// ─────────────────────────────────────────────────────────────────────────────
// Insights Agent — Tool definitions + executors.
//
// Each tool here is the agent's window into the engagement's structured data.
// The agent decides which tools to call based on the user's question. We give
// it focused, single-purpose tools rather than a single big "get_everything"
// — this is what makes the agent's reasoning visible and verifiable.
//
// The web_search tool is provided by Anthropic as a server-side tool — we
// declare it in the tool list but do not implement an executor for it.
// ─────────────────────────────────────────────────────────────────────────────

import { ROLE_GROUP_META } from '../data/engagement'
import { getIndustryProfile } from '../data/industryProfiles'
import { dimensions } from '../data/questions'
import { DIM_FRAMEWORKS } from '../constants/frameworks'

// ─── Tool definitions (Anthropic API format) ────────────────────────────────
//
// `web_search` is a server tool — Anthropic executes it. We declare and
// configure it here so the agent can use it for current-best-practices and
// Microsoft-release queries.
//
// All other tools are client-side: the agent calls them, our executors return
// JSON, and the result is fed back into the conversation.

export const TOOL_DEFINITIONS = [
  // Anthropic-managed server tool — agent can call this directly.
  {
    type: 'web_search_20250305',
    name: 'web_search',
    max_uses: 5,
  },

  {
    name: 'get_engagement_overview',
    description:
      'Returns the high-level engagement context — company name, industry, ' +
      'session count, role-group counts, and overall maturity score. Always ' +
      'call this first to orient yourself in an unfamiliar engagement.',
    input_schema: { type: 'object', properties: {}, required: [] },
  },

  {
    name: 'get_dimension_scores',
    description:
      'Returns all 5 dimensions with their composite score (0–100), maturity ' +
      'tier, confidence distribution, DK rate, and per-role-group breakdown. ' +
      'Use this to find outliers, blindspots, and high/low performers.',
    input_schema: { type: 'object', properties: {}, required: [] },
  },

  {
    name: 'get_perception_gaps',
    description:
      'Returns every dimension where two role groups (Executive, Management, ' +
      'Practitioner) diverge by ≥15 points, with severity classification ' +
      '(concerning / severe / critical). These are the most defensible ' +
      'leadership-blindspot findings.',
    input_schema: { type: 'object', properties: {}, required: [] },
  },

  {
    name: 'get_low_visibility_dimensions',
    description:
      'Returns dimensions where "Don\'t Know" responses exceeded ~30% — ' +
      'indicates the organization lacks awareness of its own capabilities in ' +
      'that area (a maturity finding independent of the score itself).',
    input_schema: { type: 'object', properties: {}, required: [] },
  },

  {
    name: 'get_recommendations',
    description:
      'Returns the generated recommendations for one or all dimensions, ' +
      'including title, priority tier, effort/impact ratings (1–5 each), and ' +
      'phased action plan. Useful for stress-testing or finding recommendation ' +
      'gaps.',
    input_schema: {
      type: 'object',
      properties: {
        dimension_id: {
          type: 'integer',
          description: 'Dimension id 1–5, or omit for all dimensions.',
        },
      },
      required: [],
    },
  },

  {
    name: 'get_framework_alignment',
    description:
      'Returns which industry frameworks (NIST AI RMF, ISO/IEC 42001, EU AI ' +
      'Act, OECD, DAMA-DMBOK, MLOps maturity models) each dimension aligns ' +
      'with. Use to validate that recommendations cite the right authority.',
    input_schema: {
      type: 'object',
      properties: {
        dimension_id: {
          type: 'integer',
          description: 'Dimension id 1–5, or omit for all dimensions.',
        },
      },
      required: [],
    },
  },

  {
    name: 'get_industry_context',
    description:
      'Returns the industry-specific context for this engagement: ' +
      'peer-benchmark tier, top AI use cases for the sector, applicable ' +
      'regulations, and any compliance-risk callouts triggered by current ' +
      'scores.',
    input_schema: { type: 'object', properties: {}, required: [] },
  },

  {
    name: 'get_session_notes',
    description:
      'Returns consultant notes captured during interviews — by dimension and ' +
      'by respondent. Useful for grounding insights in actual interview ' +
      'evidence rather than just scores.',
    input_schema: {
      type: 'object',
      properties: {
        dimension_id: {
          type: 'integer',
          description: 'Dimension id 1–5, or omit for all dimensions.',
        },
      },
      required: [],
    },
  },
]

// ─── Tool executors ─────────────────────────────────────────────────────────
//
// Each executor takes the input the agent passed and returns a plain JS value
// (we serialize to JSON before sending back to the model). Executors are pure
// functions over the engagement context.

export function buildExecutors({ engagement, composite, recommendations }) {
  const { company, sessions } = engagement

  return {
    get_engagement_overview: () => ({
      company: company.name,
      industry: company.industry,
      size: company.size,
      sessionCount: composite.sessionCount,
      roleCounts: composite.roleCounts,
      overallScore: composite.overallAvg,
      maturityTier: maturityTier(composite.overallAvg),
    }),

    get_dimension_scores: () =>
      composite.dimensions.map(d => ({
        dimensionId: d.dimId,
        name: d.name,
        shortName: d.shortName,
        score: d.avg,
        maturityTier: maturityTier(d.avg),
        stdDev: d.stdDev,
        dkRate: d.dkRate,
        confidenceCounts: d.confidenceCounts,
        byRoleGroup: {
          executive: d.byGroup.executive?.avg ?? null,
          management: d.byGroup.management?.avg ?? null,
          practitioner: d.byGroup.practitioner?.avg ?? null,
        },
      })),

    get_perception_gaps: () =>
      composite.dimensions
        .filter(d => d.perceptionGap)
        .map(d => ({
          dimensionId: d.dimId,
          name: d.name,
          gapMagnitude: d.gapMagnitude,
          severity: d.gapSeverity?.level ?? null,
          severityLabel: d.gapSeverity?.label ?? null,
          gapDirection: d.gapDirection,
          byRoleGroup: {
            executive: d.byGroup.executive?.avg ?? null,
            management: d.byGroup.management?.avg ?? null,
            practitioner: d.byGroup.practitioner?.avg ?? null,
          },
        })),

    get_low_visibility_dimensions: () =>
      composite.dimensions
        .filter(d => d.lowVisibility)
        .map(d => ({
          dimensionId: d.dimId,
          name: d.name,
          dkRate: d.dkRate,
          allDK: d.allDK,
          interpretation:
            'High Don\'t Know rate indicates the organization lacks awareness of ' +
            'its own capabilities in this area — a maturity finding distinct ' +
            'from the score itself.',
        })),

    get_recommendations: ({ dimension_id } = {}) => {
      const filtered = dimension_id
        ? recommendations.filter(r => r.dimensionId === dimension_id)
        : recommendations
      return filtered.map(r => ({
        dimensionId: r.dimensionId,
        dimensionName: r.dimensionName,
        title: r.title,
        priority: r.priority,
        tier: r.tier,
        description: r.description,
        effort: r.effort,
        impact: r.impact,
        actions: r.actions,
        keyRisk: r.keyRisk,
        phases: r.phases,
      }))
    },

    get_framework_alignment: ({ dimension_id } = {}) => {
      if (dimension_id) return DIM_FRAMEWORKS[dimension_id] || null
      return DIM_FRAMEWORKS
    },

    get_industry_context: () => {
      const profile = getIndustryProfile(company.industry)
      if (!profile) return { note: 'No industry profile available for this industry.' }
      return {
        industry: company.industry,
        peerBenchmark: profile.peerBenchmark,
        topUseCases: profile.topUseCases,
        regulations: profile.regulations,
        govPhase1: !!profile.govOverridePhase1,
      }
    },

    get_session_notes: ({ dimension_id } = {}) => {
      const dimIds = dimension_id ? [dimension_id] : dimensions.map(d => d.id)
      return sessions
        .map(s => {
          const notes = {}
          dimIds.forEach(id => {
            const text = s.notes?.[id]?.trim()
            if (text) notes[id] = text
          })
          if (!Object.keys(notes).length) return null
          return {
            respondentName: s.respondentName,
            respondentRole: s.respondentRole,
            roleGroup: ROLE_GROUP_META[s.roleGroup]?.label ?? s.roleGroup,
            confidence: s.confidence,
            notesByDimension: notes,
          }
        })
        .filter(Boolean)
    },
  }
}

function maturityTier(score) {
  if (score == null) return 'No Data'
  if (score < 20) return 'Beginning'
  if (score < 40) return 'Developing'
  if (score < 60) return 'Maturing'
  if (score < 80) return 'Advanced'
  return 'Leading'
}

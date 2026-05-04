import { useState } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Tactical Operationalization Layer — UI MOCKUP
//
// Purpose: a visual mockup to demonstrate to prospects what role-specific,
// Microsoft-stack-aware insights the assessment can produce on top of the
// existing strategic maturity report.
//
// All data here is illustrative mock data. In the real implementation it will
// be derived from a new question module (Microsoft Stack Utilization Audit),
// a productized version of DJ's build-vs-Copilot decision tree, and a
// role-by-role training matrix generator.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Mock data ───────────────────────────────────────────────────────────────

const STACK_COVERAGE = { used: 17, total: 47 }

const ROLE_COVERAGE = [
  { role: 'Senior Developers',  n: 6, pct: 41 },
  { role: 'Mid-Level Developers', n: 8, pct: 18 },
  { role: 'Business Analysts',   n: 4, pct: 8  },
  { role: 'Power BI Analysts',   n: 7, pct: 22 },
  { role: 'IT Admins',           n: 3, pct: 12 },
]

const HIGH_IMPACT_GAPS = [
  {
    feature: 'Copilot Workspace',
    audience: 'Senior Developers',
    activeOf: '0/6',
    impact: 'Devs spend ~6.2 hrs/wk each on tasks Workspace compresses (planning, scaffolding, refactor prep)',
    estReclaim: '37.2 hrs/week department-wide',
    severity: 'high',
  },
  {
    feature: 'DAX Copilot in Power BI',
    audience: 'Power BI Analysts',
    activeOf: '1/7',
    impact: 'Hand-written DAX measures consume ~3 hrs/wk per analyst — Copilot generates and explains DAX inline',
    estReclaim: '18 hrs/week department-wide',
    severity: 'high',
  },
  {
    feature: 'Power Automate AI Builder + Process Mining',
    audience: 'Business Analysts',
    activeOf: '0/4',
    impact: '3 BAs identified manual workflows that qualify; Process Mining AI surfaces optimization opportunities automatically',
    estReclaim: '~11 hrs/week + 2–3 net-new automations/month',
    severity: 'medium',
  },
  {
    feature: 'Copilot Studio Agent Flows',
    audience: 'Senior Developers',
    activeOf: '0/6',
    impact: 'Your "Customer Triage POC" is mid-build in custom code — would ship 6× faster on Agent Flows',
    estReclaim: '~4 months engineering + ongoing maintenance',
    severity: 'high',
  },
]

const FEATURE_WATCHLIST = [
  {
    feature: 'Copilot Studio Agent Flows',
    released: 'Mar 2026',
    awareness: 0,
    audience: ['Senior Devs', 'Architects'],
    note: 'Multi-step agent orchestration without custom code. Replaces several common LangChain/LangGraph patterns.',
  },
  {
    feature: 'AI Foundry Agent Service (GA)',
    released: 'Feb 2026',
    awareness: 17,
    audience: ['Senior Devs'],
    note: 'Production-grade agent runtime with built-in evaluation, threading, and tool-call telemetry.',
  },
  {
    feature: 'Copilot Code Review',
    released: 'Apr 2026',
    awareness: 33,
    audience: ['All Devs'],
    note: 'Reduces review-cycle time by ~40% on routine PRs; integrates with custom org instructions.',
  },
  {
    feature: 'Fabric Copilot Expansion',
    released: 'Apr 2026',
    awareness: 0,
    audience: ['Power BI Analysts', 'Data Engineers'],
    note: 'Natural-language data exploration across all Fabric workloads (Notebook, Pipeline, Warehouse).',
  },
  {
    feature: 'Copilot Studio Autonomous Agents',
    released: 'Mar 2026 (Preview)',
    awareness: 0,
    audience: ['Architects'],
    note: 'Long-running, event-triggered agents with memory and human-in-the-loop checkpoints.',
  },
]

const INITIATIVES = [
  { name: 'Sales Lead Qualifier',          current: 'Custom Python + Azure OpenAI',     recommendation: 'copilot',  rationale: 'Standard workflow, no IP differentiation, customer-data lookups already in CRM. Copilot Studio agent ships in 3 weeks vs. 4 months custom.', timeSave: '~4 months', costSave: '~$120K' },
  { name: 'Internal HR FAQ Bot',           current: 'In-flight, 2 contractors',         recommendation: 'copilot',  rationale: 'M365 Copilot grounded on SharePoint eliminates the build entirely. Existing licenses cover it.', timeSave: '~3 months', costSave: '~$90K' },
  { name: 'Document Classifier',           current: 'Proposed: custom CV model',        recommendation: 'copilot',  rationale: 'AI Builder model templates handle this exact pattern. No ML team required, no model lifecycle to manage.', timeSave: '~2 months', costSave: '~$60K' },
  { name: 'Compliance Triage UI',          current: 'Proposed: custom React + LLM',     recommendation: 'copilot',  rationale: 'Copilot Studio with Power Fx integration handles UI, routing, and conversational triage.', timeSave: '~2 months', costSave: '~$70K' },
  { name: 'Compliance Monitoring Engine',  current: 'Proposed: fully custom',           recommendation: 'hybrid',   rationale: 'Triage UI + alerting belongs on Copilot Studio. The regulatory rule engine itself is differentiated logic — keep custom.', timeSave: '~6 weeks',  costSave: '~$40K' },
  { name: 'Pricing Optimization Engine',   current: 'In-flight: custom Azure ML',       recommendation: 'custom',   rationale: 'Pricing is core IP, requires bespoke feature engineering, integrates deeply with proprietary ERP. Correctly scoped as custom.', timeSave: null, costSave: null },
  { name: 'Risk Scoring Model',            current: 'Production: custom Azure ML',      recommendation: 'custom',   rationale: 'Regulated model under SR 11-7 model risk management. Custom required for documentation, validation, and explainability obligations.', timeSave: null, costSave: null },
]

const TRAINING_MATRIX = [
  {
    role: 'Senior Developer',
    n: 6,
    current: 'AI-900 (4 of 6) · GitHub Copilot Standard',
    gap: 'Production GenAI engineering · Agent design · Evaluation frameworks',
    next: 'AI-102 → AI Foundry Agent Service path → Copilot Workspace certification',
    weeks: 6,
    outcome: 'Capability to lead Copilot Studio + AI Foundry implementations in-house. Estimated annual capacity: 4–6 production agents.',
  },
  {
    role: 'Mid-Level Developer',
    n: 8,
    current: 'None · Some Copilot Standard usage',
    gap: 'GenAI fundamentals · Prompt engineering · Tool integration',
    next: 'AI-900 → AI-102 → GitHub Copilot custom instructions workshop',
    weeks: 5,
    outcome: 'Independent Copilot Studio prototype delivery. Reduces dependency on senior devs for early-stage work.',
  },
  {
    role: 'Business Analyst',
    n: 4,
    current: 'PL-200 (2 of 4)',
    gap: 'AI Builder · Process Mining AI · Copilot Maker certification',
    next: 'PL-200 (remaining 2) → MB-820 (Copilot Maker)',
    weeks: 4,
    outcome: '~3 net-new Power Automate AI workflows/month. Independent process audit capability.',
  },
  {
    role: 'Power BI Analyst',
    n: 7,
    current: 'PL-300 (3 of 7) · Power BI fundamentals',
    gap: 'Copilot in Power BI · DAX Copilot · Fabric integration',
    next: 'PL-300 (remaining 4) → DP-600 (Fabric Analytics Engineer) → Copilot in Fabric workshop',
    weeks: 4,
    outcome: 'Self-serve AI dashboard creation. ~12 hrs/wk reclaimed across pool. Faster turnaround on exec data requests.',
  },
  {
    role: 'IT Admin',
    n: 3,
    current: 'None AI-specific',
    gap: 'Copilot governance · Tenant policy · DLP for AI',
    next: 'SC-100 → Copilot Admin certification → Microsoft Purview for Copilot',
    weeks: 4,
    outcome: 'Defensible Copilot rollout governance. Unblocks broader org-wide Copilot adoption (currently throttled by IT risk concerns).',
  },
  {
    role: 'Architect',
    n: 2,
    current: 'AZ-305',
    gap: 'AI Foundry architecture · Multi-agent design · RAG patterns',
    next: 'AI-102 specialty → AI Foundry Architect path → Agent orchestration patterns',
    weeks: 6,
    outcome: 'Internal architectural authority for build-vs-buy decisions. Eliminates need for external advisory on Copilot vs. custom.',
  },
]

const TRAINING_TOTALS = {
  totalHours: '~580 hrs across 30 people',
  totalCost: '~$22K certification + course costs',
  capacityUnlock: '4–6 production AI agents/year · 90+ hrs/wk reclaimed across analyst pool',
}

// ─── Microsoft brand-ish accent ──────────────────────────────────────────────
const MS_BLUE = '#0078D4'
const MS_TEAL = '#00BCF2'

// ─── Recommendation chip styling for Tab 2 ──────────────────────────────────
const RECO_META = {
  copilot: { label: 'Ship on Copilot',   bg: '#D1FAE5', color: '#065F46', border: '#A7F3D0' },
  custom:  { label: 'Build Custom',       bg: '#DBEAFE', color: '#1E40AF', border: '#BFDBFE' },
  hybrid:  { label: 'Hybrid',             bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
}

// ─── Top-level layer ─────────────────────────────────────────────────────────

export default function TacticalOperationalizationLayer() {
  const [tab, setTab] = useState('stack')

  return (
    <div
      style={{
        marginBottom: 32,
        border: `2px solid ${MS_BLUE}`,
        borderRadius: 12,
        background: 'white',
        overflow: 'hidden',
      }}
    >
      {/* Section header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${MS_BLUE} 0%, #5C2D91 100%)`,
          color: 'white',
          padding: '20px 24px',
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
            opacity: 0.85,
            marginBottom: 4,
          }}
        >
          TACTICAL OPERATIONALIZATION LAYER
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
          Developer Practice &amp; Microsoft Stack Insights
        </div>
        <div style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.5, maxWidth: 720 }}>
          Built on top of the strategic maturity baseline. Renders role-specific, tool-by-tool insights
          for engineering leaders: which Microsoft AI features your teams should be using, how to make
          build-vs-Copilot decisions, and what advanced training each role needs next.
        </div>
      </div>

      {/* Tab strip */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #E2E8F0',
          background: '#F8FAFC',
          padding: '0 24px',
        }}
      >
        {[
          { key: 'stack',    label: '1 · Microsoft Stack Utilization' },
          { key: 'buildbuy', label: '2 · Build vs. Copilot Decision Map' },
          { key: 'training', label: '3 · Role-by-Role Training Matrix' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '14px 18px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: tab === t.key ? 700 : 500,
              color: tab === t.key ? MS_BLUE : '#64748B',
              borderBottom: tab === t.key ? `3px solid ${MS_BLUE}` : '3px solid transparent',
              marginBottom: -1,
              fontFamily: 'inherit',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: 24, background: 'white' }}>
        {tab === 'stack'    && <StackUtilizationTab />}
        {tab === 'buildbuy' && <BuildVsCopilotTab />}
        {tab === 'training' && <TrainingMatrixTab />}
      </div>

      {/* Footer note */}
      <div
        style={{
          padding: '10px 24px',
          background: '#F8FAFC',
          borderTop: '1px solid #E2E8F0',
          fontSize: 11,
          color: '#64748B',
          fontStyle: 'italic',
        }}
      >
        All values derived from a Microsoft Stack Utilization Audit administered to dev / analyst / IT roles,
        the Build-vs-Copilot decision module, and a role-by-role training matrix generator anchored to
        current Microsoft Learn paths and certifications.
      </div>
    </div>
  )
}

// ─── Tab 1: Stack Utilization ────────────────────────────────────────────────

function StackUtilizationTab() {
  const coveragePct = Math.round((STACK_COVERAGE.used / STACK_COVERAGE.total) * 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Coverage hero */}
      <div
        style={{
          background: '#F0F9FF',
          border: '1px solid #BAE6FD',
          borderRadius: 8,
          padding: 18,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: MS_BLUE, lineHeight: 1 }}>
            {STACK_COVERAGE.used}
            <span style={{ fontSize: 18, color: '#94A3B8', fontWeight: 600 }}> / {STACK_COVERAGE.total}</span>
          </div>
          <div style={{ fontSize: 11, color: '#0369A1', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            High-value MS AI features
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 6 }}>
            Stack Coverage: {coveragePct}%
          </div>
          <div style={{ height: 10, background: '#E0F2FE', borderRadius: 5, overflow: 'hidden' }}>
            <div
              style={{
                width: `${coveragePct}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${MS_BLUE}, ${MS_TEAL})`,
                borderRadius: 5,
              }}
            />
          </div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 6, lineHeight: 1.5 }}>
            Microsoft has released <strong>47 high-impact AI features</strong> in the last 12 months across
            M365 Copilot, Copilot Studio, Power Platform, Fabric, GitHub Copilot, and Azure AI Foundry.
            Your teams are actively using <strong>17 of them</strong>.
          </div>
        </div>
      </div>

      {/* Coverage by role */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 10 }}>
          Coverage by role
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ROLE_COVERAGE.map(r => (
            <div key={r.role} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 180, fontSize: 13, color: '#475569' }}>
                {r.role} <span style={{ color: '#94A3B8' }}>(n={r.n})</span>
              </div>
              <div style={{ flex: 1, height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${r.pct}%`,
                    height: '100%',
                    background: r.pct >= 35 ? '#22C55E' : r.pct >= 20 ? '#F59E0B' : '#EF4444',
                    borderRadius: 4,
                  }}
                />
              </div>
              <div style={{ width: 50, textAlign: 'right', fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                {r.pct}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* High-impact gaps */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>
          High-impact gaps
        </div>
        <div style={{ fontSize: 12, color: '#64748B', marginBottom: 12 }}>
          Features your teams should be using but aren't — ranked by recoverable productivity.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {HIGH_IMPACT_GAPS.map((g, i) => (
            <div
              key={i}
              style={{
                border: `1px solid ${g.severity === 'high' ? '#FECACA' : '#FED7AA'}`,
                background: g.severity === 'high' ? '#FEF2F2' : '#FFF7ED',
                borderRadius: 8,
                padding: '12px 14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 14 }}>⚠</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{g.feature}</span>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: 'white', color: '#475569', border: '1px solid #E2E8F0' }}>
                    {g.audience}
                  </span>
                  <span style={{ fontSize: 11, color: g.severity === 'high' ? '#991B1B' : '#9A3412', fontWeight: 700 }}>
                    Active: {g.activeOf}
                  </span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: g.severity === 'high' ? '#991B1B' : '#9A3412' }}>
                  Reclaim: {g.estReclaim}
                </span>
              </div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
                {g.impact}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature watchlist */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>
          Microsoft Feature Watchlist  <span style={{ fontWeight: 500, color: '#64748B', fontSize: 12 }}>(last 90 days)</span>
        </div>
        <div style={{ fontSize: 12, color: '#64748B', marginBottom: 12 }}>
          New high-value Microsoft AI capabilities, with team awareness and recommended audience.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {FEATURE_WATCHLIST.map((f, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 0.7fr 0.6fr 1.6fr',
                gap: 12,
                padding: '10px 14px',
                border: '1px solid #E2E8F0',
                borderRadius: 6,
                background: '#FAFBFC',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{f.feature}</div>
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{f.note}</div>
              </div>
              <div style={{ fontSize: 11, color: '#64748B' }}>
                <div style={{ fontWeight: 600, color: '#475569' }}>Released</div>
                <div>{f.released}</div>
              </div>
              <div style={{ fontSize: 11 }}>
                <div style={{ fontWeight: 600, color: '#475569' }}>Awareness</div>
                <div style={{ color: f.awareness === 0 ? '#DC2626' : f.awareness < 30 ? '#D97706' : '#059669', fontWeight: 700 }}>
                  {f.awareness}%
                </div>
              </div>
              <div style={{ fontSize: 11 }}>
                <div style={{ fontWeight: 600, color: '#475569', marginBottom: 3 }}>Audience</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {f.audience.map(a => (
                    <span key={a} style={{ padding: '1px 7px', borderRadius: 99, background: '#E0F2FE', color: '#0369A1', fontWeight: 600, fontSize: 10 }}>
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Tab 2: Build vs Copilot ─────────────────────────────────────────────────

function BuildVsCopilotTab() {
  const buckets = {
    copilot: INITIATIVES.filter(i => i.recommendation === 'copilot'),
    hybrid:  INITIATIVES.filter(i => i.recommendation === 'hybrid'),
    custom:  INITIATIVES.filter(i => i.recommendation === 'custom'),
  }
  const reroutable = INITIATIVES.filter(i => i.timeSave && i.recommendation !== 'custom')
  const totalCostSave = reroutable.reduce((acc, i) => {
    const m = (i.costSave || '').match(/\$(\d+)K/)
    return acc + (m ? parseInt(m[1], 10) : 0)
  }, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Hero callout */}
      <div
        style={{
          background: '#FEF3C7',
          border: '1.5px solid #F59E0B',
          borderRadius: 8,
          padding: 16,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, color: '#92400E', letterSpacing: '0.05em', marginBottom: 4, textTransform: 'uppercase' }}>
          Decision audit summary
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#78350F', marginBottom: 6 }}>
          {reroutable.length} of {INITIATIVES.length} in-flight or proposed AI initiatives are misclassified as custom builds.
        </div>
        <div style={{ fontSize: 13, color: '#78350F', lineHeight: 1.5 }}>
          Re-routing to Microsoft-stack-native paths would save an estimated <strong>~${totalCostSave}K</strong> and{' '}
          <strong>~13 months of in-flight engineering effort</strong>, while keeping 2 correctly-scoped custom builds
          (Pricing Engine, Risk Scoring) on track.
        </div>
      </div>

      {/* Quadrant view */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 10 }}>
          Initiative classification
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
          }}
        >
          {/* Ship on Copilot */}
          <QuadrantColumn
            title="Ship on Copilot"
            subtitle={`${buckets.copilot.length} initiatives — fastest path`}
            color={RECO_META.copilot.color}
            bg={RECO_META.copilot.bg}
            border={RECO_META.copilot.border}
            initiatives={buckets.copilot}
          />
          <QuadrantColumn
            title="Hybrid"
            subtitle={`${buckets.hybrid.length} initiative — Copilot + custom`}
            color={RECO_META.hybrid.color}
            bg={RECO_META.hybrid.bg}
            border={RECO_META.hybrid.border}
            initiatives={buckets.hybrid}
          />
          <QuadrantColumn
            title="Build Custom"
            subtitle={`${buckets.custom.length} initiatives — correctly scoped`}
            color={RECO_META.custom.color}
            bg={RECO_META.custom.bg}
            border={RECO_META.custom.border}
            initiatives={buckets.custom}
          />
        </div>
      </div>

      {/* Per-initiative rationale */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 10 }}>
          Per-initiative rationale
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {INITIATIVES.map((init, i) => {
            const reco = RECO_META[init.recommendation]
            return (
              <div
                key={i}
                style={{
                  border: '1px solid #E2E8F0',
                  borderLeft: `4px solid ${reco.color}`,
                  borderRadius: 6,
                  padding: '12px 14px',
                  background: 'white',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{init.name}</span>
                    <span style={{ padding: '2px 8px', borderRadius: 99, background: reco.bg, color: reco.color, fontSize: 10, fontWeight: 700 }}>
                      {reco.label}
                    </span>
                  </div>
                  {init.timeSave && (
                    <span style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>
                      Saves: {init.timeSave} · {init.costSave}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>
                  <strong style={{ color: '#475569' }}>Current:</strong> {init.current}
                </div>
                <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
                  {init.rationale}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Decision criteria */}
      <div
        style={{
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: 8,
          padding: 14,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: '0.05em', marginBottom: 8, textTransform: 'uppercase' }}>
          Decision criteria framework
        </div>
        <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>
          Initiatives are classified using six factors: <strong>data sensitivity</strong> (sovereignty, IP, regulatory),
          <strong> standard vs. custom workflow logic</strong>, <strong>integration depth into proprietary systems</strong>,
          <strong> user-volume / cost economics</strong>, <strong>reusability across the business</strong>, and
          <strong> speed-to-value requirement</strong>. Custom builds are reserved for initiatives where 2+ factors
          unambiguously require it.
        </div>
      </div>
    </div>
  )
}

function QuadrantColumn({ title, subtitle, color, bg, border, initiatives }) {
  return (
    <div
      style={{
        background: bg,
        border: `1.5px solid ${border}`,
        borderRadius: 8,
        padding: 12,
        minHeight: 180,
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 700, color, marginBottom: 2 }}>{title}</div>
      <div style={{ fontSize: 11, color: '#64748B', marginBottom: 10 }}>{subtitle}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {initiatives.map((i, idx) => (
          <div
            key={idx}
            style={{
              padding: '8px 10px',
              background: 'white',
              borderRadius: 5,
              border: '1px solid rgba(0,0,0,0.05)',
              fontSize: 12,
              fontWeight: 500,
              color: '#1E293B',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
            {i.name}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Tab 3: Training Matrix ──────────────────────────────────────────────────

function TrainingMatrixTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Hero summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
        }}
      >
        <SummaryStat label="Total upskill investment" value={TRAINING_TOTALS.totalHours} accent={MS_BLUE} />
        <SummaryStat label="Certification + course costs" value={TRAINING_TOTALS.totalCost} accent="#5C2D91" />
        <SummaryStat label="Capacity unlock" value={TRAINING_TOTALS.capacityUnlock} accent="#059669" wide />
      </div>

      {/* Matrix table */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>
          Role-by-role training plan (Q3 2026)
        </div>
        <div style={{ fontSize: 12, color: '#64748B', marginBottom: 12 }}>
          Anchored to current Microsoft Learn paths and certifications. Sequenced so prerequisites land before specialty paths.
        </div>
        <div
          style={{
            border: '1px solid #E2E8F0',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1.4fr 1.6fr 1.8fr 0.6fr',
              gap: 0,
              background: '#F8FAFC',
              borderBottom: '1px solid #E2E8F0',
              fontSize: 10,
              fontWeight: 700,
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <div style={{ padding: '10px 14px' }}>Role</div>
            <div style={{ padding: '10px 14px' }}>Current</div>
            <div style={{ padding: '10px 14px' }}>Gap</div>
            <div style={{ padding: '10px 14px' }}>Next training (sequenced)</div>
            <div style={{ padding: '10px 14px', textAlign: 'right' }}>Weeks</div>
          </div>

          {/* Rows */}
          {TRAINING_MATRIX.map((row, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1.4fr 1.6fr 1.8fr 0.6fr',
                gap: 0,
                background: i % 2 === 0 ? 'white' : '#FAFBFC',
                borderBottom: i < TRAINING_MATRIX.length - 1 ? '1px solid #F1F5F9' : 'none',
                fontSize: 12,
              }}
            >
              <div style={{ padding: '12px 14px' }}>
                <div style={{ fontWeight: 700, color: '#0F172A' }}>{row.role}</div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>n = {row.n}</div>
              </div>
              <div style={{ padding: '12px 14px', color: '#475569', lineHeight: 1.5 }}>{row.current}</div>
              <div style={{ padding: '12px 14px', color: '#92400E', lineHeight: 1.5, fontWeight: 500 }}>{row.gap}</div>
              <div style={{ padding: '12px 14px', color: '#0F172A', lineHeight: 1.5 }}>
                <strong>{row.next}</strong>
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 4, fontStyle: 'italic' }}>
                  Outcome: {row.outcome}
                </div>
              </div>
              <div style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: MS_BLUE }}>
                {row.weeks}w
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export action mock */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button
          disabled
          style={{
            padding: '8px 14px',
            border: `1px solid ${MS_BLUE}`,
            background: 'white',
            color: MS_BLUE,
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'not-allowed',
            opacity: 0.65,
            fontFamily: 'inherit',
          }}
          title="Mockup — would export to a Microsoft Learn collection"
        >
          ⇩ Export to Microsoft Learn collection
        </button>
        <button
          disabled
          style={{
            padding: '8px 14px',
            border: '1px solid #CBD5E1',
            background: 'white',
            color: '#475569',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'not-allowed',
            opacity: 0.65,
            fontFamily: 'inherit',
          }}
          title="Mockup — would export to Excel for L&D tracking"
        >
          ⇩ Export to Excel (L&amp;D tracker)
        </button>
      </div>
    </div>
  )
}

function SummaryStat({ label, value, accent, wide }) {
  return (
    <div
      style={{
        gridColumn: wide ? 'span 1' : undefined,
        background: 'white',
        border: '1px solid #E2E8F0',
        borderTop: `4px solid ${accent}`,
        borderRadius: 8,
        padding: 14,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', lineHeight: 1.4 }}>
        {value}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Capability prompts — the user-side messages we send when a consultant
// clicks one of the V1 capability buttons.
//
// These are deliberately specific, instructing the agent on:
//   - which tools to call up front
//   - what evidence to weight
//   - how to structure the output
//
// V1 ships two end-to-end; the other two are scaffolded for the next iteration.
// ─────────────────────────────────────────────────────────────────────────────

export const CAPABILITIES = {
  strongestFindings: {
    label: 'Strongest Findings',
    description: 'Identify and rank the most defensible insights from this engagement.',
    status: 'live',
    prompt: `Identify the 3–5 most defensible insights from this engagement, ranked by evidence strength.

WORKFLOW
1. Call get_engagement_overview and get_dimension_scores to orient yourself.
2. Call get_perception_gaps — gaps backed by ≥3 respondents per role group are the strongest evidence-anchored findings.
3. Call get_low_visibility_dimensions — high DK rates are themselves maturity findings.
4. Call get_session_notes for the dimensions with the strongest scores or gaps — quoted notes elevate findings from "data shows" to "the CFO told us."
5. Synthesize and rank.

OUTPUT
For each finding (3–5 total), use this structure:

**Finding [N]: [one-line headline]**
- **Evidence:** specific data citation (score X for dim Y, gap of N points between roles, notes from respondent Z, etc.)
- **Defensibility:** Strong / Moderate / Directional — with a one-line reason
- **What it means for the client:** 1–2 sentences
- **Likely client pushback:** what they'll say and the counter

Then end with a short paragraph: **"What to lead the readout with"** — pick one finding and say why.

Be direct. No throat-clearing. If sample sizes are small for a finding, name it.`,
  },

  microsoftWatchlist: {
    label: 'Microsoft Watchlist Refresh',
    description: 'Surface recent Microsoft AI releases relevant to this client.',
    status: 'live',
    prompt: `Refresh the Microsoft Feature Watchlist for this engagement using current web sources.

WORKFLOW
1. Call get_engagement_overview and get_dimension_scores so you understand the client's industry and weakest areas.
2. Use web_search to find Microsoft AI feature releases, GA announcements, and significant updates from the LAST 90 DAYS. Focus on:
   - Microsoft 365 Copilot (especially Copilot for Sales, Service, Finance if relevant)
   - Copilot Studio (agent flows, autonomous agents, new connectors)
   - Power Platform AI (AI Builder, Process Mining, Copilot in Power Apps)
   - Microsoft Fabric / Power BI Copilot
   - GitHub Copilot (Workspace, Code Review, extensions)
   - Azure AI Foundry (Agent Service, model catalog, evaluation hooks)
   - Microsoft Purview AI Hub (governance)
3. Prefer official Microsoft sources: learn.microsoft.com, techcommunity.microsoft.com, microsoft.com/blog, official product blogs.

OUTPUT
Top 5–8 releases that materially affect this engagement, formatted as:

**[Feature name]** — *released [date], [source]*
- **What it does (one sentence)**
- **Why it matters here:** specific tie-back to a dimension score, an in-flight initiative, or a gap finding from this engagement
- **Recommended audience:** which role group on the client's team should hear about it
- **Source:** URL

End with: a one-line **"Biggest shift since the last watchlist update"** — what should change in our recommendations because of these releases.

Cite specific sources for everything. Be conservative — only include releases you can verify via search.`,
  },

  bestPracticesCheck: {
    label: 'Best-Practices Cross-Check',
    description: 'Validate recommendations against current NIST / ISO / EU AI Act guidance.',
    status: 'live',
    prompt: `Cross-check our current recommendations against current authoritative guidance on AI maturity, governance, and the Microsoft AI platform. Flag drift before the client surfaces it.

WORKFLOW
1. Call get_engagement_overview to anchor the client's industry and overall context.
2. Call get_recommendations (no dimension_id) to retrieve every active recommendation in this engagement.
3. Call get_framework_alignment to understand which frameworks each dimension's recommendations are anchored to (NIST AI RMF, ISO/IEC 42001, EU AI Act, OECD AI Principles, MLOps maturity models, etc.).
4. For the recommendations that matter most (highest priority, biggest investment, or most exposed), use web_search to find recent (LAST 6 MONTHS) authoritative guidance. Prioritize:
   - NIST AI RMF Playbook updates, crosswalks, and Generative AI Profile revisions
   - ISO/IEC 42001:2023 implementation guidance, certification case studies
   - EU AI Act phase-in news — what obligations are active now, what's coming
   - Microsoft platform releases that change build-vs-buy or operating-model assumptions
   - Recent Big 4 / McKinsey / Gartner / Forrester AI maturity publications
   - Sector-specific guidance (use the client's industry from the overview)
5. Take a position on each recommendation. Don't hedge.

OUTPUT
For each recommendation reviewed, use this structure:

**[Dimension] — "[Recommendation Title]"**
- **Status:** ✅ Solid / ⚠️ Exposed / 🔄 Needs Update
- **Anchor:** which framework(s) the recommendation cites or implies
- **Current guidance:** what the latest authoritative source says — with the web citation URL
- **Drift assessment:** specifically how (or whether) the recommendation diverges from current best practice
- **Where we'd lose a debate:** if a sophisticated client pushes back on this rec, what's the weakest defensible point?
- **Suggested edit (if any):** specific language change to bring the recommendation current

End with a one-paragraph **"Bottom line for the readout"**: name which recommendations are bulletproof, which need a defensible position prepped before the meeting, and which should be rewritten outright. Be specific.

Better to flag a weakness internally now than have the client surface it.`,
  },

  probeWatchlist: {
    label: 'Probe Watchlist',
    description: 'Identify weak-evidence findings to dig into next.',
    status: 'live',
    prompt: `Identify the weakest-evidence findings in this engagement and produce a "what to probe further" list for the next round of interviews, manager validation calls, or follow-up data requests.

WORKFLOW
1. Call get_engagement_overview and get_dimension_scores.
2. Call get_low_visibility_dimensions — high DK rates are the clearest signal of weak evidence.
3. Call get_perception_gaps and look for gaps where one role group has very few respondents (small-n findings that look directional but aren't statistically defensible).
4. For each dimension that scored anomalously high or low, or where the standard deviation is large, call get_session_notes — note where qualitative evidence is thin, contradictory, or absent.
5. For each dimension, inspect confidenceCounts — areas where most respondents marked low or medium confidence are softer findings even if the score itself looks reasonable.

OUTPUT
A ranked list of 4–7 probe areas. For each:

**Probe [N]: [Dimension or specific finding]**
- **Why the evidence is weak:** specific reason — DK rate of X%, small-n cohort (executive n=2), low-confidence ratings on Y% of responses, contradictory notes between respondents, etc. Be specific with numbers.
- **What needs verification:** the specific claim or finding that rests on this weak evidence
- **Suggested probe questions (2–3):** targeted questions a senior consultant would actually ask — framed for the appropriate role group (executive / management / practitioner). No generic "ask more questions about Governance" filler.
- **Who to ask:** which specific role group, or which named respondent if a manager validation call is the right vehicle
- **Risk if not verified by readout:** what we'd have to qualify, soften, or remove from the deliverable

End with a one-paragraph **"What to do this week"** that picks the 2–3 highest-leverage probes given remaining time, and notes which lower-priority ones can be deferred to a follow-on engagement without weakening the current readout.

Generic probes are not useful. Each suggested question should be one a senior consultant would actually use.`,
  },
}

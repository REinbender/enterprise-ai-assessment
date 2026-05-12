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
    status: 'coming-next',
    prompt: null,
  },

  probeWatchlist: {
    label: 'Probe Watchlist',
    description: 'Identify weak-evidence findings to dig into next.',
    status: 'coming-next',
    prompt: null,
  },
}

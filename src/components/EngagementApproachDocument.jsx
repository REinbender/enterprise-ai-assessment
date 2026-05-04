// ─────────────────────────────────────────────────────────────────────────────
// Engagement Approach Document — 3-page sales artifact
//
// Purpose: a Logic20/20-branded methodology document for Digital Process
// Transformation prospects. Sent to Tricia and Matt for review and alignment
// before a draft SOW.
//
// Format: 3 letter-sized pages, print-optimized. Use the browser's
// "Save as PDF" / "Print to PDF" to export. The component is a real React
// component so values can be customized per prospect by editing the
// CLIENT object below.
// ─────────────────────────────────────────────────────────────────────────────

// Logic20/20 brand
const BRAND = {
  primary:  '#003D7A',   // deep professional blue
  accent:   '#06B6D4',   // bright cyan
  dark:     '#0F172A',
  body:     '#475569',
  muted:    '#94A3B8',
  bgLight:  '#F8FAFC',
  border:   '#E2E8F0',
}

// Per-prospect content. Edit this object to re-spin the document.
const CLIENT = {
  name:        'Digital Process Transformation',  // department / org being assessed
  industry:    'Utilities',
  recipients:  'Tricia and Matt',
  preparedBy:  'Logic20/20',
  date:        new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  reference:   `DPT-AI-${new Date().toISOString().slice(0, 10)}`,
  deptSize:    50,
  fteTotal:    2.5,
  durationWeeks: 4,
}

export default function EngagementApproachDocument({ onClose }) {
  return (
    <div style={{ background: '#E5E7EB', minHeight: '100vh', padding: '24px 0' }}>

      {/* Page-level print styles + screen toolbar */}
      <style>{`
        @page { size: letter; margin: 0; }

        @media screen {
          .approach-page {
            background: white;
            box-shadow: 0 4px 24px rgba(0,0,0,0.12);
            margin: 0 auto 24px;
          }
          .approach-toolbar { display: flex; }
        }

        @media print {
          body { background: white !important; }
          .approach-toolbar, .approach-screen-only { display: none !important; }
          .approach-page {
            box-shadow: none !important;
            margin: 0 !important;
            page-break-after: always;
            page-break-inside: avoid;
          }
          .approach-page:last-child { page-break-after: auto; }
        }

        .approach-page {
          width: 8.5in;
          height: 11in;
          padding: 0.6in 0.7in;
          box-sizing: border-box;
          font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 10pt;
          line-height: 1.55;
          color: ${BRAND.body};
          position: relative;
        }
      `}</style>

      {/* Screen-only toolbar */}
      <div
        className="approach-toolbar"
        style={{
          maxWidth: '8.5in',
          margin: '0 auto 16px',
          padding: '12px 16px',
          background: 'white',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              padding: '6px 12px',
              border: '1px solid #CBD5E1',
              background: 'white',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              color: BRAND.body,
              fontFamily: 'inherit',
            }}
          >
            ← Back to Hub
          </button>
          <span style={{ fontSize: 12, color: BRAND.body }}>
            Engagement Approach Document &middot; 3 pages
          </span>
        </div>
        <button
          onClick={() => window.print()}
          style={{
            padding: '8px 16px',
            border: 'none',
            background: BRAND.primary,
            color: 'white',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 700,
            fontFamily: 'inherit',
          }}
        >
          ⇩ Save as PDF
        </button>
      </div>

      {/* PAGE 1 ─────────────────────────────────────────────────────────── */}
      <Page1 />

      {/* PAGE 2 ─────────────────────────────────────────────────────────── */}
      <Page2 />

      {/* PAGE 3 ─────────────────────────────────────────────────────────── */}
      <Page3 />

      {/* Screen-only footer */}
      <div
        className="approach-screen-only"
        style={{
          maxWidth: '8.5in',
          margin: '8px auto',
          padding: '8px 16px',
          fontSize: 11,
          color: BRAND.muted,
          textAlign: 'center',
          fontStyle: 'italic',
        }}
      >
        Use your browser's Save as PDF option to export the 3-page document.
        For best results, ensure margins are set to "None" / "Default" and background graphics are enabled.
      </div>
    </div>
  )
}

// ─── Shared layout pieces ────────────────────────────────────────────────────

function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 8,
          background: BRAND.primary,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: 13,
          letterSpacing: '-0.02em',
        }}
      >
        L
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color: BRAND.primary, letterSpacing: '-0.01em' }}>
          Logic<span style={{ color: BRAND.accent }}>20/20</span>
        </div>
        <div style={{ fontSize: 8, color: BRAND.muted, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Data &middot; AI &middot; Strategy
        </div>
      </div>
    </div>
  )
}

function PageHeader({ pageLabel }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 14,
        borderBottom: `2px solid ${BRAND.primary}`,
        marginBottom: 22,
      }}
    >
      <Logo />
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: BRAND.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {pageLabel}
        </div>
        <div style={{ fontSize: 9, color: BRAND.body, marginTop: 2 }}>
          {CLIENT.reference}
        </div>
      </div>
    </div>
  )
}

function PageFooter({ n }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: '0.7in',
        right: '0.7in',
        bottom: '0.4in',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 8,
        color: BRAND.muted,
        borderTop: `1px solid ${BRAND.border}`,
        paddingTop: 8,
      }}
    >
      <span>Logic20/20 &middot; Confidential — Prepared for {CLIENT.recipients}</span>
      <span>Page {n} of 3</span>
    </div>
  )
}

function H1({ children, style }) {
  return (
    <h1 style={{ fontSize: 22, fontWeight: 800, color: BRAND.dark, margin: '0 0 6px', letterSpacing: '-0.01em', ...style }}>
      {children}
    </h1>
  )
}

function H2({ children, accent, style }) {
  return (
    <h2 style={{
      fontSize: 13, fontWeight: 800, color: accent || BRAND.primary,
      margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em',
      ...style,
    }}>
      {children}
    </h2>
  )
}

function Eyebrow({ children }) {
  return (
    <div style={{
      fontSize: 9, fontWeight: 700, color: BRAND.accent,
      letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6,
    }}>
      {children}
    </div>
  )
}

// ─── PAGE 1 — Engagement Overview ────────────────────────────────────────────

function Page1() {
  return (
    <div className="approach-page">
      <PageHeader pageLabel="Engagement Approach &middot; 1 / 3" />

      {/* Title block */}
      <Eyebrow>Engagement Approach &middot; Prepared {CLIENT.date}</Eyebrow>
      <H1>{CLIENT.name}</H1>
      <div style={{ fontSize: 14, color: BRAND.body, fontWeight: 600, marginBottom: 22 }}>
        AI Practice &amp; Tooling Diagnostic
      </div>

      {/* Why this engagement */}
      <div style={{ marginBottom: 18 }}>
        <H2>Why a targeted diagnostic — not a full AI maturity assessment</H2>
        <p style={{ margin: '0 0 8px' }}>
          Your team has already received a Gartner-style enterprise AI maturity assessment.
          That work established the strategic baseline. What we will deliver in the next four
          weeks is a different instrument: a <strong style={{ color: BRAND.dark }}>tactical, role-specific
          diagnostic</strong> focused on the three operational questions your team is trying
          to answer right now.
        </p>
        <p style={{ margin: 0 }}>
          The goal is to give the {CLIENT.name} leadership team the
          <strong style={{ color: BRAND.dark }}> base data and concrete recommendations</strong> needed
          to direct development practice, training spend, and platform decisions through 2026 — at
          the level of "this developer should be using this Microsoft feature by Friday," not
          "your AI strategy maturity is 47 out of 100."
        </p>
      </div>

      {/* The three questions */}
      <div style={{ marginBottom: 18 }}>
        <H2>The three questions we will answer</H2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <QuestionRow
            num="1"
            title="Microsoft Stack Utilization"
            question="Are our developers, analysts, and BAs using the right out-of-the-box Microsoft features available to them — across M365 Copilot, Copilot Studio, Power Platform, Fabric, GitHub Copilot, and Azure AI Foundry?"
            output="A coverage scorecard, role-by-role gap analysis, and a Microsoft Feature Watchlist of high-value capabilities released in the last 90 days."
          />
          <QuestionRow
            num="2"
            title="Build vs. Copilot Decision Map"
            question="For our backlog and in-flight initiatives, which should ship on Copilot Studio / M365 Copilot / Power Platform — and which correctly require custom development?"
            output="An initiative-by-initiative classification with rationale, plus an independent third-party review of the decision framework your team has already developed internally — validated, stress-tested, and refined where needed."
          />
          <QuestionRow
            num="3"
            title="Role-by-Role Training Matrix"
            question="Beyond AI 101, what advanced training (300- and 400-level) does each role on our team need next — and in what sequence?"
            output="A role × current credentials × gap × sequenced Microsoft Learn paths and certifications, with capacity-unlock estimates."
          />
        </div>
      </div>

      {/* Boundary statement */}
      <div
        style={{
          padding: '10px 14px',
          background: BRAND.bgLight,
          border: `1px solid ${BRAND.border}`,
          borderLeft: `4px solid ${BRAND.accent}`,
          borderRadius: 4,
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 700, color: BRAND.dark, marginBottom: 4 }}>
          What this engagement is — and is not
        </div>
        <div style={{ fontSize: 9.5, lineHeight: 1.6 }}>
          <strong>This is</strong> a focused {CLIENT.durationWeeks}-week diagnostic sprint of {CLIENT.deptSize} people
          in {CLIENT.name}, delivered by a {CLIENT.fteTotal}-FTE Logic20/20 team, producing three decision-ready artifacts
          and a 90-day execution plan. The work is scoped to a {CLIENT.industry}-sector context — Build-vs-Copilot
          classifications weight data sensitivity and grid-relevant systems accordingly.
          <strong> This is not</strong> a re-run of the enterprise AI maturity assessment your team already received,
          a custom-build engagement, or a tooling deployment. We do not stand up new tenant configuration, dashboards,
          or AI infrastructure — we leverage what is already enabled and synthesize.
          Implementation and enablement work, if desired, is scoped separately downstream.
        </div>
      </div>

      <PageFooter n={1} />
    </div>
  )
}

function QuestionRow({ num, title, question, output }) {
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <div
        style={{
          width: 26, height: 26, borderRadius: 6,
          background: BRAND.primary, color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 800, flexShrink: 0,
        }}
      >
        {num}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: BRAND.dark, marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 9.5, fontStyle: 'italic', color: BRAND.body, marginBottom: 3 }}>
          "{question}"
        </div>
        <div style={{ fontSize: 9, color: BRAND.body }}>
          <span style={{ fontWeight: 700, color: BRAND.accent }}>Output: </span>
          {output}
        </div>
      </div>
    </div>
  )
}

// ─── PAGE 2 — Methodology ────────────────────────────────────────────────────

function Page2() {
  return (
    <div className="approach-page">
      <PageHeader pageLabel="Methodology &middot; 2 / 3" />

      <Eyebrow>How we will produce the three artifacts</Eyebrow>
      <H1 style={{ marginBottom: 4 }}>Methodology</H1>

      {/* Cross-cutting opener */}
      <div
        style={{
          fontSize: 9.5,
          color: BRAND.body,
          lineHeight: 1.6,
          marginBottom: 14,
          padding: '10px 12px',
          background: BRAND.bgLight,
          border: `1px solid ${BRAND.border}`,
          borderRadius: 4,
        }}
      >
        <strong style={{ color: BRAND.dark }}>One instrument set, three artifacts.</strong>{' '}
        A single department-wide survey (Microsoft Forms, in your tenant), 8–10 role-balanced 30-minute
        interviews, and 3 manager validation calls feed all three deliverables — minimizing time asked
        of your team. Logic20/20 will coordinate directly with your Microsoft account team for tool
        inventory and access. We synthesize and interpret existing telemetry; we do not stand up new
        tenant configuration, dashboards, or AI infrastructure.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <MethodBlock
          num="1"
          title="Microsoft Stack Utilization"
          inputs={[
            { label: 'First-party Microsoft observability (whatever is enabled in your tenant)', detail: 'Microsoft 365 Copilot Dashboard · Microsoft Purview AI Hub · Power Platform admin center + CoE Starter Kit (if running) · GitHub Copilot business reports · Azure AI Foundry observability. Logic20/20 coordinates with your Microsoft account rep to inventory enabled tooling and request the relevant exports.' },
            { label: 'Department-wide survey', detail: `Microsoft Forms instrument administered to all ${CLIENT.deptSize} members. Anonymous with role-level attribution only. Captures self-reported usage, awareness of recent feature releases, perceived blockers, and AI-Champion candidates.` },
            { label: 'Role-balanced interviews', detail: '8–10 30-minute interviews across senior devs, mid devs, BAs, analysts, IT admins, and architects to validate survey signal and surface qualitative blockers.' },
          ]}
          method="Cross-reference observed telemetry against self-reported usage. For each underused feature, classify the root cause using a six-bucket Barriers Framework — awareness · access/permissions · friction · skill · cultural · perceived risk — so each gap maps to a corresponding intervention category, not just a recommendation to use the feature."
          output="Stack coverage scorecard (X of Y high-value features actively used), per-role coverage breakdown, license-economics view (utilization vs. seats — surfacing waste and shortages), ranked high-impact gap list with cause classification and quantified reclaim estimates, and a Microsoft Feature Watchlist of capabilities released in the last 90 days mapped to role-relevance."
        />

        <MethodBlock
          num="2"
          title="Build vs. Copilot Decision Map"
          inputs={[
            { label: 'Backlog export + selected pipeline access', detail: 'Read-only export of in-flight and proposed AI/automation initiatives from Azure DevOps, Jira, or equivalent. For contested initiatives, selected PR samples and pipeline visibility under NDA so classifications are defensible to your engineering leads.' },
            { label: 'Working sessions with technical leads', detail: 'Two 60-minute walkthroughs of the active and proposed initiatives — current technical approach, sponsor, stage, and integration touchpoints.' },
            { label: 'Review of your existing decision framework', detail: 'Independent third-party review of the build-vs-Copilot decision tree your team has already developed internally. We validate it against current Microsoft platform capabilities, stress-test classifications, and refine where needed — strengthening (not replacing) work your team has already invested in.' },
          ]}
          method={`Apply a six-factor decision framework — data sensitivity, workflow standardization, integration depth, user-volume / cost economics, reusability, speed-to-value — plus an explicit operating-model dimension (who owns the artifact on day 91? citizen-dev maintained, IT-governed, or engineering-owned?). For ${CLIENT.industry} sector specifically, data sensitivity and grid-relevant or NERC CIP-scoped systems are weighted heavily. Misclassified initiatives receive directional TCO estimates (token cost · seat license · dev hours · ongoing ops) at order-of-magnitude depth.`}
          output="Initiative-by-initiative classification (Ship on Copilot / Hybrid / Build Custom) with explicit rationale per initiative including operating-model implication, directional TCO range for re-routed initiatives, and an endorsed (or refined) version of your internal decision framework that your team can apply to future initiatives without external help."
        />

        <MethodBlock
          num="3"
          title="Role-by-Role Training Matrix"
          inputs={[
            { label: 'Department-wide survey (extended)', detail: `Same Microsoft Forms instrument as Area 1 — extended with credentials questions (AI-900, AI-102, PL-200, PL-300, MB-820, etc.), comfort levels per Microsoft AI capability, and self-identified skill gaps. AI-Champion candidates are flagged via the same survey.` },
            { label: 'Manager validation calls', detail: 'Three 30-minute calls with team managers to validate self-reported credentials, identify gaps individuals may not self-report, and corroborate AI-Champion candidates against observed work product.' },
            { label: 'Microsoft Learn catalog + community design', detail: 'Logic20/20 maintains a current map of Microsoft Learn paths, role-based certifications, and complementary internal program patterns (AI Champions, communities of practice, paired mentoring). We design blended plans — not catalog dumps.' },
          ]}
          method="Bucket the department by role, score current capability against role-appropriate target levels, and identify gap topics. Identify the top 10–15% AI power users from the survey as Champion candidates. Design a blended uplift plan per role: certifications + Champion-led internal sessions + community of practice + paired mentoring. Sequence so prerequisites land before specialty paths."
          output="Role × current credentials × identified gap × sequenced training plan with weeks-of-effort, certification costs, and a directional payback estimate (hours unlocked × loaded labor rate vs. training investment). Identified AI Champions named, with a recommended program structure. Microsoft Learn collection link managers can assign directly."
        />
      </div>

      {/* Confidentiality / sample size / measurement footer */}
      <div
        style={{
          marginTop: 12,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
        }}
      >
        <FooterStatement
          label="Confidentiality"
          body={`Survey responses are aggregated to role level only — no individual attribution in any deliverable. Interview content is non-attributable. Logic20/20 operates under standard NDA throughout.`}
        />
        <FooterStatement
          label="Sample-size honesty"
          body={`n=${CLIENT.deptSize} dept-wide enables strong department-level signal. Per-role n is small (typically 3–8); role-level findings are directional and qualified accordingly in deliverables.`}
        />
        <FooterStatement
          label="90-day measurement"
          body={`Each deliverable includes 3–5 explicit KPIs (e.g., stack coverage %, initiatives shipped on Copilot, certifications completed) so your team can measure execution against the plan independently.`}
        />
      </div>

      <PageFooter n={2} />
    </div>
  )
}

function FooterStatement({ label, body }) {
  return (
    <div
      style={{
        padding: 8,
        background: 'white',
        border: `1px solid ${BRAND.border}`,
        borderTop: `3px solid ${BRAND.accent}`,
        borderRadius: 4,
        fontSize: 8,
        lineHeight: 1.5,
      }}
    >
      <div style={{ fontSize: 8, fontWeight: 800, color: BRAND.primary, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 3 }}>
        {label}
      </div>
      <div style={{ color: BRAND.body }}>{body}</div>
    </div>
  )
}

function MethodBlock({ num, title, inputs, method, output }) {
  return (
    <div
      style={{
        border: `1px solid ${BRAND.border}`,
        borderLeft: `4px solid ${BRAND.primary}`,
        borderRadius: 4,
        padding: '10px 12px',
        background: 'white',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
        <span style={{
          fontSize: 11, fontWeight: 800, color: BRAND.primary,
          minWidth: 14,
        }}>
          {num}
        </span>
        <span style={{ fontSize: 12, fontWeight: 800, color: BRAND.dark }}>
          {title}
        </span>
      </div>

      {/* 3-column layout: Inputs / Method / Output */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 1.2fr', gap: 10, fontSize: 8.5, lineHeight: 1.5 }}>
        <div>
          <div style={{ fontSize: 8, fontWeight: 800, color: BRAND.accent, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>
            Inputs needed
          </div>
          {inputs.map((inp, i) => (
            <div key={i} style={{ marginBottom: i < inputs.length - 1 ? 5 : 0 }}>
              <div style={{ fontWeight: 700, color: BRAND.dark }}>&bull; {inp.label}</div>
              <div style={{ paddingLeft: 8, color: BRAND.body }}>{inp.detail}</div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 8, fontWeight: 800, color: BRAND.accent, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>
            Logic20/20 method
          </div>
          <div style={{ color: BRAND.body }}>{method}</div>
        </div>
        <div>
          <div style={{ fontSize: 8, fontWeight: 800, color: BRAND.accent, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>
            Artifact delivered
          </div>
          <div style={{ color: BRAND.body }}>{output}</div>
        </div>
      </div>
    </div>
  )
}

// ─── PAGE 3 — Timeline & Deliverables ────────────────────────────────────────

const TIMELINE = [
  {
    week: 'Week 1',
    label: 'Discovery &amp; Setup',
    bullets: [
      'Kickoff with Tricia, Matt, and Logic20/20 lead',
      'Alignment call with client&rsquo;s Microsoft account rep — tenant tooling inventory, exports requested',
      'Department-wide Microsoft Forms survey designed and launched (open through end of Week 2)',
      'Interview slots scheduled across roles; backlog export requested',
    ],
  },
  {
    week: 'Week 2',
    label: 'Data Collection',
    bullets: [
      'Survey closes; 8–10 role-balanced interviews conducted',
      'First-party Microsoft observability data received and parsed',
      'Working sessions with technical leads: backlog walkthrough + selected PR review',
      'Independent review of client&rsquo;s internal build-vs-Copilot decision tree begins',
    ],
  },
  {
    week: 'Week 3',
    label: 'Analysis &amp; Synthesis',
    bullets: [
      'Stack utilization scorecard built; gap rankings + Barriers Framework applied',
      'Initiative classification + directional TCO; client&rsquo;s decision tree validated or refined',
      'Training matrix populated; AI Champions identified; blended plan sequenced',
      'Mid-engagement checkpoint with Tricia and Matt — directional findings shared',
    ],
  },
  {
    week: 'Week 4',
    label: 'Refinement &amp; Readout',
    bullets: [
      'Findings reviewed with technical leads and managers for accuracy and feasibility',
      'Final readout deck (PowerPoint) and supporting PDF produced',
      '90-minute executive readout delivered (live, with Q&amp;A)',
      '90-day execution plan with KPIs finalized; SOW for downstream enablement scoped if desired',
    ],
  },
]

function Page3() {
  return (
    <div className="approach-page">
      <PageHeader pageLabel="Timeline &amp; Deliverables &middot; 3 / 3" />

      <Eyebrow>Four-week engagement</Eyebrow>
      <H1 style={{ marginBottom: 4 }}>Timeline &amp; Deliverables</H1>
      <div style={{ fontSize: 11, color: BRAND.body, marginBottom: 18 }}>
        A focused, time-boxed engagement designed to produce decision-ready artifacts
        without blocking your team's day-to-day work.
      </div>

      {/* Timeline */}
      <div style={{ marginBottom: 18 }}>
        <H2>Week-by-week</H2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {TIMELINE.map((w, i) => (
            <div
              key={i}
              style={{
                background: i === 3 ? '#F0FDFA' : BRAND.bgLight,
                border: `1px solid ${i === 3 ? '#A7F3D0' : BRAND.border}`,
                borderTop: `3px solid ${i === 3 ? '#059669' : BRAND.primary}`,
                borderRadius: 4,
                padding: 10,
                fontSize: 8.5,
                lineHeight: 1.5,
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 800, color: i === 3 ? '#065F46' : BRAND.primary, marginBottom: 1 }}>
                {w.week}
              </div>
              <div
                style={{ fontSize: 9, fontWeight: 700, color: BRAND.dark, marginBottom: 6 }}
                dangerouslySetInnerHTML={{ __html: w.label }}
              />
              <ul style={{ margin: 0, paddingLeft: 12, color: BRAND.body }}>
                {w.bullets.map((b, bi) => (
                  <li
                    key={bi}
                    style={{ marginBottom: 3 }}
                    dangerouslySetInnerHTML={{ __html: b }}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Deliverables + Team — two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14, marginBottom: 18 }}>
        <div>
          <H2>Final deliverables</H2>
          <ul style={{ margin: 0, paddingLeft: 14, fontSize: 9.5, lineHeight: 1.7, color: BRAND.body }}>
            <li><strong style={{ color: BRAND.dark }}>Executive readout deck (PowerPoint).</strong> The primary deliverable — presented live in week 4, structured around the three focus areas with quantified findings and recommendations.</li>
            <li><strong style={{ color: BRAND.dark }}>Supporting PDF report.</strong> Companion artifact with the full underlying analysis: stack utilization scorecard, complete initiative classification, full role-by-role training matrix, and the 90-day execution plan with KPIs.</li>
            <li><strong style={{ color: BRAND.dark }}>Microsoft Feature Watchlist.</strong> Dated catalog of recent Microsoft AI feature releases, with role-relevance and impact estimates — your team can refer back to it as new features ship.</li>
            <li><strong style={{ color: BRAND.dark }}>Endorsed (or refined) build-vs-Copilot decision framework.</strong> Independent third-party review of your internal decision tree, validated against current Microsoft platform capabilities and ready for your team to apply to future initiatives.</li>
            <li><strong style={{ color: BRAND.dark }}>AI Champions program outline.</strong> Identified power users from the survey + a recommended program structure for sustaining the upskilling plan beyond Logic20/20&rsquo;s engagement.</li>
          </ul>
        </div>

        <div>
          <H2>Logic20/20 team — {CLIENT.fteTotal} FTE</H2>
          <ul style={{ margin: 0, paddingLeft: 14, fontSize: 9.5, lineHeight: 1.7, color: BRAND.body }}>
            <li><strong style={{ color: BRAND.dark }}>Engagement Lead — 1.0 FTE.</strong> Delivery accountability, exec-level interface, methodology integrity, final readout.</li>
            <li><strong style={{ color: BRAND.dark }}>Microsoft AI Practice Architect — 0.75 FTE.</strong> Owns stack utilization analysis, build-vs-Copilot classification, decision-tree review, MS account-rep coordination.</li>
            <li><strong style={{ color: BRAND.dark }}>Senior Consultant — 0.5 FTE.</strong> Survey design, interviews, manager calls, training matrix synthesis.</li>
            <li><strong style={{ color: BRAND.dark }}>Data Analyst — 0.25 FTE.</strong> Telemetry parsing, scorecard build, KPI definition, findings validation.</li>
          </ul>
        </div>
      </div>

      {/* What we need from client + Next steps */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div
          style={{
            background: BRAND.bgLight,
            border: `1px solid ${BRAND.border}`,
            borderLeft: `4px solid ${BRAND.accent}`,
            borderRadius: 4,
            padding: 10,
          }}
        >
          <H2 accent={BRAND.accent} style={{ marginBottom: 6 }}>To start the engagement, we need</H2>
          <ul style={{ margin: 0, paddingLeft: 14, fontSize: 9, lineHeight: 1.6 }}>
            <li>Named exec sponsor and project owner ({CLIENT.recipients}, confirmed)</li>
            <li>A point of contact in IT for tool usage report exports</li>
            <li>A point of contact in Engineering for the backlog export and working sessions</li>
            <li>Manager-level approval for survey distribution to the {CLIENT.deptSize}-person team</li>
            <li>~30 minutes of each interviewee's time across weeks 1–2 (8–10 interviewees)</li>
          </ul>
        </div>

        <div
          style={{
            background: '#FFF7ED',
            border: '1px solid #FED7AA',
            borderLeft: '4px solid #EA580C',
            borderRadius: 4,
            padding: 10,
          }}
        >
          <H2 accent="#9A3412" style={{ marginBottom: 6 }}>Next steps</H2>
          <ol style={{ margin: 0, paddingLeft: 16, fontSize: 9, lineHeight: 1.6 }}>
            <li><strong style={{ color: BRAND.dark }}>Review &amp; align.</strong> {CLIENT.recipients} review this document; flag any scope or methodology adjustments.</li>
            <li><strong style={{ color: BRAND.dark }}>Alignment call (30 min).</strong> Confirm scope, timing, and IT/Engineering points of contact.</li>
            <li><strong style={{ color: BRAND.dark }}>Draft SOW.</strong> Logic20/20 issues a draft SOW reflecting the agreed scope.</li>
            <li><strong style={{ color: BRAND.dark }}>Kickoff.</strong> Engagement begins on the agreed start date — first deliverable in week 1.</li>
          </ol>
        </div>
      </div>

      <PageFooter n={3} />
    </div>
  )
}

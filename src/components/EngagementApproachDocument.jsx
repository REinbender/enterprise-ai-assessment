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
  recipients:  'Tricia and Matt',
  preparedBy:  'Logic20/20',
  date:        new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  reference:   `DPT-AI-${new Date().toISOString().slice(0, 10)}`,
  deptSize:    50,
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
            output="An initiative-by-initiative classification with rationale, productizing the decision tree your team has already started internally."
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
          <strong>This is</strong> a focused, four-week diagnostic of {CLIENT.deptSize} people in {CLIENT.name},
          producing three actionable artifacts and a 90-day execution plan. <strong>This is not</strong> a
          re-run of an enterprise AI maturity assessment, a vendor selection, or a custom-build engagement.
          We expect the diagnostic to feed downstream Logic20/20 enablement work — but those are scoped separately.
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
      <div style={{ fontSize: 11, color: BRAND.body, marginBottom: 18 }}>
        For each focus area: the inputs we need from your team, the Logic20/20 method we apply,
        and the artifact you receive at week 4.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <MethodBlock
          num="1"
          title="Microsoft Stack Utilization"
          inputs={[
            { label: 'Tool usage reports', detail: 'Microsoft 365 Admin Center · Power Platform admin center · GitHub Copilot business reports · Azure AI Foundry telemetry — exported by your IT admin and shared with the Logic20/20 team.' },
            { label: 'Department-wide survey', detail: `12-question instrument administered to all ${CLIENT.deptSize} members of ${CLIENT.name}. Captures self-reported tool usage, awareness of recent features, and perceived blockers per role.` },
            { label: 'Targeted interviews', detail: '8–10 30-minute interviews across senior devs, BAs, analysts, IT admins, and architects to validate survey signal and surface qualitative blockers.' },
          ]}
          method="Cross-reference observed telemetry against self-reported usage to surface awareness gaps, license waste, and shadow tool patterns. Map each unused high-value feature to its role-relevant audience and estimated productivity impact."
          output="Stack coverage scorecard (X of Y high-value features actively used), per-role coverage breakdown, ranked high-impact gap list with quantified reclaim estimates, and a maintained Microsoft Feature Watchlist of capabilities released in the last 90 days."
        />

        <MethodBlock
          num="2"
          title="Build vs. Copilot Decision Map"
          inputs={[
            { label: 'Backlog export', detail: 'Read-only export of your in-flight and proposed AI/automation initiatives from Azure DevOps, Jira, or your equivalent — including current technical approach, sponsor, and stage.' },
            { label: 'Working sessions', detail: 'Two 60-minute working sessions with technical leads to walk Logic20/20 through the active and proposed initiatives. No repository access required.' },
            { label: 'Internal decision tree', detail: 'We integrate the build-vs-Copilot decision logic your team has already started so the engagement productizes (and extends) your existing thinking rather than replacing it.' },
          ]}
          method="Apply a six-factor decision framework — data sensitivity, workflow standardization, integration depth, user-volume economics, reusability, and speed-to-value — to each initiative. Custom builds are reserved for initiatives where two or more factors unambiguously require it."
          output="Initiative-by-initiative classification (Ship on Copilot / Hybrid / Build Custom) with explicit rationale per initiative, estimated time and cost savings for any re-routes, and the decision criteria framework formalized as a reusable internal tool for future initiatives."
        />

        <MethodBlock
          num="3"
          title="Role-by-Role Training Matrix"
          inputs={[
            { label: 'Department-wide survey', detail: `Same instrument as Area 1 — extended with 6 questions on current credentials (AI-900, AI-102, PL-300, etc.), comfort levels per Microsoft AI capability, and self-identified skill gaps. Required of all ${CLIENT.deptSize} department members.` },
            { label: 'Manager validation', detail: 'Three 30-minute calls with team managers to validate survey results against observed work product and to surface skill gaps individuals may not self-report.' },
            { label: 'Microsoft Learn catalog', detail: 'Logic20/20 maintains a current map of Microsoft Learn paths and certifications. We anchor recommendations to active credentials, not generic training topics.' },
          ]}
          method="Bucket department members by role, score current capability against role-appropriate target levels, and identify gap topics. Sequence Microsoft Learn paths and certifications so prerequisites land before specialty paths. Estimate effort, cost, and capacity unlock per role."
          output="Role × current credentials × identified gap × sequenced training plan, with weeks-of-effort, certification costs, and outcome-unlock estimates per role. Includes a Microsoft Learn collection link that managers can assign directly."
        />
      </div>

      <PageFooter n={2} />
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
      'Department-wide survey designed and launched (open through end of Week 2)',
      'Interview slots scheduled across roles',
      'Data exports requested: MS tool usage reports, backlog export',
    ],
  },
  {
    week: 'Week 2',
    label: 'Data Collection',
    bullets: [
      'Survey closes; 8–10 targeted interviews conducted',
      'Tool usage reports received and parsed',
      'Backlog and initiative inventory walked through with technical leads',
      'Working sessions: build-vs-Copilot decision walkthrough',
    ],
  },
  {
    week: 'Week 3',
    label: 'Analysis &amp; Synthesis',
    bullets: [
      'Stack utilization scorecard built; gap rankings produced',
      'Initiative classification applied; per-initiative rationale documented',
      'Training matrix populated; sequencing reviewed against MS Learn catalog',
      'Mid-engagement checkpoint with Tricia and Matt — directional findings shared',
    ],
  },
  {
    week: 'Week 4',
    label: 'Refinement &amp; Readout',
    bullets: [
      'Findings reviewed with technical leads for accuracy and feasibility',
      'Final readout deck and supporting PDF produced',
      '90-minute executive readout delivered (live, with Q&amp;A)',
      '90-day execution plan finalized; SOW for downstream enablement work prepared if desired',
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
            <li><strong style={{ color: BRAND.dark }}>Supporting PDF report.</strong> Companion artifact with the full underlying analysis: stack utilization scorecard, complete initiative classification, full role-by-role training matrix, and the 90-day execution plan.</li>
            <li><strong style={{ color: BRAND.dark }}>Microsoft Feature Watchlist.</strong> Ongoing artifact your team can refer back to — a dated catalog of recent Microsoft AI feature releases, with role-relevance and impact estimates.</li>
            <li><strong style={{ color: BRAND.dark }}>Reusable build-vs-Copilot decision framework.</strong> The six-factor decision tool, productized for ongoing use beyond the engagement.</li>
          </ul>
        </div>

        <div>
          <H2>Logic20/20 team</H2>
          <ul style={{ margin: 0, paddingLeft: 14, fontSize: 9.5, lineHeight: 1.7, color: BRAND.body }}>
            <li><strong style={{ color: BRAND.dark }}>Engagement Lead.</strong> Owns delivery, exec-level interface, and final readout.</li>
            <li><strong style={{ color: BRAND.dark }}>Microsoft AI Practice Architect.</strong> Drives stack utilization analysis, build-vs-Copilot classification, and feature watchlist maintenance.</li>
            <li><strong style={{ color: BRAND.dark }}>Senior Consultant.</strong> Designs and runs the survey, conducts interviews, produces the training matrix.</li>
            <li><strong style={{ color: BRAND.dark }}>Data Analyst (part-time).</strong> Processes telemetry, builds the scorecard, validates findings.</li>
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

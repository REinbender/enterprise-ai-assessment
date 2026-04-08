import { useState } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import {
  computeDimensionScores,
  computeOverallScore,
  generateNarrative,
} from '../data/questions'
import { generateRecommendations } from '../data/recommendations'

// ── Colour palette ────────────────────────────────────────────────────────
const C = {
  primary:    [46,  163, 242],  // Logic2020 blue  #2EA3F2
  primaryDk:  [26,  140, 216],  // Logic2020 dark  #1A8CD8
  slate900:   [51,  51,  51],   // #333333
  slate700:   [85,  85,  85],   // #555555
  slate500:   [153, 153, 153],  // #999999
  slate200:   [226, 226, 226],  // #E2E2E2
  slate50:    [243, 243, 243],  // #F3F3F3
  white:      [255, 255, 255],
  green:      [16,  185, 129],
  amber:      [245, 158,  11],
  red:        [239,  68,  68],
  purple:     [139,  92, 246],
  sky:        [14,  165, 233],
}

const DIM_COLORS = {
  1: [46,  163, 242],  // blue    – Strategy
  2: [14,  165, 233],  // sky     – Data
  3: [139,  92, 246],  // purple  – Governance
  4: [245, 158,  11],  // amber   – Talent
  5: [16,  185, 129],  // green   – Operations
  6: [236,  72, 153],  // pink    – GenAI
}

// Maturity color lookup (matches questions.js maturityLevels)
function maturityColor(score) {
  if (score < 20) return [231, 76,  60]
  if (score < 40) return [230, 126, 34]
  if (score < 60) return [241, 196, 15]
  if (score < 80) return [46,  163, 242]
  return              [39,  174, 96]
}
function maturityLabel(score) {
  if (score < 20) return 'Beginning'
  if (score < 40) return 'Developing'
  if (score < 60) return 'Maturing'
  if (score < 80) return 'Advanced'
  return              'Leading'
}

// ── Per-dimension tier narratives ─────────────────────────────────────────
const DIM_NARRATIVES = {
  1: {
    low:    'AI strategy is either absent or operates as a collection of uncoordinated initiatives without executive sponsorship or clear ROI accountability. This creates fundamental risk of misaligned investment and an inability to demonstrate AI value to the board. Establishing a formal strategy with executive ownership and measurable KPIs is the single highest-leverage action available.',
    medium: 'A foundational AI strategy exists and has executive visibility, but lacks the execution rigor, value-tracking infrastructure, and organizational alignment needed to deliver at scale. Investments are being made, but the link between AI spend and measurable business outcomes remains unclear to many stakeholders. Strengthening governance and building a visible AI value dashboard are the priority actions.',
    high:   'AI strategy is formally documented, actively governed, and explicitly linked to measurable business outcomes — positioning the organization for sustained competitive advantage. Leadership champions AI internally and externally, and the strategy undergoes regular review. The focus should shift to AI-native product and service innovation and ecosystem development.',
  },
  2: {
    low:    'Critical gaps in data quality, governance, and infrastructure will directly constrain any AI ambitions regardless of other investments made. Without reliable, accessible, and well-governed data, even the most capable AI models will fail to deliver consistent business value. A data estate audit and foundational data quality program are immediate prerequisites.',
    medium: 'Core data infrastructure is in place but inconsistencies in quality, pipeline reliability, and tooling create friction for AI development teams and introduce reliability risk in production. Automated quality monitoring, a formal data catalog, and a feature store would significantly accelerate development velocity. Closing data silo gaps for priority use cases is essential.',
    high:   'Data infrastructure is a genuine AI enabler — well-governed, accessible, and scalable to support the organization\'s AI ambitions. Pipeline tooling and governance practices allow AI teams to move quickly with high confidence in data reliability. The opportunity is to advance real-time streaming capabilities and optimize infrastructure costs at scale.',
  },
  3: {
    low:    'AI governance is nascent, leaving the organization exposed to significant legal, reputational, and operational risk as AI initiatives scale. The absence of formal risk assessment processes, accountability structures, and regulatory compliance mapping creates material liability. Establishing an AI ethics policy and mandatory pre-deployment risk assessment is urgent.',
    medium: 'Governance foundations are present but applied inconsistently across AI projects, creating uneven risk exposure and gaps in audit readiness. Model documentation, bias testing, and incident response capabilities need to be formalized and embedded in the standard development lifecycle. The goal is transitioning from ad-hoc governance to systematic, measurable controls.',
    high:   'AI governance is mature, systematic, and deeply integrated into the development lifecycle — a significant competitive and regulatory differentiator. Risk controls, bias monitoring, and model auditability are embedded rather than bolt-on, enabling confident AI scaling. The opportunity is to leverage this maturity for external trust-building and proactive regulatory engagement.',
  },
  4: {
    low:    'Significant AI talent gaps and cultural barriers represent a people-layer constraint that will limit AI success regardless of technology investment. Without deliberate recruitment, upskilling, and cultural change management, AI initiatives will stall at proof-of-concept. Building AI literacy across management and hiring for critical technical roles must begin immediately.',
    medium: 'AI talent and cultural momentum are building, but gaps in enablement programs, cross-functional collaboration, and change management are creating adoption friction. A Center of Excellence and embedded AI roles in business units would reduce dependence on a central team and accelerate enterprise-wide adoption velocity.',
    high:   'A strong AI talent base and innovation-friendly culture are clear organizational strengths that provide a durable competitive advantage. AI skills are distributed across the enterprise and the culture rewards data-driven experimentation. Sustaining this requires deliberate retention strategies and continued investment in frontier skill development.',
  },
  5: {
    low:    'Without foundational MLOps practices, AI models cannot be deployed reliably, monitored effectively, or improved systematically in production. The absence of standardized tooling means AI projects stall between experimentation and production value delivery. Establishing experiment tracking, model versioning, and basic CI/CD for ML models is the immediate priority.',
    medium: 'Basic MLOps practices are in place but automation gaps and inconsistent standards are creating deployment bottlenecks and reliability risk for production AI systems. Automated retraining pipelines, a shared feature store, and A/B testing infrastructure would significantly increase deployment velocity and system resilience.',
    high:   'MLOps capabilities are mature, with reliable CI/CD pipelines, automated monitoring, and systematic post-deployment review practices firmly established. AI systems are deployed at scale with high reliability and the engineering organization can iterate rapidly with confidence. The focus should advance toward self-service AI infrastructure and FinOps optimization.',
  },
  6: {
    low:    'The organization lacks the policy foundation, governance structure, and technical infrastructure needed to deploy Generative AI responsibly. Unmanaged adoption of consumer GenAI tools is already creating data privacy and IP risk. Establishing an acceptable use policy, appointing a GenAI sponsor, and auditing shadow AI usage are the immediate priorities before any further deployment occurs.',
    medium: 'GenAI experimentation is underway, but the absence of consistent governance, output quality controls, and impact measurement means the organization cannot scale responsibly or demonstrate business value. Implementing RAG infrastructure, structured evaluation frameworks, and a GenAI CoE would unlock the next phase of adoption and significantly reduce operational risk.',
    high:   'Generative AI capabilities are well-established with strong governance, quality controls, and measurable business outcomes — positioning the organization as a GenAI leader. The opportunity is to leverage proprietary data assets and agentic architectures to build differentiated capabilities that competitors cannot easily replicate, while publishing externally to shape industry practices.',
  },
}

// ── jsPDF helpers ─────────────────────────────────────────────────────────
function setFill(doc, rgb)  { doc.setFillColor(rgb[0], rgb[1], rgb[2]) }
function setDraw(doc, rgb)  { doc.setDrawColor(rgb[0], rgb[1], rgb[2]) }
function setTextC(doc, rgb) { doc.setTextColor(rgb[0], rgb[1], rgb[2]) }

function filledBox(doc, x, y, w, h, rgb, r = 3) {
  setFill(doc, rgb)
  doc.roundedRect(x, y, w, h, r, r, 'F')
}

function progressBar(doc, x, y, w, h, pct, rgb) {
  setFill(doc, C.slate200)
  doc.roundedRect(x, y, w, h, h / 2, h / 2, 'F')
  if (pct > 0) {
    setFill(doc, rgb)
    doc.roundedRect(x, y, Math.max(w * (pct / 100), h), h, h / 2, h / 2, 'F')
  }
}

// Page layout constants
const PW = 210
const PH = 297
const ML = 18
const MR = 18
const CW = PW - ML - MR

// ── Shared page header ────────────────────────────────────────────────────
function pageHeader(doc, title, pageNum) {
  filledBox(doc, 0, 0, PW, 28, C.primary, 0)

  filledBox(doc, ML, 8, 14, 8, C.primaryDk, 2)
  doc.setFontSize(6)
  doc.setFont('helvetica', 'bold')
  setTextC(doc, C.white)
  doc.text('AI', ML + 4, 13.5)

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  setTextC(doc, C.white)
  doc.text(title, ML + 20, 16)

  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  setTextC(doc, [199, 210, 254])
  doc.text('Enterprise AI Readiness Assessment  ·  Logic2020', ML + 20, 22)

  setTextC(doc, [199, 210, 254])
  doc.text(`Page ${pageNum}`, PW - ML, 16, { align: 'right' })
}

// ── PAGE 1: Cover ─────────────────────────────────────────────────────────
function drawCover(doc, company, dimScores, overallScore) {
  filledBox(doc, 0, 0, PW, PH, C.primaryDk, 0)
  filledBox(doc, 0, 0, PW, PH / 2.2, C.primary, 0)

  // Decorative circles
  setFill(doc, C.white)
  doc.setGState(doc.GState({ opacity: 0.04 }))
  doc.circle(PW - 30, 40, 60, 'F')
  doc.circle(PW - 10, 10, 30, 'F')
  doc.setGState(doc.GState({ opacity: 1 }))

  // Logic2020 badge
  filledBox(doc, ML, 24, 30, 10, C.primaryDk, 2)
  setTextC(doc, C.white)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  doc.text('LOGIC2020', ML + 2.5, 30.5)

  // Title
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  setTextC(doc, C.white)
  doc.text('Enterprise AI Readiness', ML, 56)
  doc.text('Assessment', ML, 68)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  setTextC(doc, [199, 210, 254])
  doc.text('Confidential Assessment Report', ML, 78)

  // Company name box
  if (company.name) {
    filledBox(doc, ML, 88, CW, 18, C.white, 3)
    doc.setGState(doc.GState({ opacity: 0.1 }))
    filledBox(doc, ML, 88, CW, 18, C.primary, 3)
    doc.setGState(doc.GState({ opacity: 1 }))
    setTextC(doc, C.white)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(company.name, ML + 6, 98)
    if (company.industry) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      setTextC(doc, [199, 210, 254])
      doc.text(`${company.industry}  ·  ${company.size || ''}`, ML + 6, 105)
    }
  }

  // Respondent line
  if (company.respondentName || company.respondentRole) {
    setTextC(doc, [199, 210, 254])
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    const resp = [company.respondentName, company.respondentRole].filter(Boolean).join('  ·  ')
    doc.text(`Completed by: ${resp}`, ML, 115)
  }

  // Overall Score circle
  const cx = ML + 30
  const cy = 142
  const r  = 24
  setFill(doc, C.white)
  doc.setGState(doc.GState({ opacity: 0.12 }))
  doc.circle(cx, cy, r, 'F')
  doc.setGState(doc.GState({ opacity: 1 }))
  doc.setFillColor(255, 255, 255)
  doc.circle(cx, cy, r - 3, 'F')

  setTextC(doc, C.primary)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text(`${overallScore}`, cx, cy + 3, { align: 'center' })
  doc.setFontSize(6)
  doc.setFont('helvetica', 'normal')
  doc.text('%', cx, cy + 8, { align: 'center' })

  setTextC(doc, C.white)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Overall Readiness', ML + 64, cy - 8)
  doc.setFontSize(20)
  doc.text(`${overallScore}%`, ML + 64, cy + 2)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  setTextC(doc, [199, 210, 254])
  doc.text(`Maturity Level: ${maturityLabel(overallScore)}`, ML + 64, cy + 10)

  // Dimension summary table
  const tableY = 176
  setTextC(doc, C.slate700)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('DIMENSION SCORES', ML, tableY)

  const rowH  = 14
  const col1W = 80
  const col2W = 55
  const col3W = CW - col1W - col2W

  filledBox(doc, ML, tableY + 3, CW, 8, C.slate50, 2)
  doc.setFontSize(7)
  setTextC(doc, C.slate500)
  doc.text('DIMENSION', ML + 3, tableY + 8.5)
  doc.text('MATURITY', ML + col1W + 3, tableY + 8.5)
  doc.text('SCORE', ML + col1W + col2W + 3, tableY + 8.5)

  dimScores.forEach((d, i) => {
    const ry  = tableY + 11 + i * rowH
    const dc  = DIM_COLORS[d.id]
    const mc  = maturityColor(d.score)
    const ml  = maturityLabel(d.score)

    if (i % 2 === 0) filledBox(doc, ML, ry, CW, rowH, C.slate50, 0)

    setFill(doc, dc)
    doc.circle(ML + 4, ry + 6, 2.5, 'F')

    setTextC(doc, C.slate900)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(d.shortName, ML + 9, ry + 7)

    filledBox(doc, ML + col1W + 2, ry + 2, 38, 7, mc, 3)
    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'bold')
    setTextC(doc, C.white)
    doc.text(ml, ML + col1W + 21, ry + 7, { align: 'center' })

    const bx = ML + col1W + col2W + 2
    const bw = col3W - 10
    progressBar(doc, bx, ry + 4, bw, 4, d.score, dc)
    setTextC(doc, C.slate700)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text(`${d.score}%`, bx + bw + 3, ry + 8)
  })

  // Footer
  setTextC(doc, C.slate500)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  doc.text(`Generated ${dateStr}  ·  Enterprise AI Readiness Assessment v1.4.0  ·  logic2020.com`, PW / 2, PH - 8, { align: 'center' })
}

// ── PAGE 2: Executive Summary ─────────────────────────────────────────────
function drawExecutiveSummaryPage(doc, company, dimScores, overallScore, recs) {
  doc.addPage()
  pageHeader(doc, 'Executive Summary', 2)

  const narrative = generateNarrative(company, dimScores, overallScore)
  const sorted    = [...dimScores].sort((a, b) => b.score - a.score)
  const strongest = sorted[0]
  const weakest   = sorted[sorted.length - 1]
  const topRec    = recs[0]

  let y = 42

  // ── Assessment Overview narrative ──────────────────────────
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  setTextC(doc, C.slate500)
  doc.text('ASSESSMENT OVERVIEW', ML, y)
  y += 6

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  setTextC(doc, C.slate900)
  narrative.forEach(sentence => {
    const lines = doc.splitTextToSize(sentence, CW)
    doc.text(lines, ML, y)
    y += lines.length * 5 + 2
  })
  y += 4

  // ── Key Findings row ───────────────────────────────────────
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  setTextC(doc, C.slate500)
  doc.text('KEY FINDINGS', ML, y)
  y += 5

  const boxW = (CW - 8) / 3
  const boxH = 30
  const findings = [
    {
      label: 'Overall Score',
      value: `${overallScore}/100`,
      sub: maturityLabel(overallScore),
      color: maturityColor(overallScore),
    },
    {
      label: 'Strongest Dimension',
      value: strongest.shortName,
      sub: `${strongest.score}/100 — ${maturityLabel(strongest.score)}`,
      color: DIM_COLORS[strongest.id],
    },
    {
      label: 'Priority Focus Area',
      value: weakest.shortName,
      sub: `${weakest.score}/100 — ${maturityLabel(weakest.score)}`,
      color: maturityColor(weakest.score),
    },
  ]

  findings.forEach((f, i) => {
    const bx = ML + i * (boxW + 4)

    setFill(doc, C.white)
    doc.roundedRect(bx, y, boxW, boxH, 3, 3, 'F')
    setDraw(doc, C.slate200)
    doc.roundedRect(bx, y, boxW, boxH, 3, 3, 'S')

    // Color accent top bar
    setFill(doc, f.color)
    doc.roundedRect(bx, y, boxW, 2.5, 1.5, 1.5, 'F')

    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    setTextC(doc, C.slate500)
    doc.text(f.label.toUpperCase(), bx + 5, y + 9)

    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    setTextC(doc, f.color)
    doc.text(f.value, bx + 5, y + 19)

    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    setTextC(doc, C.slate700)
    doc.text(f.sub, bx + 5, y + 26)
  })

  y += boxH + 8

  // ── Top Priority callout ───────────────────────────────────
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  setTextC(doc, C.slate500)
  doc.text('PRIMARY RECOMMENDATION', ML, y)
  y += 5

  const recDescLines = doc.splitTextToSize(topRec.description, CW - 20)
  const recBoxH = 16 + recDescLines.length * 4.5 + 4
  const pc = topRec.priority === 'Critical' ? C.red : topRec.priority === 'High' ? C.amber : C.primary

  setFill(doc, C.slate50)
  doc.roundedRect(ML, y, CW, recBoxH, 3, 3, 'F')
  setFill(doc, pc)
  doc.roundedRect(ML, y, 4, recBoxH, 2, 2, 'F')

  doc.setFontSize(9.5)
  doc.setFont('helvetica', 'bold')
  setTextC(doc, C.slate900)
  doc.text(topRec.title, ML + 8, y + 9)

  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  setTextC(doc, C.slate700)
  doc.text(recDescLines, ML + 8, y + 15)

  y += recBoxH + 8

  // ── Single-respondent advisory notice ─────────────────────
  doc.setFontSize(7)
  doc.setFont('helvetica', 'italic')
  setTextC(doc, C.slate500)
  const notice = 'This assessment reflects self-reported maturity at a single point in time. Logic2020 recommends supplementing these findings with multi-stakeholder validation and expert review before making strategic investment decisions.'
  const noticeLines = doc.splitTextToSize(notice, CW)
  doc.text(noticeLines, ML, y)
}

// ── PAGE 3: Dimension Deep-Dives ──────────────────────────────────────────
function drawDimensionsPage(doc, dimScores) {
  doc.addPage()
  pageHeader(doc, 'Dimension Score Analysis', 3)

  let y = 42

  dimScores.forEach((d) => {
    const dc    = DIM_COLORS[d.id]
    const mc    = maturityColor(d.score)
    const ml    = maturityLabel(d.score)
    const tier  = d.score < 40 ? 'low' : d.score < 70 ? 'medium' : 'high'
    const text  = DIM_NARRATIVES[d.id][tier]
    const textLines = doc.splitTextToSize(text, CW - 16)
    const cardH = 52 + textLines.length * 4

    if (y + cardH > PH - 20) {
      doc.addPage()
      pageHeader(doc, 'Dimension Score Analysis (cont.)', 3)
      y = 42
    }

    // Card background
    setFill(doc, C.white)
    doc.roundedRect(ML, y, CW, cardH, 3, 3, 'F')
    setDraw(doc, C.slate200)
    doc.roundedRect(ML, y, CW, cardH, 3, 3, 'S')

    // Left accent bar
    setFill(doc, dc)
    doc.roundedRect(ML, y, 4, cardH, 2, 2, 'F')

    // Dimension name
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    setTextC(doc, C.slate900)
    doc.text(d.name, ML + 10, y + 10)

    // Score (large)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    setTextC(doc, dc)
    doc.text(`${d.score}%`, ML + 10, y + 24)

    // Maturity pill
    const pillW = doc.getTextWidth(ml) + 8
    filledBox(doc, ML + 10, y + 27, pillW, 7, mc, 3)
    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'bold')
    setTextC(doc, C.white)
    doc.text(ml, ML + 10 + pillW / 2, y + 32, { align: 'center' })

    // Progress bar
    progressBar(doc, ML + 10, y + 38, CW - 72, 4, d.score, dc)

    // Score label beside bar
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    setTextC(doc, C.slate700)
    doc.text(`${d.score}/100`, CW - 40, y + 42)

    // Narrative text
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    setTextC(doc, C.slate700)
    doc.text(textLines, ML + 10, y + 48)

    y += cardH + 6
  })
}

// ── PAGE 4+: Recommendations ──────────────────────────────────────────────
function drawRecommendationsPage(doc, recs, startPageNum) {
  doc.addPage()
  pageHeader(doc, 'Prioritized Recommendations', startPageNum)

  const priorityColors = {
    Critical: C.red,
    High:     C.amber,
    Medium:   C.primary,
  }

  const PHASE_COL_W = (CW - 16) / 3
  const PHASE_GAP   = 4

  let y = 42
  let currentPage = startPageNum

  recs.forEach((rec) => {
    const pc = priorityColors[rec.priority] || C.slate500
    const dc = DIM_COLORS[rec.dimensionId] || C.slate500
    const descLines = doc.splitTextToSize(rec.description, CW - 16)

    // Calculate actions height
    const actionsH = rec.actions.reduce((acc, a) => {
      return acc + doc.splitTextToSize(a, CW - 26).length * 4.5
    }, 0) + rec.actions.length * 2.5

    // Calculate phases height
    let phasesH = 0
    if (rec.phases) {
      const maxLines = Math.max(...rec.phases.map(ph =>
        ph.actions.reduce((acc, a) => acc + doc.splitTextToSize(a, PHASE_COL_W - 6).length, 0)
      ))
      phasesH = 20 + maxLines * 4.5 + 8
    }

    const cardH = 28 + descLines.length * 4.5 + 12 + actionsH + (rec.phases ? 10 + phasesH : 0) + 8

    if (y + cardH > PH - 20) {
      doc.addPage()
      currentPage++
      pageHeader(doc, 'Prioritized Recommendations (cont.)', currentPage)
      y = 42
    }

    setFill(doc, C.white)
    doc.roundedRect(ML, y, CW, cardH, 3, 3, 'F')
    setDraw(doc, C.slate200)
    doc.roundedRect(ML, y, CW, cardH, 3, 3, 'S')

    // Priority accent bar
    setFill(doc, pc)
    doc.roundedRect(ML, y, 4, cardH, 2, 2, 'F')

    // Priority pill
    filledBox(doc, ML + 8, y + 5, 20, 7, pc, 3)
    doc.setFontSize(6)
    doc.setFont('helvetica', 'bold')
    setTextC(doc, C.white)
    doc.text(rec.priority, ML + 18, y + 10, { align: 'center' })

    // Dimension badge
    filledBox(doc, ML + 32, y + 5, 42, 7, dc, 3)
    doc.setFontSize(6)
    doc.setFont('helvetica', 'normal')
    setTextC(doc, C.white)
    doc.text(rec.dimensionName, ML + 53, y + 10, { align: 'center' })

    // Effort/Impact badges
    const effortLabel = `E${rec.effort}/5`
    const impactLabel = `I${rec.impact}/5`
    doc.setFontSize(6)
    doc.setFont('helvetica', 'normal')
    setTextC(doc, C.slate500)
    doc.text(`Effort ${effortLabel}  ·  Impact ${impactLabel}`, ML + 78, y + 10)

    doc.setFontSize(7)
    setTextC(doc, C.slate500)
    doc.text(`Score: ${rec.score}%`, ML + CW - 24, y + 10)

    // Title
    doc.setFontSize(9.5)
    doc.setFont('helvetica', 'bold')
    setTextC(doc, C.slate900)
    doc.text(rec.title, ML + 8, y + 21)

    // Description
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    setTextC(doc, C.slate700)
    doc.text(descLines, ML + 8, y + 28)

    // Actions
    let actY = y + 28 + descLines.length * 4.5 + 6
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    setTextC(doc, C.slate500)
    doc.text('RECOMMENDED ACTIONS:', ML + 8, actY)
    actY += 6

    rec.actions.forEach((action) => {
      setFill(doc, pc)
      doc.circle(ML + 11, actY - 1, 1.5, 'F')
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      setTextC(doc, C.slate700)
      const aLines = doc.splitTextToSize(action, CW - 26)
      doc.text(aLines, ML + 15, actY)
      actY += aLines.length * 4.5 + 2.5
    })

    // Phases timeline
    if (rec.phases) {
      actY += 6
      // Divider
      setDraw(doc, C.slate200)
      doc.setLineWidth(0.3)
      doc.line(ML + 8, actY, ML + CW - 8, actY)
      actY += 5

      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      setTextC(doc, C.slate500)
      doc.text('30 / 60 / 90-DAY ACTION PLAN:', ML + 8, actY)
      actY += 5

      rec.phases.forEach((phase, pi) => {
        const colX = ML + 8 + pi * (PHASE_COL_W + PHASE_GAP)

        // Phase column background
        setFill(doc, C.slate50)
        doc.roundedRect(colX, actY, PHASE_COL_W, phasesH - 10, 2, 2, 'F')

        // Left accent for phase
        setFill(doc, dc)
        doc.roundedRect(colX, actY, 3, phasesH - 10, 1.5, 1.5, 'F')

        // Phase label
        doc.setFontSize(6.5)
        doc.setFont('helvetica', 'bold')
        setTextC(doc, dc)
        doc.text(phase.label, colX + 6, actY + 6)

        // Theme
        doc.setFontSize(7)
        doc.setFont('helvetica', 'bold')
        setTextC(doc, C.slate900)
        doc.text(phase.theme, colX + 6, actY + 12)

        // Phase actions
        let phActY = actY + 17
        phase.actions.forEach((a) => {
          setFill(doc, dc)
          doc.circle(colX + 8, phActY - 1, 1, 'F')
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(6.5)
          setTextC(doc, C.slate700)
          const aLines = doc.splitTextToSize(a, PHASE_COL_W - 8)
          doc.text(aLines, colX + 11, phActY)
          phActY += aLines.length * 4 + 2
        })
      })
    }

    y += cardH + 6
  })
}

// ── Main export function ──────────────────────────────────────────────────
export async function exportToPDF(company, answers, radarChartRef) {
  const dimScores    = computeDimensionScores(answers)
  const overallScore = computeOverallScore(dimScores)
  const recs         = generateRecommendations(dimScores)

  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
  doc.setFont('helvetica')

  // Page 1: Cover
  drawCover(doc, company, dimScores, overallScore)

  // Page 2: Executive Summary
  drawExecutiveSummaryPage(doc, company, dimScores, overallScore, recs)

  // Page 3: Dimension Analysis
  drawDimensionsPage(doc, dimScores)

  // Page 4: Radar chart
  let recsStartPage = 4
  if (radarChartRef?.current) {
    try {
      doc.addPage()
      pageHeader(doc, 'AI Readiness Radar', 4)
      const canvas = await html2canvas(radarChartRef.current, {
        scale: 2, backgroundColor: '#ffffff', logging: false,
      })
      const imgData = canvas.toDataURL('image/png')
      const imgW = 140
      const imgH = (canvas.height / canvas.width) * imgW
      doc.addImage(imgData, 'PNG', (PW - imgW) / 2, 36, imgW, imgH)
      recsStartPage = 5
    } catch (_) {
      // radar capture failed — skip page
    }
  }

  // Page 5+: Recommendations
  drawRecommendationsPage(doc, recs, recsStartPage)

  const filename = company.name
    ? `AI_Readiness_${company.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`
    : `AI_Readiness_Assessment_${new Date().toISOString().slice(0, 10)}.pdf`

  doc.save(filename)
}

// ── Button component ──────────────────────────────────────────────────────
export default function PDFExportButton({ company, answers, radarChartRef }) {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      await exportToPDF(company, answers, radarChartRef)
    } catch (e) {
      console.error('PDF export failed:', e)
      alert('PDF export encountered an issue. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      className="btn-export-pdf"
      onClick={handleExport}
      disabled={loading}
    >
      {loading ? (
        <>
          <span className="btn-spinner" />
          Generating PDF…
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 15V3m0 12l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Export PDF Report
        </>
      )}
    </button>
  )
}

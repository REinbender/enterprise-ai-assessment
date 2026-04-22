import { useState } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import {
  computeDimensionScores,
  computeOverallScore,
  generateNarrative,
  getRiskProfile,
  maturityLevels,
  dimensions as allDimensions,
} from '../data/questions'
import { generateRecommendations } from '../data/recommendations'
import { DIM_COLORS_RGB, matColorRGB } from '../constants/colors'

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

// DIM_COLORS_RGB imported from constants/colors — single source of truth
const DIM_COLORS = DIM_COLORS_RGB

// matColorRGB imported from constants/colors — null-safe, canonical source
const maturityColor = matColorRGB
function maturityLabel(score) {
  if (score < 20) return 'Beginning'
  if (score < 40) return 'Developing'
  if (score < 60) return 'Maturing'
  if (score < 80) return 'Advanced'
  return              'Leading'
}
function maturityContext(score) {
  const lvl = maturityLevels.find(l => score >= l.min && score <= l.max)
  return lvl?.context || null
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

// ── Per-dimension framework references ────────────────────────────────────
const DIM_FRAMEWORKS_PDF = {
  1: 'NIST AI RMF 1.0 (GOVERN) · OECD AI Principles',
  2: 'DAMA-DMBOK v2 · NIST AI RMF (MAP)',
  3: 'NIST AI RMF 1.0 (MAP/MEASURE/MANAGE) · ISO/IEC 42001:2023 · EU AI Act (2024)',
  4: 'NIST AI RMF (GOVERN 6.x) · WEF AI Governance Alliance',
  5: 'Google MLOps Maturity Model · Microsoft Azure MLOps Model · NIST AI RMF (MANAGE)',
}

const DIM_OWNERS_PDF = {
  1: 'CEO / CDAO',
  2: 'CTO / CIO',
  3: 'CISO / CDAO',
  4: 'CHRO / CDAO',
  5: 'CTO / VP Engineering',
}

// ── Shared page footer (CONFIDENTIAL) ─────────────────────────────────────
function pageFooter(doc, company) {
  const y = PH - 6
  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'normal')
  setTextC(doc, C.slate500)
  doc.text('CONFIDENTIAL', ML, y)
  const centerText = company?.name
    ? `Prepared for ${company.name}  ·  Logic2020  ·  v1.6.0  ·  logic2020.com`
    : `Enterprise AI Readiness Assessment  ·  Logic2020  ·  v1.6.0  ·  logic2020.com`
  doc.text(centerText, PW / 2, y, { align: 'center' })
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  doc.text(dateStr, PW - MR, y, { align: 'right' })
}

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
  const navy    = [12, 32, 70]
  const mc      = maturityColor(overallScore)
  const mlLabel = maturityLabel(overallScore)
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  // ── Zone 1: Blue header band (top 40%) ──────────────────────
  filledBox(doc, 0, 0, PW, 118, C.primary, 0)

  // Decorative geometry — large offset circles for depth
  doc.setGState(doc.GState({ opacity: 0.08 }))
  setFill(doc, C.white)
  doc.circle(PW + 20, -15, 90, 'F')
  doc.circle(PW - 10, 105, 55, 'F')
  doc.setGState(doc.GState({ opacity: 1 }))

  // Thin white rule under logo area
  doc.setGState(doc.GState({ opacity: 0.2 }))
  setDraw(doc, C.white)
  doc.setLineWidth(0.3)
  doc.line(ML, 30, PW - MR, 30)
  doc.setGState(doc.GState({ opacity: 1 }))

  // Logo + tagline
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  setTextC(doc, C.white)
  doc.text('LOGIC2020', ML, 24)
  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'normal')
  setTextC(doc, [199, 225, 254])
  doc.text('Enterprise Transformation Consulting', ML + 34, 24)

  // Eyebrow tag
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  setTextC(doc, [199, 225, 254])
  doc.text('CONFIDENTIAL ASSESSMENT REPORT', ML, 44)

  // Main title — large, bold, two lines
  doc.setFontSize(30)
  doc.setFont('helvetica', 'bold')
  setTextC(doc, C.white)
  doc.text('Enterprise AI', ML, 62)
  doc.text('Readiness', ML, 80)
  doc.text('Assessment', ML, 98)

  // ── Zone 2: White content panel (bottom 60%) ──────────────────
  const panelY = 108
  filledBox(doc, 0, panelY, PW, PH - panelY, C.white, 0)

  // Blue left accent bar on white panel
  setFill(doc, C.primary)
  doc.rect(0, panelY, 5, PH - panelY, 'F')

  let py = panelY + 14

  // ── Client/company block ────────────────────────────────────
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  setTextC(doc, C.slate500)
  doc.text('PREPARED FOR', ML + 8, py)
  py += 6

  if (company.name) {
    doc.setFontSize(17)
    doc.setFont('helvetica', 'bold')
    setTextC(doc, navy)
    // Truncate if too wide
    let nameText = company.name
    while (doc.getTextWidth(nameText) > CW - 12 && nameText.length > 4) nameText = nameText.slice(0, -1)
    if (nameText !== company.name) nameText += '…'
    doc.text(nameText, ML + 8, py)
    py += 8
  } else {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'italic')
    setTextC(doc, C.slate500)
    doc.text('Organization not specified', ML + 8, py)
    py += 8
  }

  // Industry · Size on one line
  if (company.industry || company.size) {
    const meta = [company.industry, company.size].filter(Boolean).join('  ·  ')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    setTextC(doc, C.slate700)
    doc.text(doc.splitTextToSize(meta, CW - 12)[0], ML + 8, py)
    py += 6
  }

  // Respondent
  if (company.respondentName || company.respondentRole) {
    const resp = [company.respondentName, company.respondentRole].filter(Boolean).join('  ·  ')
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    setTextC(doc, C.slate500)
    doc.text(`Completed by: ${doc.splitTextToSize(resp, CW - 12)[0]}`, ML + 8, py)
    py += 6
  }

  py += 3
  // Section divider
  setDraw(doc, C.slate200)
  doc.setLineWidth(0.5)
  doc.line(ML + 8, py, PW - MR, py)
  py += 10

  // ── Three summary stat tiles ────────────────────────────────
  const tileGap = 5
  const tileW   = (CW - 16 - tileGap * 2) / 3
  const tileH   = 30
  const tiles   = [
    { label: 'OVERALL SCORE', value: `${overallScore}`, sub: '/ 100', color: mc },
    { label: 'MATURITY LEVEL', value: mlLabel, sub: 'AI readiness stage', color: mc },
    { label: 'ASSESSMENT DATE', value: dateStr.split(',')[0], sub: dateStr.split(',')[1]?.trim() || dateStr, color: C.primary },
  ]

  tiles.forEach((t, i) => {
    const tx = ML + 8 + i * (tileW + tileGap)
    setFill(doc, [246, 249, 252])
    doc.roundedRect(tx, py, tileW, tileH, 3, 3, 'F')
    setDraw(doc, C.slate200)
    doc.roundedRect(tx, py, tileW, tileH, 3, 3, 'S')
    // Color top accent
    setFill(doc, t.color)
    doc.roundedRect(tx, py, tileW, 3, 1.5, 1.5, 'F')
    // Label
    doc.setFontSize(6)
    doc.setFont('helvetica', 'bold')
    setTextC(doc, C.slate500)
    doc.text(t.label, tx + tileW / 2, py + 10, { align: 'center' })
    // Value
    const valFontSize = (i === 1 && t.value.length > 8) ? 10 : 15
    doc.setFontSize(valFontSize)
    doc.setFont('helvetica', 'bold')
    setTextC(doc, t.color)
    doc.text(t.value, tx + tileW / 2, py + 21, { align: 'center' })
    // Sub
    doc.setFontSize(6)
    doc.setFont('helvetica', 'normal')
    setTextC(doc, C.slate500)
    doc.text(t.sub, tx + tileW / 2, py + 27, { align: 'center' })
  })
  py += tileH + 10

  // Section divider
  setDraw(doc, C.slate200)
  doc.setLineWidth(0.5)
  doc.line(ML + 8, py, PW - MR, py)
  py += 8

  // ── Dimension scores table ───────────────────────────────────
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  setTextC(doc, C.slate500)
  doc.text('DIMENSION SCORES', ML + 8, py)
  py += 5

  const rowH    = 12
  const nameW   = 78   // dimension name column
  const pillW2  = 36   // maturity pill column
  const barW    = CW - 16 - nameW - pillW2  // score bar column

  // Column header row
  setFill(doc, [240, 245, 250])
  doc.rect(ML + 8, py, CW - 16, 7, 'F')
  doc.setFontSize(6)
  doc.setFont('helvetica', 'bold')
  setTextC(doc, C.slate500)
  doc.text('DIMENSION', ML + 16, py + 5)
  doc.text('MATURITY', ML + 8 + nameW + 2, py + 5)
  doc.text('SCORE', ML + 8 + nameW + pillW2 + 2, py + 5)
  py += 7

  dimScores.forEach((d, i) => {
    const ry  = py + i * rowH
    const dc  = DIM_COLORS[d.id]
    const dmc = maturityColor(d.score)
    const dml = maturityLabel(d.score)

    // Alternating row background
    if (i % 2 === 0) {
      setFill(doc, [248, 251, 254])
      doc.rect(ML + 8, ry, CW - 16, rowH, 'F')
    }

    // Bottom border on each row
    setDraw(doc, [235, 240, 245])
    doc.setLineWidth(0.2)
    doc.line(ML + 8, ry + rowH, ML + 8 + CW - 16, ry + rowH)

    // Color dot
    setFill(doc, dc)
    doc.circle(ML + 14, ry + 6.5, 2.5, 'F')

    // Dimension name
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    setTextC(doc, navy)
    doc.text(d.shortName, ML + 20, ry + 7.5)

    // Maturity pill
    const pW = 30
    filledBox(doc, ML + 8 + nameW + 2, ry + 3, pW, 6, dmc, 2)
    doc.setFontSize(5.5)
    doc.setFont('helvetica', 'bold')
    setTextC(doc, C.white)
    doc.text(dml, ML + 8 + nameW + 2 + pW / 2, ry + 7.2, { align: 'center' })

    // Score progress bar
    const bx = ML + 8 + nameW + pillW2 + 2
    const bw = barW - 14
    progressBar(doc, bx, ry + 4.5, bw, 4, d.score, dc)

    // Score number
    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'bold')
    setTextC(doc, navy)
    doc.text(`${d.score}%`, bx + bw + 3, ry + 8.5)
  })

  py += 5 * rowH + 10

  pageFooter(doc, company)
}

// ── PAGE 2: Table of Contents ─────────────────────────────────────────────
function drawTOCPage(doc, company, hasRadar) {
  doc.addPage()
  pageHeader(doc, 'Table of Contents', 2)
  pageFooter(doc, company)

  let y = 48

  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  setTextC(doc, C.slate500)
  doc.text('SECTION', ML, y)
  doc.text('PAGE', PW - MR, y, { align: 'right' })
  setDraw(doc, C.slate200)
  doc.setLineWidth(0.3)
  doc.line(ML, y + 2, PW - MR, y + 2)

  y += 10

  const tocItems = [
    { title: 'Executive Summary', sub: 'Overall score, key findings, and primary recommendation', page: 3 },
    { title: 'Dimension Score Analysis', sub: 'In-depth assessment across all five AI readiness dimensions', page: 4 },
    { title: 'AI Readiness Radar Profile', sub: 'Visual maturity profile across dimensions', page: hasRadar ? 5 : null },
    { title: 'Prioritized Recommendations', sub: 'Action plans with 30/60/90-day implementation roadmap', page: hasRadar ? 6 : 5 },
  ]

  tocItems.forEach((item, i) => {
    if (item.page === null) return

    const rowH = 18
    if (i % 2 === 0) {
      setFill(doc, C.slate50)
      doc.rect(ML, y - 3, CW, rowH, 'F')
    }

    // Colored left accent
    setFill(doc, C.primary)
    doc.rect(ML, y - 3, 3, rowH, 'F')

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    setTextC(doc, C.slate900)
    doc.text(item.title, ML + 8, y + 4)

    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    setTextC(doc, C.slate500)
    doc.text(item.sub, ML + 8, y + 10)

    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    setTextC(doc, C.primary)
    doc.text(`${item.page}`, PW - MR, y + 5, { align: 'right' })

    y += rowH + 2
  })

  // Footer note
  y += 12
  doc.setFontSize(7)
  doc.setFont('helvetica', 'italic')
  setTextC(doc, C.slate500)
  const noteLines = doc.splitTextToSize(
    'This report was generated by the Logic2020 Enterprise AI Readiness Assessment. ' +
    'It reflects self-reported maturity at a single point in time. ' +
    'Logic2020 recommends multi-stakeholder validation before strategic investment decisions are made.',
    CW
  )
  doc.text(noteLines, ML, y)
}

// ── PAGE 3: Executive Summary ─────────────────────────────────────────────
function drawExecutiveSummaryPage(doc, company, dimScores, overallScore, recs, worstQuestions = []) {
  doc.addPage()
  pageHeader(doc, 'Executive Summary', 3)
  pageFooter(doc, company)

  const narrative = generateNarrative(company, dimScores, overallScore)
  const sorted    = [...dimScores].sort((a, b) => b.score - a.score)
  const strongest = sorted[0]
  const weakest   = sorted[sorted.length - 1]
  const topRec    = recs[0]
  const mc        = maturityColor(overallScore)

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
  y += 2

  // ── Maturity context note ───────────────────────────────────
  const mctx = maturityContext(overallScore)
  if (mctx) {
    const ctxLines = doc.splitTextToSize(mctx, CW)
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'italic')
    setTextC(doc, C.slate500)
    doc.text(ctxLines, ML, y)
    y += ctxLines.length * 4.5 + 4
  }

  // ── Risk Profile callout (conditional) ─────────────────────
  const risk = getRiskProfile(dimScores)
  if (risk) {
    // Convert hex color string to RGB array
    const hexToRgb = h => {
      const r = parseInt(h.slice(1, 3), 16)
      const g = parseInt(h.slice(3, 5), 16)
      const b = parseInt(h.slice(5, 7), 16)
      return [r, g, b]
    }
    const riskRgb = typeof risk.color === 'string' ? hexToRgb(risk.color) : risk.color
    const riskBgRgb = typeof risk.bg === 'string' ? hexToRgb(risk.bg) : risk.bg
    const descLines = doc.splitTextToSize(risk.description, CW - 20)
    const riskBoxH = 10 + descLines.length * 4.2 + 6
    setFill(doc, riskBgRgb)
    doc.roundedRect(ML, y, CW, riskBoxH, 3, 3, 'F')
    setFill(doc, riskRgb)
    doc.roundedRect(ML, y, 4, riskBoxH, 2, 2, 'F')
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    setTextC(doc, riskRgb)
    doc.text(`RISK PROFILE: ${risk.label.toUpperCase()}`, ML + 8, y + 7)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    setTextC(doc, riskRgb)
    doc.text(descLines, ML + 8, y + 13)
    y += riskBoxH + 6
  }

  // ── Executive Scorecard table ──────────────────────────────
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  setTextC(doc, C.slate500)
  doc.text('EXECUTIVE SCORECARD', ML, y)
  y += 5

  const scColW = [70, 22, 38, 28, CW - 70 - 22 - 38 - 28]
  const scHeaders = ['DIMENSION', 'SCORE', 'MATURITY', 'PRIORITY', 'ACCOUNTABLE']
  const scRowH = 10

  // Header row
  filledBox(doc, ML, y, CW, 7, C.slate50, 1)
  setTextC(doc, C.slate500)
  doc.setFontSize(6)
  doc.setFont('helvetica', 'bold')
  let cx = ML + 3
  scHeaders.forEach((h, i) => {
    doc.text(h, cx, y + 5)
    cx += scColW[i]
  })
  y += 7

  const priorityColors = { Critical: C.red, High: C.amber, Medium: C.primary }

  dimScores.forEach((d, i) => {
    const mc = maturityColor(d.score)
    const ml2 = maturityLabel(d.score)
    const rec = recs.find(r => r.dimensionId === d.id)
    const pc = rec ? (priorityColors[rec.priority] || C.primary) : C.primary
    const dc = DIM_COLORS[d.id]

    if (i % 2 === 0) filledBox(doc, ML, y, CW, scRowH, C.slate50, 0)

    cx = ML + 3

    // Dim color dot + name
    setFill(doc, dc)
    doc.circle(cx + 2, y + 5, 2, 'F')
    setTextC(doc, C.slate900)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text(d.shortName, cx + 7, y + 6.5)
    cx += scColW[0]

    // Score
    doc.setFont('helvetica', 'bold')
    setTextC(doc, dc)
    doc.text(`${d.score}`, cx, y + 6.5)
    cx += scColW[1]

    // Maturity pill
    const pillW = doc.getTextWidth(ml2) + 6
    filledBox(doc, cx, y + 2, pillW, 6, mc, 2)
    doc.setFontSize(5.5)
    doc.setFont('helvetica', 'bold')
    setTextC(doc, C.white)
    doc.text(ml2, cx + pillW / 2, y + 6.2, { align: 'center' })
    cx += scColW[2]

    // Priority
    doc.setFontSize(6.5)
    setTextC(doc, pc)
    doc.text(rec ? rec.priority : '—', cx, y + 6.5)
    cx += scColW[3]

    // Owner
    doc.setFont('helvetica', 'normal')
    setTextC(doc, C.slate700)
    doc.text(DIM_OWNERS_PDF[d.id] || '—', cx, y + 6.5)

    y += scRowH
  })
  y += 8

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

  // ── Lowest-scoring questions ────────────────────────────────
  if (worstQuestions.length > 0) {
    const wqNeeded = 10 + worstQuestions.length * 12 + 4
    if (y + wqNeeded > PH - 20) {
      doc.addPage()
      pageHeader(doc, 'Executive Summary (cont.)', 3)
      pageFooter(doc, company)
      y = 42
    }
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    setTextC(doc, C.slate500)
    doc.text('LOWEST-SCORING RESPONSES', ML, y)
    y += 5
    setFill(doc, C.slate50)
    doc.roundedRect(ML, y, CW, worstQuestions.length * 12 + 4, 3, 3, 'F')
    y += 4
    worstQuestions.forEach((q, i) => {
      const dc = DIM_COLORS[q.dimId] || C.slate500
      setFill(doc, dc)
      doc.circle(ML + 4, y + 3, 2, 'F')
      doc.setFontSize(6)
      doc.setFont('helvetica', 'bold')
      setTextC(doc, dc)
      doc.text(q.dimName, ML + 9, y + 4.5)
      doc.setFont('helvetica', 'normal')
      setTextC(doc, C.slate500)
      doc.text(`  ·  Score: ${q.score}/5`, ML + 9 + doc.getTextWidth(q.dimName), y + 4.5)
      const qLines = doc.splitTextToSize(q.text, CW - 12)
      doc.setFontSize(7)
      setTextC(doc, C.slate700)
      doc.text(qLines[0] + (qLines.length > 1 ? '…' : ''), ML + 9, y + 9.5)
      y += 12
    })
    y += 6
  }

  // ── Single-respondent advisory notice ─────────────────────
  doc.setFontSize(7)
  doc.setFont('helvetica', 'italic')
  setTextC(doc, C.slate500)
  const notice = 'This assessment reflects self-reported maturity at a single point in time. Logic2020 recommends supplementing these findings with multi-stakeholder validation and expert review before making strategic investment decisions.'
  const noticeLines = doc.splitTextToSize(notice, CW)
  doc.text(noticeLines, ML, y)
  y += noticeLines.length * 4.5 + 8

  // ── Framework Alignment ────────────────────────────────────
  if (y < PH - 50) {
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    setTextC(doc, C.slate500)
    doc.text('FRAMEWORK ALIGNMENT', ML, y)
    y += 5

    const dimShortNames = { 1: 'Strategy', 2: 'Data', 3: 'Governance', 4: 'Talent', 5: 'Operations' }
    const refsColW = CW - 40  // refs column width (safe wrap width)

    // Calculate actual total height based on wrapped refs
    const fwEntries = Object.entries(DIM_FRAMEWORKS_PDF).map(([id, refs]) => {
      const lines = doc.splitTextToSize(refs, refsColW)
      return { id, refs, lines, rowH: Math.max(lines.length * 4.5 + 4, 9) }
    })
    const fwTotalH = fwEntries.reduce((acc, e) => acc + e.rowH, 0) + 8

    filledBox(doc, ML, y, CW, fwTotalH, C.slate50, 2)
    y += 5

    fwEntries.forEach(({ id, lines, rowH }) => {
      const dc = DIM_COLORS[parseInt(id)]
      setFill(doc, dc)
      doc.circle(ML + 4, y + 2.5, 2, 'F')
      doc.setFontSize(6.5)
      doc.setFont('helvetica', 'bold')
      setTextC(doc, C.slate900)
      doc.text(dimShortNames[id], ML + 9, y + 4)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(6.5)
      setTextC(doc, C.slate500)
      doc.text(lines, ML + 40, y + 4)
      y += rowH
    })
  }
}

// ── PAGE 4: Dimension Deep-Dives ──────────────────────────────────────────
function drawDimensionsPage(doc, company, dimScores) {
  doc.addPage()
  pageHeader(doc, 'Dimension Score Analysis', 4)
  pageFooter(doc, company)

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
      pageHeader(doc, 'Dimension Score Analysis (cont.)', 4)
      pageFooter(doc, company)
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

// ── PAGE 5+: Recommendations ──────────────────────────────────────────────
function drawRecommendationsPage(doc, company, recs, startPageNum, notes = {}) {
  doc.addPage()
  pageHeader(doc, 'Prioritized Recommendations', startPageNum)
  pageFooter(doc, company)

  const priorityColors = {
    Critical: C.red,
    High:     C.amber,
    Medium:   C.primary,
    Sustain:  C.green,
  }

  const PHASE_COL_W = (CW - 16) / 3
  const PHASE_GAP   = 4

  let y = 42
  let currentPage = startPageNum

  recs.forEach((rec) => {
    const isSustain = rec.tier === 'sustain'
    const pc = priorityColors[rec.priority] || C.slate500
    const dc = isSustain ? C.green : (DIM_COLORS[rec.dimensionId] || C.slate500)
    const descLines = doc.splitTextToSize(rec.description, CW - 16)

    // Calculate actions height
    const actionsH = rec.actions.reduce((acc, a) => {
      return acc + doc.splitTextToSize(a, CW - 26).length * 4.5
    }, 0) + rec.actions.length * 2.5

    // Calculate phases height (sustain has no phases)
    let phasesH = 0
    if (!isSustain && rec.phases) {
      const maxLines = Math.max(...rec.phases.map(ph =>
        ph.actions.reduce((acc, a) => acc + doc.splitTextToSize(a, PHASE_COL_W - 6).length, 0)
      ))
      phasesH = 20 + maxLines * 4.5 + 8
    }

    const sustainBannerLines = isSustain
      ? doc.splitTextToSize('Leading — This dimension is performing at a high-maturity level. Focus on sustaining and leveraging this capability rather than remediation.', CW - 26)
      : []
    const sustainBannerH = isSustain ? sustainBannerLines.length * 4.2 + 12 : 0

    const keyRiskLines = rec.keyRisk ? doc.splitTextToSize(rec.keyRisk, CW - 26) : []
    const keyRiskH = rec.keyRisk ? keyRiskLines.length * 4.2 + 12 : 0
    const industryCtxLines = rec.industryContext ? doc.splitTextToSize(rec.industryContext, CW - 26) : []
    const industryCtxH = rec.industryContext ? industryCtxLines.length * 4.2 + 12 : 0
    const sizeNoteLines = rec.sizeNote ? doc.splitTextToSize(rec.sizeNote, CW - 26) : []
    const sizeNoteH = rec.sizeNote ? sizeNoteLines.length * 4.2 + 12 : 0
    const dimNotes = notes[rec.dimensionId]
    const notesLines = dimNotes ? doc.splitTextToSize(dimNotes, CW - 26) : []
    const notesH = dimNotes ? notesLines.length * 4.2 + 14 : 0
    const cardH = 28 + sustainBannerH + descLines.length * 4.5 + 4 + industryCtxH + keyRiskH + 12 + actionsH + (!isSustain && rec.phases ? 10 + phasesH : 0) + sizeNoteH + notesH + 8

    if (y + cardH > PH - 20) {
      doc.addPage()
      currentPage++
      pageHeader(doc, 'Prioritized Recommendations (cont.)', currentPage)
      pageFooter(doc, company)
      y = 42
    }

    setFill(doc, isSustain ? [240, 253, 248] : C.white)
    doc.roundedRect(ML, y, CW, cardH, 3, 3, 'F')
    setDraw(doc, isSustain ? [167, 243, 208] : C.slate200)
    doc.roundedRect(ML, y, CW, cardH, 3, 3, 'S')

    // Priority accent bar
    setFill(doc, isSustain ? C.green : pc)
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

    // Sustain banner
    let actY = y + 28 + descLines.length * 4.5 + 4
    if (isSustain) {
      setFill(doc, [209, 250, 229])  // green-100
      doc.roundedRect(ML + 8, actY, CW - 16, sustainBannerH, 2, 2, 'F')
      setFill(doc, C.green)
      doc.roundedRect(ML + 8, actY, 3, sustainBannerH, 1.5, 1.5, 'F')
      doc.setFontSize(6)
      doc.setFont('helvetica', 'bold')
      setTextC(doc, [4, 120, 87])   // green-700
      doc.text('LEADING', ML + 14, actY + 5)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'normal')
      setTextC(doc, [6, 95, 70])
      doc.text(sustainBannerLines, ML + 14, actY + 10)
      actY += sustainBannerH + 2
    }

    // Industry Context
    if (rec.industryContext) {
      const ctxBoxH = industryCtxLines.length * 4.2 + 8
      setFill(doc, [239, 246, 255])  // blue-50
      doc.roundedRect(ML + 8, actY, CW - 16, ctxBoxH, 2, 2, 'F')
      setFill(doc, C.primary)
      doc.roundedRect(ML + 8, actY, 3, ctxBoxH, 1.5, 1.5, 'F')
      doc.setFontSize(6)
      doc.setFont('helvetica', 'bold')
      setTextC(doc, C.primaryDk)
      const ctxLabel = 'INDUSTRY CONTEXT'
      doc.text(ctxLabel, ML + 14, actY + 5)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'normal')
      setTextC(doc, C.slate700)
      doc.text(industryCtxLines, ML + 14, actY + 10)
      actY += ctxBoxH + 4
    }

    // Key Risk (amber) or Watch For (green for sustain)
    if (rec.keyRisk) {
      const riskLines = doc.splitTextToSize(rec.keyRisk, CW - 26)
      const riskBoxH = riskLines.length * 4.2 + 8
      setFill(doc, isSustain ? [240, 253, 249] : [255, 247, 237])
      doc.roundedRect(ML + 8, actY, CW - 16, riskBoxH, 2, 2, 'F')
      setFill(doc, isSustain ? C.green : C.amber)
      doc.roundedRect(ML + 8, actY, 3, riskBoxH, 1.5, 1.5, 'F')
      doc.setFontSize(6)
      doc.setFont('helvetica', 'bold')
      setTextC(doc, isSustain ? [4, 120, 87] : C.amber)
      doc.text(isSustain ? 'WATCH FOR' : 'KEY RISK IF NOT ADDRESSED', ML + 14, actY + 5)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'normal')
      setTextC(doc, C.slate700)
      doc.text(riskLines, ML + 14, actY + 10)
      actY += riskBoxH + 4
    }

    // Actions
    actY += 2
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    setTextC(doc, C.slate500)
    doc.text(isSustain ? 'MAINTAIN & LEVERAGE:' : 'RECOMMENDED ACTIONS:', ML + 8, actY)
    actY += 6

    rec.actions.forEach((action) => {
      setFill(doc, isSustain ? C.green : pc)
      doc.circle(ML + 11, actY - 1, 1.5, 'F')
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      setTextC(doc, C.slate700)
      const aLines = doc.splitTextToSize(action, CW - 26)
      doc.text(aLines, ML + 15, actY)
      actY += aLines.length * 4.5 + 2.5
    })

    // Phases timeline (not shown for sustain tier)
    if (!isSustain && rec.phases) {
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
      actY += phasesH
    }

    // Size Note
    if (rec.sizeNote) {
      actY += 4
      const snBoxH = sizeNoteLines.length * 4.2 + 8
      setFill(doc, [240, 253, 244])  // green-50
      doc.roundedRect(ML + 8, actY, CW - 16, snBoxH, 2, 2, 'F')
      setFill(doc, [34, 197, 94])    // green-500
      doc.roundedRect(ML + 8, actY, 3, snBoxH, 1.5, 1.5, 'F')
      doc.setFontSize(6)
      doc.setFont('helvetica', 'bold')
      setTextC(doc, [21, 128, 61])   // green-700
      doc.text('SCALE CONSIDERATION', ML + 14, actY + 5)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'normal')
      setTextC(doc, C.slate700)
      doc.text(sizeNoteLines, ML + 14, actY + 10)
      actY += snBoxH + 4
    }

    // Consultant Notes
    if (dimNotes) {
      actY += 2
      const notesBoxH = notesLines.length * 4.2 + 14
      setFill(doc, [238, 242, 255])  // indigo-50
      doc.roundedRect(ML + 8, actY, CW - 16, notesBoxH, 2, 2, 'F')
      setFill(doc, [99, 102, 241])   // indigo-500
      doc.roundedRect(ML + 8, actY, 3, notesBoxH, 1.5, 1.5, 'F')
      doc.setFontSize(6)
      doc.setFont('helvetica', 'bold')
      setTextC(doc, [67, 56, 202])   // indigo-700
      doc.text('CONSULTANT OBSERVATIONS', ML + 14, actY + 5)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'normal')
      setTextC(doc, [49, 46, 129])   // indigo-900
      doc.text(notesLines, ML + 14, actY + 11)
    }

    y += cardH + 6
  })
}

// ── Main export function ──────────────────────────────────────────────────
export async function exportToPDF(company, answers, radarChartRef, notes = {}) {
  const dimScores    = computeDimensionScores(answers)
  const overallScore = computeOverallScore(dimScores)
  const recs         = generateRecommendations(dimScores, company)

  // Compute worst-3 questions from raw answers
  const allQ = []
  allDimensions.forEach(dim => {
    const dimAnswers = answers[dim.id] || {}
    dim.questions.forEach((q, qi) => {
      const val = dimAnswers[qi]
      if (typeof val !== 'number') return
      allQ.push({ dimId: dim.id, dimName: dim.shortName, text: q.text, score: val })
    })
  })
  const worstQuestions = allQ.sort((a, b) => a.score - b.score).slice(0, 3)

  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
  doc.setFont('helvetica')

  // Page 1: Cover
  drawCover(doc, company, dimScores, overallScore)

  // Page 2: Table of Contents (radar presence affects page numbers)
  const hasRadar = !!(radarChartRef?.current)
  drawTOCPage(doc, company, hasRadar)

  // Page 3: Executive Summary
  drawExecutiveSummaryPage(doc, company, dimScores, overallScore, recs, worstQuestions)

  // Page 4: Dimension Analysis
  drawDimensionsPage(doc, company, dimScores)

  // Page 5: Radar chart — capture first, then add the page so a failure doesn't leave a blank page behind.
  let recsStartPage = 5
  let radarCaptureError = null
  if (radarChartRef?.current) {
    try {
      const canvas = await html2canvas(radarChartRef.current, {
        scale: 2, backgroundColor: '#ffffff', logging: false,
      })
      const imgData = canvas.toDataURL('image/png')
      const imgW = 140
      const imgH = (canvas.height / canvas.width) * imgW
      doc.addPage()
      pageHeader(doc, 'AI Readiness Radar', 5)
      pageFooter(doc, company)
      doc.addImage(imgData, 'PNG', (PW - imgW) / 2, 36, imgW, imgH)
      recsStartPage = 6
    } catch (e) {
      console.warn('PDF export: radar chart capture failed', e)
      radarCaptureError = e
    }
  }

  // Page 5/6+: Recommendations
  drawRecommendationsPage(doc, company, recs, recsStartPage, notes)

  const filename = company.name
    ? `AI_Readiness_${company.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`
    : `AI_Readiness_Assessment_${new Date().toISOString().slice(0, 10)}.pdf`

  doc.save(filename)

  return { radarCaptureError }
}

// ── Button component ──────────────────────────────────────────────────────
export default function PDFExportButton({ company, answers, notes = {}, radarChartRef }) {
  const [loading, setLoading] = useState(false)
  const [warning, setWarning] = useState(null)

  const handleExport = async () => {
    setLoading(true)
    setWarning(null)
    try {
      const result = await exportToPDF(company, answers, radarChartRef, notes)
      if (result?.radarCaptureError) {
        setWarning('PDF saved, but the radar chart could not be captured and was omitted. Try 100% browser zoom or close other tabs, then re-export.')
      }
    } catch (e) {
      console.error('PDF export failed:', e)
      const msg = e?.message?.toLowerCase() || ''
      if (msg.includes('canvas') || msg.includes('memory')) {
        alert('PDF export failed: the radar chart could not be rendered. Try exporting in Chrome at 100% browser zoom, or close other tabs to free memory.')
      } else {
        alert(`PDF export failed: ${e?.message || 'Unknown error'}. Check the browser console (F12) for details.`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 8, alignItems: 'stretch' }}>
      <button
        className="btn-export-pdf btn btn-secondary btn-lg"
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
      {warning && (
        <div
          role="alert"
          style={{
            padding: '8px 12px',
            background: '#FFFBEB',
            border: '1px solid #F59E0B',
            borderRadius: 6,
            fontSize: 12,
            color: '#78350F',
            lineHeight: 1.4,
            maxWidth: 360,
          }}
        >
          ⚠ {warning}
        </div>
      )}
    </div>
  )
}

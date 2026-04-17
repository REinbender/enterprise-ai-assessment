import { useState } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { dimensions } from '../data/questions'
import { generateRecommendations } from '../data/recommendations'
import { computeComposite, ROLE_GROUP_META } from '../data/engagement'

// ── Colour palette ────────────────────────────────────────────────────────
const C = {
  primary:   [46,  163, 242],
  primaryDk: [26,  140, 216],
  slate900:  [51,  51,  51],
  slate700:  [85,  85,  85],
  slate500:  [153, 153, 153],
  slate200:  [226, 226, 226],
  slate50:   [243, 243, 243],
  white:     [255, 255, 255],
  green:     [16,  185, 129],
  amber:     [245, 158,  11],
  red:       [239,  68,  68],
  purple:    [139,  92, 246],
  sky:       [14,  165, 233],
  navy:      [12,  32,  70],
}

const DIM_COLORS = {
  1: [46,  163, 242],
  2: [14,  165, 233],
  3: [139,  92, 246],
  4: [245, 158,  11],
  5: [16,  185, 129],
}

const DIM_SHORT = {
  1: 'AI Strategy',
  2: 'Data & Infrastructure',
  3: 'Governance & Ethics',
  4: 'Talent & Culture',
  5: 'AI Operations',
}

const ROLE_COLORS = {
  executive:    { fg: [99,  102, 241], bg: [238, 242, 255] },
  management:   { fg: [14,  165, 233], bg: [240, 249, 255] },
  practitioner: { fg: [16,  185, 129], bg: [240, 253, 244] },
}

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
function hexToRgb(hex) {
  return [
    parseInt(hex.slice(1,3), 16),
    parseInt(hex.slice(3,5), 16),
    parseInt(hex.slice(5,7), 16),
  ]
}

// ── jsPDF helpers ─────────────────────────────────────────────────────────
const PW = 210, PH = 297, ML = 18, MR = 18, CW = PW - ML - MR

function sf(doc, rgb) { doc.setFillColor(rgb[0], rgb[1], rgb[2]) }
function sd(doc, rgb) { doc.setDrawColor(rgb[0], rgb[1], rgb[2]) }
function st(doc, rgb) { doc.setTextColor(rgb[0], rgb[1], rgb[2]) }

function fbox(doc, x, y, w, h, rgb, r = 3) {
  sf(doc, rgb); doc.roundedRect(x, y, w, h, r, r, 'F')
}

function pbar(doc, x, y, w, h, pct, rgb) {
  sf(doc, C.slate200); doc.roundedRect(x, y, w, h, h/2, h/2, 'F')
  if (pct > 0) {
    sf(doc, rgb); doc.roundedRect(x, y, Math.max(w*(pct/100), h), h, h/2, h/2, 'F')
  }
}

function divider(doc, y, indent = 0) {
  sd(doc, C.slate200); doc.setLineWidth(0.3)
  doc.line(ML + indent, y, PW - MR, y)
}

function sectionEyebrow(doc, text, y) {
  doc.setFontSize(6.5); doc.setFont('helvetica', 'bold')
  st(doc, C.slate500); doc.text(text.toUpperCase(), ML, y)
}

function sectionTitle(doc, text, y) {
  doc.setFontSize(11); doc.setFont('helvetica', 'bold')
  st(doc, C.navy); doc.text(text, ML, y)
}

// Score badge: rounded square with big score number (reliable jsPDF alternative to donut)
function scoreDonut(doc, cx, cy, outerR, innerR, score, mc) {
  const size = outerR * 2
  const x    = cx - outerR
  const y    = cy - outerR
  fbox(doc, x, y, size, size, mc, 6)
  doc.setFontSize(16); doc.setFont('helvetica', 'bold')
  st(doc, C.white); doc.text(`${score}`, cx, cy + 3, { align: 'center' })
  doc.setFontSize(6); doc.setFont('helvetica', 'normal')
  st(doc, [255, 255, 255]); doc.text('/ 100', cx, cy + 9, { align: 'center' })
}

// ── Shared header / footer ─────────────────────────────────────────────────
function pageFooter(doc, company, pageNum) {
  const y = PH - 6
  doc.setFontSize(6.5); doc.setFont('helvetica', 'normal'); st(doc, C.slate500)
  doc.text('CONFIDENTIAL', ML, y)
  const center = company?.name
    ? `Composite Report  ·  ${company.name}  ·  Logic2020  ·  logic2020.com`
    : `Composite AI Readiness Report  ·  Logic2020  ·  logic2020.com`
  doc.text(center, PW/2, y, { align: 'center' })
  doc.text(`Page ${pageNum}`, PW - MR, y, { align: 'right' })
}

function pageHeader(doc, title, pageNum) {
  fbox(doc, 0, 0, PW, 28, C.primary, 0)
  fbox(doc, ML, 8, 14, 8, C.primaryDk, 2)
  doc.setFontSize(6); doc.setFont('helvetica', 'bold'); st(doc, C.white)
  doc.text('AI', ML + 4, 13.5)
  doc.setFontSize(11); doc.setFont('helvetica', 'bold'); st(doc, C.white)
  doc.text(title, ML + 20, 16)
  doc.setFontSize(7); doc.setFont('helvetica', 'normal'); st(doc, [199, 210, 254])
  doc.text('Enterprise AI Readiness Assessment  ·  Logic2020', ML + 20, 22)
  st(doc, [199, 210, 254]); doc.text(`Page ${pageNum}`, PW - ML, 16, { align: 'right' })
}

// ── PAGE 1: Cover ──────────────────────────────────────────────────────────
function drawCover(doc, engagement, composite, pageNum) {
  const { company } = engagement
  const mc    = maturityColor(composite.overallAvg)
  const ml    = maturityLabel(composite.overallAvg)
  const date  = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const rc    = composite.roleCounts

  fbox(doc, 0, 0, PW, 118, C.primary, 0)
  doc.setGState(doc.GState({ opacity: 0.08 }))
  sf(doc, C.white); doc.circle(PW + 20, -15, 90, 'F'); doc.circle(PW - 10, 105, 55, 'F')
  doc.setGState(doc.GState({ opacity: 1 }))

  doc.setFontSize(9); doc.setFont('helvetica', 'bold'); st(doc, C.white)
  doc.text('LOGIC2020', ML, 24)
  doc.setFontSize(6.5); doc.setFont('helvetica', 'normal'); st(doc, [199, 225, 254])
  doc.text('Enterprise Transformation Consulting', ML + 34, 24)
  doc.setFontSize(7); doc.setFont('helvetica', 'bold'); st(doc, [199, 225, 254])
  doc.text('CONFIDENTIAL · COMPOSITE ASSESSMENT REPORT', ML, 44)
  doc.setFontSize(28); doc.setFont('helvetica', 'bold'); st(doc, C.white)
  doc.text('Composite AI', ML, 62); doc.text('Readiness', ML, 80); doc.text('Report', ML, 98)

  const panelY = 108
  fbox(doc, 0, panelY, PW, PH - panelY, C.white, 0)
  sf(doc, C.primary); doc.rect(0, panelY, 5, PH - panelY, 'F')

  let py = panelY + 14
  doc.setFontSize(7); doc.setFont('helvetica', 'bold'); st(doc, C.slate500)
  doc.text('PREPARED FOR', ML + 8, py); py += 6
  doc.setFontSize(17); doc.setFont('helvetica', 'bold'); st(doc, C.navy)
  let nameText = company.name || 'Organization'
  while (doc.getTextWidth(nameText) > CW - 12 && nameText.length > 4) nameText = nameText.slice(0, -1)
  if (nameText !== (company.name || 'Organization')) nameText += '…'
  doc.text(nameText, ML + 8, py); py += 8
  if (company.industry || company.size) {
    const meta = [company.industry, company.size].filter(Boolean).join('  ·  ')
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); st(doc, C.slate700)
    doc.text(meta, ML + 8, py); py += 6
  }
  py += 3; divider(doc, py); py += 10

  // Summary tiles
  const rcParts = []
  if (rc.executive    > 0) rcParts.push(`${rc.executive} Exec`)
  if (rc.management   > 0) rcParts.push(`${rc.management} Mgmt`)
  if (rc.practitioner > 0) rcParts.push(`${rc.practitioner} Practitioner`)

  const tileW = (CW - 16 - 10) / 3, tileH = 30
  const tiles = [
    { label: 'COMPOSITE SCORE', value: `${composite.overallAvg}`, sub: '/ 100', color: mc },
    { label: 'MATURITY LEVEL',  value: ml, sub: 'AI readiness stage', color: mc },
    { label: 'RESPONDENTS',     value: `${composite.sessionCount}`, sub: rcParts.join(' · ') || 'across roles', color: C.primary },
  ]
  tiles.forEach((t, i) => {
    const tx = ML + 8 + i * (tileW + 5)
    sf(doc, [246, 249, 252]); doc.roundedRect(tx, py, tileW, tileH, 3, 3, 'F')
    sd(doc, C.slate200);      doc.roundedRect(tx, py, tileW, tileH, 3, 3, 'S')
    sf(doc, t.color);         doc.roundedRect(tx, py, tileW, 3, 1.5, 1.5, 'F')
    doc.setFontSize(6); doc.setFont('helvetica', 'bold'); st(doc, C.slate500)
    doc.text(t.label, tx + tileW/2, py + 10, { align: 'center' })
    const vfs = (i === 1 && t.value.length > 8) ? 10 : 15
    doc.setFontSize(vfs); doc.setFont('helvetica', 'bold'); st(doc, t.color)
    doc.text(t.value, tx + tileW/2, py + 21, { align: 'center' })
    doc.setFontSize(6); doc.setFont('helvetica', 'normal'); st(doc, C.slate500)
    const subTxt = t.sub.length > 22 ? t.sub.slice(0, 21) + '…' : t.sub
    doc.text(subTxt, tx + tileW/2, py + 27, { align: 'center' })
  })
  py += tileH + 10; divider(doc, py); py += 8

  // Date + report info
  doc.setFontSize(7.5); doc.setFont('helvetica', 'normal'); st(doc, C.slate700)
  doc.text(`Assessment Date: ${date}`, ML + 8, py); py += 5
  const gapCount = composite.perceptionGapDimensions?.length || 0
  const lowVisCount = composite.lowVisibilityDimensions?.length || 0
  if (gapCount > 0 || lowVisCount > 0) {
    doc.setFontSize(7); doc.setFont('helvetica', 'normal'); st(doc, [180, 80, 0])
    const flags = []
    if (gapCount > 0)    flags.push(`${gapCount} perception gap${gapCount > 1 ? 's' : ''} detected`)
    if (lowVisCount > 0) flags.push(`${lowVisCount} low visibility dimension${lowVisCount > 1 ? 's' : ''}`)
    doc.text(`⚠ Key Findings: ${flags.join('  ·  ')}`, ML + 8, py)
  }

  pageFooter(doc, company, pageNum)
}

// ── PAGE 2: Executive Summary (score ring + dim tiles + role breakdown) ────
function drawExecutiveSummaryPage(doc, engagement, composite, pageNum) {
  doc.addPage()
  pageHeader(doc, 'Executive Summary', pageNum)
  pageFooter(doc, engagement.company, pageNum)

  const { company } = engagement
  const mc  = maturityColor(composite.overallAvg)
  const mll = maturityLabel(composite.overallAvg)
  let y = 36

  // ── Overall score donut + headline ──────────────────────────────────────
  const donutCX = ML + 22, donutCY = y + 24
  scoreDonut(doc, donutCX, donutCY, 20, 12, composite.overallAvg, mc)

  // Headline text right of donut
  const tx = ML + 50
  doc.setFontSize(18); doc.setFont('helvetica', 'bold'); st(doc, mc)
  doc.text(`${composite.overallAvg} / 100`, tx, y + 14)
  fbox(doc, tx, y + 17, 32, 7, mc, 3)
  doc.setFontSize(7); doc.setFont('helvetica', 'bold'); st(doc, C.white)
  doc.text(`${mll} Maturity`, tx + 16, y + 22.5, { align: 'center' })
  doc.setFontSize(7.5); doc.setFont('helvetica', 'normal'); st(doc, C.slate700)
  const rcParts = []
  if (composite.roleCounts.executive    > 0) rcParts.push(`${composite.roleCounts.executive} Executive`)
  if (composite.roleCounts.management   > 0) rcParts.push(`${composite.roleCounts.management} Management`)
  if (composite.roleCounts.practitioner > 0) rcParts.push(`${composite.roleCounts.practitioner} Practitioner`)
  doc.text(`${composite.sessionCount} respondents  ·  ${rcParts.join(', ')}`, tx, y + 32)
  doc.setFontSize(7); st(doc, C.slate500)
  doc.text(new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' }), tx, y + 38)

  y += 54; divider(doc, y); y += 8

  // ── Dimension score tiles ────────────────────────────────────────────────
  sectionEyebrow(doc, 'Score by Dimension', y); y += 6
  const tileW = (CW - 16) / 5, tileH = 32
  composite.dimensions.forEach((d, i) => {
    const tx2 = ML + i * (tileW + 4)
    const dc  = DIM_COLORS[d.dimId]
    const dmc = maturityColor(d.avg)
    sf(doc, [246, 249, 252]); doc.roundedRect(tx2, y, tileW, tileH, 3, 3, 'F')
    sf(doc, dc); doc.roundedRect(tx2, y, tileW, 3, 1.5, 1.5, 'F')
    doc.setFontSize(6); doc.setFont('helvetica', 'bold'); st(doc, C.slate500)
    // Short name (2-word max)
    const parts = DIM_SHORT[d.dimId].split(' ')
    const label = parts[0]
    doc.text(label, tx2 + tileW/2, y + 11, { align: 'center' })
    doc.setFontSize(13); doc.setFont('helvetica', 'bold'); st(doc, dc)
    doc.text(`${d.avg}`, tx2 + tileW/2, y + 22, { align: 'center' })
    fbox(doc, tx2 + 2, y + 25, tileW - 4, 5.5, dmc, 2)
    doc.setFontSize(4.5); doc.setFont('helvetica', 'bold'); st(doc, C.white)
    doc.text(maturityLabel(d.avg), tx2 + tileW/2, y + 29, { align: 'center' })
  })
  y += tileH + 10; divider(doc, y); y += 8

  // ── Role group breakdown ─────────────────────────────────────────────────
  sectionEyebrow(doc, 'Score by Role Group', y); y += 6

  const roleKeys = ['executive', 'management', 'practitioner']
  const roleLabels = { executive: 'Executive', management: 'Management', practitioner: 'Practitioner' }
  const cardW = (CW - 8) / 3

  roleKeys.forEach((g, gi) => {
    const count = composite.roleCounts[g]
    if (!count) return
    const rc2   = ROLE_COLORS[g]
    const avg   = Math.round(
      engagement.sessions.filter(s => s.roleGroup === g)
        .reduce((a, s) => a + s.overallScore, 0) / count
    )
    const cx2   = ML + gi * (cardW + 4)
    fbox(doc, cx2, y, cardW, 28, rc2.bg, 4)
    sd(doc, rc2.fg); doc.setLineWidth(0.3); doc.roundedRect(cx2, y, cardW, 28, 4, 4, 'S')
    doc.setFontSize(15); doc.setFont('helvetica', 'bold'); st(doc, rc2.fg)
    doc.text(`${avg}`, cx2 + 14, y + 14)
    doc.setFontSize(6.5); doc.setFont('helvetica', 'normal'); st(doc, rc2.fg)
    doc.text('/ 100', cx2 + 14, y + 20)
    doc.setFontSize(8); doc.setFont('helvetica', 'bold'); st(doc, rc2.fg)
    doc.text(roleLabels[g], cx2 + cardW/2 + 8, y + 12, { align: 'center' })
    doc.setFontSize(6.5); doc.setFont('helvetica', 'normal'); st(doc, rc2.fg)
    doc.text(`n=${count}`, cx2 + cardW/2 + 8, y + 20, { align: 'center' })
    pbar(doc, cx2 + 4, y + 23, cardW - 8, 3, avg, rc2.fg)
  })
  y += 38; divider(doc, y); y += 8

  // ── Key findings summary ─────────────────────────────────────────────────
  sectionEyebrow(doc, 'Key Findings', y); y += 6

  // Highest + lowest dimension
  const sorted = [...composite.dimensions].sort((a, b) => b.avg - a.avg)
  const highest = sorted[0], lowest = sorted[sorted.length - 1]

  const findings = []
  findings.push({ icon: '▲', color: [16, 185, 129], text: `Strongest area: ${DIM_SHORT[highest.dimId]} (${highest.avg}/100 — ${maturityLabel(highest.avg)})` })
  findings.push({ icon: '▼', color: [239, 68, 68],  text: `Greatest gap: ${DIM_SHORT[lowest.dimId]} (${lowest.avg}/100 — ${maturityLabel(lowest.avg)})` })

  const gaps = composite.perceptionGapDimensions || []
  if (gaps.length > 0) {
    findings.push({ icon: '⚠', color: [230, 126, 34], text: `Perception gaps detected in: ${gaps.map(d => DIM_SHORT[d.dimId]).join(', ')}` })
  }
  const lowVis = composite.lowVisibilityDimensions || []
  if (lowVis.length > 0) {
    findings.push({ icon: '👁', color: [14, 165, 233], text: `Low visibility (high DK rate): ${lowVis.map(d => DIM_SHORT[d.dimId]).join(', ')}` })
  }

  findings.forEach(f => {
    doc.setFontSize(8); doc.setFont('helvetica', 'normal'); st(doc, f.color)
    doc.text(f.icon, ML, y + 0.5)
    st(doc, C.slate700)
    const lines = doc.splitTextToSize(f.text, CW - 10)
    doc.text(lines[0], ML + 7, y)
    y += 6
  })
}

// ── PAGE 3: Perception Gaps & Low Visibility ──────────────────────────────
function drawInsightsPage(doc, engagement, composite, pageNum) {
  const gaps   = composite.perceptionGapDimensions  || []
  const lowVis = composite.lowVisibilityDimensions  || []
  if (!gaps.length && !lowVis.length) return false

  doc.addPage()
  pageHeader(doc, 'Organizational Insights', pageNum)
  pageFooter(doc, engagement.company, pageNum)
  let y = 36

  // ── Perception Gap section ───────────────────────────────────────────────
  if (gaps.length > 0) {
    // Amber callout box
    fbox(doc, ML, y, CW, 22, [255, 251, 235], 4)
    sf(doc, [245, 158, 11]); doc.roundedRect(ML, y, CW, 22, 4, 4, 'S')
    doc.setLineWidth(0)
    sf(doc, [245, 158, 11]); doc.roundedRect(ML, y, 4, 22, 4, 0, 'F')

    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); st(doc, [92, 45, 0])
    doc.text('⚠  Perception Gap Detected', ML + 10, y + 9)
    doc.setFontSize(7.5); doc.setFont('helvetica', 'normal'); st(doc, [120, 60, 0])
    const sub = 'These dimensions show a 20+ point gap between Executive and Practitioner ratings — a standalone finding indicating leadership and frontline teams have meaningfully different views of AI maturity.'
    const subLines = doc.splitTextToSize(sub, CW - 14)
    doc.text(subLines.slice(0, 2), ML + 10, y + 15)
    y += 28

    gaps.forEach(d => {
      const dc       = DIM_COLORS[d.dimId]
      const execAvg  = d.byGroup.executive?.avg  ?? null
      const pracAvg  = d.byGroup.practitioner?.avg ?? null

      // Dim header row
      fbox(doc, ML, y, CW, 9, [248, 248, 255], 0)
      sf(doc, dc); doc.rect(ML, y, 4, 9, 'F')
      doc.setFontSize(9); doc.setFont('helvetica', 'bold'); st(doc, dc)
      doc.text(DIM_SHORT[d.dimId], ML + 8, y + 6.5)
      fbox(doc, ML + CW - 32, y + 1.5, 30, 6, [255, 237, 213], 3)
      doc.setFontSize(6.5); doc.setFont('helvetica', 'bold'); st(doc, [154, 52, 18])
      doc.text(`${d.gapMagnitude} pt gap`, ML + CW - 17, y + 6, { align: 'center' })
      y += 12

      // Side-by-side bar comparison
      const barW = CW / 2 - 10
      if (execAvg != null) {
        doc.setFontSize(7); doc.setFont('helvetica', 'bold'); st(doc, ROLE_COLORS.executive.fg)
        doc.text('Executive', ML + 2, y + 5)
        pbar(doc, ML + 28, y, barW, 6, execAvg, ROLE_COLORS.executive.fg)
        doc.setFontSize(8); doc.setFont('helvetica', 'bold')
        doc.text(`${execAvg}`, ML + 28 + barW + 3, y + 5.5)
        y += 10
      }
      if (pracAvg != null) {
        doc.setFontSize(7); doc.setFont('helvetica', 'bold'); st(doc, ROLE_COLORS.practitioner.fg)
        doc.text('Practitioner', ML + 2, y + 5)
        pbar(doc, ML + 28, y, barW, 6, pracAvg, ROLE_COLORS.practitioner.fg)
        doc.setFontSize(8); doc.setFont('helvetica', 'bold')
        doc.text(`${pracAvg}`, ML + 28 + barW + 3, y + 5.5)
        y += 10
      }

      // Insight text
      const insight = d.gapDirection === 'exec_higher'
        ? `Leadership rates this dimension ${d.gapMagnitude} points higher than practitioners. This may indicate an optimism gap — leadership believes AI capabilities are stronger than those doing the work experience them to be.`
        : `Practitioners rate this dimension ${d.gapMagnitude} points higher than leadership. This may indicate undervalued grassroots capabilities or a communication gap around existing strengths.`
      doc.setFontSize(7); doc.setFont('helvetica', 'normal'); st(doc, C.slate700)
      const iLines = doc.splitTextToSize(insight, CW - 4)
      doc.text(iLines.slice(0, 2), ML + 2, y)
      y += iLines.slice(0, 2).length * 4.5 + 10
      divider(doc, y - 4);
    })

    y += 6
  }

  // ── Low Visibility section ───────────────────────────────────────────────
  if (lowVis.length > 0) {
    fbox(doc, ML, y, CW, 20, [240, 249, 255], 4)
    sf(doc, [14, 165, 233]); doc.roundedRect(ML, y, CW, 20, 4, 4, 'S')
    doc.setLineWidth(0)
    sf(doc, [14, 165, 233]); doc.roundedRect(ML, y, 4, 20, 4, 0, 'F')

    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); st(doc, [7, 89, 133])
    doc.text('👁  Low Organizational Visibility', ML + 10, y + 8)
    doc.setFontSize(7.5); doc.setFont('helvetica', 'normal'); st(doc, [7, 89, 133])
    const lvSub = 'These dimensions had a high rate of "Don\'t Know" responses. Low visibility may indicate the org lacks awareness of its own capabilities in these areas — which is itself a maturity finding, independent of the score.'
    const lvLines = doc.splitTextToSize(lvSub, CW - 14)
    doc.text(lvLines.slice(0, 2), ML + 10, y + 14)
    y += 26

    lowVis.forEach(d => {
      const dc = DIM_COLORS[d.dimId]
      fbox(doc, ML, y, CW, 12, [246, 249, 252], 3)
      sf(doc, dc); doc.rect(ML, y, 3, 12, 'F')
      doc.setFontSize(8); doc.setFont('helvetica', 'bold'); st(doc, dc)
      doc.text(DIM_SHORT[d.dimId], ML + 8, y + 8)
      doc.setFontSize(7); doc.setFont('helvetica', 'normal'); st(doc, C.slate500)
      doc.text(`${d.dkRate}% of respondents answered "Don't Know"`, ML + 8, y + 8)
      doc.text(`${d.dkRate}% DK`, ML + CW - 20, y + 8)
      y += 16
    })
  }

  return true
}

// ── PAGE 4: Composite Scorecard table ─────────────────────────────────────
function drawScorecardPage(doc, engagement, composite, pageNum) {
  doc.addPage()
  pageHeader(doc, 'Composite Scorecard', pageNum)
  pageFooter(doc, engagement.company, pageNum)
  let y = 36

  sectionTitle(doc, 'Score Breakdown by Dimension & Role Group', y); y += 6
  doc.setFontSize(7.5); doc.setFont('helvetica', 'normal'); st(doc, C.slate500)
  doc.text(`Aggregated from ${composite.sessionCount} interviews  ·  ⚠ = perception gap ≥ 20 pts`, ML, y)
  y += 10

  const colW = { dim: 54, comp: 20, mat: 26, exec: 20, mgmt: 20, prac: 20, spread: 14 }
  const rowH = 12
  const startX = { dim: ML }
  startX.comp   = startX.dim + colW.dim
  startX.mat    = startX.comp + colW.comp
  startX.exec   = startX.mat + colW.mat
  startX.mgmt   = startX.exec + colW.exec
  startX.prac   = startX.mgmt + colW.mgmt
  startX.spread = startX.prac + colW.prac

  // Header row
  sf(doc, [240, 245, 250]); doc.rect(ML, y, CW, 8, 'F')
  doc.setFontSize(5.5); doc.setFont('helvetica', 'bold'); st(doc, C.slate500)
  doc.text('DIMENSION',    startX.dim + 2,    y + 5.5)
  doc.text('COMPOSITE',    startX.comp + 2,   y + 5.5)
  doc.text('MATURITY',     startX.mat + 2,    y + 5.5)
  doc.text('EXECUTIVE',    startX.exec + 2,   y + 5.5, { maxWidth: colW.exec })
  doc.text('MANAGEMENT',   startX.mgmt + 2,   y + 5.5, { maxWidth: colW.mgmt })
  doc.text('PRACTITIONER', startX.prac + 2,   y + 5.5, { maxWidth: colW.prac })
  doc.text('SPREAD',       startX.spread + 1, y + 5.5)
  y += 8

  composite.dimensions.forEach((d, i) => {
    const ry  = y + i * rowH
    const dc  = DIM_COLORS[d.dimId]
    const dmc = maturityColor(d.avg)
    if (i % 2 === 0) { sf(doc, [248, 251, 254]); doc.rect(ML, ry, CW, rowH, 'F') }
    sd(doc, [235, 240, 245]); doc.setLineWidth(0.2)
    doc.line(ML, ry + rowH, ML + CW, ry + rowH)

    sf(doc, dc); doc.circle(ML + 4, ry + 6, 2, 'F')
    doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); st(doc, C.navy)
    doc.text(DIM_SHORT[d.dimId], ML + 9, ry + 7.5)
    if (d.perceptionGap) {
      doc.setFontSize(5.5); st(doc, [230, 120, 30]); doc.text('⚠ Gap', ML + 9, ry + 11)
    }

    doc.setFontSize(9); doc.setFont('helvetica', 'bold'); st(doc, dc)
    doc.text(`${d.avg}`, startX.comp + 3, ry + 8)

    fbox(doc, startX.mat + 1, ry + 3, 22, 5.5, dmc, 2)
    doc.setFontSize(5); doc.setFont('helvetica', 'bold'); st(doc, C.white)
    doc.text(maturityLabel(d.avg), startX.mat + 12, ry + 6.8, { align: 'center' })

    const roleXs = [startX.exec, startX.mgmt, startX.prac]
    const roleGs = ['executive', 'management', 'practitioner']
    roleGs.forEach((g, gi) => {
      const val = d.byGroup[g]?.avg
      const rc2 = ROLE_COLORS[g]
      doc.setFontSize(8); doc.setFont('helvetica', val != null ? 'bold' : 'normal')
      st(doc, val != null ? rc2.fg : C.slate500)
      doc.text(val != null ? `${val}` : '—', roleXs[gi] + 3, ry + 8)
    })

    doc.setFontSize(6.5); doc.setFont('helvetica', 'normal'); st(doc, C.slate500)
    doc.text(`±${d.stdDev}`, startX.spread + 1, ry + 8)
  })

  y += composite.dimensions.length * rowH + 16

  // Colour legend
  divider(doc, y); y += 6
  doc.setFontSize(6.5); doc.setFont('helvetica', 'bold'); st(doc, C.slate500)
  doc.text('Role Group Colours:', ML, y); y += 5
  const roleInfo = [
    { label: 'Executive',    fg: ROLE_COLORS.executive.fg,    bg: ROLE_COLORS.executive.bg    },
    { label: 'Management',   fg: ROLE_COLORS.management.fg,   bg: ROLE_COLORS.management.bg   },
    { label: 'Practitioner', fg: ROLE_COLORS.practitioner.fg, bg: ROLE_COLORS.practitioner.bg },
  ]
  let lx = ML
  roleInfo.forEach(ri => {
    fbox(doc, lx, y, 38, 7, ri.bg, 3)
    doc.setFontSize(6); doc.setFont('helvetica', 'bold'); st(doc, ri.fg)
    doc.text(ri.label, lx + 19, y + 5, { align: 'center' })
    lx += 44
  })
}

// ── PAGE 5: Dimension Score Cards (visual grid) ───────────────────────────
function drawDimensionCardsPage(doc, engagement, composite, pageNum) {
  doc.addPage()
  pageHeader(doc, 'Dimension Score Cards', pageNum)
  pageFooter(doc, engagement.company, pageNum)
  let y = 36

  sectionEyebrow(doc, 'Five AI Readiness Dimensions — Visual Score Breakdown', y); y += 8

  const cardW = (CW - 8) / 2, cardH = 52
  composite.dimensions.forEach((d, i) => {
    const col = i % 2, row = Math.floor(i / 2)
    const cx2 = ML + col * (cardW + 8)
    const cy2 = y + row * (cardH + 8)
    const dc  = DIM_COLORS[d.dimId]
    const dmc = maturityColor(d.avg)

    sf(doc, [246, 249, 252]); doc.roundedRect(cx2, cy2, cardW, cardH, 4, 4, 'F')
    sd(doc, [226, 232, 240]); doc.setLineWidth(0.3); doc.roundedRect(cx2, cy2, cardW, cardH, 4, 4, 'S')
    sf(doc, dc); doc.roundedRect(cx2, cy2, cardW, 3, 2, 2, 'F')

    // Title + score
    doc.setFontSize(8); doc.setFont('helvetica', 'bold'); st(doc, C.navy)
    doc.text(DIM_SHORT[d.dimId], cx2 + 8, cy2 + 12)

    doc.setFontSize(16); doc.setFont('helvetica', 'bold'); st(doc, dc)
    doc.text(`${d.avg}`, cx2 + cardW - 10, cy2 + 14, { align: 'right' })
    doc.setFontSize(7); doc.setFont('helvetica', 'normal'); st(doc, C.slate500)
    doc.text('/100', cx2 + cardW - 10, cy2 + 19, { align: 'right' })

    // Maturity pill
    fbox(doc, cx2 + 8, cy2 + 15, 26, 6, dmc, 3)
    doc.setFontSize(5.5); doc.setFont('helvetica', 'bold'); st(doc, C.white)
    doc.text(maturityLabel(d.avg), cx2 + 21, cy2 + 19.5, { align: 'center' })

    // Composite progress bar
    pbar(doc, cx2 + 8, cy2 + 24, cardW - 16, 5, d.avg, dc)

    // Role bars
    let ry2 = cy2 + 33
    const roleGs = ['executive', 'management', 'practitioner']
    const roleLbls = ['Exec', 'Mgmt', 'Prac']
    roleGs.forEach((g, gi) => {
      const val = d.byGroup[g]?.avg
      if (!val) return
      const rc2 = ROLE_COLORS[g]
      doc.setFontSize(5.5); doc.setFont('helvetica', 'bold'); st(doc, rc2.fg)
      doc.text(roleLbls[gi], cx2 + 8, ry2 + 4)
      pbar(doc, cx2 + 18, ry2, cardW - 36, 4, val, rc2.fg)
      doc.setFontSize(6); doc.setFont('helvetica', 'bold')
      doc.text(`${val}`, cx2 + cardW - 10, ry2 + 3.5, { align: 'right' })
      ry2 += 6
    })

    // Gap badge
    if (d.perceptionGap) {
      fbox(doc, cx2 + 8, cy2 + cardH - 10, 35, 6, [255, 237, 213], 3)
      doc.setFontSize(5.5); doc.setFont('helvetica', 'bold'); st(doc, [154, 52, 18])
      doc.text(`⚠ ${d.gapMagnitude}pt perception gap`, cx2 + 25, cy2 + cardH - 6, { align: 'center' })
    }
  })

  // 5th card (last one, if odd count) sits in its own row — already handled
  // For the 5th dim (index 4), row=2, col=0 → positioned correctly
}

// ── PAGE 6: Radar Chart (html2canvas) ────────────────────────────────────
async function drawRadarPage(doc, engagement, composite, radarRef, pageNum) {
  if (!radarRef?.current) return false
  try {
    doc.addPage()
    pageHeader(doc, 'Composite Readiness Profile', pageNum)
    pageFooter(doc, engagement.company, pageNum)

    const canvas = await html2canvas(radarRef.current, {
      scale: 2, backgroundColor: '#ffffff', logging: false,
    })
    const imgData = canvas.toDataURL('image/png')
    const imgW = 150
    const imgH = (canvas.height / canvas.width) * imgW

    doc.setFontSize(9); doc.setFont('helvetica', 'bold'); st(doc, C.navy)
    doc.text('Composite Readiness Profile', ML, 36)
    doc.setFontSize(7.5); doc.setFont('helvetica', 'normal'); st(doc, C.slate500)
    doc.text('Aggregate score across all 5 dimensions (0–100 scale)', ML, 42)

    doc.addImage(imgData, 'PNG', (PW - imgW) / 2, 48, imgW, imgH)

    // Dimension legend below chart
    let ly = 48 + imgH + 8
    doc.setFontSize(6.5); doc.setFont('helvetica', 'bold'); st(doc, C.slate500)
    doc.text('DIMENSION REFERENCE', ML, ly); ly += 5
    composite.dimensions.forEach((d, i) => {
      const dc = DIM_COLORS[d.dimId]
      sf(doc, dc); doc.circle(ML + 4, ly - 1, 2, 'F')
      doc.setFontSize(7); doc.setFont('helvetica', 'normal'); st(doc, C.navy)
      doc.text(`${DIM_SHORT[d.dimId]}:  ${d.avg}/100  —  ${maturityLabel(d.avg)}`, ML + 9, ly)
      ly += 6
    })
    return true
  } catch (_) {
    return false
  }
}

// ── PAGES 7-11: Per-dimension detail with question heatmap ────────────────
function drawDimensionDetailPage(doc, engagement, composite, dim, questions, pageNum) {
  doc.addPage()
  const dc = DIM_COLORS[dim.dimId]
  pageHeader(doc, `Dimension: ${DIM_SHORT[dim.dimId]}`, pageNum)
  pageFooter(doc, engagement.company, pageNum)

  let y = 36

  // Score header card
  fbox(doc, ML, y, CW, 30, [246, 249, 252], 4)
  sd(doc, dc); doc.setLineWidth(0.3); doc.roundedRect(ML, y, CW, 30, 4, 4, 'S')
  sf(doc, dc); doc.roundedRect(ML, y, 4, 30, 4, 0, 'F')

  const mc  = maturityColor(dim.avg)
  doc.setFontSize(22); doc.setFont('helvetica', 'bold'); st(doc, dc)
  doc.text(`${dim.avg}`, ML + 18, y + 17)
  doc.setFontSize(8); doc.setFont('helvetica', 'normal'); st(doc, C.slate700)
  doc.text('/ 100', ML + 18, y + 23)
  fbox(doc, ML + 46, y + 8, 30, 7, mc, 3)
  doc.setFontSize(6.5); doc.setFont('helvetica', 'bold'); st(doc, C.white)
  doc.text(maturityLabel(dim.avg), ML + 61, y + 13.5, { align: 'center' })
  pbar(doc, ML + 84, y + 10, CW - 98, 6, dim.avg, dc)
  doc.setFontSize(6.5); doc.setFont('helvetica', 'normal'); st(doc, C.slate500)
  doc.text(`Std Dev: ±${dim.stdDev}  ·  Range: ${dim.min}–${dim.max}`, ML + 18, y + 28)
  y += 38

  // Role group bars
  sectionEyebrow(doc, 'Score by Role Group', y); y += 6
  const roleGs = [
    { key: 'executive',    label: 'Executive',    rc: ROLE_COLORS.executive    },
    { key: 'management',   label: 'Management',   rc: ROLE_COLORS.management   },
    { key: 'practitioner', label: 'Practitioner', rc: ROLE_COLORS.practitioner },
  ]
  roleGs.forEach(rg => {
    const data = dim.byGroup[rg.key]
    if (!data) return
    doc.setFontSize(7); doc.setFont('helvetica', 'bold'); st(doc, rg.rc.fg)
    doc.text(rg.label, ML, y + 5)
    pbar(doc, ML + 30, y, CW - 56, 7, data.avg, rg.rc.fg)
    doc.setFontSize(8.5); doc.setFont('helvetica', 'bold')
    doc.text(`${data.avg}`, ML + CW - 22, y + 6)
    doc.setFontSize(6.5); doc.setFont('helvetica', 'normal'); st(doc, C.slate500)
    doc.text(`n=${data.count}`, ML + CW - 10, y + 6)
    y += 11
  })

  if (dim.perceptionGap) {
    fbox(doc, ML, y, CW, 10, [255, 251, 235], 3)
    doc.setFontSize(7); doc.setFont('helvetica', 'bold'); st(doc, [120, 60, 0])
    doc.text(`⚠ ${dim.gapMagnitude}pt perception gap detected between Executive and Practitioner`, ML + 5, y + 7)
    y += 14
  }

  y += 4; divider(doc, y); y += 6

  // Question heatmap
  if (questions?.length && dim.qAvgs) {
    sectionEyebrow(doc, 'Question-Level Averages (1–5 scale) · Red = gap · Yellow = developing · Green = strength', y); y += 7

    questions.forEach((q, qi) => {
      if (y > PH - 18) return
      const qData  = dim.qAvgs[qi]
      const avg    = typeof qData === 'object' ? qData.avg    : qData
      const dkRate = typeof qData === 'object' ? qData.dkRate : 0

      let qc
      if (avg === null)   qc = C.slate500
      else if (avg >= 4)  qc = [16,  185, 129]
      else if (avg >= 3)  qc = [180, 130, 10]
      else                qc = [220,  50, 50]

      // Q chip
      fbox(doc, ML, y, 9, 7, qc, 2)
      doc.setFontSize(5.5); doc.setFont('helvetica', 'bold'); st(doc, C.white)
      doc.text(`Q${qi + 1}`, ML + 4.5, y + 5, { align: 'center' })

      // Question text
      doc.setFontSize(7); doc.setFont('helvetica', 'normal'); st(doc, C.slate700)
      const qLines = doc.splitTextToSize(q.text, CW - 34)
      doc.text(qLines[0] + (qLines.length > 1 ? '…' : ''), ML + 12, y + 5.5)

      // DK badge
      if (dkRate >= 30) {
        doc.setFontSize(5.5); st(doc, C.slate500)
        doc.text(`${dkRate}% DK`, ML + CW - 38, y + 5.5)
      }

      // Score chip
      fbox(doc, ML + CW - 18, y, 16, 7, qc, 2)
      doc.setFontSize(6.5); doc.setFont('helvetica', 'bold'); st(doc, C.white)
      doc.text(avg !== null ? avg.toFixed(1) : '—', ML + CW - 10, y + 5.3, { align: 'center' })

      y += 9
    })
  }
}

// ── PAGES: Recommendations (with 30/60/90) ────────────────────────────────
function drawRecommendationsPages(doc, engagement, composite, pageNum) {
  doc.addPage()
  pageHeader(doc, 'Composite Action Plan', pageNum)
  pageFooter(doc, engagement.company, pageNum)

  const { company } = engagement
  const recommendations = generateRecommendations(composite.asDimScores, company)
  let y = 36

  sectionTitle(doc, 'Prioritized Recommendations', y); y += 6
  doc.setFontSize(7.5); doc.setFont('helvetica', 'normal'); st(doc, C.slate500)
  doc.text(`Based on aggregate scores across ${composite.sessionCount} respondents  ·  Ordered by readiness gap`, ML, y)
  y += 10

  const priorityColors = {
    Critical: [231, 76, 60], High: [230, 126, 34], Medium: [241, 196, 15], Sustain: [16, 185, 129],
  }

  recommendations.forEach((rec, idx) => {
    const dc       = DIM_COLORS[rec.dimensionId]
    const pc       = priorityColors[rec.priority] || C.slate500
    const isSustain = rec.priority === 'Sustain'
    const PHASE_COL_W = (CW - 16 - 8) / 3

    // Calculate card height
    const titleLines  = doc.splitTextToSize(rec.title || '', CW - 40)
    const descLines   = doc.splitTextToSize(rec.description || '', CW - 12).slice(0, 3)
    const actionLines = (rec.actions || []).slice(0, 4).map(a => doc.splitTextToSize(a, CW - 22)[0])
    let phasesH = 0
    if (!isSustain && rec.phases?.length) {
      const maxPL = Math.max(...rec.phases.map(ph =>
        ph.actions.reduce((a, pa) => a + doc.splitTextToSize(pa, PHASE_COL_W - 12).length, 0)
      ))
      phasesH = 10 + 20 + maxPL * 4.5 + 8
    }
    const cardH = 18 + titleLines.length * 5 + descLines.length * 4.5 + actionLines.length * 5 + phasesH + 10

    if (y + cardH > PH - 16) {
      pageNum++
      doc.addPage()
      pageHeader(doc, 'Composite Action Plan (cont.)', pageNum)
      pageFooter(doc, engagement.company, pageNum)
      y = 36
    }

    fbox(doc, ML, y, CW, cardH, [248, 251, 254], 3)
    sd(doc, C.slate200); doc.setLineWidth(0.3); doc.roundedRect(ML, y, CW, cardH, 3, 3, 'S')
    sf(doc, dc); doc.roundedRect(ML, y, 4, cardH, 3, 0, 'F')

    let cy = y + 7

    // Dim label + priority badge
    doc.setFontSize(7); doc.setFont('helvetica', 'bold'); st(doc, dc)
    doc.text(`${DIM_SHORT[rec.dimensionId]}  ·  Score: ${rec.score}/100`, ML + 8, cy)
    fbox(doc, ML + CW - 30, cy - 5.5, 28, 7, pc, 3)
    doc.setFontSize(6); doc.setFont('helvetica', 'bold'); st(doc, C.white)
    doc.text(`${idx === 0 ? '↑↑ ' : ''}${rec.priority}`, ML + CW - 16, cy - 0.8, { align: 'center' })
    cy += 6

    // Title
    doc.setFontSize(9); doc.setFont('helvetica', 'bold'); st(doc, C.navy)
    doc.text(titleLines, ML + 8, cy); cy += titleLines.length * 5 + 3

    // Description
    doc.setFontSize(7.5); doc.setFont('helvetica', 'normal'); st(doc, C.slate700)
    doc.text(descLines, ML + 8, cy); cy += descLines.length * 4.5 + 3

    // Key actions
    if (rec.actions?.length) {
      doc.setFontSize(7); doc.setFont('helvetica', 'bold'); st(doc, C.navy)
      doc.text('Key Actions:', ML + 8, cy); cy += 5
      rec.actions.slice(0, 4).forEach(action => {
        sf(doc, dc); doc.circle(ML + 11, cy - 1.5, 1.5, 'F')
        doc.setFontSize(7); doc.setFont('helvetica', 'normal'); st(doc, C.slate700)
        const aLine = doc.splitTextToSize(action, CW - 22)[0]
        doc.text(aLine, ML + 15, cy); cy += 5
      })
    }

    // 30/60/90 phases
    if (!isSustain && rec.phases?.length) {
      cy += 3
      sd(doc, C.slate200); doc.setLineWidth(0.3); doc.line(ML + 8, cy, ML + CW - 8, cy); cy += 5
      doc.setFontSize(7); doc.setFont('helvetica', 'bold'); st(doc, C.slate500)
      doc.text('30 / 60 / 90-DAY ACTION PLAN:', ML + 8, cy); cy += 5

      const maxLines = Math.max(...rec.phases.map(ph =>
        ph.actions.reduce((a, pa) => a + doc.splitTextToSize(pa, PHASE_COL_W - 12).length, 0)
      ))
      const phH = 20 + maxLines * 4.5 + 8

      rec.phases.forEach((phase, pi) => {
        const px = ML + 8 + pi * (PHASE_COL_W + 4)
        sf(doc, C.slate50); doc.roundedRect(px, cy, PHASE_COL_W, phH - 10, 2, 2, 'F')
        sf(doc, dc); doc.roundedRect(px, cy, 3, phH - 10, 1.5, 1.5, 'F')
        doc.setFontSize(6.5); doc.setFont('helvetica', 'bold'); st(doc, dc)
        doc.text(phase.label, px + 6, cy + 6)
        doc.setFontSize(7); doc.setFont('helvetica', 'bold'); st(doc, C.slate900)
        doc.text(phase.theme, px + 6, cy + 12)
        let phActY = cy + 17
        phase.actions.forEach(a => {
          sf(doc, dc); doc.circle(px + 8, phActY - 1, 1, 'F')
          doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); st(doc, C.slate700)
          const aLines = doc.splitTextToSize(a, PHASE_COL_W - 12)
          doc.text(aLines, px + 11, phActY); phActY += aLines.length * 4 + 2
        })
      })
      cy += phH
    }

    y += cardH + 6
  })

  return pageNum
}

// ── PAGE: Respondent Summary ──────────────────────────────────────────────
function drawRespondentPage(doc, engagement, composite, pageNum) {
  doc.addPage()
  pageHeader(doc, 'Respondent Summary', pageNum)
  pageFooter(doc, engagement.company, pageNum)

  const { sessions } = engagement
  let y = 36

  sectionTitle(doc, 'All Respondents', y); y += 6
  doc.setFontSize(7.5); doc.setFont('helvetica', 'normal'); st(doc, C.slate500)
  doc.text('Individual scores by respondent and dimension', ML, y); y += 9

  const colX = { name: ML, role: ML + 38, grp: ML + 76, overall: ML + 96, d1: ML + 112, d2: ML + 127, d3: ML + 142, d4: ML + 157, d5: ML + 172 }

  sf(doc, [240, 245, 250]); doc.rect(ML, y, CW, 7, 'F')
  doc.setFontSize(5.5); doc.setFont('helvetica', 'bold'); st(doc, C.slate500)
  doc.text('NAME',    colX.name + 1, y + 5)
  doc.text('TITLE',   colX.role + 1, y + 5)
  doc.text('GRP',     colX.grp + 1,  y + 5)
  doc.text('OVERALL', colX.overall + 1, y + 5)
  doc.text('STRAT',   colX.d1 + 1, y + 5)
  doc.text('DATA',    colX.d2 + 1, y + 5)
  doc.text('GOV',     colX.d3 + 1, y + 5)
  doc.text('TALENT',  colX.d4 + 1, y + 5)
  doc.text('OPS',     colX.d5 + 1, y + 5)
  y += 7

  const rowH = 9
  sessions.forEach((s, i) => {
    if (y > PH - 16) return
    if (!s) return

    const roleGroup = s.roleGroup || 'practitioner'
    const m   = ROLE_GROUP_META[roleGroup] || ROLE_GROUP_META.practitioner
    const rc2 = ROLE_COLORS[roleGroup]     || ROLE_COLORS.practitioner
    const mc2 = maturityColor(s.overallScore || 0)

    if (i % 2 === 0) { sf(doc, [248, 251, 254]); doc.rect(ML, y, CW, rowH, 'F') }
    sd(doc, [235, 240, 245]); doc.setLineWidth(0.2); doc.line(ML, y + rowH, ML + CW, y + rowH)

    doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); st(doc, C.navy)
    const name    = s.respondentName || ''
    const nameTxt = name.length > 13 ? name.slice(0, 12) + '…' : name
    doc.text(nameTxt, colX.name + 1, y + 6.5)

    doc.setFontSize(6.5); doc.setFont('helvetica', 'normal'); st(doc, C.slate700)
    const role    = s.respondentRole || ''
    const roleTxt = role.length > 15 ? role.slice(0, 14) + '…' : role
    doc.text(roleTxt, colX.role + 1, y + 6.5)

    fbox(doc, colX.grp + 1, y + 2, 16, 5, rc2.bg, 2)
    doc.setFontSize(5); doc.setFont('helvetica', 'bold'); st(doc, rc2.fg)
    doc.text((m.label || '').slice(0, 4), colX.grp + 9, y + 6, { align: 'center' })

    doc.setFontSize(8); doc.setFont('helvetica', 'bold'); st(doc, mc2)
    doc.text(`${s.overallScore || 0}`, colX.overall + 4, y + 6.5)

    const dimScores = s.dimScores || {}
    ;[[1, colX.d1],[2, colX.d2],[3, colX.d3],[4, colX.d4],[5, colX.d5]].forEach(([id, cx3]) => {
      const score = dimScores[id]
      doc.setFontSize(7); doc.setFont('helvetica', score != null ? 'bold' : 'normal')
      st(doc, score != null ? maturityColor(score) : C.slate500)
      doc.text(score != null ? `${score}` : '—', cx3 + 4, y + 6.5)
    })

    y += rowH
  })
}

// ── PAGE: Confidence Distribution ────────────────────────────────────────
function drawConfidencePage(doc, engagement, composite, pageNum) {
  const hasSomeConf = composite.dimensions.some(d =>
    (d.confidenceCounts?.high || 0) + (d.confidenceCounts?.medium || 0) + (d.confidenceCounts?.low || 0) > 0
  )
  if (!hasSomeConf) return false

  doc.addPage()
  pageHeader(doc, 'Consultant Confidence Distribution', pageNum)
  pageFooter(doc, engagement.company, pageNum)
  let y = 36

  sectionTitle(doc, 'Consultant Confidence Distribution', y); y += 6
  doc.setFontSize(7.5); doc.setFont('helvetica', 'normal'); st(doc, C.slate500)
  doc.text('How confident consultants were in each dimension\'s scores across all sessions.', ML, y); y += 5
  doc.text('Low confidence flags dimensions that benefit from transcript validation.', ML, y); y += 12

  const CONF_COLORS = {
    high:   [5,   150, 105],
    medium: [217, 119,  6],
    low:    [231,  76, 60],
    null:   [148, 163, 184],
  }

  composite.dimensions.forEach(d => {
    const total  = composite.sessionCount
    const counts = d.confidenceCounts || {}
    const dc     = DIM_COLORS[d.dimId]

    doc.setFontSize(8); doc.setFont('helvetica', 'bold'); st(doc, C.navy)
    doc.text(DIM_SHORT[d.dimId], ML, y + 5)

    // Stacked bar
    const barX = ML + 52, barW = CW - 80, barH = 8
    sf(doc, C.slate200); doc.roundedRect(barX, y, barW, barH, 4, 4, 'F')
    let bx = barX
    ;['high', 'medium', 'low', 'null'].forEach(level => {
      const n = counts[level] || 0
      if (!n) return
      const segW = (n / total) * barW
      sf(doc, CONF_COLORS[level]); doc.rect(bx, y, segW, barH, 'F')
      bx += segW
    })

    // Chips
    let chipX = barX + barW + 4
    ;['high', 'medium', 'low'].forEach(level => {
      const n = counts[level] || 0
      if (!n) return
      const label = level.charAt(0).toUpperCase() + level.slice(1)
      const chipW = doc.getTextWidth(`${label}: ${n}`) + 8
      fbox(doc, chipX, y + 1, chipW, 6, CONF_COLORS[level], 2)
      doc.setFontSize(5.5); doc.setFont('helvetica', 'bold'); st(doc, C.white)
      doc.text(`${label}: ${n}`, chipX + chipW/2, y + 5.3, { align: 'center' })
      chipX += chipW + 3
    })

    y += 16
  })

  return true
}

// ── PAGE: Consultant Observations (notes) ────────────────────────────────
function drawNotesPage(doc, engagement, composite, pageNum) {
  const sessionsWithNotes = engagement.sessions.filter(s =>
    s.notes && Object.values(s.notes).some(n => n?.trim())
  )
  if (!sessionsWithNotes.length) return false

  doc.addPage()
  pageHeader(doc, 'Consultant Observations', pageNum)
  pageFooter(doc, engagement.company, pageNum)
  let y = 36

  sectionTitle(doc, 'Consultant Observations', y); y += 6
  doc.setFontSize(7.5); doc.setFont('helvetica', 'normal'); st(doc, C.slate500)
  doc.text('Notes captured during each interview, organized by respondent.', ML, y); y += 5
  doc.text('These support transcript validation and qualitative interpretation of scores.', ML, y); y += 12

  sessionsWithNotes.forEach(s => {
    if (y > PH - 20) return
    const roleGroup = s.roleGroup || 'practitioner'
    const rc2       = ROLE_COLORS[roleGroup] || ROLE_COLORS.practitioner
    const dimNotes  = Object.entries(s.notes || {}).filter(([, n]) => n?.trim())

    // Respondent header
    sf(doc, [248, 250, 252]); doc.roundedRect(ML, y, CW, 9, 3, 3, 'F')
    sd(doc, C.slate200); doc.setLineWidth(0.2); doc.roundedRect(ML, y, CW, 9, 3, 3, 'S')
    doc.setFontSize(8); doc.setFont('helvetica', 'bold'); st(doc, C.navy)
    const sName = s.respondentName || ''
    doc.text(sName, ML + 4, y + 6.5)
    doc.setFontSize(7); doc.setFont('helvetica', 'normal'); st(doc, C.slate500)
    doc.text(s.respondentRole || '', ML + 4 + doc.getTextWidth(sName) + 6, y + 6.5)
    fbox(doc, ML + CW - 28, y + 1.5, 26, 6, rc2.bg, 3)
    doc.setFontSize(5.5); doc.setFont('helvetica', 'bold'); st(doc, rc2.fg)
    doc.text(ROLE_GROUP_META[s.roleGroup]?.label || '', ML + CW - 15, y + 6, { align: 'center' })
    y += 12

    dimNotes.forEach(([dimId, note]) => {
      if (y > PH - 14) return
      const dim = dimensions.find(d => d.id === parseInt(dimId))
      const dc  = DIM_COLORS[parseInt(dimId)] || C.slate500

      doc.setFontSize(7); doc.setFont('helvetica', 'bold'); st(doc, dc)
      doc.text(dim?.shortName || `Dim ${dimId}`, ML + 4, y + 5)

      doc.setFontSize(7); doc.setFont('helvetica', 'normal'); st(doc, C.slate700)
      const noteLines = doc.splitTextToSize(note, CW - 44)
      doc.text(noteLines.slice(0, 3), ML + 36, y + 5)
      y += Math.min(noteLines.length, 3) * 4.5 + 4

      sd(doc, [241, 245, 249]); doc.setLineWidth(0.2); doc.line(ML + 4, y, ML + CW - 4, y); y += 3
    })
    y += 6
  })

  return true
}

// ── Main export orchestrator ───────────────────────────────────────────────
async function generateCompositePDF(engagement, radarRef) {
  const composite = computeComposite(engagement.sessions)
  if (!composite) throw new Error('No sessions to aggregate')

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  doc.setFont('helvetica')
  let p = 1

  // 1. Cover
  drawCover(doc, engagement, composite, p)

  // 2. Executive Summary
  p++; drawExecutiveSummaryPage(doc, engagement, composite, p)

  // 3. Perception Gaps & Low Visibility (conditional)
  const hasInsights = (composite.perceptionGapDimensions?.length || 0) + (composite.lowVisibilityDimensions?.length || 0) > 0
  if (hasInsights) { p++; drawInsightsPage(doc, engagement, composite, p) }

  // 4. Composite Scorecard
  p++; drawScorecardPage(doc, engagement, composite, p)

  // 5. Dimension Score Cards
  p++; drawDimensionCardsPage(doc, engagement, composite, p)

  // 6. Radar Chart
  const radarDone = await drawRadarPage(doc, engagement, composite, radarRef, p + 1)
  if (radarDone) p++

  // 7-11. Per-dimension detail
  composite.dimensions.forEach(dim => {
    p++
    const dimDef   = dimensions.find(d => d.id === dim.dimId)
    const questions = dimDef?.questions || []
    drawDimensionDetailPage(doc, engagement, composite, dim, questions, p)
  })

  // 12+. Recommendations with 30/60/90
  p++; p = drawRecommendationsPages(doc, engagement, composite, p)

  // Respondent Summary
  p++; drawRespondentPage(doc, engagement, composite, p)

  // Confidence Distribution (conditional)
  p++; const confDone = drawConfidencePage(doc, engagement, composite, p)
  if (!confDone) p--

  // Consultant Observations (conditional)
  p++; const notesDone = drawNotesPage(doc, engagement, composite, p)
  if (!notesDone) p--

  const company = engagement.company?.name || 'Assessment'
  const date    = new Date().toISOString().slice(0, 10)
  doc.save(`${company.replace(/\s+/g, '-')}-AI-Readiness-Composite-${date}.pdf`)
}

// ── Button component ──────────────────────────────────────────────────────
export default function CompositePDFExportButton({ engagement, radarRef }) {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    setLoading(true)
    try {
      await generateCompositePDF(engagement, radarRef)
    } catch (e) {
      console.error('Composite PDF export failed:', e)
      alert(`PDF export failed: ${e?.message || String(e)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      className="btn btn-primary btn-lg"
      onClick={handleExport}
      disabled={loading}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
    >
      {loading ? (
        <>
          <span style={{
            display: 'inline-block', width: 14, height: 14,
            border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white',
            borderRadius: '50%', animation: 'spin 0.7s linear infinite',
          }} />
          Generating PDF…
        </>
      ) : (
        <>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          Export Composite PDF
        </>
      )}
    </button>
  )
}

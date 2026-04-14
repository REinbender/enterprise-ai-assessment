import { useState } from 'react'
import jsPDF from 'jspdf'
import { getMaturityLevel, dimensions } from '../data/questions'
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

const DIM_ICONS_TEXT = { 1: 'Strategy', 2: 'Data', 3: 'Governance', 4: 'Talent', 5: 'Operations' }
const DIM_SHORT = { 1: 'AI Strategy', 2: 'Data & Infrastructure', 3: 'Governance & Ethics', 4: 'Talent & Culture', 5: 'AI Operations' }

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

// ── jsPDF helpers ─────────────────────────────────────────────────────────
const PW = 210, PH = 297, ML = 18, MR = 18, CW = PW - ML - MR

function sf(doc, rgb)  { doc.setFillColor(rgb[0], rgb[1], rgb[2]) }
function sd(doc, rgb)  { doc.setDrawColor(rgb[0], rgb[1], rgb[2]) }
function st(doc, rgb)  { doc.setTextColor(rgb[0], rgb[1], rgb[2]) }

function fbox(doc, x, y, w, h, rgb, r = 3) {
  sf(doc, rgb)
  doc.roundedRect(x, y, w, h, r, r, 'F')
}

function pbar(doc, x, y, w, h, pct, rgb) {
  sf(doc, C.slate200)
  doc.roundedRect(x, y, w, h, h / 2, h / 2, 'F')
  if (pct > 0) {
    sf(doc, rgb)
    doc.roundedRect(x, y, Math.max(w * (pct / 100), h), h, h / 2, h / 2, 'F')
  }
}

function wrap(doc, text, maxW, fontSize = 9) {
  doc.setFontSize(fontSize)
  return doc.splitTextToSize(String(text || ''), maxW)
}

function pageFooter(doc, company, pageNum) {
  const y = PH - 6
  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'normal')
  st(doc, C.slate500)
  doc.text('CONFIDENTIAL', ML, y)
  const center = company?.name
    ? `Composite Report · ${company.name}  ·  Logic2020  ·  logic2020.com`
    : `Composite AI Readiness Report  ·  Logic2020  ·  logic2020.com`
  doc.text(center, PW / 2, y, { align: 'center' })
  doc.text(`Page ${pageNum}`, PW - MR, y, { align: 'right' })
}

function pageHeader(doc, title, pageNum) {
  fbox(doc, 0, 0, PW, 28, C.primary, 0)
  fbox(doc, ML, 8, 14, 8, C.primaryDk, 2)
  doc.setFontSize(6)
  doc.setFont('helvetica', 'bold')
  st(doc, C.white)
  doc.text('AI', ML + 4, 13.5)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  st(doc, C.white)
  doc.text(title, ML + 20, 16)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  st(doc, [199, 210, 254])
  doc.text('Enterprise AI Readiness Assessment  ·  Logic2020', ML + 20, 22)
  st(doc, [199, 210, 254])
  doc.text(`Page ${pageNum}`, PW - ML, 16, { align: 'right' })
}

// ── PAGE 1: Cover ─────────────────────────────────────────────────────────
function drawCover(doc, engagement, composite, pageNum) {
  const { company, sessions } = engagement
  const mc    = maturityColor(composite.overallAvg)
  const ml    = maturityLabel(composite.overallAvg)
  const date  = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const rc    = composite.roleCounts

  fbox(doc, 0, 0, PW, 118, C.primary, 0)

  // Decorative circles
  doc.setGState(doc.GState({ opacity: 0.08 }))
  sf(doc, C.white)
  doc.circle(PW + 20, -15, 90, 'F')
  doc.circle(PW - 10, 105, 55, 'F')
  doc.setGState(doc.GState({ opacity: 1 }))

  // Logo
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  st(doc, C.white)
  doc.text('LOGIC2020', ML, 24)
  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'normal')
  st(doc, [199, 225, 254])
  doc.text('Enterprise Transformation Consulting', ML + 34, 24)

  // Eyebrow
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  st(doc, [199, 225, 254])
  doc.text('CONFIDENTIAL · COMPOSITE ASSESSMENT REPORT', ML, 44)

  // Title
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  st(doc, C.white)
  doc.text('Composite AI', ML, 62)
  doc.text('Readiness', ML, 80)
  doc.text('Report', ML, 98)

  // White content panel
  const panelY = 108
  fbox(doc, 0, panelY, PW, PH - panelY, C.white, 0)
  sf(doc, C.primary)
  doc.rect(0, panelY, 5, PH - panelY, 'F')

  let py = panelY + 14

  // Company block
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  st(doc, C.slate500)
  doc.text('PREPARED FOR', ML + 8, py)
  py += 6

  doc.setFontSize(17)
  doc.setFont('helvetica', 'bold')
  st(doc, C.navy)
  let nameText = company.name || 'Organization'
  while (doc.getTextWidth(nameText) > CW - 12 && nameText.length > 4) nameText = nameText.slice(0, -1)
  if (nameText !== (company.name || 'Organization')) nameText += '…'
  doc.text(nameText, ML + 8, py)
  py += 8

  if (company.industry || company.size) {
    const meta = [company.industry, company.size].filter(Boolean).join('  ·  ')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    st(doc, C.slate700)
    doc.text(meta, ML + 8, py)
    py += 6
  }

  py += 3
  sd(doc, C.slate200)
  doc.setLineWidth(0.5)
  doc.line(ML + 8, py, PW - MR, py)
  py += 10

  // Summary tiles
  const rcParts = []
  if (rc.executive   > 0) rcParts.push(`${rc.executive} Exec`)
  if (rc.management  > 0) rcParts.push(`${rc.management} Mgmt`)
  if (rc.practitioner > 0) rcParts.push(`${rc.practitioner} Practitioner`)

  const tileGap = 5
  const tileW   = (CW - 16 - tileGap * 2) / 3
  const tileH   = 30
  const tiles   = [
    { label: 'COMPOSITE SCORE', value: `${composite.overallAvg}`, sub: '/ 100', color: mc },
    { label: 'MATURITY LEVEL',  value: ml,                         sub: 'AI readiness stage', color: mc },
    { label: 'RESPONDENTS',     value: `${composite.sessionCount}`, sub: rcParts.join(' · ') || 'across all roles', color: C.primary },
  ]

  tiles.forEach((t, i) => {
    const tx = ML + 8 + i * (tileW + tileGap)
    sf(doc, [246, 249, 252])
    doc.roundedRect(tx, py, tileW, tileH, 3, 3, 'F')
    sd(doc, C.slate200)
    doc.roundedRect(tx, py, tileW, tileH, 3, 3, 'S')
    sf(doc, t.color)
    doc.roundedRect(tx, py, tileW, 3, 1.5, 1.5, 'F')
    doc.setFontSize(6)
    doc.setFont('helvetica', 'bold')
    st(doc, C.slate500)
    doc.text(t.label, tx + tileW / 2, py + 10, { align: 'center' })
    const vfs = (i === 1 && t.value.length > 8) ? 10 : 15
    doc.setFontSize(vfs)
    doc.setFont('helvetica', 'bold')
    st(doc, t.color)
    doc.text(t.value, tx + tileW / 2, py + 21, { align: 'center' })
    doc.setFontSize(6)
    doc.setFont('helvetica', 'normal')
    st(doc, C.slate500)
    doc.text(t.sub, tx + tileW / 2, py + 27, { align: 'center' })
  })
  py += tileH + 10

  sd(doc, C.slate200)
  doc.setLineWidth(0.5)
  doc.line(ML + 8, py, PW - MR, py)
  py += 8

  // Dimension scores on cover
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  st(doc, C.slate500)
  doc.text('DIMENSION SCORES AT A GLANCE', ML + 8, py)
  py += 5

  const rowH = 11
  const nameW = 78
  const pillW2 = 34
  const barW = CW - 16 - nameW - pillW2

  setFill2(doc, [240, 245, 250])
  doc.rect(ML + 8, py, CW - 16, 7, 'F')
  doc.setFontSize(6)
  doc.setFont('helvetica', 'bold')
  st(doc, C.slate500)
  doc.text('DIMENSION', ML + 16, py + 5)
  doc.text('MATURITY', ML + 8 + nameW + 2, py + 5)
  doc.text('COMPOSITE SCORE', ML + 8 + nameW + pillW2 + 2, py + 5)
  py += 7

  composite.dimensions.forEach((d, i) => {
    const ry  = py + i * rowH
    const dc  = DIM_COLORS[d.dimId]
    const dmc = maturityColor(d.avg)
    const dml = maturityLabel(d.avg)

    if (i % 2 === 0) {
      sf(doc, [248, 251, 254])
      doc.rect(ML + 8, ry, CW - 16, rowH, 'F')
    }
    sd(doc, [235, 240, 245])
    doc.setLineWidth(0.2)
    doc.line(ML + 8, ry + rowH, ML + 8 + CW - 16, ry + rowH)

    sf(doc, dc)
    doc.circle(ML + 14, ry + 6, 2.5, 'F')

    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    st(doc, C.navy)
    doc.text(DIM_SHORT[d.dimId], ML + 20, ry + 7)

    const pW = 28
    fbox(doc, ML + 8 + nameW + 2, ry + 3, pW, 5.5, dmc, 2)
    doc.setFontSize(5)
    doc.setFont('helvetica', 'bold')
    st(doc, C.white)
    doc.text(dml, ML + 8 + nameW + 2 + pW / 2, ry + 6.8, { align: 'center' })

    const bx = ML + 8 + nameW + pillW2 + 2
    const bw = barW - 14
    pbar(doc, bx, ry + 4, bw, 4, d.avg, dc)
    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'bold')
    st(doc, C.navy)
    doc.text(`${d.avg}`, bx + bw + 3, ry + 8)
  })

  pageFooter(doc, company, pageNum)
}

function setFill2(doc, rgb) { doc.setFillColor(rgb[0], rgb[1], rgb[2]) }

// ── PAGE 2: Composite Scorecard ───────────────────────────────────────────
function drawScorecardPage(doc, engagement, composite, pageNum) {
  doc.addPage()
  pageHeader(doc, 'Composite Scorecard', pageNum)
  pageFooter(doc, engagement.company, pageNum)

  let y = 38

  // Section intro
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  st(doc, C.navy)
  doc.text('Score Breakdown by Dimension and Role Group', ML, y)
  y += 6
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  st(doc, C.slate500)
  doc.text(`Aggregated from ${composite.sessionCount} interviews · ⚠ = perception gap ≥ 20 pts between Executive and Practitioner`, ML, y)
  y += 10

  // Table header
  const colW = { dim: 56, comp: 22, mat: 26, exec: 22, mgmt: 22, prac: 22, spread: 24 }
  const rowH = 11
  const cols = [
    { label: 'DIMENSION',   x: ML,                                  w: colW.dim  },
    { label: 'COMPOSITE',   x: ML + colW.dim,                       w: colW.comp },
    { label: 'MATURITY',    x: ML + colW.dim + colW.comp,           w: colW.mat  },
    { label: 'EXECUTIVE',   x: ML + colW.dim + colW.comp + colW.mat, w: colW.exec },
    { label: 'MGMT',        x: ML + colW.dim + colW.comp + colW.mat + colW.exec, w: colW.mgmt },
    { label: 'PRACTITIONER',x: ML + colW.dim + colW.comp + colW.mat + colW.exec + colW.mgmt, w: colW.prac },
    { label: 'SPREAD',      x: ML + colW.dim + colW.comp + colW.mat + colW.exec + colW.mgmt + colW.prac, w: colW.spread },
  ]

  sf(doc, [240, 245, 250])
  doc.rect(ML, y, CW, 8, 'F')
  doc.setFontSize(6)
  doc.setFont('helvetica', 'bold')
  st(doc, C.slate500)
  cols.forEach(c => doc.text(c.label, c.x + 2, y + 5.5))
  y += 8

  composite.dimensions.forEach((d, i) => {
    const ry  = y + i * rowH
    const dc  = DIM_COLORS[d.dimId]
    const dmc = maturityColor(d.avg)
    const dml = maturityLabel(d.avg)

    if (i % 2 === 0) {
      sf(doc, [248, 251, 254])
      doc.rect(ML, ry, CW, rowH, 'F')
    }
    sd(doc, [235, 240, 245])
    doc.setLineWidth(0.2)
    doc.line(ML, ry + rowH, ML + CW, ry + rowH)

    // Dim name + gap flag
    sf(doc, dc)
    doc.circle(ML + 4, ry + 5.5, 2, 'F')
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    st(doc, C.navy)
    doc.text(DIM_SHORT[d.dimId], ML + 9, ry + 7)
    if (d.perceptionGap) {
      doc.setFontSize(6)
      st(doc, [230, 120, 30])
      doc.text('⚠ Gap', ML + 9, ry + 10.5)
    }

    // Composite
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    st(doc, dc)
    doc.text(`${d.avg}`, ML + colW.dim + 4, ry + 7.5)

    // Maturity pill
    const px = ML + colW.dim + colW.comp
    fbox(doc, px + 1, ry + 2.5, 22, 5.5, dmc, 2)
    doc.setFontSize(5)
    doc.setFont('helvetica', 'bold')
    st(doc, C.white)
    doc.text(dml, px + 12, ry + 6.2, { align: 'center' })

    // Role scores
    const roleX = [
      ML + colW.dim + colW.comp + colW.mat + 3,
      ML + colW.dim + colW.comp + colW.mat + colW.exec + 3,
      ML + colW.dim + colW.comp + colW.mat + colW.exec + colW.mgmt + 3,
    ]
    const roleGroups = ['executive', 'management', 'practitioner']
    const roleColors = [ROLE_GROUP_META.executive.color, ROLE_GROUP_META.management.color, ROLE_GROUP_META.practitioner.color]
    roleGroups.forEach((g, gi) => {
      const val = d.byGroup[g]?.avg
      doc.setFontSize(8)
      doc.setFont('helvetica', val != null ? 'bold' : 'normal')
      // Parse hex color to RGB
      const hc = roleColors[gi]
      const r  = parseInt(hc.slice(1, 3), 16)
      const gv = parseInt(hc.slice(3, 5), 16)
      const b  = parseInt(hc.slice(5, 7), 16)
      st(doc, val != null ? [r, gv, b] : C.slate500)
      doc.text(val != null ? `${val}` : '—', roleX[gi], ry + 7.5)
    })

    // Spread
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    st(doc, C.slate500)
    const spreadX = ML + colW.dim + colW.comp + colW.mat + colW.exec + colW.mgmt + colW.prac + 2
    doc.text(`±${d.stdDev}`, spreadX, ry + 7.5)
  })

  y += composite.dimensions.length * rowH + 16

  // Perception gap callout if any
  if (composite.perceptionGapDimensions?.length > 0) {
    fbox(doc, ML, y, CW, 8, [255, 251, 235], 3)
    sf(doc, [245, 158, 11])
    doc.roundedRect(ML, y, CW, 8, 3, 3, 'S')
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'bold')
    st(doc, [120, 60, 0])
    const gapNames = composite.perceptionGapDimensions.map(d => d.name).join(', ')
    doc.text(`⚠ Perception Gap Detected: ${gapNames}`, ML + 6, y + 5.5)
    y += 14

    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    st(doc, C.slate700)
    const gapNote = 'A 20+ point gap between Executive and Practitioner ratings indicates leadership and frontline teams have meaningfully different views of AI maturity. This is a standalone finding requiring investigation.'
    const gapLines = doc.splitTextToSize(gapNote, CW)
    doc.text(gapLines, ML, y)
    y += gapLines.length * 4.5 + 10

    // Per-gap details
    composite.perceptionGapDimensions.forEach(d => {
      const execAvg = d.byGroup.executive?.avg ?? null
      const pracAvg = d.byGroup.practitioner?.avg ?? null
      if (execAvg == null || pracAvg == null) return

      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      st(doc, C.navy)
      doc.text(`${DIM_SHORT[d.dimId]}: Executive ${execAvg} vs Practitioner ${pracAvg} (${d.gapMagnitude}pt gap)`, ML, y)
      y += 5.5

      const insight = d.gapDirection === 'exec_higher'
        ? `Leadership rates this ${d.gapMagnitude} pts higher than practitioners, suggesting an optimism gap.`
        : `Practitioners rate this ${d.gapMagnitude} pts higher than leadership, indicating undervalued grassroots capability.`
      doc.setFontSize(7)
      doc.setFont('helvetica', 'normal')
      st(doc, C.slate700)
      const iLines = doc.splitTextToSize(insight, CW)
      doc.text(iLines, ML, y)
      y += iLines.length * 4 + 8
    })
  }
}

// ── PAGE 3+: Dimension Detail Pages ──────────────────────────────────────
function drawDimensionPage(doc, engagement, composite, dim, questions, pageNum) {
  doc.addPage()
  const dc = DIM_COLORS[dim.dimId]
  pageHeader(doc, `Dimension: ${DIM_SHORT[dim.dimId]}`, pageNum)
  pageFooter(doc, engagement.company, pageNum)

  let y = 38

  // Score + maturity header
  const mc  = maturityColor(dim.avg)
  const mll = maturityLabel(dim.avg)

  fbox(doc, ML, y, CW, 28, [246, 249, 252], 4)
  sf(doc, dc)
  doc.roundedRect(ML, y, CW, 28, 4, 4, 'S')
  doc.setLineWidth(0)
  // Left accent
  sf(doc, dc)
  doc.roundedRect(ML, y, 4, 28, 4, 0, 'F')

  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  st(doc, dc)
  doc.text(`${dim.avg}`, ML + 14, y + 14)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  st(doc, C.slate700)
  doc.text('/ 100', ML + 14, y + 21)

  fbox(doc, ML + 44, y + 7, 28, 7, mc, 3)
  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'bold')
  st(doc, C.white)
  doc.text(mll, ML + 58, y + 12.5, { align: 'center' })

  // Progress bar
  pbar(doc, ML + 80, y + 9, CW - 90, 6, dim.avg, dc)

  // stdDev/range
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  st(doc, C.slate500)
  doc.text(`Std Dev: ±${dim.stdDev}  ·  Range: ${dim.min}–${dim.max}`, ML + 14, y + 26)
  y += 36

  // Role breakdown bars
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  st(doc, C.navy)
  doc.text('Score by Role Group', ML, y)
  y += 7

  const roleGroups = [
    { key: 'executive',    label: 'Executive',    color: ROLE_GROUP_META.executive.color    },
    { key: 'management',   label: 'Management',   color: ROLE_GROUP_META.management.color   },
    { key: 'practitioner', label: 'Practitioner', color: ROLE_GROUP_META.practitioner.color },
  ]

  roleGroups.forEach(rg => {
    const data = dim.byGroup[rg.key]
    if (!data) return
    const hc = rg.color
    const r = parseInt(hc.slice(1,3),16), gv = parseInt(hc.slice(3,5),16), b = parseInt(hc.slice(5,7),16)
    const rgbArr = [r, gv, b]

    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'bold')
    st(doc, rgbArr)
    doc.text(rg.label, ML, y + 5)

    pbar(doc, ML + 32, y, CW - 72, 7, data.avg, rgbArr)

    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    st(doc, rgbArr)
    doc.text(`${data.avg}`, ML + CW - 36, y + 6)

    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    st(doc, C.slate500)
    doc.text(`n=${data.count}`, ML + CW - 22, y + 6)

    y += 11
  })

  if (dim.perceptionGap) {
    fbox(doc, ML, y, CW, 10, [255, 251, 235], 3)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    st(doc, [120, 60, 0])
    doc.text(`⚠ ${dim.gapMagnitude}pt perception gap detected between Executive and Practitioner`, ML + 4, y + 7)
    y += 16
  }

  y += 4

  // Top 3 questions by avg (lowest = gaps)
  if (questions && dim.qAvgs) {
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    st(doc, C.navy)
    doc.text('Question-Level Averages (1–5 scale)', ML, y)
    y += 7

    const qEntries = questions.map((q, qi) => {
      const qData   = dim.qAvgs[qi]
      const avg     = typeof qData === 'object' ? qData.avg    : qData
      const dkRate  = typeof qData === 'object' ? qData.dkRate : 0
      return { text: q.text, avg, dkRate, qi }
    })

    qEntries.forEach(q => {
      if (y > PH - 20) return // safety overflow guard

      // Color based on avg
      let qColor
      if (q.avg === null)  qColor = C.slate500
      else if (q.avg >= 4) qColor = [16, 185, 129]
      else if (q.avg >= 3) qColor = [180, 130, 10]
      else                 qColor = [220, 50, 50]

      // Q number chip
      fbox(doc, ML, y, 9, 7, qColor, 2)
      doc.setFontSize(5.5)
      doc.setFont('helvetica', 'bold')
      st(doc, C.white)
      doc.text(`Q${q.qi + 1}`, ML + 4.5, y + 5, { align: 'center' })

      // Question text truncated
      doc.setFontSize(7)
      doc.setFont('helvetica', 'normal')
      st(doc, C.slate700)
      const qText = doc.splitTextToSize(q.text, CW - 32)[0]
      const tooLong = doc.splitTextToSize(q.text, CW - 32).length > 1
      doc.text(qText + (tooLong ? '…' : ''), ML + 12, y + 5.5)

      // Score chip
      fbox(doc, ML + CW - 18, y, 16, 7, qColor, 2)
      doc.setFontSize(6.5)
      doc.setFont('helvetica', 'bold')
      st(doc, C.white)
      const scoreLabel = q.avg !== null ? q.avg.toFixed(1) : '—'
      doc.text(scoreLabel, ML + CW - 10, y + 5.3, { align: 'center' })

      // DK rate badge
      if (q.dkRate >= 30) {
        doc.setFontSize(5.5)
        doc.setFont('helvetica', 'normal')
        st(doc, C.slate500)
        doc.text(`${q.dkRate}% DK`, ML + CW - 37, y + 5.5)
      }

      y += 9
    })
  }
}

// ── PAGE: Recommendations ─────────────────────────────────────────────────
function drawRecommendationsPage(doc, engagement, composite, pageNum) {
  doc.addPage()
  pageHeader(doc, 'Composite Action Plan', pageNum)
  pageFooter(doc, engagement.company, pageNum)

  const { company } = engagement
  const recommendations = generateRecommendations(composite.asDimScores, company)

  let y = 38

  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  st(doc, C.navy)
  doc.text('Prioritized Recommendations', ML, y)
  y += 5
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  st(doc, C.slate500)
  doc.text(`Based on aggregate scores across ${composite.sessionCount} respondents · Ordered by readiness gap`, ML, y)
  y += 10

  const priorityColors = {
    'Critical': [231, 76, 60],
    'High':     [230, 126, 34],
    'Medium':   [241, 196, 15],
    'Sustain':  [16, 185, 129],
  }

  recommendations.forEach((rec, idx) => {
    if (y > PH - 30) {
      doc.addPage()
      pageNum++
      pageHeader(doc, 'Composite Action Plan (cont.)', pageNum)
      pageFooter(doc, engagement.company, pageNum)
      y = 38
    }

    const dc = DIM_COLORS[rec.dimensionId]
    const pc = priorityColors[rec.priority] || C.slate500

    // Rec card background
    const cardH = estimateRecHeight(doc, rec)
    const safeH = Math.min(cardH, PH - y - 12)

    fbox(doc, ML, y, CW, safeH, [248, 251, 254], 3)
    sd(doc, C.slate200)
    doc.setLineWidth(0.3)
    doc.roundedRect(ML, y, CW, safeH, 3, 3, 'S')

    // Left color accent
    sf(doc, dc)
    doc.roundedRect(ML, y, 4, safeH, 3, 0, 'F')

    let cy = y + 6

    // Dimension label + priority badge
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    st(doc, dc)
    doc.text(`${DIM_SHORT[rec.dimensionId]} · Score: ${rec.score}/100`, ML + 8, cy)

    fbox(doc, ML + CW - 28, cy - 5, 26, 7, pc, 3)
    doc.setFontSize(6)
    doc.setFont('helvetica', 'bold')
    st(doc, C.white)
    doc.text(`${idx === 0 ? '↑↑ ' : ''}${rec.priority}`, ML + CW - 15, cy - 0.8, { align: 'center' })

    cy += 6

    // Title
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    st(doc, C.navy)
    const titleLines = doc.splitTextToSize(rec.title, CW - 40)
    doc.text(titleLines, ML + 8, cy)
    cy += titleLines.length * 5 + 3

    // Description
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    st(doc, C.slate700)
    const descLines = doc.splitTextToSize(rec.description, CW - 12)
    doc.text(descLines.slice(0, 3), ML + 8, cy)
    cy += Math.min(descLines.length, 3) * 4.5 + 3

    // Actions
    if (rec.actions?.length) {
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      st(doc, C.navy)
      doc.text('Key Actions:', ML + 8, cy)
      cy += 5
      rec.actions.slice(0, 3).forEach(action => {
        sf(doc, dc)
        doc.circle(ML + 11, cy - 1.5, 1.5, 'F')
        doc.setFontSize(7)
        doc.setFont('helvetica', 'normal')
        st(doc, C.slate700)
        const aLines = doc.splitTextToSize(action, CW - 22)
        doc.text(aLines[0], ML + 15, cy)
        cy += 5
      })
    }

    y += safeH + 6
  })

  return pageNum
}

function estimateRecHeight(doc, rec) {
  const titleLines = doc.splitTextToSize(rec.title || '', CW - 40).length
  const descLines  = Math.min(doc.splitTextToSize(rec.description || '', CW - 12).length, 3)
  const actionCount = Math.min(rec.actions?.length || 0, 3)
  return 16 + titleLines * 5 + descLines * 4.5 + actionCount * 5 + 12
}

// ── PAGE: Respondent Summary ──────────────────────────────────────────────
function drawRespondentPage(doc, engagement, composite, pageNum) {
  doc.addPage()
  pageHeader(doc, 'Respondent Summary', pageNum)
  pageFooter(doc, engagement.company, pageNum)

  const { sessions } = engagement
  let y = 38

  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  st(doc, C.navy)
  doc.text('All Respondents', ML, y)
  y += 5
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  st(doc, C.slate500)
  doc.text('Individual scores by respondent and dimension', ML, y)
  y += 9

  // Column headers
  const colX = { name: ML, role: ML + 40, grp: ML + 78, overall: ML + 100, dims: ML + 116 }
  const dimColW = (CW - 116 + ML - ML) / 5
  const dimIds = [1, 2, 3, 4, 5]
  const dimLabels = ['Strat', 'Data', 'Gov', 'Tal', 'Ops']

  sf(doc, [240, 245, 250])
  doc.rect(ML, y, CW, 7, 'F')
  doc.setFontSize(5.5)
  doc.setFont('helvetica', 'bold')
  st(doc, C.slate500)
  doc.text('NAME', colX.name + 1, y + 5)
  doc.text('TITLE', colX.role + 1, y + 5)
  doc.text('GRP', colX.grp + 1, y + 5)
  doc.text('OVERALL', colX.overall + 1, y + 5)
  dimLabels.forEach((lbl, i) => {
    doc.text(lbl, colX.dims + i * 19 + 1, y + 5)
  })
  y += 7

  const rowH = 9
  sessions.forEach((s, i) => {
    if (y > PH - 18) return
    const m   = ROLE_GROUP_META[s.roleGroup]
    const mc2 = maturityColor(s.overallScore)

    if (i % 2 === 0) {
      sf(doc, [248, 251, 254])
      doc.rect(ML, y, CW, rowH, 'F')
    }
    sd(doc, [235, 240, 245])
    doc.setLineWidth(0.2)
    doc.line(ML, y + rowH, ML + CW, y + rowH)

    // Name (truncated)
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'bold')
    st(doc, C.navy)
    const nameTxt = s.respondentName.length > 14 ? s.respondentName.slice(0, 13) + '…' : s.respondentName
    doc.text(nameTxt, colX.name + 1, y + 6.5)

    // Role (truncated)
    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'normal')
    st(doc, C.slate700)
    const roleTxt = (s.respondentRole || '').length > 16 ? s.respondentRole.slice(0, 15) + '…' : (s.respondentRole || '')
    doc.text(roleTxt, colX.role + 1, y + 6.5)

    // Group chip
    const hc = m.color
    const r2 = parseInt(hc.slice(1,3),16), g2 = parseInt(hc.slice(3,5),16), b2 = parseInt(hc.slice(5,7),16)
    const hbg = m.bg
    const rb = parseInt(hbg.slice(1,3),16), gb = parseInt(hbg.slice(3,5),16), bb = parseInt(hbg.slice(5,7),16)
    fbox(doc, colX.grp + 1, y + 2, 16, 5, [rb, gb, bb], 2)
    doc.setFontSize(5)
    doc.setFont('helvetica', 'bold')
    st(doc, [r2, g2, b2])
    doc.text(m.label.slice(0, 5), colX.grp + 9, y + 6, { align: 'center' })

    // Overall
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    st(doc, mc2)
    doc.text(`${s.overallScore}`, colX.overall + 4, y + 6.5)

    // Per-dim scores
    dimIds.forEach((id, di) => {
      const score = s.dimScores[id]
      const dc2   = score != null ? maturityColor(score) : C.slate500
      doc.setFontSize(7)
      doc.setFont('helvetica', score != null ? 'bold' : 'normal')
      st(doc, dc2)
      doc.text(score != null ? `${score}` : '—', colX.dims + di * 19 + 4, y + 6.5)
    })

    y += rowH
  })
}

// ── Main export function ──────────────────────────────────────────────────
async function generateCompositePDF(engagement) {
  const composite = computeComposite(engagement.sessions)
  if (!composite) throw new Error('No sessions to aggregate')

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  let pageNum = 1

  // Page 1: Cover
  drawCover(doc, engagement, composite, pageNum)

  // Page 2: Composite Scorecard
  pageNum++
  drawScorecardPage(doc, engagement, composite, pageNum)

  // Pages 3-7: One per dimension
  composite.dimensions.forEach((dim, i) => {
    pageNum++
    const dimDef   = dimensions.find(d => d.id === dim.dimId)
    const questions = dimDef?.questions || []
    drawDimensionPage(doc, engagement, composite, dim, questions, pageNum)
  })

  // Recommendations page(s)
  pageNum++
  pageNum = drawRecommendationsPage(doc, engagement, composite, pageNum)

  // Respondent summary
  pageNum++
  drawRespondentPage(doc, engagement, composite, pageNum)

  // Save
  const company = engagement.company?.name || 'Assessment'
  const date    = new Date().toISOString().slice(0, 10)
  doc.save(`${company.replace(/\s+/g, '-')}-AI-Readiness-Composite-${date}.pdf`)
}

// ── Export button component ───────────────────────────────────────────────
export default function CompositePDFExportButton({ engagement }) {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    setLoading(true)
    try {
      await generateCompositePDF(engagement)
    } catch (e) {
      console.error('Composite PDF export failed:', e)
      alert('PDF export failed. Please try again.')
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

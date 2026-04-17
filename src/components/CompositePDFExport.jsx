import { useState } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { dimensions } from '../data/questions'
import { generateRecommendations } from '../data/recommendations'
import { computeComposite, ROLE_GROUP_META } from '../data/engagement'

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN SYSTEM
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  primary:   [46,  163, 242],
  primaryDk: [26,  140, 216],
  navy:      [12,  32,  70],
  slate700:  [71,  85, 105],
  slate500:  [100, 116, 139],
  slate300:  [203, 213, 225],
  slate100:  [241, 245, 249],
  slate50:   [248, 250, 252],
  white:     [255, 255, 255],
  green:     [22,  163,  74],
  amber:     [217, 119,   6],
  red:       [220,  38,  38],
  blue:      [37,   99, 235],
  purple:    [124,  58, 237],
}

// Page layout
const PW = 210, PH = 297
const ML = 16, MR = 16, CW = PW - ML - MR   // 178mm content width
const CONTENT_TOP = 34, CONTENT_BOT = 286    // usable vertical range

const DIM_COLORS = {
  1: [46,  163, 242],  // blue    – Strategy
  2: [14,  165, 233],  // sky     – Data
  3: [124,  58, 237],  // purple  – Governance
  4: [217, 119,   6],  // amber   – Talent
  5: [22,  163,  74],  // green   – Operations
}

const DIM_NAMES = {
  1: 'AI Strategy',
  2: 'Data & Infrastructure',
  3: 'Governance & Ethics',
  4: 'Talent & Culture',
  5: 'AI Operations',
}

const DIM_SHORT_LABEL = {
  1: 'Strategy', 2: 'Data', 3: 'Governance', 4: 'Talent', 5: 'Operations',
}

const ROLE_STYLE = {
  executive:    { fg: [99,  102, 241], bg: [238, 242, 255], label: 'Executive'    },
  management:   { fg: [14,  165, 233], bg: [240, 249, 255], label: 'Management'   },
  practitioner: { fg: [22,  163,  74], bg: [240, 253, 244], label: 'Practitioner' },
}

function matColor(score) {
  if (score === undefined || score === null) return C.slate500
  if (score < 20) return C.red
  if (score < 40) return [234, 88, 12]
  if (score < 60) return C.amber
  if (score < 80) return C.blue
  return C.green
}
function matLabel(score) {
  if (score < 20) return 'Beginning'
  if (score < 40) return 'Developing'
  if (score < 60) return 'Maturing'
  if (score < 80) return 'Advanced'
  return 'Leading'
}

// ─────────────────────────────────────────────────────────────────────────────
// DRAWING PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────
const sf = (d, c) => d.setFillColor(c[0], c[1], c[2])
const sd = (d, c) => d.setDrawColor(c[0], c[1], c[2])
const st = (d, c) => d.setTextColor(c[0], c[1], c[2])

function rbox(doc, x, y, w, h, fill, r = 3) {
  sf(doc, fill); doc.roundedRect(x, y, w, h, r, r, 'F')
}
function rboxS(doc, x, y, w, h, fill, stroke, r = 3) {
  sf(doc, fill); sd(doc, stroke); doc.setLineWidth(0.3)
  doc.roundedRect(x, y, w, h, r, r, 'FD')
}

function pbar(doc, x, y, w, h, pct, fill) {
  rbox(doc, x, y, w, h, C.slate100, h / 2)
  if (pct > 0) {
    const bw = Math.max(w * (pct / 100), h)
    sf(doc, fill); doc.roundedRect(x, y, bw, h, h / 2, h / 2, 'F')
  }
}

function txt(doc, text, x, y, size, color, style = 'normal', opts = {}) {
  doc.setFontSize(size); doc.setFont('helvetica', style); st(doc, color)
  doc.text(String(text ?? ''), x, y, opts)
}

function wrapped(doc, text, x, y, maxW, size, color, style = 'normal', maxLines = 99) {
  doc.setFontSize(size); doc.setFont('helvetica', style)
  const lines = doc.splitTextToSize(String(text ?? ''), maxW).slice(0, maxLines)
  st(doc, color); doc.text(lines, x, y)
  return lines.length
}

function pill(doc, label, x, y, w, h, bg, fg) {
  rbox(doc, x, y, w, h, bg, 3)
  txt(doc, label, x + w / 2, y + h - 1.8, 6.5, fg, 'bold', { align: 'center' })
}

function scoreBadge(doc, score, x, y, size = 22) {
  const mc = matColor(score)
  rbox(doc, x, y, size, size, mc, 4)
  txt(doc, `${score}`, x + size / 2, y + size / 2 + 3.5, 14, C.white, 'bold', { align: 'center' })
  txt(doc, '/100', x + size / 2, y + size / 2 + 8.5, 5.5, [255, 255, 255], 'normal', { align: 'center' })
}

function matPill(doc, score, x, y, w = 28, h = 7) {
  pill(doc, matLabel(score), x, y, w, h, matColor(score), C.white)
}

function sectionHeader(doc, title, subtitle, y) {
  txt(doc, title, ML, y, 13, C.navy, 'bold')
  if (subtitle) {
    txt(doc, subtitle, ML, y + 7, 8, C.slate500, 'normal')
    return y + 14
  }
  return y + 10
}

function cardBase(doc, x, y, w, h, accentColor) {
  rboxS(doc, x, y, w, h, C.slate50, C.slate300, 3)
  if (accentColor) {
    sf(doc, accentColor); doc.roundedRect(x, y, 4, h, 3, 0, 'F')
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED HEADER / FOOTER
// ─────────────────────────────────────────────────────────────────────────────
function pageHeader(doc, title, pageNum) {
  rbox(doc, 0, 0, PW, 26, C.primary, 0)
  rbox(doc, ML, 7, 12, 12, C.primaryDk, 2)
  txt(doc, 'AI', ML + 3, 15, 7, C.white, 'bold')
  txt(doc, title, ML + 17, 15, 11, C.white, 'bold')
  txt(doc, 'Enterprise AI Readiness Assessment  ·  Logic2020', ML + 17, 21, 6.5, [199, 220, 254], 'normal')
  txt(doc, `Page ${pageNum}`, PW - MR, 15, 8, [199, 220, 254], 'normal', { align: 'right' })
}

function pageFooter(doc, company, pageNum) {
  const y = PH - 6
  txt(doc, 'CONFIDENTIAL', ML, y, 6.5, C.slate500)
  const center = company?.name
    ? `${company.name}  ·  Logic2020  ·  logic2020.com`
    : 'Composite AI Readiness Report  ·  Logic2020  ·  logic2020.com'
  txt(doc, center, PW / 2, y, 6.5, C.slate500, 'normal', { align: 'center' })
  txt(doc, `Page ${pageNum}`, PW - MR, y, 6.5, C.slate500, 'normal', { align: 'right' })
}

function newPage(doc, title, company, pageNum) {
  doc.addPage()
  pageHeader(doc, title, pageNum)
  pageFooter(doc, company, pageNum)
  return CONTENT_TOP
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 1 — COVER
// ─────────────────────────────────────────────────────────────────────────────
function drawCover(doc, engagement, composite, pageNum) {
  const { company } = engagement
  const mc    = matColor(composite.overallAvg)
  const ml    = matLabel(composite.overallAvg)
  const date  = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const rc    = composite.roleCounts

  // Blue header band
  rbox(doc, 0, 0, PW, 125, C.primary, 0)
  doc.setGState(doc.GState({ opacity: 0.07 }))
  sf(doc, C.white); doc.circle(PW + 15, -10, 95, 'F'); doc.circle(PW - 8, 112, 52, 'F')
  doc.setGState(doc.GState({ opacity: 1 }))

  // Logo
  txt(doc, 'LOGIC2020', ML, 22, 9, C.white, 'bold')
  txt(doc, 'Enterprise Transformation Consulting', ML + 36, 22, 6.5, [199, 225, 254], 'normal')

  // Eyebrow
  txt(doc, 'CONFIDENTIAL  ·  COMPOSITE ASSESSMENT REPORT', ML, 40, 7, [199, 225, 254], 'bold')

  // Title
  txt(doc, 'Composite AI', ML, 62, 30, C.white, 'bold')
  txt(doc, 'Readiness', ML, 82, 30, C.white, 'bold')
  txt(doc, 'Report', ML, 102, 30, C.white, 'bold')

  // White panel
  rbox(doc, 0, 115, PW, PH - 115, C.white, 0)
  sf(doc, C.primary); doc.rect(0, 115, 5, PH - 115, 'F')

  let py = 130

  // Prepared for
  txt(doc, 'PREPARED FOR', ML + 8, py, 7, C.slate500, 'bold'); py += 7

  let nameText = company.name || 'Organization'
  doc.setFontSize(20); doc.setFont('helvetica', 'bold')
  while (doc.getTextWidth(nameText) > CW - 12 && nameText.length > 4)
    nameText = nameText.slice(0, -1)
  if (nameText !== (company.name || 'Organization')) nameText += '…'
  txt(doc, nameText, ML + 8, py, 20, C.navy, 'bold'); py += 10

  if (company.industry || company.size) {
    const meta = [company.industry, company.size].filter(Boolean).join('  ·  ')
    txt(doc, meta, ML + 8, py, 9, C.slate700); py += 7
  }

  py += 2; sd(doc, C.slate300); doc.setLineWidth(0.4)
  doc.line(ML + 8, py, PW - MR, py); py += 10

  // 3 summary tiles
  const rcParts = []
  if (rc.executive    > 0) rcParts.push(`${rc.executive} Exec`)
  if (rc.management   > 0) rcParts.push(`${rc.management} Mgmt`)
  if (rc.practitioner > 0) rcParts.push(`${rc.practitioner} Practitioner`)

  const tileW = (CW - 16 - 8) / 3, tileH = 34
  const tiles = [
    { label: 'COMPOSITE SCORE', value: `${composite.overallAvg}`, sub: '/ 100',                color: mc },
    { label: 'MATURITY LEVEL',  value: ml,                         sub: 'AI readiness stage',   color: mc },
    { label: 'RESPONDENTS',     value: `${composite.sessionCount}`, sub: rcParts.join(' · ') || 'across roles', color: C.primary },
  ]
  tiles.forEach((t, i) => {
    const tx = ML + 8 + i * (tileW + 4)
    rboxS(doc, tx, py, tileW, tileH, C.slate50, C.slate300, 3)
    sf(doc, t.color); doc.roundedRect(tx, py, tileW, 3, 1.5, 1.5, 'F')
    txt(doc, t.label, tx + tileW / 2, py + 12, 6, C.slate500, 'bold', { align: 'center' })
    const vfs = i === 1 && t.value.length > 8 ? 11 : 16
    txt(doc, t.value, tx + tileW / 2, py + 24, vfs, t.color, 'bold', { align: 'center' })
    const subTxt = t.sub.length > 24 ? t.sub.slice(0, 23) + '…' : t.sub
    txt(doc, subTxt, tx + tileW / 2, py + 31, 6, C.slate500, 'normal', { align: 'center' })
  })
  py += tileH + 10

  sd(doc, C.slate300); doc.setLineWidth(0.4)
  doc.line(ML + 8, py, PW - MR, py); py += 8

  txt(doc, `Assessment Date: ${date}`, ML + 8, py, 8, C.slate700); py += 7

  const gapCount = composite.perceptionGapDimensions?.length || 0
  const lvCount  = composite.lowVisibilityDimensions?.length  || 0
  if (gapCount > 0 || lvCount > 0) {
    const flags = []
    if (gapCount > 0) flags.push(`${gapCount} perception gap${gapCount > 1 ? 's' : ''} detected`)
    if (lvCount  > 0) flags.push(`${lvCount} low-visibility dimension${lvCount > 1 ? 's' : ''}`)
    rbox(doc, ML + 8, py, CW - 8, 10, [255, 247, 237], 3)
    txt(doc, `⚠  Key Flags: ${flags.join('  ·  ')}`, ML + 13, py + 7, 7.5, [154, 52, 18], 'bold')
  }

  pageFooter(doc, company, pageNum)
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 2 — EXECUTIVE SUMMARY
// ─────────────────────────────────────────────────────────────────────────────
function drawExecutiveSummaryPage(doc, engagement, composite, pageNum) {
  let y = newPage(doc, 'Executive Summary', engagement.company, pageNum)

  // ── Overall score block ───────────────────────────────────────────────────
  const mc  = matColor(composite.overallAvg)
  const mll = matLabel(composite.overallAvg)

  cardBase(doc, ML, y, CW, 38, mc)
  scoreBadge(doc, composite.overallAvg, ML + 8, y + 8, 26)

  txt(doc, `${composite.overallAvg} / 100`, ML + 42, y + 18, 20, mc, 'bold')
  pill(doc, mll + ' Maturity', ML + 42, y + 22, 42, 9, mc, C.white)

  const rcParts = []
  if (composite.roleCounts.executive    > 0) rcParts.push(`${composite.roleCounts.executive} Executive`)
  if (composite.roleCounts.management   > 0) rcParts.push(`${composite.roleCounts.management} Management`)
  if (composite.roleCounts.practitioner > 0) rcParts.push(`${composite.roleCounts.practitioner} Practitioner`)
  txt(doc, `${composite.sessionCount} respondents  ·  ${rcParts.join(', ')}`, ML + 42, y + 34, 8, C.slate700)
  y += 46

  // ── Dimension scores strip ────────────────────────────────────────────────
  txt(doc, 'SCORE BY DIMENSION', ML, y, 7, C.slate500, 'bold'); y += 6

  const dimCardW = (CW - 16) / 5, dimCardH = 36
  composite.dimensions.forEach((d, i) => {
    const cx = ML + i * (dimCardW + 4)
    const dc = DIM_COLORS[d.dimId]
    rboxS(doc, cx, y, dimCardW, dimCardH, C.white, C.slate300, 3)
    sf(doc, dc); doc.roundedRect(cx, y, dimCardW, 3, 1.5, 1.5, 'F')
    txt(doc, DIM_SHORT_LABEL[d.dimId], cx + dimCardW / 2, y + 12, 6.5, C.slate700, 'bold', { align: 'center' })
    txt(doc, `${d.avg}`, cx + dimCardW / 2, y + 24, 15, dc, 'bold', { align: 'center' })
    matPill(doc, d.avg, cx + (dimCardW - 24) / 2, y + 28, 24, 6)
  })
  y += dimCardH + 10

  // ── Role group comparison ─────────────────────────────────────────────────
  txt(doc, 'SCORE BY ROLE GROUP', ML, y, 7, C.slate500, 'bold'); y += 6

  const roleKeys = ['executive', 'management', 'practitioner']
  const roleCardW = (CW - 8) / 3, roleCardH = 32
  roleKeys.forEach((g, gi) => {
    const count = composite.roleCounts[g] || 0
    const rs    = ROLE_STYLE[g]
    const cx    = ML + gi * (roleCardW + 4)
    rboxS(doc, cx, y, roleCardW, roleCardH, rs.bg, rs.fg, 3)

    if (count > 0) {
      const groupAvg = Math.round(
        engagement.sessions.filter(s => (s.roleGroup || 'practitioner') === g)
          .reduce((a, s) => a + (s.overallScore || 0), 0) / count
      )
      txt(doc, `${groupAvg}`, cx + 14, y + 16, 18, rs.fg, 'bold')
      txt(doc, '/100', cx + 14, y + 22, 7, rs.fg, 'normal')
      txt(doc, rs.label, cx + roleCardW / 2 + 10, y + 14, 9, rs.fg, 'bold', { align: 'center' })
      txt(doc, `n = ${count}`, cx + roleCardW / 2 + 10, y + 21, 7.5, rs.fg, 'normal', { align: 'center' })
      pbar(doc, cx + 4, y + 27, roleCardW - 8, 3, groupAvg, rs.fg)
    } else {
      txt(doc, rs.label, cx + roleCardW / 2, y + 18, 9, rs.fg, 'bold', { align: 'center' })
      txt(doc, 'No respondents', cx + roleCardW / 2, y + 25, 7, rs.fg, 'normal', { align: 'center' })
    }
  })
  y += roleCardH + 10

  // ── Key findings ──────────────────────────────────────────────────────────
  txt(doc, 'KEY FINDINGS', ML, y, 7, C.slate500, 'bold'); y += 7

  const sorted  = [...composite.dimensions].sort((a, b) => b.avg - a.avg)
  const highest = sorted[0]
  const lowest  = sorted[sorted.length - 1]
  const findings = [
    { dot: C.green, text: `Strongest area: ${DIM_NAMES[highest.dimId]} — scored ${highest.avg}/100 (${matLabel(highest.avg)})` },
    { dot: C.red,   text: `Greatest gap: ${DIM_NAMES[lowest.dimId]} — scored ${lowest.avg}/100 (${matLabel(lowest.avg)})` },
  ]
  const gaps  = composite.perceptionGapDimensions || []
  const lvDims = composite.lowVisibilityDimensions || []
  if (gaps.length)   findings.push({ dot: [230, 126, 34], text: `Perception gaps in: ${gaps.map(d => DIM_NAMES[d.dimId]).join(', ')} — see Insights page` })
  if (lvDims.length) findings.push({ dot: C.primary,      text: `Low organizational visibility in: ${lvDims.map(d => DIM_NAMES[d.dimId]).join(', ')}` })

  findings.forEach(f => {
    sf(doc, f.dot); doc.circle(ML + 3, y - 1, 2.5, 'F')
    const n = wrapped(doc, f.text, ML + 10, y, CW - 12, 8.5, C.slate700, 'normal', 2)
    y += n * 5 + 3
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 3 — PERCEPTION GAPS & LOW VISIBILITY (conditional)
// ─────────────────────────────────────────────────────────────────────────────
function drawInsightsPage(doc, engagement, composite, pageNum) {
  const gaps  = composite.perceptionGapDimensions  || []
  const lvDims = composite.lowVisibilityDimensions || []
  if (!gaps.length && !lvDims.length) return false

  let y = newPage(doc, 'Organizational Insights', engagement.company, pageNum)

  // ── Perception Gaps ───────────────────────────────────────────────────────
  if (gaps.length > 0) {
    y = sectionHeader(doc, 'Perception Gap Analysis', 'A 20+ point difference between Executive and Practitioner ratings — a standalone strategic finding.', y)

    gaps.forEach(d => {
      if (y > CONTENT_BOT - 50) return
      const dc      = DIM_COLORS[d.dimId]
      const execAvg = d.byGroup.executive?.avg   ?? null
      const pracAvg = d.byGroup.practitioner?.avg ?? null

      // Card
      const cardH = execAvg != null && pracAvg != null ? 52 : 32
      cardBase(doc, ML, y, CW, cardH, dc)

      // Dim title + gap badge
      txt(doc, DIM_NAMES[d.dimId], ML + 9, y + 9, 10, dc, 'bold')
      rbox(doc, PW - MR - 36, y + 4, 34, 9, [255, 237, 213], 3)
      txt(doc, `${d.gapMagnitude} pt gap`, PW - MR - 19, y + 10.5, 8, [154, 52, 18], 'bold', { align: 'center' })

      let cy = y + 16

      // Exec bar
      if (execAvg != null) {
        txt(doc, 'Executive', ML + 9, cy + 5, 8, ROLE_STYLE.executive.fg, 'bold')
        pbar(doc, ML + 44, cy, CW - 70, 8, execAvg, ROLE_STYLE.executive.fg)
        txt(doc, `${execAvg}`, ML + 44 + CW - 70 + 4, cy + 6.5, 9, ROLE_STYLE.executive.fg, 'bold')
        cy += 13
      }
      // Practitioner bar
      if (pracAvg != null) {
        txt(doc, 'Practitioner', ML + 9, cy + 5, 8, ROLE_STYLE.practitioner.fg, 'bold')
        pbar(doc, ML + 44, cy, CW - 70, 8, pracAvg, ROLE_STYLE.practitioner.fg)
        txt(doc, `${pracAvg}`, ML + 44 + CW - 70 + 4, cy + 6.5, 9, ROLE_STYLE.practitioner.fg, 'bold')
        cy += 13
      }

      y += cardH + 5

      // Insight text below card
      const insight = d.gapDirection === 'exec_higher'
        ? `Leadership rates this dimension ${d.gapMagnitude} pts higher than practitioners. This may indicate an optimism gap — leadership believes AI capabilities are stronger than those doing the work experience them to be.`
        : `Practitioners rate this dimension ${d.gapMagnitude} pts higher than leadership. This may indicate undervalued grassroots capability or a communication gap around existing strengths.`
      const n = wrapped(doc, insight, ML, y, CW, 8, C.slate700, 'normal', 2)
      y += n * 4.5 + 10
    })
  }

  // ── Low Visibility ────────────────────────────────────────────────────────
  if (lvDims.length > 0 && y < CONTENT_BOT - 40) {
    y = sectionHeader(doc, 'Low Organizational Visibility',
      'Dimensions with ≥30% "Don\'t Know" responses — a maturity signal independent of the score.', y)

    lvDims.forEach(d => {
      if (y > CONTENT_BOT - 20) return
      const dc = DIM_COLORS[d.dimId]
      cardBase(doc, ML, y, CW, 18, dc)
      txt(doc, DIM_NAMES[d.dimId], ML + 9, y + 7, 9, dc, 'bold')
      txt(doc, `${d.dkRate}% of respondents answered "Don't Know"`, ML + 9, y + 14, 8, C.slate700, 'normal')
      rbox(doc, PW - MR - 28, y + 5, 26, 8, C.slate100, 3)
      txt(doc, `${d.dkRate}% DK`, PW - MR - 15, y + 11, 7.5, C.slate700, 'bold', { align: 'center' })
      y += 22
    })
  }

  return true
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGES 4-8 — PER-DIMENSION DETAIL
// ─────────────────────────────────────────────────────────────────────────────
function drawDimensionDetailPage(doc, engagement, composite, dim, questions, pageNum) {
  let y = newPage(doc, DIM_NAMES[dim.dimId], engagement.company, pageNum)
  const dc = DIM_COLORS[dim.dimId]

  // ── Score header ──────────────────────────────────────────────────────────
  cardBase(doc, ML, y, CW, 32, dc)
  scoreBadge(doc, dim.avg, ML + 8, y + 5, 22)
  matPill(doc, dim.avg, ML + 38, y + 10, 32, 9)
  txt(doc, DIM_NAMES[dim.dimId], ML + 76, y + 14, 12, C.navy, 'bold')
  txt(doc, `Std Dev ±${dim.stdDev}  ·  Range ${dim.min}–${dim.max}  ·  ${dim.respondentCount || ''} respondents`, ML + 76, y + 22, 7.5, C.slate500, 'normal')
  pbar(doc, ML + 38, y + 22, CW - 50, 5, dim.avg, dc)
  y += 38

  // ── Role group bars ───────────────────────────────────────────────────────
  txt(doc, 'SCORE BY ROLE GROUP', ML, y, 7, C.slate500, 'bold'); y += 7

  ;[['executive', 'Executive'], ['management', 'Management'], ['practitioner', 'Practitioner']].forEach(([g, label]) => {
    const data = dim.byGroup[g]
    if (!data) return
    const rs = ROLE_STYLE[g]
    txt(doc, label, ML, y + 6, 8.5, rs.fg, 'bold')
    pbar(doc, ML + 36, y, CW - 68, 9, data.avg, rs.fg)
    txt(doc, `${data.avg}`, ML + 36 + CW - 68 + 5, y + 7, 10, rs.fg, 'bold')
    txt(doc, `n=${data.count}`, ML + CW - 12, y + 7, 7, C.slate500, 'normal', { align: 'right' })
    y += 13
  })

  if (dim.perceptionGap) {
    rbox(doc, ML, y, CW, 10, [255, 247, 237], 3)
    txt(doc, `⚠  ${dim.gapMagnitude}pt perception gap between Executive and Practitioner scores`, ML + 6, y + 7.5, 8, [154, 52, 18], 'bold')
    y += 14
  }

  y += 4
  sd(doc, C.slate300); doc.setLineWidth(0.3); doc.line(ML, y, PW - MR, y); y += 8

  // ── Question heatmap ──────────────────────────────────────────────────────
  txt(doc, 'QUESTION-LEVEL AVERAGES  (1–5 scale)', ML, y, 7, C.slate500, 'bold')
  txt(doc, 'Green ≥4  ·  Yellow 3–3.9  ·  Red <3  ·  Grey = Don\'t Know', PW - MR, y, 6.5, C.slate500, 'normal', { align: 'right' })
  y += 7

  if (questions?.length && dim.qAvgs) {
    questions.forEach((q, qi) => {
      if (y > CONTENT_BOT - 10) return
      const qData  = dim.qAvgs[qi]
      const avg    = typeof qData === 'object' ? qData.avg    : qData
      const dkRate = typeof qData === 'object' ? qData.dkRate : 0

      let qc
      if (avg === null)  qc = C.slate300
      else if (avg >= 4) qc = C.green
      else if (avg >= 3) qc = C.amber
      else               qc = C.red

      // Row background
      if (qi % 2 === 0) { rbox(doc, ML, y, CW, 9, C.slate50, 0) }

      // Q chip
      rbox(doc, ML + 1, y + 1, 10, 7, qc, 2)
      txt(doc, `Q${qi + 1}`, ML + 6, y + 6.3, 6, C.white, 'bold', { align: 'center' })

      // Question text — truncated to fit
      doc.setFontSize(8); doc.setFont('helvetica', 'normal')
      const qLines = doc.splitTextToSize(q.text, CW - 44)
      st(doc, C.slate700); doc.text(qLines[0] + (qLines.length > 1 ? '…' : ''), ML + 14, y + 6.3)

      // DK badge
      if (dkRate >= 30) {
        rbox(doc, PW - MR - 26, y + 1.5, 24, 6, C.slate100, 2)
        txt(doc, `${dkRate}% DK`, PW - MR - 14, y + 6, 6, C.slate500, 'bold', { align: 'center' })
      }

      // Score chip
      rbox(doc, PW - MR - (dkRate >= 30 ? 52 : 26), y + 1, 22, 7, qc, 2)
      txt(doc, avg !== null ? avg.toFixed(1) : '—',
        PW - MR - (dkRate >= 30 ? 41 : 15), y + 6.3,
        7.5, C.white, 'bold', { align: 'center' })

      y += 10
    })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE — RADAR CHART
// ─────────────────────────────────────────────────────────────────────────────
async function drawRadarPage(doc, engagement, composite, radarRef, pageNum) {
  if (!radarRef?.current) return false
  try {
    let y = newPage(doc, 'Composite Readiness Profile', engagement.company, pageNum)
    txt(doc, 'Aggregate Score Across All 5 Dimensions (0–100 scale)', ML, y, 9, C.slate700, 'normal')
    y += 8

    const canvas = await html2canvas(radarRef.current, { scale: 2, backgroundColor: '#ffffff', logging: false })
    const imgData = canvas.toDataURL('image/png')
    const imgW = 148, imgH = (canvas.height / canvas.width) * imgW
    doc.addImage(imgData, 'PNG', (PW - imgW) / 2, y, imgW, imgH)

    let ly = y + imgH + 6
    txt(doc, 'DIMENSION REFERENCE', ML, ly, 6.5, C.slate500, 'bold'); ly += 6
    composite.dimensions.forEach(d => {
      const dc = DIM_COLORS[d.dimId]
      sf(doc, dc); doc.circle(ML + 3.5, ly - 1, 2.5, 'F')
      txt(doc, `${DIM_NAMES[d.dimId]}`, ML + 9, ly, 8, C.navy, 'bold')
      txt(doc, `${d.avg}/100  —  ${matLabel(d.avg)}`, ML + 60, ly, 8, matColor(d.avg), 'bold')
      ly += 6
    })
    return true
  } catch (_) { return false }
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGES — RECOMMENDATIONS
// ─────────────────────────────────────────────────────────────────────────────
function drawRecommendationsPages(doc, engagement, composite, pageNum) {
  let y = newPage(doc, 'Composite Action Plan', engagement.company, pageNum)
  const { company } = engagement
  const recommendations = generateRecommendations(composite.asDimScores, company)

  txt(doc, 'Prioritized Recommendations', ML, y, 13, C.navy, 'bold'); y += 7
  txt(doc, `Based on aggregate scores across ${composite.sessionCount} respondents  ·  Ordered by readiness gap`, ML, y, 8, C.slate500); y += 12

  const priorityColors = {
    Critical: C.red, High: [234, 88, 12], Medium: C.amber, Sustain: C.green,
  }

  const PHASE_COL_W = (CW - 20) / 3

  recommendations.forEach((rec, idx) => {
    const dc       = DIM_COLORS[rec.dimensionId]
    const pc       = priorityColors[rec.priority] || C.slate500
    const isSustain = rec.priority === 'Sustain'

    // Pre-calculate all text heights
    doc.setFontSize(9.5); doc.setFont('helvetica', 'bold')
    const titleLines = doc.splitTextToSize(rec.title || '', CW - 46)
    doc.setFontSize(8); doc.setFont('helvetica', 'normal')
    const descLines = doc.splitTextToSize(rec.description || '', CW - 16).slice(0, 4)
    const actionLinesCounts = (rec.actions || []).slice(0, 4).map(a =>
      doc.splitTextToSize(a, CW - 26).length
    )
    const actionsH = actionLinesCounts.reduce((a, n) => a + n * 4.5 + 2, 0)

    let phasesH = 0
    if (!isSustain && rec.phases?.length) {
      const maxPL = Math.max(...rec.phases.map(ph =>
        ph.actions.reduce((a, pa) => a + doc.splitTextToSize(pa, PHASE_COL_W - 10).length, 0)
      ))
      phasesH = 24 + maxPL * 4.5 + 8
    }

    const cardH = 14                         // top padding + dim label row
      + titleLines.length * 5.5 + 4          // title
      + descLines.length * 4.8 + 6           // description
      + (rec.actions?.length ? 8 + actionsH : 0)
      + (phasesH > 0 ? phasesH + 8 : 0)
      + 8                                    // bottom padding

    // Page break if needed
    if (y + cardH > CONTENT_BOT) {
      pageNum++
      y = newPage(doc, 'Composite Action Plan (cont.)', company, pageNum)
    }

    // Card
    cardBase(doc, ML, y, CW, cardH, dc)

    let cy = y + 8

    // Dim label row
    txt(doc, `${DIM_NAMES[rec.dimensionId]}  ·  Score: ${rec.score}/100`, ML + 9, cy, 7.5, dc, 'bold')
    rbox(doc, PW - MR - 34, y + 5, 32, 9, pc, 3)
    txt(doc, `${idx === 0 ? '↑↑ ' : ''}${rec.priority}`, PW - MR - 18, y + 11.3, 7.5, C.white, 'bold', { align: 'center' })
    cy += 7

    // Title
    st(doc, C.navy); doc.setFontSize(9.5); doc.setFont('helvetica', 'bold')
    doc.text(titleLines, ML + 9, cy)
    cy += titleLines.length * 5.5 + 4

    // Description
    st(doc, C.slate700); doc.setFontSize(8); doc.setFont('helvetica', 'normal')
    doc.text(descLines, ML + 9, cy)
    cy += descLines.length * 4.8 + 6

    // Key actions
    if (rec.actions?.length) {
      txt(doc, 'Key Actions:', ML + 9, cy, 8, C.navy, 'bold'); cy += 6
      rec.actions.slice(0, 4).forEach(action => {
        doc.setFontSize(8); doc.setFont('helvetica', 'normal')
        const aLines = doc.splitTextToSize(action, CW - 26)
        sf(doc, dc); doc.circle(ML + 13, cy - 1.5, 1.8, 'F')
        st(doc, C.slate700); doc.text(aLines, ML + 18, cy)
        cy += aLines.length * 4.5 + 2
      })
    }

    // 30/60/90 phases
    if (!isSustain && rec.phases?.length) {
      cy += 4
      sd(doc, C.slate300); doc.setLineWidth(0.3); doc.line(ML + 9, cy, PW - MR, cy); cy += 5
      txt(doc, '30 / 60 / 90-DAY ACTION PLAN', ML + 9, cy, 7, C.slate500, 'bold'); cy += 6

      const maxPL = Math.max(...rec.phases.map(ph =>
        ph.actions.reduce((a, pa) => a + doc.splitTextToSize(pa, PHASE_COL_W - 10).length, 0)
      ))
      const phH = 20 + maxPL * 4.5 + 6

      rec.phases.forEach((phase, pi) => {
        const px = ML + 9 + pi * (PHASE_COL_W + 4)
        rbox(doc, px, cy, PHASE_COL_W, phH, C.slate50, 2)
        sf(doc, dc); doc.roundedRect(px, cy, 3, phH, 2, 0, 'F')
        txt(doc, phase.label, px + 6, cy + 7, 7, dc, 'bold')
        txt(doc, phase.theme, px + 6, cy + 13, 7.5, C.navy, 'bold')
        let phActY = cy + 20
        phase.actions.forEach(a => {
          doc.setFontSize(7); doc.setFont('helvetica', 'normal')
          const aLines = doc.splitTextToSize(a, PHASE_COL_W - 10)
          sf(doc, dc); doc.circle(px + 7, phActY - 1, 1, 'F')
          st(doc, C.slate700); doc.text(aLines, px + 10, phActY)
          phActY += aLines.length * 4 + 2
        })
      })
    }

    y += cardH + 7
  })

  return pageNum
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE — RESPONDENT SUMMARY
// ─────────────────────────────────────────────────────────────────────────────
function drawRespondentPage(doc, engagement, composite, pageNum) {
  let y = newPage(doc, 'Respondent Summary', engagement.company, pageNum)
  const { sessions } = engagement

  y = sectionHeader(doc, 'All Respondents', 'Individual scores by respondent and dimension', y)

  // Column layout — wider, more readable
  const COL = {
    name:    { x: ML,       w: 42 },
    role:    { x: ML + 44,  w: 36 },
    grp:     { x: ML + 82,  w: 20 },
    overall: { x: ML + 104, w: 16 },
    d1:      { x: ML + 122, w: 14 },
    d2:      { x: ML + 138, w: 14 },
    d3:      { x: ML + 154, w: 14 },
    d4:      { x: ML + 170, w: 14 },  // fits to 184
  }
  // 5 dims don't all fit — use 4 + overflow label for d5
  const dimCols = [
    { id: 1, col: COL.d1, label: 'Strat'  },
    { id: 2, col: COL.d2, label: 'Data'   },
    { id: 3, col: COL.d3, label: 'Gov'    },
    { id: 4, col: COL.d4, label: 'Talent' },
  ]

  // Header row
  rbox(doc, ML, y, CW, 9, [235, 241, 250], 0)
  txt(doc, 'NAME',    COL.name.x    + 2, y + 6.5, 6.5, C.slate500, 'bold')
  txt(doc, 'TITLE',   COL.role.x    + 2, y + 6.5, 6.5, C.slate500, 'bold')
  txt(doc, 'GROUP',   COL.grp.x     + 2, y + 6.5, 6.5, C.slate500, 'bold')
  txt(doc, 'SCORE',   COL.overall.x + 2, y + 6.5, 6.5, C.slate500, 'bold')
  dimCols.forEach(dc2 => txt(doc, dc2.label, dc2.col.x + 2, y + 6.5, 6.5, C.slate500, 'bold'))
  txt(doc, 'Ops', COL.d4.x + COL.d4.w + 2, y + 6.5, 6.5, C.slate500, 'bold')
  y += 9

  const rowH = 10
  sessions.forEach((s, i) => {
    if (y > CONTENT_BOT - 12) return
    if (!s) return

    const roleGroup = s.roleGroup || 'practitioner'
    const rs  = ROLE_STYLE[roleGroup] || ROLE_STYLE.practitioner
    const mc2 = matColor(s.overallScore || 0)
    const ds  = s.dimScores || {}

    if (i % 2 === 0) rbox(doc, ML, y, CW, rowH, C.slate50, 0)
    sd(doc, C.slate300); doc.setLineWidth(0.2); doc.line(ML, y + rowH, ML + CW, y + rowH)

    // Name
    const name = (s.respondentName || '').length > 18 ? s.respondentName.slice(0, 17) + '…' : (s.respondentName || '')
    txt(doc, name, COL.name.x + 2, y + 7, 8, C.navy, 'bold')

    // Role
    const role = (s.respondentRole || '').length > 19 ? s.respondentRole.slice(0, 18) + '…' : (s.respondentRole || '')
    txt(doc, role, COL.role.x + 2, y + 7, 7.5, C.slate700, 'normal')

    // Group chip
    rbox(doc, COL.grp.x + 1, y + 2, 18, 6, rs.bg, 2)
    txt(doc, rs.label.slice(0, 4), COL.grp.x + 10, y + 6.8, 5.5, rs.fg, 'bold', { align: 'center' })

    // Overall
    txt(doc, `${s.overallScore || 0}`, COL.overall.x + 4, y + 7, 9, mc2, 'bold')

    // Dim scores
    dimCols.forEach(dc2 => {
      const score = ds[dc2.id]
      txt(doc, score != null ? `${score}` : '—', dc2.col.x + 4, y + 7, 8, score != null ? matColor(score) : C.slate300, score != null ? 'bold' : 'normal')
    })
    // d5 in overflow slot
    const d5 = ds[5]
    txt(doc, d5 != null ? `${d5}` : '—', COL.d4.x + COL.d4.w + 4, y + 7, 8, d5 != null ? matColor(d5) : C.slate300, d5 != null ? 'bold' : 'normal')

    y += rowH
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE — CONFIDENCE DISTRIBUTION (conditional)
// ─────────────────────────────────────────────────────────────────────────────
function drawConfidencePage(doc, engagement, composite, pageNum) {
  const hasSome = composite.dimensions.some(d =>
    ((d.confidenceCounts?.high || 0) + (d.confidenceCounts?.medium || 0) + (d.confidenceCounts?.low || 0)) > 0
  )
  if (!hasSome) return false

  let y = newPage(doc, 'Consultant Confidence', engagement.company, pageNum)
  y = sectionHeader(doc, 'Consultant Confidence Distribution',
    'How confident consultants were in each dimension\'s scores. Low confidence = transcript validation recommended.', y)

  const CONF = {
    high:   { label: 'High',    color: C.green },
    medium: { label: 'Medium',  color: C.amber },
    low:    { label: 'Low',     color: C.red   },
    null:   { label: 'Not set', color: C.slate300 },
  }

  composite.dimensions.forEach(d => {
    if (y > CONTENT_BOT - 18) return
    const total  = composite.sessionCount
    const counts = d.confidenceCounts || {}
    const dc     = DIM_COLORS[d.dimId]

    txt(doc, DIM_NAMES[d.dimId], ML, y + 6, 9, C.navy, 'bold')

    // Stacked bar
    const barX = ML + 52, barW = 80, barH = 9
    rbox(doc, barX, y, barW, barH, C.slate100, barH / 2)
    let bx = barX
    ;['high', 'medium', 'low', 'null'].forEach(level => {
      const n = counts[level] || 0
      if (!n) return
      const sw = (n / total) * barW
      sf(doc, CONF[level].color); doc.roundedRect(bx, y, sw, barH, 0, 0, 'F')
      bx += sw
    })

    // Legend chips
    let chipX = barX + barW + 6
    ;['high', 'medium', 'low'].forEach(level => {
      const n = counts[level] || 0
      if (!n) return
      const lbl = `${CONF[level].label}: ${n}`
      const cw  = doc.getTextWidth(lbl) + 8
      rbox(doc, chipX, y + 1, cw, 7, CONF[level].color, 2)
      txt(doc, lbl, chipX + cw / 2, y + 6.3, 6.5, C.white, 'bold', { align: 'center' })
      chipX += cw + 3
    })

    y += 16
  })

  return true
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE — CONSULTANT OBSERVATIONS (conditional)
// ─────────────────────────────────────────────────────────────────────────────
function drawNotesPage(doc, engagement, composite, pageNum) {
  const withNotes = engagement.sessions.filter(s =>
    s.notes && Object.values(s.notes).some(n => n?.trim())
  )
  if (!withNotes.length) return false

  let y = newPage(doc, 'Consultant Observations', engagement.company, pageNum)
  y = sectionHeader(doc, 'Consultant Observations',
    'Notes captured during each interview. Supports transcript validation and qualitative interpretation.', y)

  withNotes.forEach(s => {
    if (y > CONTENT_BOT - 24) return
    const roleGroup = s.roleGroup || 'practitioner'
    const rs        = ROLE_STYLE[roleGroup] || ROLE_STYLE.practitioner
    const dimNotes  = Object.entries(s.notes || {}).filter(([, n]) => n?.trim())

    // Respondent header row
    rboxS(doc, ML, y, CW, 11, [248, 250, 252], C.slate300, 3)
    txt(doc, s.respondentName || '', ML + 5, y + 8, 9, C.navy, 'bold')
    const nameW = doc.getTextWidth(s.respondentName || '')
    txt(doc, s.respondentRole || '', ML + 7 + nameW, y + 8, 8, C.slate500, 'normal')
    rbox(doc, PW - MR - 30, y + 2, 28, 7, rs.bg, 3)
    txt(doc, rs.label, PW - MR - 16, y + 7.3, 6.5, rs.fg, 'bold', { align: 'center' })
    y += 14

    dimNotes.forEach(([dimId, note]) => {
      if (y > CONTENT_BOT - 12) return
      const dim  = dimensions.find(d => d.id === parseInt(dimId))
      const dc   = DIM_COLORS[parseInt(dimId)] || C.slate500
      const maxNoteW = CW - 48

      doc.setFontSize(8); doc.setFont('helvetica', 'normal')
      const noteLines = doc.splitTextToSize(note, maxNoteW).slice(0, 3)
      const rowH = noteLines.length * 4.8 + 6

      txt(doc, dim?.shortName || `Dim ${dimId}`, ML + 2, y + 5, 7.5, dc, 'bold')
      st(doc, C.slate700); doc.text(noteLines, ML + 44, y + 5)
      sd(doc, C.slate100); doc.setLineWidth(0.2); doc.line(ML + 2, y + rowH, ML + CW - 2, y + rowH)
      y += rowH + 2
    })
    y += 6
  })

  return true
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT ORCHESTRATOR
// ─────────────────────────────────────────────────────────────────────────────
async function generateCompositePDF(engagement, radarRef) {
  const composite = computeComposite(engagement.sessions)
  if (!composite) throw new Error('No sessions to aggregate')

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  doc.setFont('helvetica')
  let p = 1

  drawCover(doc, engagement, composite, p)

  p++; drawExecutiveSummaryPage(doc, engagement, composite, p)

  const hasInsights = (composite.perceptionGapDimensions?.length || 0) +
                      (composite.lowVisibilityDimensions?.length  || 0) > 0
  if (hasInsights) { p++; drawInsightsPage(doc, engagement, composite, p) }

  composite.dimensions.forEach(dim => {
    p++
    const dimDef   = dimensions.find(d => d.id === dim.dimId)
    drawDimensionDetailPage(doc, engagement, composite, dim, dimDef?.questions || [], p)
  })

  const radarDone = await drawRadarPage(doc, engagement, composite, radarRef, p + 1)
  if (radarDone) p++

  p++; p = drawRecommendationsPages(doc, engagement, composite, p)

  p++; drawRespondentPage(doc, engagement, composite, p)

  p++; if (!drawConfidencePage(doc, engagement, composite, p)) p--

  p++; if (!drawNotesPage(doc, engagement, composite, p)) p--

  const company = engagement.company?.name || 'Assessment'
  const date    = new Date().toISOString().slice(0, 10)
  doc.save(`${company.replace(/\s+/g, '-')}-AI-Readiness-Composite-${date}.pdf`)
}

// ─────────────────────────────────────────────────────────────────────────────
// BUTTON COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
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

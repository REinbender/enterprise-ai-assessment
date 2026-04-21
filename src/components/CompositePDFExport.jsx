import { useState } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { computeComposite, ROLE_GROUP_META } from '../data/engagement'
import { generateRecommendations } from '../data/recommendations'
import { DIM_COLORS_RGB, matColorRGB } from '../constants/colors'
import { HTML2CANVAS_SCALE } from '../constants/thresholds'

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const PW = 210, PH = 297
const ML = 14, MR = 14
const HEADER_H  = 18   // blue bar height
const FOOTER_H  = 10
const PAGE_CONTENT_H = PH - HEADER_H - FOOTER_H  // 269mm usable per content page
const CONTENT_W = PW - ML - MR                    // 182mm

const C = {
  primary:  [46,  163, 242],
  primaryDk:[26,  140, 216],
  navy:     [12,  32,  70],
  navyMid:  [18,  48,  100],   // slightly lighter navy for alternating rows
  orange:   [243, 112,  33],   // Logic2020 brand orange
  slate700: [71,  85,  105],
  slate500: [100, 116, 139],
  slate300: [203, 213, 225],
  slate100: [241, 245, 249],
  white:    [255, 255, 255],
  green:    [22,  163,  74],
  amber:    [217, 119,   6],
  red:      [220,  38,  38],
}

// DIM_COLORS_RGB imported from constants/colors — canonical source for all PDF files
const DIM_COLORS = DIM_COLORS_RGB

const DIM_NAMES = {
  1: 'AI Strategy',
  2: 'Data & Infrastructure',
  3: 'Governance & Ethics',
  4: 'Talent & Culture',
  5: 'AI Operations',
}

// matColorRGB imported from constants/colors — null-safe, canonical for all PDF files
const matColor = matColorRGB
function matLabel(score) {
  if (score < 20) return 'Beginning'
  if (score < 40) return 'Developing'
  if (score < 60) return 'Maturing'
  if (score < 80) return 'Advanced'
  return 'Leading'
}

const sf = (d, c) => d.setFillColor(c[0], c[1], c[2])
const sd = (d, c) => d.setDrawColor(c[0], c[1], c[2])
const st = (d, c) => d.setTextColor(c[0], c[1], c[2])
function rbox(doc, x, y, w, h, fill, r = 3) {
  sf(doc, fill); doc.roundedRect(x, y, w, h, r, r, 'F')
}
function txt(doc, text, x, y, size, color, style = 'normal', opts = {}) {
  doc.setFontSize(size); doc.setFont('helvetica', style); st(doc, color)
  doc.text(String(text ?? ''), x, y, opts)
}
function pbar(doc, x, y, w, h, pct, fill) {
  sf(doc, C.slate100); doc.roundedRect(x, y, w, h, h / 2, h / 2, 'F')
  if (pct > 0) { sf(doc, fill); doc.roundedRect(x, y, Math.max(w * (pct / 100), h), h, h / 2, h / 2, 'F') }
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED HEADER / FOOTER
// ─────────────────────────────────────────────────────────────────────────────
function pageHeader(doc, title, pageNum) {
  rbox(doc, 0, 0, PW, HEADER_H, C.navy, 0)
  // Logic2020 orange accent stripe along the bottom of the header
  rbox(doc, 0, HEADER_H - 1.5, PW, 1.5, C.orange, 0)
  // Primary-blue logo mark
  rbox(doc, ML, 4, 10, 10, C.primary, 2)
  txt(doc, 'AI', ML + 2, 11, 6, C.white, 'bold')
  txt(doc, title, ML + 14, 12, 9.5, C.white, 'bold')
  txt(doc, `Page ${pageNum}`, PW - MR, 12, 7.5, [160, 205, 240], 'normal', { align: 'right' })
}

function pageFooter(doc, companyName, date) {
  const y = PH - 4
  txt(doc, 'CONFIDENTIAL', ML, y, 6, C.slate500)
  const center = companyName
    ? `${companyName}  ·  Logic2020  ·  logic2020.com`
    : 'Logic2020  ·  logic2020.com'
  txt(doc, center, PW / 2, y, 6, C.slate500, 'normal', { align: 'center' })
  txt(doc, date, PW - MR, y, 6, C.slate500, 'normal', { align: 'right' })
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 1 — COVER (pure jsPDF — designed to look polished)
// ─────────────────────────────────────────────────────────────────────────────
function drawCover(doc, engagement, composite) {
  const { company } = engagement
  const mc   = matColor(composite.overallAvg)
  const ml   = matLabel(composite.overallAvg)
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const rc   = composite.roleCounts

  const SAFE_BOTTOM = PH - FOOTER_H - 8

  // ── Full-page navy background ─────────────────────────────
  rbox(doc, 0, 0, PW, PH, C.navy, 0)

  // Decorative circles — clip to page bounds first so nothing bleeds past edges
  doc.saveGraphicsState()
  // Write a PDF clipping rectangle in points (jsPDF scaleFactor converts mm→pt)
  const _sf = doc.internal.scaleFactor
  doc.internal.write(
    `0 0 ${(PW * _sf).toFixed(3)} ${(PH * _sf).toFixed(3)} re W n`
  )
  doc.setGState(doc.GState({ opacity: 0.06 }))
  sf(doc, C.white)
  doc.circle(PW - 45, 15,      55, 'F')   // top-right glow
  doc.circle(PW - 35, 145,     45, 'F')   // mid-right glow
  doc.circle(45,      PH - 45, 55, 'F')   // bottom-left glow
  doc.setGState(doc.GState({ opacity: 1 }))
  doc.restoreGraphicsState()

  // Logic2020 orange accent bar at very top (matches page headers)
  rbox(doc, 0, 0, PW, 2, C.orange, 0)

  // ── Branding bar ──────────────────────────────────────────
  rbox(doc, ML, 10, 9, 9, C.primary, 2)
  txt(doc, 'L', ML + 2.5, 17, 7, C.white, 'bold')
  txt(doc, 'LOGIC2020', ML + 13, 17, 8.5, C.white, 'bold')
  sd(doc, [80, 130, 180]); doc.setLineWidth(0.3)
  doc.line(ML + 47, 11, ML + 47, 18)
  txt(doc, 'Enterprise Transformation Consulting', ML + 51, 17, 6.5, [140, 185, 225])

  // Horizontal rule below branding
  sd(doc, [30, 60, 110]); doc.setLineWidth(0.4)
  doc.line(ML, 23, PW - MR, 23)

  // ── Eyebrow ───────────────────────────────────────────────
  txt(doc, 'CONFIDENTIAL  ·  COMPOSITE ASSESSMENT REPORT', ML, 33, 6.5, [120, 170, 215], 'bold')

  // ── Title ─────────────────────────────────────────────────
  txt(doc, 'Composite AI', ML, 57, 26, C.white, 'bold')
  txt(doc, 'Readiness Report', ML, 78, 26, C.white, 'bold')

  // Company name + context
  txt(doc, (company.name || 'Organization').toUpperCase(), ML, 96, 9.5, C.primary, 'bold')
  if (company.industry || company.size) {
    txt(doc, [company.industry, company.size].filter(Boolean).join('  ·  '), ML, 105, 7.5, [140, 185, 225])
  }

  // ── Respondent badges ─────────────────────────────────────
  const ROLE_BADGE_COLORS = {
    executive:    C.primary,
    management:   [34, 197, 94],
    practitioner: [168, 85, 247],
  }
  const ROLE_LABELS = { executive: 'Executive', management: 'Management', practitioner: 'Practitioner' }
  const roleEntries  = Object.entries(rc).filter(([, count]) => count > 0)

  txt(doc, `${composite.sessionCount} Total Respondents`, ML, 116, 10, C.white, 'bold')
  let bx = ML
  roleEntries.forEach(([group, count]) => {
    const bc    = ROLE_BADGE_COLORS[group] || C.slate500
    const label = `${count}  ${ROLE_LABELS[group]}`
    doc.setFontSize(7); doc.setFont('helvetica', 'bold')
    const lw = doc.getTextWidth(label) + 8
    sf(doc, bc); doc.roundedRect(bx, 120, lw, 8, 2, 2, 'F')
    txt(doc, label, bx + lw / 2, 125.5, 7, C.white, 'bold', { align: 'center' })
    bx += lw + 4
  })

  // ── Score tile (right column) ─────────────────────────────
  const TX = 148, TY = 28, TW = 54, TH = 114, TR = 5  // TR = corner radius
  // Tile background
  rbox(doc, TX, TY, TW, TH, C.navyMid, TR)
  // Blue top accent bar — rounded on top only, flush on bottom
  rbox(doc, TX, TY, TW, 3, C.primary, TR)
  sf(doc, C.primary); doc.rect(TX, TY + TR - 1, TW, 3 - TR + 1 + 1, 'F')  // fill square bottom half

  // Orange left accent bar — inset by corner radius (TR) so it doesn't poke
  // outside the rounded rect corners
  sf(doc, C.orange); doc.rect(TX, TY + TR, 3, TH - TR * 2, 'F')

  // Border drawn last so it sits on top of accents
  sd(doc, [50, 90, 140]); doc.setLineWidth(0.4); doc.roundedRect(TX, TY, TW, TH, TR, TR, 'S')

  txt(doc, 'AI READINESS',     TX + TW / 2, TY + 13, 5.5, [160, 205, 240], 'bold',   { align: 'center' })
  txt(doc, 'SCORE OUT OF 100', TX + TW / 2, TY + 20, 5,   [160, 205, 240], 'normal', { align: 'center' })

  sd(doc, [50, 90, 140]); doc.setLineWidth(0.3)
  doc.line(TX + 8, TY + 23, TX + TW - 8, TY + 23)

  // Score number
  txt(doc, `${composite.overallAvg}`, TX + TW / 2, TY + 54, 38, C.white, 'bold', { align: 'center' })

  doc.line(TX + 12, TY + 58, TX + TW - 12, TY + 58)

  // Maturity pill — taller to fit larger text
  sf(doc, mc); doc.roundedRect(TX + 6, TY + 63, TW - 12, 16, 3, 3, 'F')
  txt(doc, ml.toUpperCase(), TX + TW / 2, TY + 74, 10, C.white, 'bold', { align: 'center' })

  // Role breakdown
  const tileRcParts = roleEntries.map(([g, n]) => `${n} ${ROLE_LABELS[g]}`).join(' · ')
  txt(doc, tileRcParts,                   TX + TW / 2, TY + 89,  5.5, [140, 185, 225], 'normal', { align: 'center' })
  txt(doc, `${composite.sessionCount} respondents total`, TX + TW / 2, TY + 97, 5.5, [180, 215, 245], 'bold', { align: 'center' })

  // Date
  txt(doc, date, TX + TW / 2, TY + 107, 5.5, [120, 170, 215], 'normal', { align: 'center' })

  // ── Divider before dimension scores ───────────────────────
  let py = 140
  sd(doc, [30, 60, 110]); doc.setLineWidth(0.4)
  doc.line(ML, py, PW - MR, py); py += 8

  // Key flags
  const gapDims   = composite.perceptionGapDimensions || []
  const gapCount  = gapDims.length
  const lvCount   = composite.lowVisibilityDimensions?.length || 0
  if (gapCount > 0 || lvCount > 0) {
    const flags = []
    if (gapCount > 0) {
      const criticalN   = gapDims.filter(d => d.gapSeverity?.level === 'critical').length
      const severeN     = gapDims.filter(d => d.gapSeverity?.level === 'severe').length
      const concerningN = gapDims.filter(d => d.gapSeverity?.level === 'concerning').length
      const parts = []
      if (criticalN   > 0) parts.push(`${criticalN} critical`)
      if (severeN     > 0) parts.push(`${severeN} severe`)
      if (concerningN > 0) parts.push(`${concerningN} concerning`)
      const sev = parts.length ? ` (${parts.join(', ')})` : ''
      flags.push(`${gapCount} perception gap${gapCount > 1 ? 's' : ''} detected${sev}`)
    }
    if (lvCount > 0) flags.push(`${lvCount} low-visibility dimension${lvCount > 1 ? 's' : ''}`)
    rbox(doc, ML, py, CONTENT_W, 10, [60, 25, 10], 3)
    sf(doc, C.orange); doc.rect(ML + 3, py + 3.5, 3, 3, 'F')
    txt(doc, `Key Flags: ${flags.join('  ·  ')}`, ML + 10, py + 7.5, 7, [255, 180, 120], 'bold')
    py += 14
  }

  // Dimension scores
  txt(doc, 'DIMENSION SCORES AT A GLANCE', ML, py, 7, [120, 170, 215], 'bold'); py += 6

  composite.dimensions.forEach((d, i) => {
    if (py + 9 > SAFE_BOTTOM) return
    const dc = DIM_COLORS[d.dimId]
    // Alternating subtle row tint
    if (i % 2 === 0) { sf(doc, C.navyMid); doc.rect(ML, py, CONTENT_W, 9, 'F') }
    sf(doc, dc); doc.circle(ML + 5, py + 4.5, 2.5, 'F')
    txt(doc, DIM_NAMES[d.dimId], ML + 10, py + 6.3, 8.5, C.white, 'bold')
    pbar(doc, ML + 70, py + 2.5, CONTENT_W - 85, 4.5, d.avg, dc)
    txt(doc, `${d.avg}`, PW - MR - 2, py + 6.3, 9.5, dc, 'bold', { align: 'right' })
    py += 9
  })

  // Assessment date
  py += 5
  if (py < SAFE_BOTTOM) txt(doc, `Assessment Date: ${date}`, ML, py, 7, [100, 150, 200])

  // Footer — override text colors for dark background
  const fy = PH - 4
  txt(doc, 'CONFIDENTIAL', ML, fy, 6, [100, 150, 200])
  const center = company.name
    ? `${company.name}  ·  Logic2020  ·  logic2020.com`
    : 'Logic2020  ·  logic2020.com'
  txt(doc, center, PW / 2, fy, 6, [100, 150, 200], 'normal', { align: 'center' })
  txt(doc, date, PW - MR, fy, 6, [100, 150, 200], 'normal', { align: 'right' })
}

// ─────────────────────────────────────────────────────────────────────────────
// SMART SLICE — find the nearest whitespace row to avoid cutting mid-element
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// DOM-BASED NO-CUT ZONE BUILDER
// Call this BEFORE html2canvas so we have real pixel positions.
// Returns array of {top, bottom} in canvas-pixel coordinates (scale=1.5).
// ─────────────────────────────────────────────────────────────────────────────
const NO_CUT_SELECTORS = [
  '.dim-scores-grid',
  '.card',
  '.rec-card',
  '.perception-gap-section',
  '.low-visibility-section',
  '.sandbox-section',
  '.sandbox-test-card',
  '.heatmap-dim-block',
  '.roadmap-phase',
  '.composite-notes-respondent',
  '.phases-timeline',
]

function buildNoCutZones(containerEl, scale) {
  const cr   = containerEl.getBoundingClientRect()
  const zones = []
  NO_CUT_SELECTORS.forEach(sel => {
    containerEl.querySelectorAll(sel).forEach(node => {
      const r      = node.getBoundingClientRect()
      const topPx  = (r.top    - cr.top) * scale
      const botPx  = (r.bottom - cr.top) * scale
      if (botPx > 0) zones.push({ top: topPx, bottom: botPx })
    })
  })
  return zones
}

// Given a proposed cut y (canvas px), slide it to avoid slicing a protected block.
function safeCutY(proposedY, noCutZones, sliceStartPx, pageHpx, canvasHeight) {
  if (proposedY >= canvasHeight) return canvasHeight
  const MARGIN = 6  // px padding around zone edges

  const zone = noCutZones.find(
    z => proposedY > z.top + MARGIN && proposedY < z.bottom - MARGIN
  )
  if (!zone) return proposedY

  // Prefer cutting just before the zone starts
  const cutBefore = zone.top - MARGIN
  if (cutBefore > sliceStartPx + pageHpx * 0.25) return cutBefore

  // If cutting before would leave too little content, cut after instead
  return Math.min(zone.bottom + MARGIN, canvasHeight)
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT PAGES — html2canvas screenshot of the live web page content
// ─────────────────────────────────────────────────────────────────────────────
async function drawContentPages(doc, contentRef, companyName, date, startPage) {
  if (!contentRef?.current) return { pageNum: startPage, captureError: null }

  const el    = contentRef.current
  const SCALE = HTML2CANVAS_SCALE

  // Measure the full rendered height of the content element before capture
  const fullH = el.scrollHeight
  const fullW = el.scrollWidth

  // Collect no-cut zones from DOM BEFORE hiding anything (positions are stable here)
  const noCutZones = buildNoCutZones(el, SCALE)

  // Hide elements that should not appear in the PDF
  const actionsEl   = el.querySelector('.results-actions')
  const topbarEl    = document.querySelector('.topbar')
  if (actionsEl)  actionsEl.style.display  = 'none'
  if (topbarEl)   topbarEl.style.visibility = 'hidden'

  let canvas
  let captureError = null
  try {
    canvas = await html2canvas(el, {
      scale: SCALE,
      backgroundColor: '#f8fafc',
      logging: false,
      useCORS: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      width:  fullW,
      height: fullH,
      windowWidth:  fullW,
      windowHeight: fullH,
    })
  } catch (e) {
    console.error('html2canvas capture failed:', e)
    captureError = e?.message || String(e)
  } finally {
    if (actionsEl)  actionsEl.style.display    = ''
    if (topbarEl)   topbarEl.style.visibility  = ''
  }

  // If capture failed, add a placeholder page and return early
  if (!canvas) {
    doc.addPage()
    pageHeader(doc, 'Composite AI Readiness Report', startPage)
    pageFooter(doc, companyName, date)
    const midY = PH / 2
    txt(doc, 'Content pages could not be rendered', PW / 2, midY - 6, 11, C.slate500, 'bold', { align: 'center' })
    txt(doc, 'Try exporting in Chrome at 100% browser zoom, or on a device with more available memory.', PW / 2, midY + 2, 7.5, C.slate500, 'normal', { align: 'center' })
    return { pageNum: startPage + 1, captureError }
  }

  const mmPerPx = CONTENT_W / canvas.width
  const pageHpx = PAGE_CONTENT_H / mmPerPx  // canvas px that fit on one content page

  let sliceStartPx = 0
  let pageNum      = startPage

  while (sliceStartPx < canvas.height) {
    doc.addPage()
    pageHeader(doc, 'Composite AI Readiness Report', pageNum)

    const idealEndPx = sliceStartPx + pageHpx

    let sliceEndPx
    if (idealEndPx >= canvas.height) {
      sliceEndPx = canvas.height
    } else {
      // Use DOM positions to avoid cutting through protected blocks
      sliceEndPx = safeCutY(Math.round(idealEndPx), noCutZones, sliceStartPx, pageHpx, canvas.height)
      // Guarantee minimum advance of 30% of a page to prevent infinite loops
      const minEnd = sliceStartPx + Math.round(pageHpx * 0.3)
      sliceEndPx = Math.max(sliceEndPx, Math.min(minEnd, canvas.height))
      sliceEndPx = Math.min(sliceEndPx, canvas.height)
    }

    const sliceHpx = sliceEndPx - sliceStartPx
    const destH    = sliceHpx * mmPerPx

    // Draw slice
    const slice = document.createElement('canvas')
    slice.width  = canvas.width
    slice.height = Math.ceil(sliceHpx)
    const ctx = slice.getContext('2d')
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, 0, slice.width, slice.height)
    ctx.drawImage(canvas, 0, -Math.round(sliceStartPx))

    doc.addImage(slice.toDataURL('image/jpeg', 0.92), 'JPEG', ML, HEADER_H + 1, CONTENT_W, destH)
    pageFooter(doc, companyName, date)

    sliceStartPx = sliceEndPx
    pageNum++
  }

  return { pageNum, captureError }
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTION PLAN PAGE — pure jsPDF, appended after content pages
// ─────────────────────────────────────────────────────────────────────────────
function drawActionPlanPage(doc, engagement, recommendations, pageNum) {
  const { company, actionPlan } = engagement
  if (!actionPlan) return
  const committed = recommendations.filter(r => actionPlan[r.dimensionId]?.committed)
  if (committed.length === 0) return

  doc.addPage()
  const companyName = company?.name || ''
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  pageHeader(doc, 'Committed Action Plan', pageNum)
  pageFooter(doc, companyName, date)

  let y = HEADER_H + 8

  // Section intro
  txt(doc, `${companyName ? companyName + ' — ' : ''}AI Readiness Commitments`, ML, y, 11, C.navy, 'bold')
  y += 6
  txt(doc, `${committed.length} dimension${committed.length !== 1 ? 's' : ''} committed · Generated ${date}`, ML, y, 7.5, C.slate500)
  y += 10

  // Table header
  const colW = [52, 36, 32, CONTENT_W - 52 - 36 - 32]
  const rowH = 7
  rbox(doc, ML, y, CONTENT_W, rowH, C.slate100, 2)
  doc.setFontSize(6); doc.setFont('helvetica', 'bold'); st(doc, C.slate500)
  const headers = ['Dimension / Recommendation', 'Owner', 'Target Date', 'Notes']
  let cx = ML + 3
  headers.forEach((h, i) => { doc.text(h, cx, y + 5); cx += colW[i] })
  y += rowH

  committed.forEach((rec, i) => {
    const plan = actionPlan[rec.dimensionId] || {}
    const dc = DIM_COLORS[rec.dimensionId] || C.slate500

    // Calculate row height based on wrapped text
    const noteText = plan.customNote || '—'
    const noteLines = doc.splitTextToSize(noteText, colW[3] - 4)
    const titleLines = doc.splitTextToSize(rec.title, colW[0] - 4)
    const lineCount = Math.max(titleLines.length + 1, noteLines.length, 2)
    const rh = lineCount * 4.5 + 5

    // Alternating row background
    if (i % 2 === 0) {
      sf(doc, C.white); doc.rect(ML, y, CONTENT_W, rh, 'F')
    } else {
      rbox(doc, ML, y, CONTENT_W, rh, [248, 250, 252], 0)
    }

    // Left accent bar in dimension color
    sf(doc, dc); doc.rect(ML, y, 3, rh, 'F')

    // Dim name + title
    cx = ML + 6
    doc.setFontSize(6); doc.setFont('helvetica', 'bold'); st(doc, dc)
    doc.text(DIM_NAMES[rec.dimensionId] || rec.dimensionName, cx, y + 4.5)
    doc.setFontSize(7); doc.setFont('helvetica', 'normal'); st(doc, C.navy)
    doc.text(titleLines, cx, y + 9)
    cx += colW[0]

    // Owner
    doc.setFontSize(7.5); doc.setFont('helvetica', 'normal')
    st(doc, plan.owner ? C.navy : C.slate500)
    doc.text(doc.splitTextToSize(plan.owner || 'Not assigned', colW[1] - 4)[0], cx, y + 7)
    cx += colW[1]

    // Target date
    st(doc, plan.targetDate ? C.navy : C.slate500)
    doc.text(doc.splitTextToSize(plan.targetDate || 'Not set', colW[2] - 4)[0], cx, y + 7)
    cx += colW[2]

    // Notes
    st(doc, plan.customNote ? C.slate700 : C.slate500)
    doc.text(noteLines, cx, y + 7)

    // Bottom border
    sd(doc, C.slate300); doc.setLineWidth(0.2)
    doc.line(ML, y + rh, ML + CONTENT_W, y + rh)

    y += rh
  })

  // Uncommitted dims note
  if (committed.length < 5) {
    y += 6
    const uncommitted = recommendations
      .filter(r => !actionPlan[r.dimensionId]?.committed)
      .map(r => DIM_NAMES[r.dimensionId] || r.dimensionName)
    rbox(doc, ML, y, CONTENT_W, 14, [255, 251, 235], 3)
    doc.setFontSize(6.5); doc.setFont('helvetica', 'bold'); st(doc, [146, 64, 14])
    doc.text('Dimensions not yet committed:', ML + 4, y + 5.5)
    doc.setFont('helvetica', 'normal')
    doc.text(uncommitted.join('  ·  '), ML + 4, y + 10.5)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
async function generateCompositePDF(engagement, contentRef) {
  const composite = computeComposite(engagement.sessions)
  if (!composite) throw new Error('No sessions to aggregate')

  const doc  = new jsPDF({ unit: 'mm', format: 'a4' })
  doc.setFont('helvetica')

  const companyName = engagement.company?.name || ''
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  const recommendations = generateRecommendations(composite.asDimScores, engagement.company)

  // Page 1: Designed cover
  drawCover(doc, engagement, composite)

  // Pages 2+: Screenshot of the live web content
  const { pageNum: lastPage, captureError } = await drawContentPages(doc, contentRef, companyName, date, 2)

  // Final page: Action Plan (only if any commitments exist)
  if (engagement.actionPlan && Object.values(engagement.actionPlan).some(p => p?.committed)) {
    drawActionPlanPage(doc, engagement, recommendations, lastPage + 1)
  }

  const slug = companyName.replace(/\s+/g, '-') || 'Assessment'
  const dateSlug = new Date().toISOString().slice(0, 10)
  doc.save(`${slug}-AI-Readiness-Composite-${dateSlug}.pdf`)

  // Return capture error (if any) so the button component can surface a warning
  return captureError ? { warning: `Content pages rendered with errors — the PDF may be incomplete. Try exporting in Chrome at 100% zoom. Detail: ${captureError}` } : null
}

// ─────────────────────────────────────────────────────────────────────────────
// BUTTON COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function CompositePDFExportButton({ engagement, radarRef, contentRef }) {
  const [loading, setLoading]   = useState(false)
  const [warning, setWarning]   = useState(null)

  async function handleExport() {
    setLoading(true)
    setWarning(null)
    try {
      const result = await generateCompositePDF(engagement, contentRef)
      if (result?.warning) setWarning(result.warning)
    } catch (e) {
      console.error('Composite PDF export failed:', e)
      const msg = e?.message?.toLowerCase()
      if (msg?.includes('canvas') || msg?.includes('memory')) {
        alert('PDF export failed: the content area was too large to render. Try exporting in Chrome at 100% browser zoom, or close other tabs to free memory.')
      } else if (msg?.includes('no sessions')) {
        alert('PDF export failed: no sessions to aggregate. Add at least one session before exporting.')
      } else {
        alert(`PDF export failed: ${e?.message || 'Unknown error'}. Check the browser console for details.`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
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
      {warning && (
        <div style={{
          fontSize: 11, color: '#92400E', background: '#FEF3C7',
          border: '1px solid #FDE68A', borderRadius: 6,
          padding: '6px 10px', maxWidth: 340, lineHeight: 1.5,
        }}>
          ⚠ {warning}
        </div>
      )}
    </div>
  )
}

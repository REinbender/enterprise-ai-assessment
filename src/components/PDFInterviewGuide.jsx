import { useState } from 'react'
import jsPDF from 'jspdf'
import { dimensions } from '../data/questions'

// ── Colour palette ─────────────────────────────────────────────────────────
const C = {
  primary:  [46,  163, 242],
  primaryDk:[26,  140, 216],
  navy:     [12,  32,  70],
  s900:     [15,  23,  42],
  s700:     [55,  65,  81],
  s500:     [100, 116, 139],
  s300:     [203, 213, 225],
  s100:     [241, 245, 249],
  s50:      [248, 250, 252],
  white:    [255, 255, 255],
}

const DIM_COLORS = {
  1: [46,  163, 242],
  2: [14,  165, 233],
  3: [139,  92, 246],
  4: [245, 158,  11],
  5: [16,  185, 129],
}

const SCORE_COLORS = {
  1: [220, 38,  38],
  2: [234, 88,  12],
  3: [161, 98,   7],
  4: [29,  78, 216],
  5: [21, 128,  61],
}

const SCORE_LABELS = {
  1: 'Beginning',
  2: 'Emerging',
  3: 'Developing',
  4: 'Advanced',
  5: 'Leading',
}

// ── Layout constants ────────────────────────────────────────────────────────
const PW = 210, PH = 297, ML = 16, MR = 16, CW = PW - ML - MR

// ── Helpers ─────────────────────────────────────────────────────────────────
function sf(doc, rgb)  { doc.setFillColor(rgb[0], rgb[1], rgb[2]) }
function sd(doc, rgb)  { doc.setDrawColor(rgb[0], rgb[1], rgb[2]) }
function st(doc, rgb)  { doc.setTextColor(rgb[0], rgb[1], rgb[2]) }

function filledBox(doc, x, y, w, h, rgb, r = 0) {
  sf(doc, rgb)
  if (r > 0) doc.roundedRect(x, y, w, h, r, r, 'F')
  else        doc.rect(x, y, w, h, 'F')
}

// ── Shared page header ──────────────────────────────────────────────────────
function pageHeader(doc, dim, pageNum) {
  const dc = dim ? DIM_COLORS[dim.id] : C.primary
  filledBox(doc, 0, 0, PW, 20, dc)
  // White left accent
  doc.setGState(doc.GState({ opacity: 0.18 }))
  sf(doc, C.white)
  doc.rect(0, 0, 5, 20, 'F')
  doc.setGState(doc.GState({ opacity: 1 }))

  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'bold')
  st(doc, C.white)
  const headerTitle = dim
    ? `DIMENSION ${dim.id}  ·  ${dim.name.toUpperCase()}`
    : 'ENTERPRISE AI READINESS ASSESSMENT — PRACTITIONER INTERVIEW GUIDE'
  doc.text(headerTitle, ML + 2, 13)

  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'normal')
  st(doc, [210, 228, 255])
  if (dim) doc.text('Enterprise AI Readiness Assessment — Practitioner Interview Guide', ML + 2, 18)

  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'bold')
  st(doc, C.white)
  doc.text(`${pageNum}`, PW - MR, 13, { align: 'right' })
}

// ── Shared page footer ──────────────────────────────────────────────────────
function pageFooter(doc, pageNum) {
  const y = PH - 7
  doc.setFontSize(6)
  doc.setFont('helvetica', 'normal')
  st(doc, C.s500)
  doc.text('FOR INTERVIEWER USE ONLY — DO NOT DISTRIBUTE TO ASSESSMENT SUBJECTS', ML, y)
  doc.text('Logic2020  ·  logic2020.com  ·  v1.6.0', PW / 2, y, { align: 'center' })
  doc.text(`Page ${pageNum}`, PW - MR, y, { align: 'right' })
}

// ── Calculate question card height ──────────────────────────────────────────
function calcQuestionHeight(doc, q) {
  const anchorW = CW - 26

  // Header row (Q# + score circles)
  let h = 12
  // Question text
  const qLines = doc.splitTextToSize(q.text, CW - 52)
  h += qLines.length * 5 + 5   // text + rule
  // 5 behavioural anchors
  for (let s = 1; s <= 5; s++) {
    const aLines = doc.splitTextToSize(q.anchors[s], anchorW)
    h += aLines.length * 3.6 + 2.8
  }
  // Notes area: label + 3 ruled lines
  h += 5 + 3 * 5.8 + 6
  return Math.ceil(h)
}

// ── Draw one question card ──────────────────────────────────────────────────
function drawQuestion(doc, q, qIdx, dimIdx, y, dim) {
  const dc = DIM_COLORS[dim.id]
  const cardH = calcQuestionHeight(doc, q)
  const anchorW = CW - 26
  const globalNum = (dim.id - 1) * 12 + qIdx + 1

  // Card background
  filledBox(doc, ML, y, CW, cardH, C.s50, 3)
  sd(doc, C.s300)
  doc.setLineWidth(0.25)
  doc.roundedRect(ML, y, CW, cardH, 3, 3, 'S')

  // Dimension color left accent
  filledBox(doc, ML, y, 4, cardH, dc, 2)

  let cy = y + 6

  // Question number badge
  filledBox(doc, ML + 7, cy - 4, 16, 7, dc, 1.5)
  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'bold')
  st(doc, C.white)
  doc.text(`Q${qIdx + 1}`, ML + 15, cy + 0.5, { align: 'center' })

  // Global question reference (small, grey)
  doc.setFontSize(6)
  doc.setFont('helvetica', 'normal')
  st(doc, C.s500)
  doc.text(`(${globalNum} of 60)`, ML + 25, cy + 0.5)

  // Score selector on the right
  const circleR  = 4
  const circleGap = 9.5
  const circleBaseX = PW - MR - 5 * circleGap + circleR
  doc.setFontSize(6)
  doc.setFont('helvetica', 'bold')
  st(doc, C.s500)
  doc.text('SCORE:', circleBaseX - 14, cy + 0.8)

  for (let s = 1; s <= 5; s++) {
    const cx = circleBaseX + (s - 1) * circleGap
    doc.setGState(doc.GState({ opacity: 0.12 }))
    sf(doc, SCORE_COLORS[s])
    doc.circle(cx, cy - 1, circleR + 0.5, 'F')
    doc.setGState(doc.GState({ opacity: 1 }))
    sd(doc, SCORE_COLORS[s])
    doc.setLineWidth(0.8)
    doc.circle(cx, cy - 1, circleR, 'S')
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'bold')
    st(doc, SCORE_COLORS[s])
    doc.text(`${s}`, cx, cy + 1.5, { align: 'center' })
  }

  cy += 8

  // Question text
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'bold')
  st(doc, C.s900)
  const qLines = doc.splitTextToSize(q.text, CW - 52)
  doc.text(qLines, ML + 7, cy)
  cy += qLines.length * 5 + 3

  // Rule before anchors
  sd(doc, C.s300)
  doc.setLineWidth(0.25)
  doc.line(ML + 7, cy, ML + CW - 4, cy)
  cy += 4

  // Behavioural anchors
  for (let s = 1; s <= 5; s++) {
    const aLines = doc.splitTextToSize(q.anchors[s], anchorW)
    const rowH   = aLines.length * 3.6 + 2.8

    // Score badge
    filledBox(doc, ML + 7, cy, 8, rowH - 1, SCORE_COLORS[s], 1.5)
    doc.setFontSize(6)
    doc.setFont('helvetica', 'bold')
    st(doc, C.white)
    doc.text(`${s}`, ML + 11, cy + rowH / 2 + 0.5, { align: 'center' })

    // Label
    doc.setFontSize(6)
    doc.setFont('helvetica', 'bold')
    st(doc, SCORE_COLORS[s])
    doc.text(SCORE_LABELS[s].toUpperCase(), ML + 17, cy + 3)

    // Anchor text
    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'normal')
    st(doc, C.s700)
    doc.text(aLines, ML + 17, cy + 3 + (aLines.length > 1 ? 4 : 0))

    // Reflow if multiline
    if (aLines.length > 1) {
      doc.text(aLines, ML + 17, cy + 7)
    } else {
      doc.text(aLines, ML + 17, cy + 3.5)
    }

    cy += rowH
  }

  cy += 2

  // Notes area
  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'bold')
  st(doc, C.s500)
  doc.text('INTERVIEW NOTES & EVIDENCE:', ML + 7, cy)
  cy += 4.5

  sd(doc, C.s300)
  doc.setLineWidth(0.3)
  for (let l = 0; l < 3; l++) {
    doc.line(ML + 7, cy + l * 5.8, ML + CW - 4, cy + l * 5.8)
  }
}

// ── Draw one question card (corrected anchor rendering) ─────────────────────
function drawQuestionCard(doc, q, qIdx, y, dim) {
  const dc      = DIM_COLORS[dim.id]
  const anchorW = CW - 26
  const cardH   = calcQuestionHeight(doc, q)
  const globalNum = (dim.id - 1) * 12 + qIdx + 1

  // Card background + border
  filledBox(doc, ML, y, CW, cardH, C.s50, 3)
  sd(doc, C.s300)
  doc.setLineWidth(0.25)
  doc.roundedRect(ML, y, CW, cardH, 3, 3, 'S')

  // Left accent bar
  filledBox(doc, ML, y, 4, cardH, dc, 2)

  let cy = y + 7

  // ── Q badge + global ref ─────────────────────────────────────
  filledBox(doc, ML + 7, cy - 4.5, 15, 7, dc, 1.5)
  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'bold')
  st(doc, C.white)
  doc.text(`Q${qIdx + 1}`, ML + 14.5, cy + 0.5, { align: 'center' })

  doc.setFontSize(5.5)
  doc.setFont('helvetica', 'normal')
  st(doc, C.s500)
  doc.text(`Question ${globalNum} of 60`, ML + 25, cy + 0.5)

  // ── Score circles ────────────────────────────────────────────
  const cGap = 9.5
  const cBaseX = PW - MR - 4 * cGap - 4
  doc.setFontSize(6)
  doc.setFont('helvetica', 'bold')
  st(doc, C.s500)
  doc.text('SCORE ▶', cBaseX - 14, cy + 1)

  for (let s = 1; s <= 5; s++) {
    const cx = cBaseX + (s - 1) * cGap
    // light fill
    doc.setGState(doc.GState({ opacity: 0.1 }))
    sf(doc, SCORE_COLORS[s])
    doc.circle(cx, cy - 1, 4.5, 'F')
    doc.setGState(doc.GState({ opacity: 1 }))
    // ring
    sd(doc, SCORE_COLORS[s])
    doc.setLineWidth(0.7)
    doc.circle(cx, cy - 1, 4, 'S')
    // number
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'bold')
    st(doc, SCORE_COLORS[s])
    doc.text(`${s}`, cx, cy + 1.5, { align: 'center' })
  }

  cy += 9

  // ── Question text ─────────────────────────────────────────────
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'bold')
  st(doc, C.s900)
  const qLines = doc.splitTextToSize(q.text, CW - 50)
  doc.text(qLines, ML + 7, cy)
  cy += qLines.length * 5 + 4

  // Thin rule
  sd(doc, C.s300)
  doc.setLineWidth(0.2)
  doc.line(ML + 7, cy, ML + CW - 4, cy)
  cy += 4

  // ── Behavioural anchors ───────────────────────────────────────
  for (let s = 1; s <= 5; s++) {
    const aLines = doc.splitTextToSize(q.anchors[s], anchorW)
    const rowH   = aLines.length * 3.6 + 3

    // Score pill
    filledBox(doc, ML + 7, cy + 0.5, 8, rowH - 1.5, SCORE_COLORS[s], 1.5)
    doc.setFontSize(6)
    doc.setFont('helvetica', 'bold')
    st(doc, C.white)
    doc.text(`${s}`, ML + 11, cy + rowH / 2 + 0.8, { align: 'center' })

    // Score label
    doc.setFontSize(6)
    doc.setFont('helvetica', 'bold')
    st(doc, SCORE_COLORS[s])
    doc.text(SCORE_LABELS[s].toUpperCase(), ML + 18, cy + 3.5)

    // Anchor description text
    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'normal')
    st(doc, C.s700)
    if (aLines.length === 1) {
      doc.text(aLines[0], ML + 18, cy + 3.5 + 4)
    } else {
      aLines.forEach((line, li) => {
        doc.text(line, ML + 18, cy + 3.5 + 4 + li * 3.6)
      })
    }

    cy += rowH
  }

  cy += 3

  // ── Notes area ────────────────────────────────────────────────
  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'bold')
  st(doc, C.s500)
  doc.text('INTERVIEW NOTES & SUPPORTING EVIDENCE:', ML + 7, cy)
  cy += 5

  sd(doc, C.s300)
  doc.setLineWidth(0.25)
  for (let l = 0; l < 3; l++) {
    const ly = cy + l * 5.8
    doc.line(ML + 7, ly, ML + CW - 4, ly)
  }
}

// ── Cover Page ──────────────────────────────────────────────────────────────
function drawCoverPage(doc) {
  const navy = C.navy

  // Full blue header (top 45%)
  filledBox(doc, 0, 0, PW, 135, C.primary)

  // Decorative circles
  doc.setGState(doc.GState({ opacity: 0.07 }))
  sf(doc, C.white)
  doc.circle(PW + 15, -10, 90, 'F')
  doc.circle(PW - 15, 120, 50, 'F')
  doc.setGState(doc.GState({ opacity: 1 }))

  // Logo
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  st(doc, C.white)
  doc.text('LOGIC2020', ML, 22)
  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'normal')
  st(doc, [199, 225, 254])
  doc.text('Enterprise Transformation Consulting', ML + 36, 22)

  // Eyebrow
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  st(doc, [199, 225, 254])
  doc.text('PRACTITIONER INTERVIEW GUIDE  ·  CONFIDENTIAL', ML, 38)

  // Rule
  doc.setGState(doc.GState({ opacity: 0.3 }))
  sd(doc, C.white)
  doc.setLineWidth(0.4)
  doc.line(ML, 42, PW - MR, 42)
  doc.setGState(doc.GState({ opacity: 1 }))

  // Title
  doc.setFontSize(30)
  doc.setFont('helvetica', 'bold')
  st(doc, C.white)
  doc.text('Enterprise AI', ML, 62)
  doc.text('Readiness', ML, 79)
  doc.text('Assessment', ML, 96)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  st(doc, [199, 225, 254])
  doc.text('Interview Guide & Scoring Workbook', ML, 110)

  // White panel
  filledBox(doc, 0, 129, PW, PH - 129, C.white)
  sf(doc, C.primary)
  doc.rect(0, 129, 5, PH - 129, 'F')

  let py = 144

  // About box
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'bold')
  st(doc, navy)
  doc.text('About This Document', ML + 8, py)
  py += 7

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  st(doc, C.s700)
  const about = 'This guide contains all 60 behaviorally-anchored assessment questions across 5 AI readiness dimensions. Each question includes full scoring descriptors (1–5) to support consistent, evidence-based scoring during stakeholder interviews.'
  const aboutLines = doc.splitTextToSize(about, CW - 12)
  doc.text(aboutLines, ML + 8, py)
  py += aboutLines.length * 5 + 8

  // Dimension summary list
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  st(doc, C.s500)
  doc.text('DIMENSIONS COVERED', ML + 8, py)
  py += 6

  dimensions.forEach((dim) => {
    const dc = DIM_COLORS[dim.id]
    sf(doc, dc)
    doc.circle(ML + 12, py - 1, 3, 'F')
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    st(doc, navy)
    doc.text(`${dim.id}. ${dim.name}`, ML + 18, py + 0.5)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    st(doc, C.s500)
    doc.text(`12 questions  ·  ${dim.description}`, ML + 18, py + 5.5)
    py += 13
  })

  py += 4
  sd(doc, C.s300)
  doc.setLineWidth(0.4)
  doc.line(ML + 8, py, PW - MR, py)
  py += 6

  // Stats row
  const stats = [
    { val: '5', label: 'Dimensions' },
    { val: '60', label: 'Questions' },
    { val: '300', label: 'Score Points' },
    { val: '1–5', label: 'Scale' },
  ]
  const statW = (CW - 12) / stats.length
  stats.forEach((s, i) => {
    const sx = ML + 8 + i * (statW + 4)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    st(doc, C.primary)
    doc.text(s.val, sx + statW / 2, py + 9, { align: 'center' })
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    st(doc, C.s500)
    doc.text(s.label, sx + statW / 2, py + 15, { align: 'center' })
  })

  py += 22

  // Footer
  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'italic')
  st(doc, C.s500)
  doc.text(
    'FOR INTERVIEWER USE ONLY — NOT FOR DISTRIBUTION TO ASSESSMENT SUBJECTS',
    PW / 2, PH - 8, { align: 'center' }
  )
}

// ── Instructions Page ───────────────────────────────────────────────────────
function drawInstructionsPage(doc) {
  pageHeader(doc, null, 2)
  pageFooter(doc, 2)

  let y = 30

  // Title
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  st(doc, C.navy)
  doc.text('How to Use This Guide', ML, y)
  y += 10

  // Purpose
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  st(doc, C.s500)
  doc.text('PURPOSE', ML, y)
  y += 5
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  st(doc, C.s700)
  const purpose = 'This guide is designed for Logic2020 practitioners conducting structured AI readiness interviews with client stakeholders. Use it to facilitate conversations, anchor scores to observable evidence, and record findings for input into the assessment tool. Do not share this document with assessment subjects prior to or during the interview.'
  const pLines = doc.splitTextToSize(purpose, CW)
  doc.text(pLines, ML, y)
  y += pLines.length * 4.5 + 8

  // Scoring scale
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  st(doc, C.s500)
  doc.text('SCORING SCALE', ML, y)
  y += 5

  const scaleRows = [
    { s: 1, label: 'Beginning', desc: 'No formal capabilities, processes, or structures exist. AI efforts are entirely ad hoc, uncoordinated, or absent.' },
    { s: 2, label: 'Emerging', desc: 'Early-stage, informal activity is underway but lacks formal structure, ownership, documented process, or consistent application.' },
    { s: 3, label: 'Developing', desc: 'Formal capabilities exist and are documented but are applied inconsistently across the organization. Governance and measurement are partial.' },
    { s: 4, label: 'Advanced', desc: 'Well-established capabilities are consistently applied with clear ownership, measurement, and evidence of strong execution across most areas.' },
    { s: 5, label: 'Leading', desc: 'Best-in-class, continuously improving capabilities that are deeply embedded in strategy and operations, benchmarked externally, and regularly reviewed.' },
  ]

  scaleRows.forEach((row) => {
    const dc = SCORE_COLORS[row.s]
    const descLines = doc.splitTextToSize(row.desc, CW - 30)
    const rowH = descLines.length * 4 + 10

    filledBox(doc, ML, y, CW, rowH, C.s50, 2)
    sd(doc, C.s300)
    doc.setLineWidth(0.2)
    doc.roundedRect(ML, y, CW, rowH, 2, 2, 'S')

    filledBox(doc, ML, y, 16, rowH, dc, 2)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    st(doc, C.white)
    doc.text(`${row.s}`, ML + 8, y + rowH / 2 + 2, { align: 'center' })

    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    st(doc, [dc[0], dc[1], dc[2]])
    doc.text(row.label, ML + 20, y + 6)

    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    st(doc, C.s700)
    doc.text(descLines, ML + 20, y + 12)

    y += rowH + 3
  })

  y += 4

  // Interview tips
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  st(doc, C.s500)
  doc.text('INTERVIEW FACILITATION TIPS', ML, y)
  y += 5

  const tips = [
    'Ask open-ended questions first — let the respondent describe their current state before referencing anchors.',
    'Probe for evidence: ask "Can you give me a specific example?" before assigning a score.',
    'Score current state, not aspirations. If the respondent describes plans or intentions, score as 1–2.',
    'Note specific examples and quotes to support each score — these are critical for the final report.',
    'If multiple stakeholders are present and disagree, record both views and resolve offline.',
    'Complete all 12 questions per dimension before moving to the next. Do not skip questions.',
    'The full assessment (~60 questions) takes 60–90 minutes with a single informed respondent.',
    'Enter scores into the digital tool after the interview to generate the automated analysis and report.',
  ]

  tips.forEach((tip, i) => {
    sf(doc, C.primary)
    doc.circle(ML + 3, y + 1, 1.8, 'F')
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    st(doc, C.s700)
    const tipLines = doc.splitTextToSize(tip, CW - 10)
    doc.text(tipLines, ML + 8, y + 2)
    y += tipLines.length * 4.2 + 3
  })
}

// ── Scoring Summary Page ────────────────────────────────────────────────────
function drawSummaryPage(doc, pageNum) {
  pageHeader(doc, null, pageNum)
  pageFooter(doc, pageNum)

  let y = 30

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  st(doc, C.navy)
  doc.text('Scoring Summary Sheet', ML, y)
  y += 6

  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'italic')
  st(doc, C.s500)
  doc.text('Transfer raw scores from each question, calculate dimension averages, then enter into the digital assessment tool.', ML, y)
  y += 8

  // Per-dimension tables
  dimensions.forEach((dim) => {
    const dc = DIM_COLORS[dim.id]

    // Dimension header
    filledBox(doc, ML, y, CW, 8, dc, 2)
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'bold')
    st(doc, C.white)
    doc.text(`${dim.id}.  ${dim.name}`, ML + 5, y + 5.5)
    y += 8

    // Q score grid — 2 rows of 6
    const cellW = (CW - 2) / 6
    const cellH = 10

    // Row labels + cells for Q1-Q6
    ;[0, 6].forEach((offset) => {
      // Labels row
      filledBox(doc, ML, y, CW, cellH, C.s100)
      sd(doc, C.s300)
      doc.setLineWidth(0.2)
      doc.rect(ML, y, CW, cellH, 'S')

      for (let col = 0; col < 6; col++) {
        const qNum = offset + col + 1
        const cx = ML + col * cellW
        // Vertical dividers
        if (col > 0) {
          doc.line(cx, y, cx, y + cellH)
        }
        doc.setFontSize(6.5)
        doc.setFont('helvetica', 'bold')
        st(doc, C.s700)
        doc.text(`Q${qNum}`, cx + cellW / 2, y + 4, { align: 'center' })
        // Score input line
        sd(doc, dc)
        doc.setLineWidth(0.4)
        doc.line(cx + 4, y + 8, cx + cellW - 4, y + 8)
      }
      y += cellH
    })

    // Average + notes row
    filledBox(doc, ML, y, CW, 10, C.s50)
    sd(doc, C.s300)
    doc.setLineWidth(0.2)
    doc.rect(ML, y, CW, 10, 'S')

    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    st(doc, C.s700)
    doc.text('Sum (Q1–Q12):', ML + 4, y + 6.5)
    sd(doc, C.s500)
    doc.setLineWidth(0.3)
    doc.line(ML + 38, y + 7, ML + 60, y + 7)

    doc.text('÷ 12 =', ML + 65, y + 6.5)
    sd(doc, dc)
    doc.setLineWidth(0.5)
    doc.line(ML + 82, y + 7, ML + 105, y + 7)

    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'italic')
    st(doc, C.s500)
    doc.text('(Dimension Average, 1–5 scale)', ML + 108, y + 6.5)

    y += 14
  })

  y += 2

  // Overall score formula box
  filledBox(doc, ML, y, CW, 22, [239, 246, 255], 3)
  sd(doc, C.primary)
  doc.setLineWidth(0.4)
  doc.roundedRect(ML, y, CW, 22, 3, 3, 'S')
  filledBox(doc, ML, y, 4, 22, C.primary, 2)

  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'bold')
  st(doc, C.navy)
  doc.text('OVERALL SCORE FORMULA', ML + 8, y + 6)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  st(doc, C.s700)
  doc.text(
    'Sum all five dimension averages, divide by 5, then multiply by 20 to convert to a 0–100 scale.',
    ML + 8, y + 12
  )
  doc.setFont('helvetica', 'bold')
  st(doc, C.primary)
  doc.text(
    '((Dim1 + Dim2 + Dim3 + Dim4 + Dim5) ÷ 5) × 20  =  Overall Score (0–100)',
    ML + 8, y + 18
  )
  y += 28

  // Maturity interpretation
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  st(doc, C.s500)
  doc.text('MATURITY INTERPRETATION', ML, y)
  y += 5

  const bands = [
    { range: '0 – 20',   label: 'Beginning',  desc: 'No foundational AI capabilities in place.',              color: [220, 38,  38]  },
    { range: '21 – 40',  label: 'Developing', desc: 'Early efforts underway, significant gaps remain.',       color: [234, 88,  12]  },
    { range: '41 – 60',  label: 'Maturing',   desc: 'Core capabilities established, scaling challenges exist.', color: [161, 98, 7]  },
    { range: '61 – 80',  label: 'Advanced',   desc: 'Strong AI capabilities, focus on optimization.',        color: [29,  78, 216]  },
    { range: '81 – 100', label: 'Leading',    desc: 'AI deeply embedded, sustained competitive advantage.',   color: [21, 128,  61]  },
  ]

  const bColW = CW / bands.length
  bands.forEach((b, i) => {
    const bx = ML + i * bColW
    filledBox(doc, bx, y, bColW - 1, 16, b.color, 2)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    st(doc, C.white)
    doc.text(b.range, bx + bColW / 2, y + 6, { align: 'center' })
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    doc.text(b.label, bx + bColW / 2, y + 12, { align: 'center' })
  })

  y += 22

  // Sign-off fields
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  st(doc, C.s500)
  doc.text('INTERVIEW RECORD', ML, y)
  y += 6

  const fields = [
    { label: 'Organization:', w: 80 },
    { label: 'Respondent Name & Title:', w: 80 },
    { label: 'Interviewer:', w: 80 },
    { label: 'Interview Date:', w: 55 },
    { label: 'Duration (mins):', w: 40 },
  ]

  let fx = ML
  let fy = y
  fields.forEach((f, i) => {
    if (i === 3) { fx = ML; fy += 12 }  // wrap to new line after 2
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    st(doc, C.s700)
    doc.text(f.label, fx, fy)
    sd(doc, C.s300)
    doc.setLineWidth(0.4)
    doc.line(fx, fy + 5, fx + f.w, fy + 5)
    fx += f.w + 16
  })
}

// ── Main export function ────────────────────────────────────────────────────
export async function exportInterviewGuide() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
  doc.setFont('helvetica')

  let pageNum = 1

  // Page 1: Cover
  drawCoverPage(doc)

  // Page 2: Instructions
  doc.addPage()
  pageNum++
  drawInstructionsPage(doc, pageNum)

  // Pages 3+: Questions (flowing layout)
  const BODY_TOP  = 26  // below header
  const BODY_BOT  = PH - 14  // above footer
  const BODY_H    = BODY_BOT - BODY_TOP

  let currentDimId = null

  for (const dim of dimensions) {
    // New page for each dimension start
    doc.addPage()
    pageNum++
    currentDimId = dim.id
    pageHeader(doc, dim, pageNum)
    pageFooter(doc, pageNum)

    // Dimension intro strip
    let y = BODY_TOP + 4
    filledBox(doc, ML, y, CW, 18, [239, 246, 255], 3)
    sd(doc, [191, 219, 254])
    doc.setLineWidth(0.3)
    doc.roundedRect(ML, y, CW, 18, 3, 3, 'S')
    filledBox(doc, ML, y, 4, 18, DIM_COLORS[dim.id], 2)

    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    st(doc, C.navy)
    doc.text(`Dimension ${dim.id}:  ${dim.name}`, ML + 8, y + 7)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    st(doc, C.s700)
    const descLines = doc.splitTextToSize(dim.description, CW - 12)
    doc.text(descLines, ML + 8, y + 13)
    y += 24

    // Flow questions
    for (let qi = 0; qi < dim.questions.length; qi++) {
      const q   = dim.questions[qi]
      const qH  = calcQuestionHeight(doc, q)

      // Need a new page?
      if (y + qH > BODY_BOT - 2) {
        doc.addPage()
        pageNum++
        pageHeader(doc, dim, pageNum)
        pageFooter(doc, pageNum)
        y = BODY_TOP + 4
      }

      drawQuestionCard(doc, q, qi, y, dim)
      y += qH + 6
    }
  }

  // Final page: Scoring Summary
  doc.addPage()
  pageNum++
  drawSummaryPage(doc, pageNum)

  const dateStr = new Date().toISOString().slice(0, 10)
  doc.save(`AI_Readiness_Interview_Guide_${dateStr}.pdf`)
}

// ── Button component ────────────────────────────────────────────────────────
export default function InterviewGuideButton() {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      await exportInterviewGuide()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      className="btn btn-ghost"
      onClick={handleClick}
      disabled={loading}
      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
    >
      {loading ? (
        <>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Generating PDF…
        </>
      ) : (
        <>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          Download Interview Guide
        </>
      )}
    </button>
  )
}

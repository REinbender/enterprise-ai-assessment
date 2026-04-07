import { useState } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import {
  computeDimensionScores,
  computeOverallScore,
  getMaturityLevel,
} from '../data/questions'
import { generateRecommendations } from '../data/recommendations'

// ── Colour palette (hex without #, for jsPDF rgb helpers) ─────────────────
const C = {
  indigo:     [46,  163, 242],  // Logic2020 primary blue #2EA3F2
  indigoDark: [26,  140, 216],  // Logic2020 dark blue   #1A8CD8
  slate900:   [51,  51,  51],   // #333333
  slate700:   [85,  85,  85],   // #555555
  slate500:   [153, 153, 153],  // #999999
  slate200:   [226, 226, 226],  // #E2E2E2
  slate50:    [243, 243, 243],  // #F3F3F3
  white:      [255, 255, 255],
  green:      [16,  185, 129],
  amber:      [245, 158,  11],
  red:        [239,  68,  68],
  blue:       [46,  163, 242],  // same as primary
  purple:     [139,  92, 246],
  sky:        [14,  165, 233],
}

const DIM_COLORS = {
  1: [46,  163, 242],  // Logic2020 blue  – Strategy
  2: [14,  165, 233],  // sky             – Data
  3: [139,  92, 246],  // purple          – Governance
  4: [245, 158,  11],  // amber           – Talent
  5: [16,  185, 129],  // green           – Operations
}

// jsPDF helper wrappers
function setFill(doc, rgb) { doc.setFillColor(rgb[0], rgb[1], rgb[2]) }
function setDraw(doc, rgb) { doc.setDrawColor(rgb[0], rgb[1], rgb[2]) }
function setTextC(doc, rgb) { doc.setTextColor(rgb[0], rgb[1], rgb[2]) }

// ── Page layout constants ─────────────────────────────────────────────────
const PW = 210   // A4 width  mm
const PH = 297   // A4 height mm
const ML = 18    // margin left
const MR = 18    // margin right
const CW = PW - ML - MR  // content width

// ── Helper: draw a rounded-rect filled box ────────────────────────────────
function filledBox(doc, x, y, w, h, rgb, r = 3) {
  setFill(doc, rgb)
  doc.roundedRect(x, y, w, h, r, r, 'F')
}

// ── Helper: draw a horizontal progress bar ───────────────────────────────
function progressBar(doc, x, y, w, h, pct, rgb) {
  setFill(doc, C.slate200)
  doc.roundedRect(x, y, w, h, h / 2, h / 2, 'F')
  if (pct > 0) {
    setFill(doc, rgb)
    doc.roundedRect(x, y, Math.max(w * (pct / 100), h), h, h / 2, h / 2, 'F')
  }
}

// ── PAGE 1: Cover ─────────────────────────────────────────────────────────
function drawCover(doc, company, dimScores, overallScore) {
  // Deep indigo gradient background (simulated with two rects)
  filledBox(doc, 0, 0, PW, PH, C.indigoDark, 0)
  filledBox(doc, 0, 0, PW, PH / 2.2, C.indigo, 0)

  // Decorative circles
  setFill(doc, [255, 255, 255])
  doc.setGState(doc.GState({ opacity: 0.04 }))
  doc.circle(PW - 30, 40, 60, 'F')
  doc.circle(PW - 10, 10, 30, 'F')
  doc.setGState(doc.GState({ opacity: 1 }))

  // AI badge
  setFill(doc, [255, 255, 255])
  doc.setGState(doc.GState({ opacity: 0.15 }))
  filledBox(doc, ML, 28, 22, 10, C.white, 2)
  doc.setGState(doc.GState({ opacity: 1 }))
  setTextC(doc, C.white)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  doc.text('AI', ML + 5.5, 34.5)

  // Title
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  setTextC(doc, C.white)
  doc.text('Enterprise AI Readiness', ML, 58)
  doc.text('Assessment', ML, 70)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  setTextC(doc, [199, 210, 254])
  doc.text('Confidential Assessment Report', ML, 80)

  // Company name box
  if (company.name) {
    filledBox(doc, ML, 90, CW, 16, [255, 255, 255], 3)
    doc.setGState(doc.GState({ opacity: 0.12 }))
    filledBox(doc, ML, 90, CW, 16, C.indigo, 3)
    doc.setGState(doc.GState({ opacity: 1 }))
    setTextC(doc, C.white)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(company.name, ML + 6, 100)
    if (company.industry) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      setTextC(doc, [199, 210, 254])
      doc.text(`${company.industry}  ·  ${company.size || ''}`, ML + 6, 107)
    }
  }

  // Overall Score circle (bottom of blue section)
  const cx = ML + 30
  const cy = 140
  const r  = 24
  setFill(doc, [255, 255, 255])
  doc.setGState(doc.GState({ opacity: 0.12 }))
  doc.circle(cx, cy, r, 'F')
  doc.setGState(doc.GState({ opacity: 1 }))
  doc.setFillColor(255, 255, 255)
  doc.circle(cx, cy, r - 3, 'F')

  const maturity = getMaturityLevel(overallScore)
  setTextC(doc, C.indigo)
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
  doc.text(`Maturity Level: ${maturity.label}`, ML + 64, cy + 10)

  // ── Lower white section: dimension summary table ─────────────────────────
  const tableY = 176
  setTextC(doc, C.slate700)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('DIMENSION SCORES', ML, tableY)

  const rowH  = 14
  const col1W = 80
  const col2W = 55
  const col3W = CW - col1W - col2W

  // Header row
  filledBox(doc, ML, tableY + 3, CW, 8, C.slate50, 2)
  doc.setFontSize(7)
  setTextC(doc, C.slate500)
  doc.text('DIMENSION', ML + 3, tableY + 8.5)
  doc.text('MATURITY', ML + col1W + 3, tableY + 8.5)
  doc.text('SCORE', ML + col1W + col2W + 3, tableY + 8.5)

  dimScores.forEach((d, i) => {
    const ry = tableY + 11 + i * rowH
    const m  = getMaturityLevel(d.score)
    const dc = DIM_COLORS[d.id]

    if (i % 2 === 0) filledBox(doc, ML, ry, CW, rowH, C.slate50, 0)

    // Color dot
    setFill(doc, dc)
    doc.circle(ML + 4, ry + 6, 2.5, 'F')

    setTextC(doc, C.slate900)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(d.shortName, ML + 9, ry + 7)

    // Maturity pill
    const mhex = m.color.replace('#','')
    const mr_rgb = [parseInt(mhex.slice(0,2),16), parseInt(mhex.slice(2,4),16), parseInt(mhex.slice(4,6),16)]
    filledBox(doc, ML + col1W + 2, ry + 2, 38, 7, mr_rgb, 3)
    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'bold')
    setTextC(doc, C.white)
    doc.text(m.label, ML + col1W + 21, ry + 7, { align: 'center' })

    // Score bar
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
  doc.text(`Generated ${dateStr}  ·  Enterprise AI Readiness Assessment v1.2.0`, PW / 2, PH - 8, { align: 'center' })
}

// ── PAGE 2: Dimension Deep-Dives ──────────────────────────────────────────
function drawDimensionsPage(doc, dimScores) {
  doc.addPage()

  pageHeader(doc, 'Dimension Score Analysis', 2)

  let y = 42
  const half = (CW - 6) / 2

  dimScores.forEach((d, i) => {
    const col = i % 2
    const x   = ML + col * (half + 6)
    const m   = getMaturityLevel(d.score)
    const dc  = DIM_COLORS[d.id]
    const mhex = m.color.replace('#','')
    const mr_rgb = [parseInt(mhex.slice(0,2),16), parseInt(mhex.slice(2,4),16), parseInt(mhex.slice(4,6),16)]

    const cardH = 50
    // card bg
    setFill(doc, C.white)
    doc.roundedRect(x, y, half, cardH, 3, 3, 'F')
    setDraw(doc, C.slate200)
    doc.roundedRect(x, y, half, cardH, 3, 3, 'S')

    // Color accent bar
    setFill(doc, dc)
    doc.roundedRect(x, y, 3, cardH, 1.5, 1.5, 'F')

    // Icon + name
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    setTextC(doc, C.slate900)
    doc.text(d.name, x + 7, y + 8)

    // Score
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    setTextC(doc, dc)
    doc.text(`${d.score}%`, x + 7, y + 22)

    // Maturity pill
    filledBox(doc, x + 7, y + 25, 28, 7, mr_rgb, 3)
    doc.setFontSize(6)
    doc.setFont('helvetica', 'bold')
    setTextC(doc, C.white)
    doc.text(m.label, x + 21, y + 30.5, { align: 'center' })

    // Progress bar
    progressBar(doc, x + 7, y + 36, half - 14, 4, d.score, dc)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    setTextC(doc, C.slate500)
    doc.text(d.description, x + 7, y + 47, { maxWidth: half - 14 })

    if (col === 1 || i === dimScores.length - 1) {
      y += cardH + 6
    }
  })
}

// ── PAGE 3: Recommendations ───────────────────────────────────────────────
function drawRecommendationsPage(doc, recs) {
  doc.addPage()
  pageHeader(doc, 'Prioritized Recommendations', 3)

  const priorityColors = {
    Critical: [239, 68, 68],
    High:     [245, 158, 11],
    Medium:   [59, 130, 246],
  }

  let y = 42
  recs.forEach((rec) => {
    const pc = priorityColors[rec.priority] || C.slate500

    // Estimate card height
    const actionsH = rec.actions.length * 9
    const cardH = 52 + actionsH

    if (y + cardH > PH - 20) {
      doc.addPage()
      pageHeader(doc, 'Prioritized Recommendations (cont.)', 3)
      y = 42
    }

    // Card
    setFill(doc, C.white)
    doc.roundedRect(ML, y, CW, cardH, 3, 3, 'F')
    setDraw(doc, C.slate200)
    doc.roundedRect(ML, y, CW, cardH, 3, 3, 'S')

    // Priority accent
    setFill(doc, pc)
    doc.roundedRect(ML, y, 4, cardH, 2, 2, 'F')

    // Priority pill
    filledBox(doc, ML + 8, y + 5, 20, 7, pc, 3)
    doc.setFontSize(6)
    doc.setFont('helvetica', 'bold')
    setTextC(doc, C.white)
    doc.text(rec.priority, ML + 18, y + 10, { align: 'center' })

    // Dimension badge
    const dc = DIM_COLORS[rec.dimensionId] || C.slate500
    filledBox(doc, ML + 32, y + 5, 36, 7, dc, 3)
    doc.setGState(doc.GState({ opacity: 0.15 }))
    filledBox(doc, ML + 32, y + 5, 36, 7, dc, 3)
    doc.setGState(doc.GState({ opacity: 1 }))
    doc.setFontSize(6)
    doc.setFont('helvetica', 'normal')
    setTextC(doc, dc)
    doc.text(rec.dimensionName, ML + 50, y + 10, { align: 'center' })

    // Score
    doc.setFontSize(7)
    setTextC(doc, C.slate500)
    doc.text(`Score: ${rec.score}%`, ML + CW - 24, y + 10)

    // Title
    doc.setFontSize(9.5)
    doc.setFont('helvetica', 'bold')
    setTextC(doc, C.slate900)
    doc.text(rec.title, ML + 8, y + 22)

    // Why it matters
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    setTextC(doc, C.slate700)
    const descLines = doc.splitTextToSize(rec.description, CW - 16)
    doc.text(descLines, ML + 8, y + 30)

    // Actions
    const actY = y + 30 + descLines.length * 4.5 + 4
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    setTextC(doc, C.slate500)
    doc.text('RECOMMENDED ACTIONS:', ML + 8, actY)

    rec.actions.forEach((action, ai) => {
      const ay = actY + 6 + ai * 9
      setFill(doc, pc)
      doc.circle(ML + 11, ay - 1, 1.5, 'F')
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      setTextC(doc, C.slate700)
      const aLines = doc.splitTextToSize(action, CW - 26)
      doc.text(aLines, ML + 15, ay)
    })

    y += cardH + 6
  })
}

// ── Shared page header ────────────────────────────────────────────────────
function pageHeader(doc, title, pageNum) {
  filledBox(doc, 0, 0, PW, 28, C.indigo, 0)

  // AI badge
  filledBox(doc, ML, 8, 14, 8, C.indigoDark, 2)
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
  doc.text('Enterprise AI Readiness Assessment', ML + 20, 22)

  // Page number
  setTextC(doc, [199, 210, 254])
  doc.text(`Page ${pageNum}`, PW - ML, 16, { align: 'right' })
}

// ── Main export function ──────────────────────────────────────────────────
export async function exportToPDF(company, answers, radarChartRef) {
  const dimScores = computeDimensionScores(answers)
  const overallScore = computeOverallScore(dimScores)
  const recs = generateRecommendations(dimScores)

  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
  doc.setFont('helvetica')

  // ── Page 1: Cover
  drawCover(doc, company, dimScores, overallScore)

  // ── Page 2: Dimension deep-dives
  drawDimensionsPage(doc, dimScores)

  // ── Page 3: Radar chart (capture from DOM if ref provided)
  if (radarChartRef?.current) {
    try {
      doc.addPage()
      pageHeader(doc, 'AI Readiness Radar', 3)

      const canvas = await html2canvas(radarChartRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      })
      const imgData = canvas.toDataURL('image/png')
      const imgW = 140
      const imgH = (canvas.height / canvas.width) * imgW
      doc.addImage(imgData, 'PNG', (PW - imgW) / 2, 36, imgW, imgH)

      drawRecommendationsPage(doc, recs)
    } catch (e) {
      drawRecommendationsPage(doc, recs)
    }
  } else {
    drawRecommendationsPage(doc, recs)
  }

  // Save
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

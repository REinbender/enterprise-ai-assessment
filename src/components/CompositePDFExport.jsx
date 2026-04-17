import { useState } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { computeComposite, ROLE_GROUP_META } from '../data/engagement'

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
  slate700: [71,  85,  105],
  slate500: [100, 116, 139],
  slate300: [203, 213, 225],
  slate100: [241, 245, 249],
  white:    [255, 255, 255],
  green:    [22,  163,  74],
  amber:    [217, 119,   6],
  red:      [220,  38,  38],
}

const DIM_COLORS = {
  1: [46,  163, 242],
  2: [14,  165, 233],
  3: [124,  58, 237],
  4: [217, 119,   6],
  5: [22,  163,  74],
}

const DIM_NAMES = {
  1: 'AI Strategy',
  2: 'Data & Infrastructure',
  3: 'Governance & Ethics',
  4: 'Talent & Culture',
  5: 'AI Operations',
}

function matColor(score) {
  if (score === undefined || score === null) return C.slate500
  if (score < 20) return C.red
  if (score < 40) return [234, 88, 12]
  if (score < 60) return C.amber
  if (score < 80) return C.blue || [37, 99, 235]
  return C.green
}
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
  rbox(doc, 0, 0, PW, HEADER_H, C.primary, 0)
  rbox(doc, ML, 4, 10, 10, C.primaryDk, 2)
  txt(doc, 'AI', ML + 2, 11, 6, C.white, 'bold')
  txt(doc, title, ML + 14, 12, 9.5, C.white, 'bold')
  txt(doc, `Page ${pageNum}`, PW - MR, 12, 7.5, [199, 220, 254], 'normal', { align: 'right' })
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

  // Blue header band
  rbox(doc, 0, 0, PW, 130, C.primary, 0)
  doc.setGState(doc.GState({ opacity: 0.07 }))
  sf(doc, C.white)
  doc.circle(PW + 15, -10, 95, 'F')
  doc.circle(PW - 8, 120, 55, 'F')
  doc.setGState(doc.GState({ opacity: 1 }))

  // Logo
  txt(doc, 'LOGIC2020', ML, 22, 9, C.white, 'bold')
  txt(doc, 'Enterprise Transformation Consulting', ML + 38, 22, 6.5, [199, 225, 254])

  // Eyebrow
  txt(doc, 'CONFIDENTIAL  ·  COMPOSITE ASSESSMENT REPORT', ML, 40, 7, [199, 225, 254], 'bold')

  // Title
  txt(doc, 'Composite AI', ML, 65, 28, C.white, 'bold')
  txt(doc, 'Readiness Report', ML, 88, 28, C.white, 'bold')

  // White panel
  rbox(doc, 0, 120, PW, PH - 120, C.white, 0)
  sf(doc, C.primary); doc.rect(0, 120, 5, PH - 120, 'F')

  let py = 134

  // Prepared for
  txt(doc, 'PREPARED FOR', ML + 8, py, 7, C.slate500, 'bold'); py += 7

  doc.setFontSize(19); doc.setFont('helvetica', 'bold')
  let nameText = company.name || 'Organization'
  while (doc.getTextWidth(nameText) > CONTENT_W - 8 && nameText.length > 4)
    nameText = nameText.slice(0, -1)
  if (nameText !== (company.name || 'Organization')) nameText += '…'
  txt(doc, nameText, ML + 8, py, 19, C.navy, 'bold'); py += 9

  if (company.industry || company.size) {
    txt(doc, [company.industry, company.size].filter(Boolean).join('  ·  '), ML + 8, py, 9, C.slate700); py += 7
  }
  py += 3
  sd(doc, C.slate300); doc.setLineWidth(0.4); doc.line(ML + 8, py, PW - MR, py); py += 10

  // 3 stat tiles
  const rcParts = []
  if (rc.executive    > 0) rcParts.push(`${rc.executive} Exec`)
  if (rc.management   > 0) rcParts.push(`${rc.management} Mgmt`)
  if (rc.practitioner > 0) rcParts.push(`${rc.practitioner} Practitioner`)

  const tileW = (CONTENT_W - 8 - 8) / 3, tileH = 36
  const tiles = [
    { label: 'COMPOSITE SCORE', value: `${composite.overallAvg}`, sub: '/ 100',              color: mc },
    { label: 'MATURITY LEVEL',  value: ml,                         sub: 'AI readiness stage', color: mc },
    { label: 'RESPONDENTS',     value: `${composite.sessionCount}`, sub: rcParts.join(' · ') || 'across roles', color: C.primary },
  ]
  tiles.forEach((t, i) => {
    const tx = ML + 8 + i * (tileW + 4)
    sf(doc, C.slate100); doc.roundedRect(tx, py, tileW, tileH, 3, 3, 'F')
    sd(doc, C.slate300); doc.setLineWidth(0.3); doc.roundedRect(tx, py, tileW, tileH, 3, 3, 'S')
    sf(doc, t.color); doc.roundedRect(tx, py, tileW, 3, 1.5, 1.5, 'F')
    txt(doc, t.label, tx + tileW / 2, py + 12, 6, C.slate500, 'bold', { align: 'center' })
    const vfs = i === 1 && t.value.length > 8 ? 11 : 17
    txt(doc, t.value, tx + tileW / 2, py + 26, vfs, t.color, 'bold', { align: 'center' })
    const sub = t.sub.length > 24 ? t.sub.slice(0, 23) + '…' : t.sub
    txt(doc, sub, tx + tileW / 2, py + 33, 6, C.slate500, 'normal', { align: 'center' })
  })
  py += tileH + 10

  sd(doc, C.slate300); doc.setLineWidth(0.4); doc.line(ML + 8, py, PW - MR, py); py += 8

  txt(doc, `Assessment Date: ${date}`, ML + 8, py, 8.5, C.slate700); py += 7

  // Flag box
  const gapCount = composite.perceptionGapDimensions?.length || 0
  const lvCount  = composite.lowVisibilityDimensions?.length  || 0
  if (gapCount > 0 || lvCount > 0) {
    const flags = []
    if (gapCount > 0) flags.push(`${gapCount} perception gap${gapCount > 1 ? 's' : ''} detected`)
    if (lvCount  > 0) flags.push(`${lvCount} low-visibility dimension${lvCount > 1 ? 's' : ''}`)
    rbox(doc, ML + 8, py, CONTENT_W - 8, 11, [255, 247, 237], 3)
    txt(doc, `⚠  Key Flags: ${flags.join('  ·  ')}`, ML + 13, py + 8, 8, [154, 52, 18], 'bold')
    py += 14
  }

  // Dimension scores at a glance
  txt(doc, 'DIMENSION SCORES AT A GLANCE', ML + 8, py, 7, C.slate500, 'bold'); py += 6

  composite.dimensions.forEach((d, i) => {
    const dc  = DIM_COLORS[d.dimId]
    const dmc = matColor(d.avg)
    if (i % 2 === 0) { sf(doc, C.slate100); doc.rect(ML + 8, py, CONTENT_W - 8, 9, 'F') }
    sf(doc, dc); doc.circle(ML + 13, py + 4.5, 2.5, 'F')
    txt(doc, DIM_NAMES[d.dimId], ML + 18, py + 6.5, 8, C.navy, 'bold')
    pbar(doc, ML + 80, py + 2, CONTENT_W - 108, 5, d.avg, dc)
    txt(doc, matLabel(d.avg), ML + 80, py + 6.5, 6.5, dmc, 'bold')
    txt(doc, `${d.avg}`, PW - MR - 4, py + 6.5, 9, dc, 'bold', { align: 'right' })
    py += 9
  })

  pageFooter(doc, company.name, date)
}

// ─────────────────────────────────────────────────────────────────────────────
// SMART SLICE — find the nearest whitespace row to avoid cutting mid-element
// ─────────────────────────────────────────────────────────────────────────────
function findSafeSliceY(canvas, targetYpx, searchPx = 60) {
  const ctx    = canvas.getContext('2d')
  const scanW  = Math.min(canvas.width, 400) // sample centre strip for speed
  const scanX  = Math.floor((canvas.width - scanW) / 2)

  let bestY     = targetYpx
  let bestScore = -1

  const lo = Math.max(0, targetYpx - searchPx)
  const hi = Math.min(canvas.height - 1, targetYpx + searchPx)

  for (let y = lo; y <= hi; y++) {
    const data = ctx.getImageData(scanX, y, scanW, 1).data
    let lightPx = 0
    for (let x = 0; x < data.length; x += 4) {
      // Count pixels that look like background (light grey / white)
      if (data[x] > 230 && data[x+1] > 230 && data[x+2] > 230) lightPx++
    }
    const score = lightPx / (scanW)
    // Prefer rows closer to target when scores tie
    const proximity = 1 - Math.abs(y - targetYpx) / (searchPx + 1)
    const weighted  = score * 0.7 + proximity * 0.3
    if (weighted > bestScore) { bestScore = weighted; bestY = y }
  }

  return bestY
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT PAGES — html2canvas screenshot of the live web page content
// ─────────────────────────────────────────────────────────────────────────────
async function drawContentPages(doc, contentRef, companyName, date, startPage) {
  if (!contentRef?.current) return startPage

  // Hide footer actions bar before capture so it doesn't appear in PDF
  const actionsEl = contentRef.current.querySelector('.results-actions')
  if (actionsEl) actionsEl.style.display = 'none'

  let canvas
  try {
    canvas = await html2canvas(contentRef.current, {
      scale: 2,
      backgroundColor: '#f8fafc',
      logging: false,
      useCORS: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: -window.scrollY,
    })
  } finally {
    if (actionsEl) actionsEl.style.display = ''
  }

  const mmPerPx      = CONTENT_W / canvas.width
  const pageHpx      = PAGE_CONTENT_H / mmPerPx   // how many px fit per page
  const searchPx     = Math.round(60 / mmPerPx)    // ~60mm search window in px

  let sliceStartPx = 0
  let pageNum      = startPage

  while (sliceStartPx < canvas.height) {
    doc.addPage()
    pageHeader(doc, 'Composite AI Readiness Report', pageNum)

    // Ideal end of this slice
    const idealEndPx = sliceStartPx + pageHpx

    // Find the safest cut point near idealEnd (not past end of canvas)
    let sliceEndPx
    if (idealEndPx >= canvas.height) {
      sliceEndPx = canvas.height
    } else {
      sliceEndPx = findSafeSliceY(canvas, Math.round(idealEndPx), searchPx)
      // Never go backward from start or exceed canvas
      sliceEndPx = Math.max(sliceStartPx + 10, Math.min(sliceEndPx, canvas.height))
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

  return pageNum
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

  // Page 1: Designed cover
  drawCover(doc, engagement, composite)

  // Pages 2+: Screenshot of the live web content
  await drawContentPages(doc, contentRef, companyName, date, 2)

  const slug = companyName.replace(/\s+/g, '-') || 'Assessment'
  const dateSlug = new Date().toISOString().slice(0, 10)
  doc.save(`${slug}-AI-Readiness-Composite-${dateSlug}.pdf`)
}

// ─────────────────────────────────────────────────────────────────────────────
// BUTTON COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function CompositePDFExportButton({ engagement, radarRef, contentRef }) {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    setLoading(true)
    try {
      await generateCompositePDF(engagement, contentRef)
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

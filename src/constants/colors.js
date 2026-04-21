// ─────────────────────────────────────────────────────────────────────────────
// Shared color constants
//
// Canonical dimension colors, derived from the dimension definitions in
// questions.js. Two formats are exported:
//   DIM_COLORS_HEX  — hex strings for React/CSS (e.g. '#2EA3F2')
//   DIM_COLORS_RGB  — [R, G, B] arrays for jsPDF (e.g. [46, 163, 242])
//
// The PDF exports (PDFExport.jsx, CompositePDFExport.jsx) previously defined
// their own DIM_COLORS inline with slightly divergent values. Both now import
// from here, eliminating the inconsistency.
// ─────────────────────────────────────────────────────────────────────────────

// Hex format — matches dimension[].color in questions.js exactly
export const DIM_COLORS_HEX = {
  1: '#2EA3F2',  // Strategy   — Logic2020 blue
  2: '#0EA5E9',  // Data       — sky blue
  3: '#8B5CF6',  // Governance — violet
  4: '#F59E0B',  // Talent     — amber
  5: '#10B981',  // Operations — emerald
}

// RGB format — for use with jsPDF setFillColor / setTextColor / setDrawColor
export const DIM_COLORS_RGB = {
  1: [46,  163, 242],  // #2EA3F2
  2: [14,  165, 233],  // #0EA5E9
  3: [139,  92, 246],  // #8B5CF6
  4: [245, 158,  11],  // #F59E0B
  5: [16,  185, 129],  // #10B981
}

// Maturity level colors — hex, matches maturityLevels in questions.js
export const MATURITY_COLORS_HEX = {
  beginning:  '#E74C3C',
  developing: '#E67E22',
  maturing:   '#F1C40F',
  advanced:   '#2EA3F2',
  leading:    '#27AE60',
}

// Maturity colors by score range — RGB arrays for jsPDF
export function matColorRGB(score) {
  if (score == null) return [100, 116, 139]  // slate500 — no data
  if (score < 20) return [231,  76,  60]     // Beginning  #E74C3C
  if (score < 40) return [230, 126,  34]     // Developing #E67E22
  if (score < 60) return [241, 196,  15]     // Maturing   #F1C40F
  if (score < 80) return [46,  163, 242]     // Advanced   #2EA3F2
  return              [39,  174,  96]         // Leading    #27AE60
}

// Role group colors — hex
export const ROLE_COLORS_HEX = {
  executive:    '#7C3AED',
  management:   '#2563EB',
  practitioner: '#059669',
}

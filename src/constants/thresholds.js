// ─────────────────────────────────────────────────────────────────────────────
// Shared threshold constants
// Single source of truth for all magic numbers used in scoring, flagging,
// and display logic. Import from here rather than hard-coding inline.
// ─────────────────────────────────────────────────────────────────────────────

// ── Perception gap ────────────────────────────────────────────────────────────
// Minimum point spread between role groups to flag a perception gap
export const PERCEPTION_GAP_THRESHOLD = 15

// ── Low visibility (Don't Know rate) ─────────────────────────────────────────
// % of DK responses in a dimension that triggers the low-visibility flag (0–100)
export const LOW_VISIBILITY_THRESHOLD = 30

// ── Compliance risk ───────────────────────────────────────────────────────────
// Default Governance score threshold below which a compliance risk callout fires
// for regulated industries. Individual industry profiles may override this.
export const COMPLIANCE_RISK_THRESHOLD = 40

// ── localStorage quota ────────────────────────────────────────────────────────
// Browsers typically allow 5 MB per origin (Safari, older Chrome/Firefox).
// Used as the denominator in the storage usage ratio calculation.
export const STORAGE_QUOTA_BYTES = 5_242_880

// Storage warning thresholds (ratio 0–1)
export const STORAGE_WARN_RATIO     = 0.7
export const STORAGE_CRITICAL_RATIO = 0.9

// ── html2canvas ───────────────────────────────────────────────────────────────
// Scale factor for html2canvas captures. 1.5 keeps canvas size within GPU
// memory limits on most hardware while still producing sharper-than-screen output.
// Do NOT increase to 2 without testing on low-end hardware — it can silently
// truncate canvas height on machines with limited GPU memory (~8–16 MB limit).
export const HTML2CANVAS_SCALE = 1.5

// ── Recommendation tiers ──────────────────────────────────────────────────────
// Aligned exactly to maturityLevels bands in questions.js.
// Used in recommendations.js and anywhere score tiers need to be derived.
// IMPORTANT: If maturityLevels bands in questions.js change, update these too.
export const RECOMMENDATION_TIERS = {
  low:     { min: 0,   max: 39  },  // Beginning / Developing
  medium:  { min: 40,  max: 59  },  // Maturing
  high:    { min: 60,  max: 79  },  // Advanced
  sustain: { min: 80,  max: 100 },  // Leading
}

// Derive tier string from a numeric score
export function scoreTier(score) {
  if (score == null || !isFinite(score)) return 'low'
  if (score <= RECOMMENDATION_TIERS.low.max)    return 'low'
  if (score <= RECOMMENDATION_TIERS.medium.max) return 'medium'
  if (score <= RECOMMENDATION_TIERS.high.max)   return 'high'
  return 'sustain'
}

// ── Narrative DK visibility flag ──────────────────────────────────────────────
// % threshold above which a dimension is flagged as low-visibility in the narrative
export const NARRATIVE_LOW_VIS_THRESHOLD = 0.4  // 40% DK rate

// ── Sequencing / phase status ─────────────────────────────────────────────────
// Score at or above this value means a dimension is "established" for phase status
export const PHASE_ESTABLISHED_THRESHOLD = 60

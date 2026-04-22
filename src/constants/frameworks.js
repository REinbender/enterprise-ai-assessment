// ─────────────────────────────────────────────────────────────────────────────
// Framework Alignment — v1.0.0
//
// Maps each of the 60 assessment questions to one or more recognized industry
// frameworks. Used by:
//   - FrameworkAlignmentCard on CompositeResults and ResultsPage (dimension-level)
//   - DimensionAssessment question cards (question-level badges)
//   - PDF exports (methodology section)
//
// These are ALIGNMENT references — not certifications. They indicate which
// framework function/clause each question most closely corresponds to, to help
// consultants and stakeholders trace the assessment to authoritative sources.
//
// Sources referenced:
//   - NIST AI Risk Management Framework (AI RMF 1.0, Jan 2023)
//     Functions: GOVERN, MAP, MEASURE, MANAGE — each with numbered categories
//   - ISO/IEC 42001:2023 — AI Management Systems (clauses 4–10, Annex A controls)
//   - ISO/IEC 23894:2023 — AI Risk Management
//   - EU AI Act (Regulation 2024/1689) — risk-based obligations, Articles 9–15
//   - OECD AI Principles (2019, updated 2024)
//   - DAMA-DMBOK v2 — Data Management Body of Knowledge
//   - Google MLOps Maturity Model (2020), Microsoft Azure MLOps Maturity Model
//   - WEF AI Governance Alliance (2024)
// ─────────────────────────────────────────────────────────────────────────────

// ── Dimension-level framework summaries (shown on all reports) ──────────────
export const DIM_FRAMEWORKS = {
  1: {
    label: 'Strategy',
    primary: [
      { name: 'NIST AI RMF 1.0', detail: 'GOVERN 1.x (policy & process), GOVERN 2.x (accountability), GOVERN 3.x (workforce)' },
      { name: 'OECD AI Principles', detail: 'Inclusive growth & well-being, human-centered values' },
    ],
    secondary: [
      { name: 'ISO/IEC 42001:2023', detail: 'Clause 5 (Leadership), Clause 6 (Planning)' },
    ],
  },
  2: {
    label: 'Data',
    primary: [
      { name: 'NIST AI RMF 1.0', detail: 'MAP 1.x (context), MAP 2.x (data categorization), MEASURE 2.x (data quality)' },
      { name: 'DAMA-DMBOK v2', detail: 'Data governance, data quality, metadata management' },
    ],
    secondary: [
      { name: 'ISO/IEC 42001:2023', detail: 'Annex A.7 (Data for AI systems)' },
      { name: 'EU AI Act', detail: 'Article 10 (Data and data governance)' },
    ],
  },
  3: {
    label: 'Governance',
    primary: [
      { name: 'NIST AI RMF 1.0', detail: 'MAP 5.x (risks), MEASURE 1–4 (bias, validity, reliability), MANAGE 1–4 (risk response)' },
      { name: 'ISO/IEC 42001:2023', detail: 'Clause 8 (Operation), Annex A (controls)' },
      { name: 'EU AI Act', detail: 'Articles 9 (risk mgmt), 11 (docs), 12 (logs), 14 (human oversight), 15 (accuracy/robustness)' },
    ],
    secondary: [
      { name: 'ISO/IEC 23894:2023', detail: 'AI risk management guidance' },
    ],
  },
  4: {
    label: 'Talent',
    primary: [
      { name: 'NIST AI RMF 1.0', detail: 'GOVERN 3.x (workforce diversity, equity, inclusion), GOVERN 6.x (third-party & workforce training)' },
      { name: 'WEF AI Governance Alliance', detail: 'Responsible AI talent development' },
    ],
    secondary: [
      { name: 'ISO/IEC 42001:2023', detail: 'Clause 7.2 (Competence), 7.3 (Awareness)' },
    ],
  },
  5: {
    label: 'Operations / MLOps',
    primary: [
      { name: 'NIST AI RMF 1.0', detail: 'MEASURE 4.x (monitoring), MANAGE 4.x (continuous improvement)' },
      { name: 'Google MLOps Maturity Model', detail: 'Levels 0–2: manual → CI/CD → automated retraining' },
      { name: 'Microsoft Azure MLOps Maturity Model', detail: 'Levels 0–4: no MLOps → full MLOps automation' },
    ],
    secondary: [
      { name: 'ISO/IEC 42001:2023', detail: 'Annex A.6 (AI system lifecycle)' },
    ],
  },
}

// ── Question-level framework tags ───────────────────────────────────────────
// Each question maps to one short primary tag (shown as badge) and optionally a
// secondary tag. Format: { primary: 'NIST: GOVERN 1.1', secondary: '...' | null }
//
// Mappings are derived from question text / intent against NIST AI RMF 1.0
// Playbook categories and ISO/IEC 42001:2023 Annex A controls.
// ─────────────────────────────────────────────────────────────────────────────

export const QUESTION_FRAMEWORKS = {
  1: [
    { primary: 'NIST: GOVERN 1.1', secondary: 'ISO 42001: 6.2' },   // Q1: formal documented AI strategy
    { primary: 'NIST: GOVERN 2.1', secondary: 'ISO 42001: 5.1' },   // Q2: executive sponsorship
    { primary: 'NIST: MAP 1.1',    secondary: 'OECD AI Principle 1' }, // Q3: use cases with ROI
    { primary: 'NIST: GOVERN 1.2', secondary: null },               // Q4: competitive differentiation
    { primary: 'NIST: MAP 1.2',    secondary: 'ISO 42001: 6.1.4' }, // Q5: prioritization process
    { primary: 'NIST: MEASURE 3.1',secondary: null },               // Q6: tracking outcomes
    { primary: 'NIST: GOVERN 1.1', secondary: null },               // Q7: multi-year roadmap
    { primary: 'NIST: GOVERN 2.2', secondary: null },               // Q8: business unit alignment
    { primary: 'NIST: GOVERN 1.4', secondary: null },               // Q9: dedicated budget
    { primary: 'NIST: MANAGE 1.1', secondary: null },               // Q10: pilot-to-production
    { primary: 'NIST: GOVERN 1.3', secondary: 'EU AI Act Art. 3' }, // Q11: GenAI strategic position
    { primary: 'NIST: GOVERN 3.2', secondary: null },               // Q12: leadership AI literacy
  ],
  2: [
    { primary: 'NIST: MAP 2.2',    secondary: 'DAMA: Data Governance' }, // Q1: centrally managed data ownership
    { primary: 'NIST: MEASURE 2.8',secondary: 'DAMA: Data Quality' },    // Q2: data quality
    { primary: 'NIST: GOVERN 1.1', secondary: 'ISO 42001: A.7.2' },      // Q3: data governance framework
    { primary: 'NIST: MAP 2.3',    secondary: null },                    // Q4: data pipelines
    { primary: 'NIST: MANAGE 3.1', secondary: null },                    // Q5: AI-ready infrastructure
    { primary: 'NIST: MAP 2.3',    secondary: 'DAMA: Data Integration' },// Q6: secure API access
    { primary: 'NIST: MAP 2.3',    secondary: null },                    // Q7: real-time processing
    { primary: 'NIST: MAP 2.2',    secondary: 'DAMA: Metadata Mgmt' },   // Q8: catalogs & lineage
    { primary: 'NIST: MAP 4.1',    secondary: 'EU AI Act Art. 10' },     // Q9: regulated data protection
    { primary: 'NIST: MAP 2.3',    secondary: null },                    // Q10: data onboarding
    { primary: 'NIST: GOVERN 6.1', secondary: 'EU AI Act Art. 10' },     // Q11: GenAI data controls
    { primary: 'NIST: MANAGE 3.2', secondary: null },                    // Q12: scalable storage/compute
  ],
  3: [
    { primary: 'NIST: GOVERN 1.1', secondary: 'ISO 42001: A.2' },         // Q1: AI policies/ethics
    { primary: 'NIST: MAP 5.1',    secondary: 'EU AI Act Art. 9' },       // Q2: risk assessment process
    { primary: 'NIST: MEASURE 2.9',secondary: 'EU AI Act Art. 13' },      // Q3: auditability & explainability
    { primary: 'NIST: MEASURE 2.11',secondary: 'EU AI Act Art. 15' },     // Q4: bias/fairness testing
    { primary: 'NIST: GOVERN 1.1', secondary: 'GDPR / EU AI Act' },       // Q5: regulatory compliance
    { primary: 'NIST: GOVERN 2.1', secondary: 'ISO 42001: 5.3' },         // Q6: named accountability
    { primary: 'NIST: GOVERN 6.1', secondary: 'EU AI Act Art. 14' },      // Q7: GenAI acceptable use
    { primary: 'NIST: MANAGE 4.2', secondary: 'ISO 42001: A.6.2.8' },     // Q8: AI incident response
    { primary: 'NIST: MEASURE 4.1',secondary: 'EU AI Act Art. 12' },      // Q9: audits of AI systems
    { primary: 'NIST: GOVERN 6.1', secondary: 'ISO 42001: A.10' },        // Q10: third-party vendors
    { primary: 'NIST: MANAGE 2.4', secondary: 'ISO 42001: A.6.2.9' },     // Q11: AI retirement process
    { primary: 'NIST: GOVERN 2.1', secondary: 'ISO 42001: 5.1' },         // Q12: governance committee
  ],
  4: [
    { primary: 'NIST: GOVERN 3.1', secondary: 'ISO 42001: 7.2' },   // Q1: dedicated AI/ML talent
    { primary: 'NIST: GOVERN 3.2', secondary: 'ISO 42001: 7.3' },   // Q2: upskilling program
    { primary: 'NIST: GOVERN 2.1', secondary: null },               // Q3: data-driven culture
    { primary: 'NIST: GOVERN 3.2', secondary: null },               // Q4: AI tools literacy
    { primary: 'NIST: MANAGE 1.4', secondary: null },               // Q5: change management
    { primary: 'NIST: MAP 3.4',    secondary: null },               // Q6: domain expert involvement
    { primary: 'NIST: GOVERN 3.2', secondary: 'EU AI Act Art. 4' }, // Q7: GenAI literacy
    { primary: 'NIST: GOVERN 2.2', secondary: null },               // Q8: cross-functional collaboration
    { primary: 'NIST: GOVERN 3.1', secondary: null },               // Q9: community of practice / CoE
    { primary: 'NIST: GOVERN 3.1', secondary: null },               // Q10: psychological safety
    { primary: 'NIST: MEASURE 3.3',secondary: null },               // Q11: literacy measurement
    { primary: 'NIST: GOVERN 3.1', secondary: null },               // Q12: career paths
  ],
  5: [
    { primary: 'MLOps L3+',         secondary: 'NIST: MANAGE 4.1' },    // Q1: mature MLOps practices
    { primary: 'MLOps L2',          secondary: 'ISO 42001: A.6.2.6' },  // Q2: version control + reproducibility
    { primary: 'MLOps L2',          secondary: 'NIST: MEASURE 2.5' },   // Q3: automated testing
    { primary: 'MLOps L2',          secondary: null },                  // Q4: CI/CD for models
    { primary: 'NIST: MEASURE 4.1', secondary: 'EU AI Act Art. 15' },   // Q5: production monitoring
    { primary: 'NIST: MANAGE 4.1',  secondary: null },                  // Q6: retraining process
    { primary: 'MLOps L2',          secondary: null },                  // Q7: experiment tracking
    { primary: 'NIST: MEASURE 4.1', secondary: null },                  // Q8: SLAs
    { primary: 'NIST: MAP 4.1',     secondary: 'EU AI Act Art. 11' },   // Q9: model cards / documentation
    { primary: 'MLOps L1+',         secondary: 'ISO 42001: A.6.2.2' },  // Q10: AI dev best practices
    { primary: 'NIST: MANAGE 4.1',  secondary: 'EU AI Act Art. 15' },   // Q11: GenAI production ops
    { primary: 'NIST: MANAGE 2.3',  secondary: null },                  // Q12: efficiency & cost
  ],
}

// ── Industry-level framework summaries (always visible) ─────────────────────
// Maps industry names (matching CompanyForm.jsx) to their core regulatory context.
// Unlike compliance-risk callouts (which fire only on low scores), these are
// rendered whenever an industry is selected so the user always sees the relevant
// frameworks.
// ─────────────────────────────────────────────────────────────────────────────

export const INDUSTRY_FRAMEWORKS = {
  'Financial Services & Banking': {
    tier: 'Highly Regulated',
    summary: 'AI used in credit, trading, fraud, or AML is subject to model risk management requirements from multiple regulators.',
    frameworks: [
      { name: 'SR 11-7',      scope: 'Federal Reserve / OCC — model risk management (governance, validation, monitoring)' },
      { name: 'DORA',         scope: 'EU — digital operational resilience, third-party AI risk, incident reporting' },
      { name: 'FCRA / ECOA',  scope: 'US — explainability & bias monitoring for credit/pricing/adverse action AI' },
    ],
  },
  'Healthcare & Life Sciences': {
    tier: 'Highly Regulated',
    summary: 'Clinical AI faces FDA premarket requirements; patient-data AI triggers HIPAA obligations on de-identification and access.',
    frameworks: [
      { name: 'FDA SaMD',           scope: 'Software as a Medical Device — 510(k), PCCP for AI that informs clinical decisions' },
      { name: 'HIPAA',              scope: 'US — PHI protection, de-identification standards, BAAs for AI vendors' },
      { name: 'CMS / HEDIS / HCAHPS', scope: 'US — reimbursement alignment and quality measurement for clinical AI' },
    ],
  },
  'Government & Public Sector': {
    tier: 'Highly Regulated',
    summary: 'Federal AI must follow OMB policy and NIST AI RMF; FedRAMP authorization is required for cloud-hosted AI.',
    frameworks: [
      { name: 'OMB M-24-10',    scope: 'Federal — AI use case inventory, rights-impacting & safety-impacting AI controls' },
      { name: 'NIST AI RMF 1.0', scope: 'Federal benchmark — govern/map/measure/manage functions for all AI' },
      { name: 'FedRAMP',        scope: 'Federal — authorization required for cloud AI services (Low/Moderate/High)' },
    ],
  },
  'Energy & Utilities': {
    tier: 'Highly Regulated',
    summary: 'Operational AI touching grid infrastructure is subject to NERC CIP cybersecurity standards and FERC oversight.',
    frameworks: [
      { name: 'NERC CIP',  scope: 'North America — critical infrastructure protection for grid-connected AI/OT systems' },
      { name: 'FERC',      scope: 'US — oversight of AI in wholesale energy markets and transmission planning' },
    ],
  },
  'Manufacturing & Industrial': {
    tier: 'Regulated (Operational Safety)',
    summary: 'Industrial AI in safety-critical OT environments follows IEC and ISO quality/safety standards.',
    frameworks: [
      { name: 'IEC 62443',          scope: 'Industrial OT cybersecurity — applies to AI connected to production control systems' },
      { name: 'ISO 9001 / IATF 16949', scope: 'Quality management — AI systems in production must integrate with quality controls' },
    ],
  },
  'Retail & Consumer Goods': {
    tier: 'Privacy-Regulated',
    summary: 'Personalization and recommendation AI faces consumer-privacy regulations and FTC advertising/pricing scrutiny.',
    frameworks: [
      { name: 'FTC Act Section 5', scope: 'US — unfair or deceptive practices, including algorithmic pricing and advertising' },
      { name: 'CCPA / CPRA',       scope: 'California — consumer data rights, automated decision-making disclosures' },
      { name: 'GDPR',              scope: 'EU — data subject rights for EU customers, Art. 22 automated decisions' },
    ],
  },
  'Education': {
    tier: 'Regulated (Student Data)',
    summary: 'Student-data AI is governed by FERPA; K-12 and student-facing AI faces additional state-level regulation.',
    frameworks: [
      { name: 'FERPA', scope: 'US — student education records, parental/student rights, vendor contracts' },
    ],
  },
  'Technology & Software': {
    tier: 'Voluntary + Customer-Driven',
    summary: 'Technology firms face customer-driven compliance (SOC 2, ISO 27001) and are increasingly adopting AI-specific frameworks proactively.',
    frameworks: [
      { name: 'NIST AI RMF 1.0', scope: 'Voluntary benchmark — widely adopted by B2B buyers as a vendor evaluation criterion' },
      { name: 'ISO/IEC 42001:2023', scope: 'Voluntary — first certifiable AI management system standard; differentiator for AI vendors' },
      { name: 'EU AI Act',       scope: 'EU — providers of high-risk or GPAI models with EU users have direct obligations' },
    ],
  },
  'Professional Services': {
    tier: 'Voluntary + Client-Driven',
    summary: 'Client confidentiality obligations and professional-conduct rules drive AI controls; regulated clients impose additional requirements.',
    frameworks: [
      { name: 'ISO/IEC 42001:2023', scope: 'Voluntary — increasingly requested by regulated clients for AI service providers' },
      { name: 'NIST AI RMF 1.0',   scope: 'Voluntary — expected by federal and regulated-industry clients' },
    ],
  },
  'Telecommunications': {
    tier: 'Regulated (Network & Privacy)',
    summary: 'Telco AI faces network-neutrality/CPNI rules and growing regulation of customer-data analytics.',
    frameworks: [
      { name: 'CPNI (47 CFR §64.2005)', scope: 'US — customer proprietary network information protections for AI analytics' },
      { name: 'GDPR / CCPA',            scope: 'EU/US — subscriber data rights, automated decisioning disclosures' },
    ],
  },
  'Media & Entertainment': {
    tier: 'Emerging Regulation',
    summary: 'Generative-AI-driven content faces evolving copyright, likeness, and disclosure obligations.',
    frameworks: [
      { name: 'EU AI Act',        scope: 'EU — GPAI transparency obligations (Art. 50), deepfake labeling' },
      { name: 'US Copyright Office guidance', scope: 'US — AI-generated content registrability, training-data disclosure proposals' },
    ],
  },
  'Transportation & Logistics': {
    tier: 'Regulated (Safety)',
    summary: 'Autonomous-vehicle and safety-critical routing AI is subject to DOT, FMCSA, and NHTSA oversight.',
    frameworks: [
      { name: 'DOT / NHTSA', scope: 'US — autonomous vehicle safety standards, AV safety data reporting' },
      { name: 'FMCSA',       scope: 'US — commercial motor vehicle safety, AI-assisted driving systems' },
    ],
  },
  'Real Estate & Construction': {
    tier: 'Fair-Lending & Safety',
    summary: 'AI used in tenant screening, lending, or insurance underwriting faces fair-housing scrutiny.',
    frameworks: [
      { name: 'Fair Housing Act', scope: 'US — disparate-impact review for AI in tenant screening, pricing, and lending' },
      { name: 'CFPB guidance',    scope: 'US — AI-assisted lending decisions, adverse action notices' },
    ],
  },
  'Other': null, // no industry-specific frameworks
}

// ── Helper: get framework info for a dimension ──────────────────────────────
export function getDimensionFrameworks(dimId) {
  return DIM_FRAMEWORKS[dimId] || null
}

// ── Helper: get per-question framework tags ─────────────────────────────────
export function getQuestionFramework(dimId, qIdx) {
  return QUESTION_FRAMEWORKS[dimId]?.[qIdx] || null
}

// ── Helper: get industry framework summary ──────────────────────────────────
export function getIndustryFrameworks(industry) {
  return INDUSTRY_FRAMEWORKS[industry] || null
}

// ── PDF convenience: flat string per dimension (preserves existing PDF format) ─
export const DIM_FRAMEWORKS_FLAT = Object.fromEntries(
  Object.entries(DIM_FRAMEWORKS).map(([id, d]) => [
    id,
    [...d.primary, ...d.secondary].map(f => f.name).join(' · '),
  ])
)

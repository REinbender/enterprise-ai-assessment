// ─────────────────────────────────────────────────────────────────────────────
// Industry Profiles — v1.7.0
//
// Drives four features:
//   D2 — Industry Intelligence Card (peer benchmark + top use cases)
//   D3 — Industry-aware sequencing (govOverridePhase1 moves Governance → Phase 1)
//   D4 — Compliance urgency flag (named regulation callout when score < threshold)
//
// Keys match the exact industry strings from CompanyForm.jsx.
// ─────────────────────────────────────────────────────────────────────────────

export const INDUSTRY_PROFILES = {

  // ── Financial Services & Banking ──────────────────────────────────────────
  'Financial Services & Banking': {
    peerBenchmark: {
      maturityTier: 'Developing → Maturing',
      context:
        'Financial services organizations are broadly in the Developing-to-Maturing range on AI readiness — driven by strong Strategy investment but persistent Governance and Talent gaps. Regulatory overhead from SR 11-7, DORA, and FCRA creates meaningful deployment friction that keeps many firms behind their stated ambitions despite years of AI investment.',
      leaders:
        'Leading institutions differentiate by maintaining dedicated model risk management teams, automated model validation pipelines, and governance that runs at deployment velocity rather than lagging it.',
    },
    topUseCases: [
      {
        name: 'Credit Risk & Underwriting Automation',
        value: '15–30% reduction in default rates; 40% faster credit decisions; reduced underwriter FTE on routine applications',
      },
      {
        name: 'Real-Time Fraud Detection & Prevention',
        value: '20–40% fraud loss reduction; sub-millisecond decisioning at transaction scale; 30–50% reduction in false positive customer friction',
      },
      {
        name: 'Hyper-Personalization & Next Best Action',
        value: '15–25% increase in product cross-sell conversion; measurable NPS improvement; reduced cost-to-serve through proactive offer optimization',
      },
      {
        name: 'AML / Compliance Monitoring Automation',
        value: '30–60% reduction in false positive SARs; significant FTE reallocation from manual transaction review to investigation; faster regulatory reporting',
      },
    ],
    regulations: [
      {
        name: 'SR 11-7',
        description:
          'Federal Reserve / OCC model risk management guidance requires documented governance, independent validation, and ongoing monitoring for all models used in credit, risk, and trading decisions. Non-compliance creates examination findings and deployment restrictions.',
      },
      {
        name: 'DORA (EU)',
        description:
          'Digital Operational Resilience Act requires AI system resilience testing, third-party risk management, and incident reporting for financial entities operating in EU markets. Compliance obligations are active.',
      },
      {
        name: 'FCRA / ECOA',
        description:
          'Fair Credit Reporting Act and Equal Credit Opportunity Act apply to AI-driven underwriting, pricing, and adverse action decisions — requiring explainability and bias monitoring as legal prerequisites.',
      },
    ],
    priorityDimension: 3,
    govOverridePhase1: true,
    govPhase1Rationale:
      'For financial institutions, Governance is a regulatory prerequisite — not a Phase 2 capability. SR 11-7, DORA, and FCRA create direct examination exposure for AI systems deployed without documented model risk controls. Regulators do not accept a roadmap as a substitute for current controls.',
    complianceRisk: {
      dimId: 3,
      threshold: 40,
      label: 'Regulatory Exposure: Model Risk Management',
      regulations: 'SR 11-7 · DORA · FCRA / ECOA',
      description:
        'Your Governance score indicates gaps in model risk management controls that create direct regulatory exposure. SR 11-7 requires documented governance, independent validation, and ongoing monitoring for any model used in credit, fraud, or trading decisions. DORA compliance obligations are active for EU-market operations. Regulators expect evidence of current controls — not a future roadmap — before approving AI for regulated decision-making.',
    },
  },

  // ── Healthcare & Life Sciences ────────────────────────────────────────────
  'Healthcare & Life Sciences': {
    peerBenchmark: {
      maturityTier: 'Developing',
      context:
        'Healthcare and life sciences organizations broadly sit in the Developing range — with life sciences firms (pharma, biotech) typically ahead of health systems due to stronger data infrastructure investment. The primary constraint industry-wide is regulatory overhead: FDA SaMD pathways, HIPAA de-identification requirements, and reimbursement alignment create deployment friction that inflates time-to-value for clinical AI.',
      leaders:
        'Leading health systems and pharma organizations differentiate by treating regulatory compliance as an engineering problem — building HIPAA-compliant data pipelines, FDA Predetermined Change Control Plans, and clinical validation frameworks into standard development practice.',
    },
    topUseCases: [
      {
        name: 'Clinical Decision Support & Diagnostic Assistance',
        value: '15–25% improvement in diagnostic accuracy; reduced time-to-diagnosis for imaging-heavy specialties; measurable reduction in missed findings',
      },
      {
        name: 'Drug Discovery & Clinical Trial Optimization',
        value: '30–50% reduction in pre-clinical screening time; 20–35% improvement in trial site selection accuracy; accelerated molecule prioritization',
      },
      {
        name: 'Revenue Cycle & Prior Authorization Automation',
        value: '15–30% reduction in claim denials; 40–60% faster prior authorization turnaround; significant reduction in revenue cycle FTE cost',
      },
      {
        name: 'Population Health & Early Intervention Analytics',
        value: '10–20% reduction in preventable readmissions; earlier identification of at-risk patient cohorts; measurable improvement in HEDIS and quality measure performance',
      },
    ],
    regulations: [
      {
        name: 'FDA SaMD / PCCP',
        description:
          'Software as a Medical Device regulations require pre-market submission or 510(k) clearance for AI used in clinical decision-making. The Predetermined Change Control Plan pathway enables iterative improvement under a pre-approved framework.',
      },
      {
        name: 'HIPAA',
        description:
          'Health Insurance Portability and Accountability Act requires Safe Harbor or Expert Determination de-identification before patient data can be used for AI training or inference outside direct care contexts.',
      },
      {
        name: 'CMS / Reimbursement Alignment',
        description:
          'Clinical AI use cases must align to reimbursable pathways and demonstrate outcomes against HEDIS/HCAHPS quality metrics to sustain organizational investment beyond initial pilots.',
      },
    ],
    priorityDimension: 3,
    govOverridePhase1: true,
    govPhase1Rationale:
      'FDA SaMD pathway requirements and HIPAA de-identification obligations are hard deployment prerequisites for any AI touching patient data or clinical workflows. Governance must reach a minimum viable threshold before AI Operations can scale — treating it as a Phase 2 investment creates regulatory exposure that blocks deployment approvals.',
    complianceRisk: {
      dimId: 3,
      threshold: 40,
      label: 'Regulatory Exposure: FDA SaMD & HIPAA Compliance',
      regulations: 'FDA SaMD · HIPAA · CMS Coverage Policies',
      description:
        'Your Governance score indicates gaps in the compliance controls required for clinical AI deployment. FDA SaMD regulations require pre-market review or 510(k) clearance for AI used in clinical decision support. HIPAA requires documented de-identification and data governance before patient data can be used in AI systems. Gaps at this score level create deployment blockers — not just audit findings.',
    },
  },

  // ── Technology & Software ─────────────────────────────────────────────────
  'Technology & Software': {
    peerBenchmark: {
      maturityTier: 'Maturing → Advanced',
      context:
        'Technology and software companies sit at the higher end of industry AI readiness — driven by strong Operations and Data Infrastructure. The primary gap is Governance: as EU AI Act obligations become enforceable and enterprise clients embed AI governance requirements into procurement contracts, technology companies that scaled deployment ahead of controls face growing sales cycle friction.',
      leaders:
        'AI-native technology companies differentiate by treating Governance as a product quality requirement rather than a compliance overhead — embedding bias testing, explainability, and audit trails into the development lifecycle from day one.',
    },
    topUseCases: [
      {
        name: 'AI-Powered Product Features & Differentiation',
        value: 'Direct revenue impact from product differentiation; measurable conversion improvement; reduced churn as AI features become switching costs',
      },
      {
        name: 'Developer Productivity & Code Generation',
        value: '20–40% reduction in development cycle time; measurable reduction in code defect rates; faster onboarding for new engineering hires',
      },
      {
        name: 'Intelligent Customer Support & Self-Service',
        value: '30–50% reduction in support ticket volume; faster resolution time; measurable CSAT improvement with reduced support headcount growth',
      },
      {
        name: 'Predictive Churn & Customer Lifetime Value Optimization',
        value: '10–20% improvement in retention rates; earlier identification of at-risk accounts; measurable improvement in net revenue retention',
      },
    ],
    regulations: [
      {
        name: 'EU AI Act',
        description:
          'The EU AI Act creates tiered obligations for AI systems — high-risk AI (hiring, credit, education, law enforcement) requires conformity assessments, transparency documentation, and human oversight mechanisms.',
      },
      {
        name: 'Enterprise Contract Requirements',
        description:
          'Enterprise procurement contracts increasingly require AI governance documentation, bias testing results, and data processing agreements — creating commercial gates that are more immediately constraining than regulatory timelines.',
      },
    ],
    priorityDimension: 5,
    govOverridePhase1: false,
    complianceRisk: {
      dimId: 3,
      threshold: 35,
      label: 'Commercial Risk: EU AI Act & Enterprise Procurement Gates',
      regulations: 'EU AI Act · Enterprise AI Procurement Requirements',
      description:
        'Your Governance score creates risk in two channels: EU AI Act obligations for high-risk AI system categories, and enterprise client procurement requirements that increasingly mandate AI governance documentation as a contract condition. Both are active commercial constraints — not future regulatory considerations.',
    },
  },

  // ── Manufacturing & Industrial ────────────────────────────────────────────
  'Manufacturing & Industrial': {
    peerBenchmark: {
      maturityTier: 'Developing',
      context:
        'Manufacturing organizations span a wide range — with large automotive OEMs and process manufacturers significantly ahead of discrete and mid-market manufacturers. The primary constraint across the sector is the OT/IT data divide: the highest-value AI use cases (predictive maintenance, quality defect detection) require historian and sensor data that is typically locked in OT environments not connected to enterprise data infrastructure.',
      leaders:
        'Leading manufacturers differentiate by treating OT/IT data integration as a foundational infrastructure investment rather than a project-specific data pull — establishing real-time sensor data pipelines as a shared platform capability before scaling AI use cases.',
    },
    topUseCases: [
      {
        name: 'Predictive Maintenance & Asset Reliability',
        value: '20–40% reduction in unplanned downtime; 15–25% reduction in maintenance costs; extended asset useful life; reduced spare parts inventory',
      },
      {
        name: 'AI-Powered Quality Defect Detection',
        value: '30–70% reduction in defect escape rate (computer vision inspection); measurable OEE improvement; reduced rework and scrap costs',
      },
      {
        name: 'Supply Chain Resilience & Demand Planning',
        value: '10–20% reduction in inventory carrying costs; 15–30% improvement in forecast accuracy; measurable reduction in stockout events',
      },
      {
        name: 'Autonomous Process Optimization',
        value: 'Measurable yield improvement on continuous process lines; energy cost reduction through AI-driven process parameter optimization; reduced operator intervention requirements',
      },
    ],
    regulations: [
      {
        name: 'IEC 62443',
        description:
          'Industrial cybersecurity standards apply to AI systems deployed in OT environments — model updates to production control systems require the same change management discipline as firmware updates.',
      },
      {
        name: 'ISO 9001 / IATF 16949',
        description:
          'Quality management system requirements create documentation and traceability obligations for AI-assisted quality decisions in regulated manufacturing sectors (automotive, aerospace, medical devices).',
      },
    ],
    priorityDimension: 2,
    govOverridePhase1: false,
    complianceRisk: {
      dimId: 2,
      threshold: 35,
      label: 'Operational Risk: OT/IT Data Integration Gap',
      regulations: 'IEC 62443 · OT Safety Requirements',
      description:
        'Your Data Infrastructure score indicates the OT/IT integration foundation required for high-value manufacturing AI use cases is not yet in place. Without reliable real-time sensor data pipelines, predictive maintenance and quality AI operate on incomplete or stale data — producing false alerts and missed detections that undermine operational trust. This is the single largest barrier to manufacturing AI ROI.',
    },
  },

  // ── Retail & Consumer Goods ───────────────────────────────────────────────
  'Retail & Consumer Goods': {
    peerBenchmark: {
      maturityTier: 'Developing → Maturing',
      context:
        'Retail and consumer goods organizations span a wide range — with pure-play e-commerce and digital-native retailers significantly ahead of traditional brick-and-mortar. The primary constraint across the sector is data fragmentation: transactional, behavioral, and supply chain signals are typically siloed across channels, limiting the accuracy of both personalization and demand forecasting AI.',
      leaders:
        'Leading retailers differentiate by maintaining unified real-time customer data platforms that consolidate all behavioral signals, enabling personalization that compounds in accuracy as the customer relationship deepens over time.',
    },
    topUseCases: [
      {
        name: 'Demand Forecasting & Inventory Optimization',
        value: '10–25% reduction in inventory carrying costs; 15–30% improvement in forecast accuracy; measurable reduction in both stockout and overstock events across the network',
      },
      {
        name: 'Personalized Recommendations & Next Best Offer',
        value: '15–30% increase in conversion rate; 10–20% improvement in average order value; measurable reduction in customer acquisition cost through personalized retention',
      },
      {
        name: 'Dynamic Pricing & Margin Optimization',
        value: '2–5% gross margin improvement; faster competitive price response; reduced markdown exposure through AI-driven clearance optimization',
      },
      {
        name: 'Supply Chain Visibility & Disruption Response',
        value: '15–25% reduction in logistics cost variance; faster disruption identification; measurable improvement in on-time delivery performance',
      },
    ],
    regulations: [
      {
        name: 'FTC Act / Algorithmic Pricing',
        description:
          'FTC enforcement guidance on algorithmic pricing and personalization requires documented controls to prevent price discrimination, collusion, and deceptive practices — enforcement activity is increasing.',
      },
      {
        name: 'CCPA / State Privacy Laws',
        description:
          'California Consumer Privacy Act and equivalent state laws create consent and data rights obligations for AI systems using customer behavioral data — non-compliance creates class action and regulatory exposure.',
      },
    ],
    priorityDimension: 2,
    govOverridePhase1: false,
    complianceRisk: {
      dimId: 2,
      threshold: 35,
      label: 'Capability Risk: Fragmented Customer Data',
      regulations: 'FTC Algorithmic Pricing · CCPA / State Privacy Laws',
      description:
        'Your Data Infrastructure score indicates customer data fragmentation that will directly constrain personalization accuracy, demand forecasting quality, and supply chain AI performance. Additionally, fragmented data governance increases CCPA and state privacy law exposure — AI systems using customer behavioral data require documented data lineage and consent management that depends on mature data infrastructure.',
    },
  },

  // ── Energy & Utilities ────────────────────────────────────────────────────
  'Energy & Utilities': {
    peerBenchmark: {
      maturityTier: 'Developing',
      context:
        'Energy and utilities organizations are broadly in the Developing range — with large grid operators and IOUs ahead of smaller co-ops and municipal utilities. OT safety constraints, NERC CIP compliance obligations, and the operational consequence of AI failures in grid-connected environments create conservative deployment cultures that appropriately slow maturity progression.',
      leaders:
        'Leading grid operators and IOUs differentiate by establishing AI governance that runs at OT change management speed — embedded in existing ICS change control processes rather than operating as a separate technology governance track.',
    },
    topUseCases: [
      {
        name: 'Predictive Asset Maintenance & Grid Reliability',
        value: '15–30% reduction in unplanned outages; extended transformer and substation asset life; measurable reduction in emergency maintenance spend',
      },
      {
        name: 'Grid Optimization & Renewable Integration',
        value: 'Measurable improvement in renewable curtailment reduction; real-time load balancing that reduces reserve margin requirements; improved grid stability metrics',
      },
      {
        name: 'Energy Demand Forecasting',
        value: '20–40% improvement in short-term load forecast accuracy; reduced imbalance costs; better capacity planning for peak demand events',
      },
      {
        name: 'Customer Analytics & Demand Response',
        value: '10–20% improvement in demand response program participation; measurable customer churn reduction; increased uptake of time-of-use rate structures',
      },
    ],
    regulations: [
      {
        name: 'NERC CIP',
        description:
          'Critical Infrastructure Protection standards require cybersecurity controls for AI systems deployed in bulk electric system environments — including change management and supply chain risk management for AI vendors.',
      },
      {
        name: 'FERC Reliability Standards',
        description:
          'Federal Energy Regulatory Commission reliability standards apply to AI systems involved in operational decisions affecting grid stability — uncontrolled AI in these environments creates national security and reliability consequences.',
      },
    ],
    priorityDimension: 3,
    govOverridePhase1: true,
    govPhase1Rationale:
      'NERC CIP and FERC reliability standards create direct compliance obligations for AI deployed in grid-connected operational environments. Governance must lead AI investment in this sector — uncontrolled AI in OT settings carries grid stability, safety, and national security consequences that regulatory penalties alone cannot fully capture.',
    complianceRisk: {
      dimId: 3,
      threshold: 40,
      label: 'Regulatory & Safety Exposure: NERC CIP / FERC Compliance',
      regulations: 'NERC CIP · FERC Reliability Standards',
      description:
        'Your Governance score indicates gaps in the controls required for AI deployment in grid-connected operational environments. NERC CIP requires cybersecurity change management for AI systems touching bulk electric system operations. Beyond regulatory compliance, the operational consequence of AI failures in this environment is significant — inadequate governance is an operational safety issue, not only a compliance finding.',
    },
  },

  // ── Government & Public Sector ────────────────────────────────────────────
  'Government & Public Sector': {
    peerBenchmark: {
      maturityTier: 'Beginning → Developing',
      context:
        'Government and public sector organizations are broadly in the Beginning-to-Developing range — with federal civilian agencies ahead of state and local government. Procurement processes, ATO requirements, and the public accountability standard for AI failures create deployment timelines that are structurally longer than the private sector, limiting maturity progression despite meaningful investment.',
      leaders:
        'Leading federal agencies differentiate by treating ATO as an engineering process — building FedRAMP-compliant infrastructure and automated security control validation into standard development practice rather than managing it as a separate compliance workstream.',
    },
    topUseCases: [
      {
        name: 'Benefits Eligibility & Claims Processing Automation',
        value: 'Significant reduction in application processing time; measurable reduction in backlogs; improved accuracy in eligibility determinations with auditable decision trails',
      },
      {
        name: 'Fraud, Waste & Abuse Detection',
        value: '20–40% improvement in fraud pattern detection rates; faster investigation prioritization; measurable reduction in improper payments',
      },
      {
        name: 'Citizen Services & Intelligent Self-Service',
        value: '30–50% reduction in call center volume for routine inquiries; faster citizen response times; improved accessibility outcomes for underserved populations',
      },
      {
        name: 'Workforce Analytics & HR Optimization',
        value: 'Improved workforce planning accuracy; earlier identification of attrition risk; measurable improvement in hiring process efficiency',
      },
    ],
    regulations: [
      {
        name: 'OMB M-24-10',
        description:
          'Requires federal agencies to designate a Chief AI Officer, maintain an AI use case inventory, and establish AI governance frameworks — active compliance obligations for federal civilian agencies.',
      },
      {
        name: 'NIST AI RMF',
        description:
          'National Institute of Standards and Technology AI Risk Management Framework is a federal mandate for AI governance — agencies that do not reference it in their governance frameworks create audit findings.',
      },
      {
        name: 'FedRAMP / ATO',
        description:
          'Authority to Operate requirements mean AI systems cannot be deployed in federal environments without security authorization — making Governance a deployment gate, not a maturity aspiration.',
      },
    ],
    priorityDimension: 3,
    govOverridePhase1: true,
    govPhase1Rationale:
      'OMB M-24-10, NIST AI RMF compliance, and ATO requirements are legal prerequisites for AI deployment in federal environments — not maturity milestones. Governance must reach minimum compliance thresholds before Data Infrastructure investment can convert to deployed capability. Without ATO processes, AI systems cannot be deployed regardless of technical readiness.',
    complianceRisk: {
      dimId: 3,
      threshold: 40,
      label: 'Compliance Exposure: OMB M-24-10 & ATO Requirements',
      regulations: 'OMB M-24-10 · NIST AI RMF · FedRAMP / ATO',
      description:
        'Your Governance score indicates gaps in the AI governance framework required for OMB M-24-10 compliance and ATO authorization. Federal agencies without a Chief AI Officer designation, documented AI use case inventory, and NIST AI RMF-aligned governance are in active non-compliance with current OMB requirements. ATO gaps mean AI systems cannot be deployed to production regardless of their technical state.',
    },
  },

  // ── Professional Services ─────────────────────────────────────────────────
  'Professional Services': {
    peerBenchmark: {
      maturityTier: 'Developing → Maturing',
      context:
        'Professional services organizations span a wide range — with the largest global firms significantly ahead of boutique and regional practices. The primary constraint is not technology access but governance: client confidentiality obligations, data segregation requirements, and professional ethics standards create AI capability boundaries that do not exist in other industries.',
      leaders:
        'Leading professional services firms differentiate by treating client data governance as an engineering constraint embedded in the AI platform from day one — using synthetic data, privacy-preserving techniques, and strict engagement data segregation to build cross-engagement intelligence without violating confidentiality obligations.',
    },
    topUseCases: [
      {
        name: 'Document Review, Contract Analysis & Due Diligence',
        value: '60–80% reduction in document review time; higher accuracy on clause extraction than manual review; significant paralegal FTE reallocation to higher-value analysis',
      },
      {
        name: 'Research Synthesis & Knowledge Management',
        value: 'Faster insight development cycles; ability to surface cross-engagement intelligence (where permissible); measurable improvement in proposal quality and win rates',
      },
      {
        name: 'Client Insight Analytics & Account Intelligence',
        value: 'Earlier identification of expansion and at-risk signals; more precise pursuit prioritization; measurable improvement in account growth rates',
      },
      {
        name: 'Engagement Delivery Acceleration (Copilot / AI-Augmented Work)',
        value: '20–35% reduction in analysis cycle time; measurable improvement in deliverable consistency; faster onboarding of junior staff to engagement standards',
      },
    ],
    regulations: [
      {
        name: 'Client Contractual Obligations',
        description:
          'Most client service agreements explicitly restrict data use — AI systems that use client data for model training or cross-engagement inference without explicit permission create breach of contract liability.',
      },
      {
        name: 'Professional Ethics Standards',
        description:
          'Legal, accounting, and financial advisory professional ethics rules restrict AI use in ways that vary by jurisdiction and professional body — non-compliance creates licensing risk.',
      },
    ],
    priorityDimension: 3,
    govOverridePhase1: false,
    complianceRisk: {
      dimId: 3,
      threshold: 40,
      label: 'Client & Contractual Risk: Data Governance Gaps',
      regulations: 'Client Confidentiality Obligations · Professional Ethics Standards',
      description:
        'Your Governance score indicates data governance gaps that create direct client confidentiality risk. In professional services, AI systems that allow client data to cross engagement boundaries or be used for model training without explicit consent expose the firm to breach of contract liability and professional ethics violations. This risk is often discovered when a client asks for your AI data handling policy — having no documented answer is itself a commercial liability.',
    },
  },

  // ── Telecommunications ────────────────────────────────────────────────────
  'Telecommunications': {
    peerBenchmark: {
      maturityTier: 'Developing → Maturing',
      context:
        'Telecommunications organizations span a meaningful range — with Tier 1 carriers ahead of regional operators. Strong Data Infrastructure (driven by network telemetry maturity) is partially offset by Governance and Talent gaps across the sector. The primary constraint for mid-size operators is engineering talent: the skills required for network operations AI are specialized and not readily available at regional carrier scale.',
      leaders:
        'Leading Tier 1 carriers differentiate by investing in AI platforms that serve both network operations and customer-facing applications from a shared data and MLOps foundation — capturing reuse value across both investment tracks rather than building siloed capabilities.',
    },
    topUseCases: [
      {
        name: 'Network Anomaly Detection & Self-Healing',
        value: '20–40% reduction in mean time to detect (MTTD) for network incidents; measurable improvement in SLA adherence; significant NOC analyst workload reduction',
      },
      {
        name: 'Customer Churn Prediction & Retention Optimization',
        value: '10–20% improvement in proactive retention rates; earlier identification of at-risk subscribers; measurable reduction in involuntary churn',
      },
      {
        name: 'AI-Driven Fraud Detection',
        value: '30–50% improvement in subscription fraud and account takeover detection rates; faster SIM-swap fraud response; measurable reduction in fraud losses',
      },
      {
        name: 'Intelligent Customer Service & Self-Service',
        value: '25–40% reduction in call center handle time; measurable CSAT improvement; reduction in repeat contacts through better first-contact resolution',
      },
    ],
    regulations: [
      {
        name: 'FCC Part 64 / CPNI',
        description:
          'Customer Proprietary Network Information rules restrict how customer behavioral data can be used for AI-driven marketing and analytics — explicit consent frameworks are required for most AI use cases involving subscriber data.',
      },
      {
        name: 'STIR/SHAKEN',
        description:
          'Caller ID authentication framework creates obligations for AI-assisted fraud and robocall detection — FCC compliance requirements have active enforcement.',
      },
    ],
    priorityDimension: 2,
    govOverridePhase1: false,
    complianceRisk: {
      dimId: 2,
      threshold: 35,
      label: 'Capability Risk: Network Telemetry Infrastructure Gaps',
      regulations: 'FCC CPNI · Network SLA Obligations',
      description:
        'Your Data Infrastructure score indicates gaps in the network telemetry pipelines required for high-value network operations AI. The highest-ROI telecom AI use cases (anomaly detection, self-healing, fraud detection) require high-volume, low-latency data infrastructure that standard enterprise data architectures cannot support. This gap directly constrains the ROI achievable from AI investment in network operations.',
    },
  },

  // ── Media & Entertainment ─────────────────────────────────────────────────
  'Media & Entertainment': {
    peerBenchmark: {
      maturityTier: 'Developing → Maturing',
      context:
        'Media and entertainment organizations span a wide range — with streaming platforms significantly ahead of traditional broadcast and print media. The primary constraint for non-streaming organizations is content rights governance: AI use cases that touch licensed content require rights metadata management that most traditional media companies have not yet systematically addressed.',
      leaders:
        'Leading streaming platforms differentiate by treating recommendation and personalization infrastructure as a core product engineering investment — not a data science project — and building rights-aware content intelligence into the platform architecture from inception.',
    },
    topUseCases: [
      {
        name: 'Content Personalization & Recommendation',
        value: '15–30% increase in viewing hours / engagement time; measurable reduction in subscriber churn; improved content ROI through better audience matching',
      },
      {
        name: 'Content Moderation & Brand Safety',
        value: 'Faster at-scale content review with fewer human moderators required; measurable reduction in policy violation rates; reduced regulatory exposure from harmful content',
      },
      {
        name: 'Rights Portfolio Optimization',
        value: 'Improved acquisition decision accuracy; measurable reduction in rights overpayment; better audience performance forecasting for content investment decisions',
      },
      {
        name: 'Audience Analytics & Lifecycle Management',
        value: '10–20% improvement in subscriber retention; earlier identification of churn risk signals; measurable improvement in lifetime value through targeted engagement',
      },
    ],
    regulations: [
      {
        name: 'EU DSA / DMA',
        description:
          'Digital Services Act and Digital Markets Act require algorithmic transparency, bias auditing, and user controls for recommendation systems operating in European markets — with significant fine exposure for non-compliance.',
      },
      {
        name: 'DMCA / Content Rights',
        description:
          'Digital Millennium Copyright Act and licensing agreements create legal boundaries on AI use of content — models trained on licensed content without explicit rights authorization create IP liability.',
      },
      {
        name: 'COPPA',
        description:
          'Children\'s Online Privacy Protection Act creates strict consent and data handling requirements for AI systems that may reach users under 13 — algorithmic recommendation systems targeting minors require specific governance controls.',
      },
    ],
    priorityDimension: 3,
    govOverridePhase1: false,
    complianceRisk: {
      dimId: 3,
      threshold: 35,
      label: 'Legal & Regulatory Risk: Rights Governance & Algorithmic Transparency',
      regulations: 'EU DSA/DMA · DMCA · COPPA',
      description:
        'Your Governance score indicates gaps in rights governance and algorithmic transparency controls. EU DSA/DMA enforcement is active for recommendation systems operating in European markets — algorithmic transparency documentation and audit capabilities are legal requirements, not best practices. Additionally, AI use of content without proper rights metadata management creates DMCA liability that can halt production AI systems.',
    },
  },

  // ── Education ─────────────────────────────────────────────────────────────
  'Education': {
    peerBenchmark: {
      maturityTier: 'Beginning → Developing',
      context:
        'Educational institutions are broadly in the Beginning-to-Developing range — with EdTech companies and research universities significantly ahead of K-12 districts and community colleges. The public accountability standard for AI in education is appropriately higher than most commercial sectors: equity implications, FERPA restrictions, and the vulnerability of student populations create governance requirements that should precede deployment.',
      leaders:
        'Leading research universities and innovative districts differentiate by treating FERPA compliance as an engineering constraint built into data infrastructure — rather than a legal review gate applied at the end of development.',
    },
    topUseCases: [
      {
        name: 'Adaptive Learning & Personalized Instruction',
        value: 'Measurable improvement in student learning outcomes; earlier mastery identification enabling pacing acceleration; reduced teacher time on content differentiation',
      },
      {
        name: 'Early Intervention & At-Risk Student Identification',
        value: '15–25% improvement in early identification of students at academic or social-emotional risk; measurable improvement in intervention response time; demonstrable reduction in dropout rates when paired with effective support systems',
      },
      {
        name: 'Admissions & Enrollment Optimization',
        value: 'Improved yield prediction accuracy; more effective financial aid targeting; earlier identification of enrollment risk before enrollment deadlines',
      },
      {
        name: 'Administrative Automation & Operational Efficiency',
        value: 'Significant reduction in administrative processing time for routine tasks; measurable staff time reallocation to higher-value student-facing work',
      },
    ],
    regulations: [
      {
        name: 'FERPA',
        description:
          'Family Educational Rights and Privacy Act restricts disclosure of student education records — AI systems accessing student data require compliance with FERPA\'s school official exception or explicit consent, creating a legal prerequisite before AI can access student records.',
      },
      {
        name: 'COPPA',
        description:
          'Children\'s Online Privacy Protection Act creates strict parental consent requirements for AI systems used with students under 13 — any AI tool deployed in K-12 environments must address COPPA compliance.',
      },
      {
        name: 'Title VI / Equity Obligations',
        description:
          'Civil rights requirements prohibit AI systems that create disparate impacts across student populations by race, national origin, or other protected characteristics — algorithmic bias monitoring is a civil rights compliance obligation.',
      },
    ],
    priorityDimension: 3,
    govOverridePhase1: true,
    govPhase1Rationale:
      'FERPA compliance and Title VI equity obligations are legal prerequisites before any AI system can access student data or influence student outcomes. Governance is not a maturity milestone in education — it is the legal gate that determines whether AI can be deployed at all. Investing in AI Operations before FERPA-compliant data infrastructure and bias monitoring controls are in place creates legal exposure that blocks deployment.',
    complianceRisk: {
      dimId: 3,
      threshold: 40,
      label: 'Legal Exposure: FERPA, COPPA & Civil Rights Compliance',
      regulations: 'FERPA · COPPA · Title VI',
      description:
        'Your Governance score indicates gaps in the student data governance and equity controls required for legal AI deployment in educational settings. FERPA requires documented data governance before AI systems can access student records. Title VI civil rights obligations require bias monitoring for AI that influences student outcomes. These are not audit findings — they are deployment prerequisites that must be in place before AI systems interact with student data.',
    },
  },

  // ── Transportation & Logistics ────────────────────────────────────────────
  'Transportation & Logistics': {
    peerBenchmark: {
      maturityTier: 'Developing',
      context:
        'Transportation and logistics organizations are broadly in the Developing range — with express carriers and digitally mature 3PLs ahead of asset-heavy trucking and rail carriers. Safety obligations create a conservative AI deployment culture: the liability consequence of AI-assisted decisions in safety-critical contexts requires stronger governance controls before deployment than industries where failure modes carry lower consequences.',
      leaders:
        'Leading logistics organizations differentiate by treating safety management system integration as the governance design constraint for operational AI — rather than retrofitting safety controls after deployment is underway.',
    },
    topUseCases: [
      {
        name: 'Route Optimization & Network Planning',
        value: '8–15% reduction in fuel costs; measurable improvement in on-time delivery performance; reduced driver hours through optimized dispatch',
      },
      {
        name: 'Predictive Fleet Maintenance',
        value: '20–35% reduction in unplanned vehicle downtime; measurable reduction in roadside breakdown events; extended asset useful life',
      },
      {
        name: 'Demand Forecasting & Capacity Planning',
        value: '15–25% improvement in capacity utilization; reduced deadhead miles; measurable improvement in load factor and revenue per available unit',
      },
      {
        name: 'Customs Automation & Trade Compliance',
        value: 'Significant reduction in customs documentation processing time; measurable reduction in delay events; improved compliance accuracy',
      },
    ],
    regulations: [
      {
        name: 'FMCSA Safety Regulations',
        description:
          'Federal Motor Carrier Safety Administration regulations apply to AI-assisted driving, fatigue monitoring, and route decision systems — AI used in these contexts creates direct liability under existing safety frameworks.',
      },
      {
        name: 'DOT Safety Management Systems',
        description:
          'Department of Transportation SMS frameworks require documented safety controls for AI systems involved in operational decisions — gaps create both regulatory exposure and insurance liability.',
      },
    ],
    priorityDimension: 3,
    govOverridePhase1: false,
    complianceRisk: {
      dimId: 3,
      threshold: 35,
      label: 'Safety & Liability Risk: AI Governance in Safety-Critical Operations',
      regulations: 'FMCSA · DOT SMS · NTSB Potential Oversight',
      description:
        'Your Governance score indicates gaps in the AI governance controls required for safe deployment in transportation operations. FMCSA regulations create direct liability for AI-assisted decisions in safety-critical contexts. Inadequate governance in this sector is not merely a compliance risk — it is an operational safety issue that creates personal injury liability exposure when AI-assisted decisions contribute to incidents.',
    },
  },

  // ── Real Estate & Construction ────────────────────────────────────────────
  'Real Estate & Construction': {
    peerBenchmark: {
      maturityTier: 'Beginning → Developing',
      context:
        'Real estate and construction organizations are broadly in the Beginning-to-Developing range — with PropTech companies and large CRE investment managers significantly ahead of traditional brokerages and regional developers. The primary constraint is data fragmentation: MLS data, public records, environmental reports, and construction documents are siloed across incompatible systems, creating an integration challenge that precedes most AI investment.',
      leaders:
        'Leading CRE investment managers and PropTech companies differentiate by treating property data consolidation as a strategic asset — investing in data infrastructure that creates proprietary AI training advantages competitors cannot easily replicate.',
    },
    topUseCases: [
      {
        name: 'AI-Powered Property Valuation (AVM)',
        value: 'Faster and more consistent valuation at scale; measurable improvement in appraisal accuracy; ability to value portfolios and non-standard properties at speed that manual appraisal cannot match',
      },
      {
        name: 'Lease Abstraction & Document Intelligence',
        value: '60–80% reduction in lease review time; higher extraction accuracy than manual review; significant paralegal and analyst FTE reallocation',
      },
      {
        name: 'Construction Risk Monitoring & Project Analytics',
        value: 'Earlier identification of schedule and cost risk; measurable reduction in project overrun events; improved subcontractor performance management',
      },
      {
        name: 'Tenant Experience & Predictive Maintenance',
        value: 'Measurable improvement in tenant satisfaction scores; reduction in reactive maintenance costs; improved occupancy retention',
      },
    ],
    regulations: [
      {
        name: 'ECOA / Fair Lending',
        description:
          'Equal Credit Opportunity Act applies to AI-driven underwriting and pricing decisions — algorithmic valuation and lending models require bias testing and adverse action explainability as legal requirements.',
      },
      {
        name: 'FHA / Fair Housing Act',
        description:
          'Fair Housing Act prohibits AI-driven decisions that create disparate impacts in property sales, rentals, and lending — algorithmic tenant screening and valuation are areas of active HUD enforcement.',
      },
    ],
    priorityDimension: 3,
    govOverridePhase1: false,
    complianceRisk: {
      dimId: 3,
      threshold: 40,
      label: 'Legal Exposure: Fair Lending & Fair Housing Compliance',
      regulations: 'ECOA · FHA / Fair Housing Act · HUD Algorithmic Guidance',
      description:
        'Your Governance score indicates gaps in the bias monitoring and explainability controls required for AI used in property valuation, tenant screening, or lending decisions. ECOA and the Fair Housing Act make algorithmic bias in these applications an active enforcement priority — HUD guidance on algorithmic valuation bias is increasingly specific. Deploying AI in these contexts without documented bias testing and adverse action explainability creates significant legal exposure.',
    },
  },

  // ── Other ─────────────────────────────────────────────────────────────────
  'Other': {
    peerBenchmark: {
      maturityTier: 'Developing',
      context:
        'Most organizations across industries have made initial AI investments but not yet established the governance, talent, and operational infrastructure needed to scale from pilot to enterprise value delivery.',
      leaders:
        'Organizations at leading maturity share a common pattern: they treat AI governance as a development prerequisite rather than a compliance audit, and they invest in Operations infrastructure before scaling the number of AI use cases.',
    },
    topUseCases: [
      {
        name: 'Process Automation & Workflow Intelligence',
        value: 'Measurable reduction in manual processing time; reallocation of staff from repetitive tasks to higher-value work; improved consistency and auditability of routine decisions',
      },
      {
        name: 'Document Processing & Knowledge Extraction',
        value: 'Significant reduction in document review and data entry time; higher accuracy than manual extraction; faster decision cycles that depend on document content',
      },
      {
        name: 'Customer Experience & Service Intelligence',
        value: 'Measurable improvement in response time and resolution rates; reduction in repetitive tier-1 support volume; improved customer satisfaction scores',
      },
      {
        name: 'Analytics, Forecasting & Decision Support',
        value: 'Faster insight development cycles; improved forecast accuracy; better resource allocation through AI-assisted planning',
      },
    ],
    regulations: [],
    priorityDimension: 1,
    govOverridePhase1: false,
    complianceRisk: null,
  },
}

/**
 * Returns the profile for a given industry, falling back to 'Other' if not found.
 */
export function getIndustryProfile(industry) {
  return INDUSTRY_PROFILES[industry] || INDUSTRY_PROFILES['Other']
}

/**
 * Returns true if this industry requires Governance to be treated as a Phase 1 prerequisite.
 */
export function isGovPhase1Industry(industry) {
  return !!(INDUSTRY_PROFILES[industry]?.govOverridePhase1)
}

/**
 * Returns the active compliance risk callout if the relevant dimension score is below threshold.
 * Returns null if no risk applies or score is above threshold.
 */
export function getComplianceRisk(industry, dimScores) {
  const profile = INDUSTRY_PROFILES[industry]
  if (!profile?.complianceRisk) return null
  const { dimId, threshold } = profile.complianceRisk
  const dim = dimScores.find(d => (d.id ?? d.dimId) === dimId)
  const score = dim != null ? (dim.score ?? dim.avg) : null
  if (score === null || score >= threshold) return null
  return profile.complianceRisk
}

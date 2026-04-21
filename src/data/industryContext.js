// ─────────────────────────────────────────────────────────────────────────────
// Industry Context — v1.6.0
// One regulatory/competitive context sentence per dimension × tier × industry.
// Keys match the exact industry strings from CompanyForm.jsx.
// ─────────────────────────────────────────────────────────────────────────────

const IC = {
  // ── DIM 1: AI Strategy & Value Realization ────────────────────────────────
  1: {
    low: {
      'Financial Services & Banking':
        'Financial institutions must ground AI strategy in model risk management obligations (SR 11-7, DORA) from inception — regulators expect documented governance before models are used in regulated decisions.',
      'Healthcare & Life Sciences':
        'Healthcare AI strategy must align with FDA SaMD pathways and CMS requirements to ensure clinical use cases translate into reimbursable, regulatorily defensible outcomes.',
      'Technology & Software':
        'Technology companies face existential competitive pressure to formalize AI strategy — differentiation windows narrow quickly as AI capabilities become commoditized across the industry.',
      'Manufacturing & Industrial':
        'Manufacturers need a formal AI strategy that bridges OT and IT environments, or AI investments will remain confined to the enterprise layer without reaching the shop floor where the highest-value use cases reside.',
      'Retail & Consumer Goods':
        'Retail organizations without a formal AI strategy typically see personalization, demand forecasting, and supply chain AI pursued as disconnected initiatives — missing the compounding value of an integrated portfolio.',
      'Energy & Utilities':
        'Energy sector AI strategy must address OT/IT convergence risks and asset safety constraints from inception, as uncontrolled AI deployments in operational environments carry regulatory and safety consequences.',
      'Government & Public Sector':
        'Federal and state agencies must align AI strategy to OMB M-24-10, designate a Chief AI Officer, and maintain an AI use case inventory as foundational compliance requirements.',
      'Professional Services':
        'Professional services firms need an AI strategy that explicitly resolves the tension between client confidentiality obligations and the data aggregation required to build effective AI capabilities.',
      'Telecommunications':
        'Telecommunications organizations benefit from AI strategy that explicitly spans network operations, customer experience, and fraud — three domains where AI generates measurable ROI but require distinct governance and data approaches.',
      'Media & Entertainment':
        'Media and entertainment organizations need AI strategy that addresses content rights and licensing constraints upfront, as these create deployment boundaries that must be planned around rather than discovered reactively.',
      'Education':
        'Educational institutions must anchor AI strategy to FERPA compliance and equity commitments, ensuring AI investments serve all student populations and do not amplify existing systemic gaps.',
      'Transportation & Logistics':
        'Transportation and logistics organizations need AI strategy that integrates safety management frameworks — unplanned AI deployments in this sector carry material liability if operational safety implications are not assessed upfront.',
      'Real Estate & Construction':
        'Real estate and construction organizations should anchor AI strategy to property lifecycle stages, as acquisition analytics, construction risk, and asset management AI have distinct data, tooling, and governance needs.',
      'Other':
        'A formal AI strategy ensures investments are aligned to business outcomes rather than technology novelty, creating the accountability structure needed to sustain AI funding through competing priorities.',
    },
    medium: {
      'Financial Services & Banking':
        'Financial services organizations at this stage should operationalize AI value tracking to satisfy both internal model risk governance and executive ROI reporting, creating a defensible audit trail for every model in production.',
      'Healthcare & Life Sciences':
        'Healthcare organizations should align AI value tracking to clinical quality metrics (HEDIS, HCAHPS) and operational KPIs, building the evidence base required for regulatory submissions and care pathway approvals.',
      'Technology & Software':
        'Technology companies at this stage should formalize the distinction between AI as an internal efficiency enabler and AI as a product differentiator — these require separate strategies, funding models, and success metrics.',
      'Manufacturing & Industrial':
        'Manufacturers should operationalize an AI value dashboard that connects OT/IT investments directly to yield improvement, downtime reduction, and quality defect KPIs to justify continued capital allocation.',
      'Retail & Consumer Goods':
        'Maturing retail AI programs should balance near-term personalization ROI with longer-term supply chain intelligence investments — the two have fundamentally different payback horizons that require explicit portfolio governance.',
      'Energy & Utilities':
        'Energy organizations at this stage should embed AI governance into existing OT change management processes to ensure AI strategy execution does not outpace operational safety controls.',
      'Government & Public Sector':
        'Government agencies maturing AI programs should focus on procurement compliance and building civilian AI oversight capacity — two prerequisites for scaling AI use cases beyond pilot status under current federal guidance.',
      'Professional Services':
        'Professional services firms at this stage should formalize client-facing AI disclosures and develop an AI value narrative that builds market differentiation without overstating capability or creating client data liabilities.',
      'Telecommunications':
        'Maturing telecom AI programs benefit from formalizing the link between AI investments and network SLA commitments, creating accountability structures that satisfy both operational leaders and regulatory reporting requirements.',
      'Media & Entertainment':
        'Media organizations at this stage should formalize an AI opportunity pipeline that explicitly balances content personalization (short-cycle revenue) with rights portfolio optimization (long-term asset value).',
      'Education':
        'Educational institutions at this stage should align AI value metrics to student outcome data and equity indicators, ensuring AI investments demonstrably close rather than widen achievement and access gaps.',
      'Transportation & Logistics':
        'Transportation organizations should operationalize AI value tracking against fleet efficiency, on-time performance, and safety KPIs — creating the performance evidence needed to secure continued executive sponsorship.',
      'Real Estate & Construction':
        'Real estate organizations at this stage should segment the AI opportunity pipeline by property lifecycle phase, as acquisition analytics and property management AI require different data partnerships and governance structures.',
      'Other':
        'Organizations at this stage benefit from implementing AI portfolio governance that regularly realigns investments to business outcomes and deprioritizes AI projects unable to demonstrate measurable progress.',
    },
    high: {
      'Financial Services & Banking':
        'Leading financial institutions are competing on AI-driven credit risk, fraud detection, and hyper-personalization — with the most advanced protecting proprietary model IP as a core competitive asset.',
      'Healthcare & Life Sciences':
        'Advanced healthcare AI programs are leveraging AI for precision diagnostics, drug discovery acceleration, and population health management — generating clinical differentiation that translates directly into patient outcomes and system economics.',
      'Technology & Software':
        'Technology companies at this maturity level should build AI into core product offerings and explore AI-native business models that create compounding switching costs competitors cannot easily replicate.',
      'Manufacturing & Industrial':
        'Advanced manufacturers deploying autonomous quality control, predictive maintenance at scale, and supply chain resilience AI are establishing operational performance standards that traditional competitors without equivalent data maturity cannot match.',
      'Retail & Consumer Goods':
        'Leading retailers use AI to create hyper-personalized omnichannel experiences, dynamic pricing, and demand-driven supply chains — capabilities that compound over time and become increasingly difficult for less mature competitors to replicate.',
      'Energy & Utilities':
        'Advanced energy AI programs deploying grid optimization, renewable integration forecasting, and predictive asset management are creating measurable contributions to decarbonization targets while reducing operational cost.',
      'Government & Public Sector':
        'Leading government AI programs are developing shared capabilities across agencies, automating citizen-facing services, and applying AI to resource allocation challenges in ways that generate measurable public value.',
      'Professional Services':
        'Advanced professional services firms are building proprietary AI capabilities that create differentiated client offerings — using AI to accelerate analysis velocity and develop insight capabilities that establish new competitive moats.',
      'Telecommunications':
        'Leading telecommunications organizations use AI for autonomous network management, real-time fraud detection, and AI-driven customer experience optimization that translates directly into measurable NPS and churn improvements.',
      'Media & Entertainment':
        'Advanced media organizations use AI-driven content intelligence to optimize audience engagement, guide rights acquisition strategy, and develop personalization capabilities that drive subscriber retention and lifetime value.',
      'Education':
        'Advanced educational AI programs are deploying adaptive learning at scale, early intervention analytics, and AI-powered research capabilities — setting the sector benchmark for responsible, equity-positive AI deployment.',
      'Transportation & Logistics':
        'Leading transportation organizations deploy AI-powered autonomous logistics optimization, predictive safety systems, and real-time supply chain visibility — creating service level commitments that legacy competitors cannot match.',
      'Real Estate & Construction':
        'Advanced real estate AI programs deploy predictive property valuation, construction risk management, and tenant experience optimization — creating investment performance advantages that are difficult for peers to replicate.',
      'Other':
        'Organizations at this maturity level should build an external AI innovation narrative that reinforces market positioning and strengthens the talent brand needed to attract and retain frontier AI practitioners.',
    },
  },

  // ── DIM 2: Data & AI Infrastructure ──────────────────────────────────────
  2: {
    low: {
      'Financial Services & Banking':
        'Financial institutions must address data quality under SR 11-7 model validation requirements — regulators expect evidence that model inputs are clean, well-governed, and traceable before approving AI models for credit, fraud, or trading applications.',
      'Healthcare & Life Sciences':
        'Healthcare data estates must meet HIPAA de-identification standards (Safe Harbor or Expert Determination) before AI systems can use patient data — this prerequisite must be embedded in the infrastructure roadmap from the outset.',
      'Technology & Software':
        'Technology companies building AI on fragmented data estates incur disproportionate engineering costs maintaining data pipelines rather than developing AI capabilities — infrastructure investment pays back quickly as AI scales.',
      'Manufacturing & Industrial':
        'Manufacturers face the additional complexity of integrating OT historian data (SCADA, OSIsoft PI) with enterprise data lakes — this OT/IT integration is typically the single largest infrastructure bottleneck for high-value AI use cases.',
      'Retail & Consumer Goods':
        'Retail organizations need to consolidate transactional, behavioral, and supply chain data across channels before AI models can deliver the personalization accuracy and demand forecasting quality that generates measurable ROI.',
      'Energy & Utilities':
        'Energy sector data infrastructure must account for time-series sensor data at scale — SCADA and IoT historian platforms require specialized ingestion architectures that differ significantly from standard enterprise data lake patterns.',
      'Government & Public Sector':
        'Government agencies must address data classification and authority-to-operate (ATO) requirements before AI infrastructure can be deployed — FedRAMP compliance and data sovereignty constraints directly shape architecture choices.',
      'Professional Services':
        'Professional services firms must implement strict data segregation in AI infrastructure to prevent client data from crossing engagement boundaries — a technical and contractual non-negotiable in most client agreements.',
      'Telecommunications':
        'Telecom data infrastructure must handle high-volume, high-velocity network telemetry and call detail records at scale — standard data warehouse architectures are typically insufficient without real-time streaming capabilities.',
      'Media & Entertainment':
        'Media organizations must resolve rights and licensing metadata management before AI systems can reliably use content assets — unresolved rights data creates legal exposure and limits the scope of permissible AI applications.',
      'Education':
        'Educational institutions must implement FERPA-compliant data governance before AI systems can access student records — this means explicit consent frameworks and role-based access controls as non-negotiable infrastructure prerequisites.',
      'Transportation & Logistics':
        'Transportation organizations must integrate IoT, GPS, and ELD compliance data sources into a unified data estate — this multi-source integration challenge is typically the primary infrastructure bottleneck for logistics AI use cases.',
      'Real Estate & Construction':
        'Real estate organizations must consolidate property, transaction, and market data from fragmented sources before AI models can deliver reliable valuation and risk analytics at portfolio scale.',
      'Other':
        'Organizations building AI infrastructure for the first time should prioritize data quality and governance over tooling sophistication — unreliable data remains the single greatest cause of AI project failure.',
    },
    medium: {
      'Financial Services & Banking':
        'Financial services data pipelines require the rigor of model risk management validation — automated data quality monitoring is not just an efficiency measure but a regulatory expectation for models used in credit, risk, and trading.',
      'Healthcare & Life Sciences':
        'Healthcare organizations at this stage should implement automated data quality monitoring that flags PHI handling violations and data completeness gaps before they propagate into clinical AI model outputs.',
      'Technology & Software':
        'Technology companies at this stage benefit from investing in a mature feature store that enables AI teams to share and reuse features across products — reducing duplicated engineering effort and accelerating model iteration velocity.',
      'Manufacturing & Industrial':
        'Mid-maturity manufacturers should focus on building reliable real-time OT data pipelines — the latency between sensor readings and AI model inputs directly determines the value of predictive maintenance and quality control applications.',
      'Retail & Consumer Goods':
        'Retail organizations at this stage should prioritize unified customer data platforms that consolidate behavioral signals across channels — data fragmentation is the primary constraint on personalization accuracy and demand forecasting quality.',
      'Energy & Utilities':
        'Energy organizations at this stage should implement streaming data infrastructure for grid telemetry — near-real-time data availability directly determines whether AI can move from post-hoc analysis to operational decision support.',
      'Government & Public Sector':
        'Government agencies at this stage should focus on cross-agency data sharing frameworks with appropriate privacy protections — these capabilities unlock higher-value AI use cases that require multi-system data integration.',
      'Professional Services':
        'Professional services firms at this stage should invest in engagement data infrastructure that enables AI models to surface cross-engagement insights while preserving strict client confidentiality boundaries.',
      'Telecommunications':
        'Telecom organizations at this stage should implement automated monitoring for network telemetry pipeline quality — data latency and completeness directly impact the accuracy of real-time network optimization and fraud detection models.',
      'Media & Entertainment':
        'Media organizations at this stage should prioritize audience behavioral data consolidation across platforms — fragmented engagement signals remain the primary constraint on personalization model quality.',
      'Education':
        'Educational institutions at this stage should implement automated data quality monitoring for student information systems, ensuring early intervention AI models receive complete and accurate signals about at-risk students.',
      'Transportation & Logistics':
        'Transportation organizations at this stage should focus on real-time GPS and sensor data pipeline reliability — operational AI for route optimization and safety monitoring requires low-latency, high-availability data infrastructure.',
      'Real Estate & Construction':
        'Real estate organizations at this stage should invest in automated property data quality monitoring that validates comparables, transaction data, and attribute completeness before AI models use them.',
      'Other':
        'Organizations at this stage should focus on data pipeline reliability and documentation — inconsistent data quality is the most frequently cited reason for AI project failure after initial deployment.',
    },
    high: {
      'Financial Services & Banking':
        'Leading financial services data operations are investing in real-time, low-latency infrastructure that enables fraud detection, algorithmic trading, and personalized pricing at millisecond response times.',
      'Healthcare & Life Sciences':
        'Advanced healthcare data operations are investing in real-world evidence (RWE) infrastructure and synthetic data generation to support AI model training where patient data availability is limited or restricted by consent.',
      'Technology & Software':
        'Technology companies at this maturity level should explore synthetic data generation to address training data gaps and invest in advanced data observability to support increasingly complex multi-model AI systems.',
      'Manufacturing & Industrial':
        'Advanced manufacturers are deploying real-time OT data streaming at scale, enabling autonomous AI-driven quality control and predictive maintenance that responds to process changes in seconds rather than hours.',
      'Retail & Consumer Goods':
        'Leading retail data operations are moving toward unified real-time platforms that enable dynamic pricing, real-time inventory optimization, and in-session personalization at scale across all customer touchpoints.',
      'Energy & Utilities':
        'Advanced energy data operations are deploying real-time grid telemetry streaming and synthetic data generation for rare event modeling — capabilities that directly support AI-driven grid stability and renewable integration.',
      'Government & Public Sector':
        'Leading government data programs are building interoperable cross-agency sharing capabilities while implementing advanced privacy-preserving techniques that enable AI use cases without creating individual-level surveillance risks.',
      'Professional Services':
        'Advanced professional services data operations are using synthetic data and privacy-preserving techniques to build AI training datasets that capture cross-engagement intelligence without violating client confidentiality agreements.',
      'Telecommunications':
        'Leading telecom data organizations are deploying real-time network telemetry streaming at exabyte scale, enabling autonomous network management AI that responds to infrastructure changes in near-real-time.',
      'Media & Entertainment':
        'Advanced media data organizations are investing in real-time audience signal infrastructure and synthetic content data generation to train personalization models that perform reliably across diverse content and viewer segments.',
      'Education':
        'Leading educational data programs are implementing privacy-preserving federated learning approaches that enable AI model improvement across institutions without centralizing student data.',
      'Transportation & Logistics':
        'Advanced transportation data operations are deploying real-time multi-modal sensor fusion infrastructure that enables autonomous logistics optimization and safety systems requiring sub-second response times.',
      'Real Estate & Construction':
        'Leading real estate data organizations are building real-time market intelligence infrastructure and synthetic property data generation capabilities that enable AI valuation models to perform reliably in thin markets.',
      'Other':
        'Organizations at this maturity level should invest in real-time data capabilities and synthetic data generation to support the next generation of AI use cases that current batch-oriented infrastructure cannot enable.',
    },
  },

  // ── DIM 3: AI Governance, Risk & Compliance ───────────────────────────────
  3: {
    low: {
      'Financial Services & Banking':
        'Financial institutions deploying AI without formal governance face direct regulatory exposure — SR 11-7, DORA, FCRA, and ECOA all require documented controls before AI models are used in regulated credit, fraud, or trading decisions.',
      'Healthcare & Life Sciences':
        'Healthcare organizations must address FDA oversight for Software as a Medical Device (SaMD) and HIPAA PHI protections before AI touches clinical workflows — governance gaps in this sector carry patient safety and direct legal liability implications.',
      'Technology & Software':
        'Technology companies deploying AI without governance frameworks face growing liability under the EU AI Act, CCPA, and emerging US state AI regulations — proactive governance avoids retroactive compliance remediation that is significantly more costly.',
      'Manufacturing & Industrial':
        'Manufacturers deploying AI in operational technology environments must establish governance frameworks that address IEC 62443 industrial cybersecurity standards — uncontrolled AI in OT environments carries both safety and regulatory risk.',
      'Retail & Consumer Goods':
        'Retail organizations using AI for pricing, personalization, and hiring must establish governance controls to prevent FTC and state consumer protection exposure — algorithmic pricing and automated hiring are under increasing regulatory scrutiny.',
      'Energy & Utilities':
        'Energy sector AI governance must address NERC CIP cybersecurity standards for grid-connected AI systems and FERC reliability obligations — governance gaps in this sector carry potential grid stability and national security consequences.',
      'Government & Public Sector':
        'Government agencies must comply with OMB M-24-10, Executive Order 14110, and agency-specific AI oversight requirements — public sector AI is subject to congressional oversight, FOIA requests, and inspector general review.',
      'Professional Services':
        'Professional services firms face client contract governance requirements and professional liability exposure — clients increasingly mandate AI disclosure, bias controls, and data handling governance in engagement terms and MSAs.',
      'Telecommunications':
        'Telecommunications organizations must address FCC regulations, CPNI data protection requirements, and emerging AI-specific guidelines — governance gaps in customer-facing AI applications create regulatory and reputational exposure.',
      'Media & Entertainment':
        'Media organizations using AI for content moderation, recommendation, and ad targeting face DSA/DMA obligations in Europe and increasing state-level scrutiny in the US — governance must address algorithmic transparency requirements.',
      'Education':
        'Educational institutions must implement AI governance that explicitly addresses FERPA student data protections, CIPA compliance for minors, and state-level student privacy laws — governance gaps carry significant legal and reputational consequences.',
      'Transportation & Logistics':
        'Transportation organizations deploying AI in safety-critical systems must address FMCSA regulations, DOT safety management requirements, and NTSB oversight — AI governance must be integrated into existing safety management systems.',
      'Real Estate & Construction':
        'Real estate organizations must establish AI governance frameworks that address ECOA fair lending requirements for AI-assisted underwriting and property valuation — algorithmic bias in property analytics carries significant legal exposure.',
      'Other':
        'Organizations deploying AI without formal governance create unquantified legal, operational, and reputational risk — governance investment at this stage is significantly lower cost than remediating an AI incident after the fact.',
    },
    medium: {
      'Financial Services & Banking':
        'Financial services organizations at this stage need audit-ready AI documentation and independent model validation processes that can withstand OCC and Fed examination — AI governance maturity is now an active examination focus.',
      'Healthcare & Life Sciences':
        'Healthcare organizations at this stage should implement systematic bias monitoring for clinical AI with particular attention to demographic equity — FDA and OCR are both actively scrutinizing AI bias in healthcare settings.',
      'Technology & Software':
        'Technology companies at this stage should formalize a third-party AI audit program — enterprise clients and regulators increasingly require evidence of independent AI risk assessment as a procurement and compliance condition.',
      'Manufacturing & Industrial':
        'Manufacturers at this stage should integrate AI risk controls into existing ISO 9001/IATF 16949 quality management systems — this creates auditability familiar to both regulators and Tier 1 customers who audit supplier quality processes.',
      'Retail & Consumer Goods':
        'Retail organizations at this stage should deploy automated bias monitoring for customer-facing AI, particularly pricing and credit applications — FTC consent decrees for algorithmic pricing violations are increasing in frequency.',
      'Energy & Utilities':
        'Energy organizations at this stage should integrate AI monitoring into existing NERC CIP compliance infrastructure — creating a unified audit trail that covers both traditional OT cybersecurity and AI-specific operational risk.',
      'Government & Public Sector':
        'Government agencies at this stage should implement AI risk controls aligned to NIST AI RMF — agencies with established controls are better positioned for congressional oversight and inspector general review.',
      'Professional Services':
        'Professional services firms at this stage should build client-visible governance reporting capabilities — clients at the top of the market increasingly request evidence of responsible AI controls as part of engagement governance.',
      'Telecommunications':
        'Telecom organizations at this stage should implement systematic bias and fairness testing for customer-facing AI, particularly churn prediction and credit scoring — FCC regulatory interest in algorithmic decision-making is increasing.',
      'Media & Entertainment':
        'Media organizations at this stage should build transparent content recommendation governance frameworks that satisfy DSA requirements for algorithmic accountability — these are now legally required for platforms operating in the EU.',
      'Education':
        'Educational institutions at this stage should deploy systematic equity monitoring for AI in admissions, academic support, and early intervention — governance gaps in these applications carry significant civil rights exposure under Title VI.',
      'Transportation & Logistics':
        'Transportation organizations at this stage should integrate AI incident response into existing safety management system (SMS) protocols — AI-related safety incidents require the same structured investigation and corrective action processes as traditional operational incidents.',
      'Real Estate & Construction':
        'Real estate organizations at this stage should implement bias monitoring specifically for property valuation and tenant screening AI — fair housing regulations (FHA, ECOA) apply to algorithmic systems and are actively enforced.',
      'Other':
        'Organizations at this stage benefit from implementing independent AI audit processes that provide objective assurance on governance effectiveness — internal assessments alone are insufficient for stakeholder confidence as AI scales.',
    },
    high: {
      'Financial Services & Banking':
        'Leading financial services organizations are publishing voluntary AI transparency reports and proactively engaging with OCC, Fed, and CFPB on model governance — regulatory leadership creates competitive advantages in examination cycles and accelerates model approval timelines.',
      'Healthcare & Life Sciences':
        'Advanced healthcare AI governance programs are publishing clinical algorithm transparency reports and engaging FDA\'s Digital Health Center of Excellence — governance leadership translates into faster regulatory clearance pathways for new AI applications.',
      'Technology & Software':
        'Technology companies at this maturity level should build an AI safety and transparency leadership position — publishing research, engaging standards bodies, and contributing to responsible AI frameworks creates durable market differentiation.',
      'Manufacturing & Industrial':
        'Advanced manufacturers are building AI governance transparency capabilities that extend to Tier 1 and Tier 2 suppliers — supply chain AI governance is becoming a customer requirement in automotive, aerospace, and defense sectors.',
      'Retail & Consumer Goods':
        'Leading retail organizations are publishing algorithmic transparency reports and engaging proactively with the FTC on AI governance best practices — early engagement shapes regulatory expectations rather than responding reactively to enforcement actions.',
      'Energy & Utilities':
        'Advanced energy AI governance programs are working with NERC and FERC to develop industry-specific AI reliability standards — leadership in standards development creates first-mover advantages in shaping compliance requirements.',
      'Government & Public Sector':
        'Leading government AI programs are establishing shared governance infrastructure across agencies and publishing transparency reports that build public trust — governance leadership translates directly into legislative and appropriations support.',
      'Professional Services':
        'Advanced professional services firms are publishing responsible AI frameworks and offering clients independent AI governance assessments — governance leadership is increasingly a required capability for top-tier engagements.',
      'Telecommunications':
        'Leading telecom organizations are publishing network AI transparency reports and engaging the FCC on AI governance standards — proactive regulatory engagement shapes the standards environment in ways that benefit early movers.',
      'Media & Entertainment':
        'Advanced media AI governance programs are building algorithmic transparency capabilities that satisfy DSA Very Large Online Platform requirements and that can be leveraged as competitive trust signals with publishers and advertisers.',
      'Education':
        'Leading educational AI governance programs are publishing student privacy and equity impact assessments for all AI deployments — this level of transparency builds the trust required for faculty, parent, and accreditor confidence.',
      'Transportation & Logistics':
        'Advanced transportation AI governance programs are engaging NTSB, FMCSA, and FAA on AI safety standards development — early standards participation shapes the regulatory environment in ways that reward governance leaders.',
      'Real Estate & Construction':
        'Leading real estate AI governance programs are publishing fair lending and valuation bias reports and engaging HUD proactively — governance transparency creates trust with both regulators and institutional investors who increasingly require evidence of responsible AI use.',
      'Other':
        'Organizations at this maturity level should use governance leadership as a market differentiator — publishing responsible AI frameworks and engaging industry standards bodies creates stakeholder trust that translates into competitive advantage.',
    },
  },

  // ── DIM 4: AI Talent, Culture & Change ───────────────────────────────────
  4: {
    low: {
      'Financial Services & Banking':
        'Financial services organizations face a highly competitive talent market for AI practitioners with risk, compliance, and quantitative modeling domain expertise — talent strategy must include retention incentives as well as recruitment from the outset.',
      'Healthcare & Life Sciences':
        'Healthcare AI talent strategy must address the rare combination of clinical domain expertise and AI technical skills — most organizations need a bimodal approach of training clinicians in AI literacy and training AI practitioners in clinical workflows.',
      'Technology & Software':
        'Technology companies face the most competitive AI talent market globally — talent strategy must include employer brand, equity compensation, and technical innovation opportunities to compete with hyperscaler and startup hiring programs.',
      'Manufacturing & Industrial':
        'Manufacturing organizations typically have deep OT and engineering talent but limited AI/ML skills — talent strategy should emphasize reskilling existing engineers rather than competing for scarce data scientists in an unfavorable labor market.',
      'Retail & Consumer Goods':
        'Retail organizations need AI talent that understands both technical ML and the business context of merchandising and customer behavior — pure technical talent without retail domain knowledge typically generates low-impact AI in this sector.',
      'Energy & Utilities':
        'Energy sector AI talent strategy must address the intersection of AI skills and operational technology expertise — few practitioners have both, making internal development from existing OT engineers often more effective than external hiring.',
      'Government & Public Sector':
        'Government agencies face significant AI talent competition from the private sector — talent strategy must leverage public service mission, job security, and unique data access as differentiators for candidates who accept below-market compensation.',
      'Professional Services':
        'Professional services firms must build AI talent capable of both delivering client engagements and developing internal capabilities — the billable model creates structural tension with the non-billable investment required to build AI expertise.',
      'Telecommunications':
        'Telecommunications organizations have deep network engineering talent that can be reskilled for AI/ML applications on network data — internal reskilling is typically faster and more cost-effective than competing externally for ML talent.',
      'Media & Entertainment':
        'Media organizations need AI talent that bridges technical ML skills and creative/editorial domain knowledge — this combination is rare and requires deliberate talent development programs rather than relying solely on external market hiring.',
      'Education':
        'Educational institutions face a talent paradox — they train AI talent but struggle to retain it against private sector compensation — strategy must emphasize mission, work-life balance, and unique research access as compensating factors.',
      'Transportation & Logistics':
        'Transportation and logistics organizations should build AI talent programs that leverage existing operational expertise — logistics domain knowledge is a competitive differentiator for AI practitioners, making internal reskilling particularly valuable.',
      'Real Estate & Construction':
        'Real estate organizations need AI talent with both technical ML skills and deep property market domain knowledge — this combination requires deliberate development programs rather than assuming off-the-shelf AI hires will understand the domain.',
      'Other':
        'Organizations building AI talent from a low base should prioritize AI literacy across the leadership team before focusing on technical specialist hiring — executive AI understanding is the prerequisite for effective AI talent investment.',
    },
    medium: {
      'Financial Services & Banking':
        'Financial services organizations at this stage should formalize a quantitative AI track developing practitioners at the intersection of ML and risk, credit, and trading domain knowledge — this combination is critical for high-value use cases and very difficult to hire externally.',
      'Healthcare & Life Sciences':
        'Healthcare organizations at this stage benefit from establishing clinical AI fellowship programs that pair clinicians with data scientists on real-world use cases — producing practitioners who understand both domains is the key capacity constraint for healthcare AI scaling.',
      'Technology & Software':
        'Technology companies at this stage should formalize internal AI innovation programs with dedicated time for research and open-source contribution — these programs retain top practitioners who have alternatives and build the employer brand needed to attract new talent.',
      'Manufacturing & Industrial':
        'Mid-maturity manufacturers should invest in embedded AI engineers within manufacturing engineering teams — this model accelerates OT/IT integration and transfers AI skills into the operational teams who will ultimately own and maintain AI systems.',
      'Retail & Consumer Goods':
        'Retail organizations at this stage should build structured learning paths that develop AI practitioners with merchandising and supply chain domain expertise — technical ML skills alone are insufficient for the high-value retail AI use cases.',
      'Energy & Utilities':
        'Energy organizations at this stage should develop AI practitioners with specific expertise in time-series modeling and OT data systems — this domain-specific capability is the primary technical bottleneck for energy sector AI scaling.',
      'Government & Public Sector':
        'Government agencies at this stage should build structured AI training tracks aligned to agency mission areas — generalist AI programs have poor completion rates in government; mission-aligned programs generate significantly higher engagement.',
      'Professional Services':
        'Professional services firms at this stage should develop structured AI competency frameworks mapped to service lines — this creates clear career paths for AI practitioners and supports the development of differentiated client offerings.',
      'Telecommunications':
        'Telecom organizations at this stage benefit from developing AI practitioners with expertise in network data science — graph neural networks, time-series anomaly detection, and geospatial modeling are specialized skills with high application value in this sector.',
      'Media & Entertainment':
        'Media organizations at this stage should build AI literacy programs tailored to editorial and creative teams — without business-side AI literacy, technical capabilities remain underutilized and adoption stalls despite investment.',
      'Education':
        'Educational institutions at this stage should create interdisciplinary AI development programs that pair technical staff with faculty and student affairs professionals — AI that improves outcomes must be designed by people who understand educational context.',
      'Transportation & Logistics':
        'Transportation organizations at this stage should build structured learning paths that develop AI practitioners with safety management and operations research expertise — these domain skills are critical for high-value transport AI applications.',
      'Real Estate & Construction':
        'Real estate organizations at this stage should develop AI training programs that build property market and transaction domain knowledge alongside ML technical skills — the combination is rare and creates a durable competitive advantage.',
      'Other':
        'Organizations at this stage should establish a Center of Excellence that creates structured career paths for AI practitioners — without career development pathways, organizations at this maturity level experience high AI talent turnover.',
    },
    high: {
      'Financial Services & Banking':
        'Leading financial services AI programs are investing in proprietary ML research and publishing academic work — this builds employer brand, retains top practitioners motivated by intellectual challenge, and shapes the frontier of financial AI.',
      'Healthcare & Life Sciences':
        'Advanced healthcare AI organizations are investing in clinical AI research partnerships with academic medical centers — these partnerships provide access to unique datasets and attract clinician-researchers who bridge both the clinical and AI domains.',
      'Technology & Software':
        'Technology companies at this maturity level should invest in AI safety and alignment research capabilities — these areas attract the most sought-after AI researchers and position the organization as a thought leader in responsible AI development.',
      'Manufacturing & Industrial':
        'Advanced manufacturers are developing proprietary AI capabilities in process optimization and quality control — protecting these as trade secrets while using them to attract industrial AI practitioners who want to work on novel high-stakes applications.',
      'Retail & Consumer Goods':
        'Leading retail AI programs are investing in consumer behavior research and publishing insights — this builds employer brand for consumer AI practitioners and positions the organization as a thought leader in AI-driven retail.',
      'Energy & Utilities':
        'Advanced energy AI programs are investing in grid AI and renewable integration research — frontier capabilities attract practitioners motivated by the intersection of AI and climate impact, a differentiating talent value proposition.',
      'Government & Public Sector':
        'Leading government AI programs are investing in AI research partnerships with national laboratories and universities — these partnerships create unique development opportunities that retain high-performing practitioners who could earn more in the private sector.',
      'Professional Services':
        'Advanced professional services firms are building AI research functions that publish white papers and develop thought leadership — this creates practitioner development opportunities, builds employer brand, and generates client development value simultaneously.',
      'Telecommunications':
        'Leading telecom AI programs are investing in network AI research and open-source contributions — this builds the employer brand needed to attract network AI specialists in a competitive talent market where hyperscalers are competing for the same skills.',
      'Media & Entertainment':
        'Advanced media AI programs are investing in content intelligence research and publishing insights on AI in creative industries — positioning the organization to attract interdisciplinary AI talent at the intersection of technology and creative production.',
      'Education':
        'Leading educational AI programs are investing in learning science research partnerships and publishing equity-focused AI research — this attracts practitioners motivated by social impact and creates a research pipeline of talent from partner institutions.',
      'Transportation & Logistics':
        'Advanced transportation AI programs are investing in autonomous systems and safety AI research — frontier research capabilities attract practitioners motivated by high-stakes AI applications and create IP that translates directly into competitive service capabilities.',
      'Real Estate & Construction':
        'Leading real estate AI programs are investing in market analytics research and publishing property AI insights — building thought leadership in a sector where AI maturity is relatively low creates talent attraction and client development advantages.',
      'Other':
        'Organizations at this maturity level should invest in visible AI innovation programs — publications, conference presence, and open-source contributions create employer brand signals that attract and retain the frontier AI talent needed for continued leadership.',
    },
  },

  // ── DIM 5: AI Engineering & MLOps ─────────────────────────────────────────
  5: {
    low: {
      'Financial Services & Banking':
        'Financial institutions deploying AI without MLOps practices create model risk management gaps — SR 11-7 requires documented model validation, performance monitoring, and change control processes that MLOps infrastructure directly enables.',
      'Healthcare & Life Sciences':
        'Healthcare organizations must establish MLOps practices that support FDA SaMD post-market surveillance requirements — deployed clinical AI models must be monitored for performance drift and updated through controlled change management processes.',
      'Technology & Software':
        'Technology companies shipping AI without CI/CD and MLOps infrastructure incur compounding technical debt — the cost of retroactively implementing engineering practices grows exponentially as the number of models in production increases.',
      'Manufacturing & Industrial':
        'Manufacturing organizations deploying AI in OT environments need MLOps practices adapted to industrial change management requirements — model updates in production environments require the same change control discipline as firmware updates to industrial systems.',
      'Retail & Consumer Goods':
        'Retail organizations deploying AI for demand forecasting and personalization without MLOps infrastructure typically see significant performance degradation during seasonal demand shifts — automated drift detection is essential for models operating on rapidly changing consumer behavior.',
      'Energy & Utilities':
        'Energy sector AI engineering must integrate with existing ICS change management processes — model updates to operational AI systems must follow the same approval gates used for OT software changes to prevent reliability incidents.',
      'Government & Public Sector':
        'Government agencies establishing MLOps must address authority-to-operate (ATO) requirements — AI model deployment pipelines must satisfy NIST 800-53 security controls and FedRAMP requirements where applicable.',
      'Professional Services':
        'Professional services firms establishing MLOps must implement client data segregation in all model training and serving infrastructure — this is a technical non-negotiable that must be designed into the MLOps architecture from the outset.',
      'Telecommunications':
        'Telecommunications organizations establishing MLOps must design for the high-volume inference requirements of network operations AI — model serving infrastructure must handle telemetry-scale data volumes with sub-second latency for operational use cases.',
      'Media & Entertainment':
        'Media organizations establishing MLOps must build content rights compliance into the model training pipeline — models trained on licensed content require usage tracking that integrates with rights management systems.',
      'Education':
        'Educational institutions establishing MLOps must implement FERPA-compliant data handling throughout the ML pipeline — student data used for model training requires the same privacy protections as the source student information systems.',
      'Transportation & Logistics':
        'Transportation organizations establishing MLOps must integrate safety validation into the model deployment pipeline — AI systems used in safety-critical applications require formal safety case documentation before production deployment.',
      'Real Estate & Construction':
        'Real estate organizations establishing MLOps should design training pipelines that handle the structured and unstructured data fusion required for property AI — MLS data, property documents, and imagery require distinct data preparation approaches.',
      'Other':
        'Organizations establishing MLOps for the first time should begin with experiment tracking and model version control as the foundational capabilities — these create the reproducibility and auditability needed before any model moves to production.',
    },
    medium: {
      'Financial Services & Banking':
        'Financial services organizations at this stage should invest in automated model validation pipelines that can satisfy SR 11-7 documentation requirements without manual intervention — this directly reduces time-to-production for regulated models.',
      'Healthcare & Life Sciences':
        'Healthcare organizations at this stage should build automated performance monitoring that generates the continuous post-market surveillance evidence required for FDA-cleared AI/ML-based Software as a Medical Device under the Predetermined Change Control Plan (PCCP) pathway.',
      'Technology & Software':
        'Technology companies at this stage should invest in platform engineering for ML — building self-service infrastructure that allows product teams to deploy AI without engineering bottlenecks directly accelerates AI product velocity.',
      'Manufacturing & Industrial':
        'Mid-maturity manufacturers should implement drift detection tuned to OT data characteristics — sensor drift, equipment wear, and seasonal process variations produce patterns that require domain-aware alerting thresholds rather than generic statistical tests.',
      'Retail & Consumer Goods':
        'Retail organizations at this stage should implement seasonal drift management capabilities — models trained on peak-season data require proactive retraining strategies to maintain accuracy during off-peak periods and vice versa.',
      'Energy & Utilities':
        'Energy organizations at this stage should implement drift detection aligned to energy market seasonality and equipment aging patterns — standard drift detection thresholds are often miscalibrated for the slow, predictable drift characteristic of OT systems.',
      'Government & Public Sector':
        'Government agencies at this stage should build ATO-compatible CI/CD pipelines that automate security control verification — reducing the time and cost of continuous ATO processes that currently create significant deployment bottlenecks.',
      'Professional Services':
        'Professional services firms at this stage should build MLOps infrastructure that supports both internal AI and client-facing deliverables — the same pipeline should produce auditable model documentation that satisfies client governance requirements.',
      'Telecommunications':
        'Telecom organizations at this stage should invest in real-time inference infrastructure for network operations AI — batch serving architectures are insufficient for the sub-second response requirements of network anomaly detection and fraud prevention.',
      'Media & Entertainment':
        'Media organizations at this stage should build recommendation model retraining pipelines that respond to content freshness signals — recommendation models degrade rapidly when new content is released without automated retraining triggers.',
      'Education':
        'Educational institutions at this stage should implement academic calendar-aware drift detection — student behavior models experience predictable drift at semester boundaries and enrollment cycles that require proactive retraining rather than reactive monitoring.',
      'Transportation & Logistics':
        'Transportation organizations at this stage should build drift detection tuned to seasonal demand and route network changes — static thresholds generate excessive false positives in logistics networks that experience predictable operational changes.',
      'Real Estate & Construction':
        'Real estate organizations at this stage should implement market-cycle-aware drift monitoring — property valuation models trained on peak market data require more frequent retraining and wider confidence intervals during market downturns.',
      'Other':
        'Organizations at this stage should prioritize building CI/CD automation for the highest-volume AI systems first — automating deployment and monitoring for the most active models delivers the fastest return on MLOps investment.',
    },
    high: {
      'Financial Services & Banking':
        'Leading financial services AI engineering programs are investing in low-latency inference infrastructure for real-time fraud detection, algorithmic trading, and credit decisioning — millisecond response requirements necessitate specialized serving architectures beyond standard ML platforms.',
      'Healthcare & Life Sciences':
        'Advanced healthcare AI engineering programs are deploying federated learning infrastructure that enables model improvement across institutions without centralizing patient data — achieving training scale that a single-institution approach cannot deliver.',
      'Technology & Software':
        'Technology companies at this maturity level should invest in LLMOps capabilities and self-service ML infrastructure — enabling product teams to deploy and manage AI without central engineering involvement drives AI product velocity at scale.',
      'Manufacturing & Industrial':
        'Advanced manufacturers are investing in edge AI inference infrastructure that runs ML models directly on industrial equipment — eliminating network latency for time-critical control applications and reducing cloud dependency in OT environments.',
      'Retail & Consumer Goods':
        'Leading retail AI engineering programs are building real-time personalization serving infrastructure capable of sub-100ms inference at millions of requests per second — this is the engineering prerequisite for truly responsive omnichannel AI experiences.',
      'Energy & Utilities':
        'Advanced energy AI engineering programs are deploying edge inference on grid-connected equipment — enabling AI-driven real-time control decisions without the latency and reliability risks of round-trip cloud inference for grid-critical applications.',
      'Government & Public Sector':
        'Leading government AI engineering programs are building reusable, FedRAMP-compliant MLOps infrastructure shared across agencies — shared platforms reduce per-agency compliance costs and create consistent governance standards.',
      'Professional Services':
        'Advanced professional services AI engineering programs are building LLMOps infrastructure for foundation model-based consulting tools — creating differentiated delivery capabilities that competitors without equivalent engineering investment cannot replicate.',
      'Telecommunications':
        'Leading telecom AI engineering programs are deploying LLMOps infrastructure for network operations copilots and customer service AI — managing foundation models in production at telecom scale requires specialized serving, monitoring, and update management capabilities.',
      'Media & Entertainment':
        'Advanced media AI engineering programs are investing in real-time content personalization serving and LLMOps capabilities for generative content tools — enabling both algorithmic and generative AI at production scale simultaneously.',
      'Education':
        'Leading educational AI engineering programs are deploying privacy-preserving federated learning infrastructure that enables AI model improvement across student populations at a scale that a single institution cannot achieve alone.',
      'Transportation & Logistics':
        'Advanced transportation AI engineering programs are investing in edge inference for real-time vehicle and route optimization — eliminating cloud round-trip latency is a prerequisite for autonomous and semi-autonomous logistics AI applications.',
      'Real Estate & Construction':
        'Leading real estate AI engineering programs are deploying multi-modal inference infrastructure that combines property imagery, documents, and market data in real-time — this architecture enables the richest property intelligence capabilities.',
      'Other':
        'Organizations at this maturity level should invest in LLMOps capabilities for foundation model management and self-service ML infrastructure that removes engineering bottlenecks from AI deployment — these are the two highest-leverage engineering investments at advanced maturity.',
    },
  },
}

/**
 * Returns the industry-specific context sentence for a given dimension, tier, and industry.
 * Falls back to the 'Other' sentence if the specific industry is not found.
 */
export function getIndustryContext(dimId, tier, industry) {
  // Guard against invalid inputs — always returns null, never undefined
  if (dimId == null || !tier) return null
  return IC[dimId]?.[tier]?.[industry] || IC[dimId]?.[tier]?.['Other'] || null
}

/**
 * Returns a size calibration note for smaller organizations.
 * Returns null for large organizations where the full recommendations apply as-is.
 */
export function getSizeNote(size) {
  const notes = {
    '1–50 employees':
      'At this scale, focus on 1–2 high-impact use cases rather than broad programs — resource constraint is your primary risk. Use lightweight, pay-as-you-go cloud tooling and prove ROI before expanding infrastructure, governance, or team investment.',
    '51–200 employees':
      'Organizations at your scale can build meaningful AI capability without enterprise platform investment. Designate an AI lead, adopt proven cloud-native tools, and prioritize use cases with clear payback windows before scaling governance overhead or standing up a dedicated team.',
    '201–500 employees':
      'At this scale, a small Center of Excellence (2–3 dedicated AI practitioners supporting business units) delivers strong ROI. Invest in standardized tooling and lightweight governance now — before team proliferation creates fragmentation that is costly to reverse.',
    '501–1,000 employees':
      'Your organization is at the inflection point between ad hoc and systematic AI. This is the right time to formalize an AI team, adopt enterprise-grade tooling, and establish governance processes that scale without creating bottlenecks — waiting until larger scale makes these changes significantly harder.',
    '1,001–5,000 employees':
      'At this scale, a CoE with embedded dimension leads in major business units is the proven model. Platform investment is now justified; prioritize standardization, feature and model reuse, and governance that operates across multiple business units simultaneously to prevent portfolio fragmentation.',
    '5,001–10,000 employees':
      'Large enterprise AI programs require dedicated AI leadership (CAIO or VP-level), multiple domain-aligned Centers of Excellence, and enterprise platform investment. The primary risk at this scale is portfolio fragmentation — governance and portfolio management rigor are as valuable as technical capability.',
    '10,000+ employees':
      'At this scale, AI is a strategic enterprise function, not a project portfolio. Invest in enterprise AI platforms, dedicated AI engineering teams per domain, and a governance operating model built for scale. Speed of deployment and capability reuse are the primary competitive differentiators — not individual model quality.',
  }
  return notes[size] || null
}

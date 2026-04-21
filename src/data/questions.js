// ─────────────────────────────────────────────────────────────────────────────
// Enterprise AI Readiness Assessment — Question Bank v1.5.0
// 12 questions per dimension (60 total) — curated for maximum diagnostic value
// within a 3-week client engagement. Each question carries 5 behaviorally-
// anchored score descriptors so respondents rate against observable evidence.
// ─────────────────────────────────────────────────────────────────────────────

// Re-export RECOMMENDATION_TIERS and scoreTier so consumers can import from
// either questions.js or constants/thresholds.js without circular deps.
export { RECOMMENDATION_TIERS, scoreTier } from '../constants/thresholds'

export const dimensions = [
  // ─── DIMENSION 1 ─────────────────────────────────────────────────────────
  {
    id: 1,
    name: 'AI Strategy & Value Realization',
    shortName: 'Strategy',
    color: '#2EA3F2',
    bgColor: '#E8F4FD',
    description:
      'Assesses whether AI is strategically anchored to business goals, sponsored at the executive level, and delivering measurable value.',
    questions: [
      {
        text: 'Our organization has a formal, documented AI strategy that is aligned to business objectives.',
        anchors: {
          1: 'No AI strategy exists. AI initiatives are opportunistic, uncoordinated, and driven by individual teams without enterprise alignment.',
          2: 'An informal AI vision has been discussed at leadership level but is not documented, approved, or communicated beyond a small group.',
          3: 'A documented AI strategy exists and has been shared, but lacks measurable KPIs, named owners, or formal board/C-suite sign-off.',
          4: 'A formal, C-suite-approved AI strategy exists with defined KPIs, named owners, and is reviewed on at least an annual cadence.',
          5: 'AI strategy is fully embedded in the corporate strategic plan, reviewed semi-annually with real-time outcome dashboards, and linked to a formal refresh process aligned to annual business planning cycles. AI performance against strategic objectives is reported to the board.',
        },
      },
      {
        text: 'Senior leadership actively sponsors and publicly advocates for AI initiatives.',
        anchors: {
          1: 'No executive is visibly sponsoring AI. Leadership is either unengaged or skeptical, and AI is not discussed in leadership forums.',
          2: 'One or two executives express interest in AI informally, but there is no formal sponsorship, budget ownership, or public advocacy.',
          3: 'A named executive sponsor exists for some AI projects, but sponsorship is inconsistent across the portfolio and not visible to the broader organization.',
          4: 'A C-suite AI sponsor (e.g., CDAO, CTO, or equivalent) actively champions AI in all-hands meetings, external communications, and budget discussions.',
          5: 'The CEO and multiple C-suite members publicly champion AI internally and externally. A formal AI steering committee with board-level representation provides cross-enterprise governance, accountability, and strategic direction.',
        },
      },
      {
        text: 'We have identified specific AI use cases with clearly defined, measurable ROI targets.',
        anchors: {
          1: 'No formal use case identification process exists. AI projects are started based on interest or vendor pitches without business case validation.',
          2: 'A list of potential AI use cases exists informally, but few have defined ROI targets or business sponsor accountability.',
          3: 'A use case pipeline exists with estimated ROI for some initiatives, but the methodology is inconsistent and targets are rarely tracked post-deployment.',
          4: 'A structured use case pipeline with standardized ROI templates, formal business case approval, and post-deployment value tracking is consistently applied across the AI portfolio.',
          5: 'A continuously maintained use case registry links every AI initiative to a business outcome owner, ROI target, and real-time value tracking dashboard. Realized value is reported at quarterly business reviews.',
        },
      },
      {
        text: 'AI capabilities are a deliberate part of our competitive differentiation strategy.',
        anchors: {
          1: 'AI is not discussed in the context of competitive strategy. Leadership does not view AI as a source of competitive advantage.',
          2: 'Leadership acknowledges AI as an emerging competitive factor but has not formally incorporated it into competitive strategy or positioning.',
          3: 'AI is mentioned in the competitive strategy but is treated as a supporting capability rather than a deliberate differentiator with specific target outcomes.',
          4: 'AI is explicitly called out in the competitive strategy with 1–2 specific areas where AI-driven differentiation is being pursued and tracked.',
          5: 'AI is a core pillar of competitive strategy. Multiple AI-driven differentiated products, services, or operational advantages are live, documented, and actively widening the competitive moat.',
        },
      },
      {
        text: 'We have a structured, repeatable process for prioritizing and evaluating AI opportunities.',
        anchors: {
          1: 'No process exists. AI opportunities are pursued based on individual advocacy or vendor engagement without structured evaluation.',
          2: 'Some informal criteria are applied (e.g., "is there data available?") but the process is inconsistent and undocumented.',
          3: 'A documented prioritization framework exists (e.g., effort/impact matrix) but is applied inconsistently across business units and lacks governance.',
          4: 'A standardized AI opportunity scoring methodology is applied consistently across the portfolio, with a governance body making final prioritization decisions.',
          5: 'A fully operationalized AI opportunity management process includes scoring, business case templates, portfolio view, and a quarterly governance review with documented decision rationale.',
        },
      },
      {
        text: 'AI investments are tracked against quantifiable business outcomes on a regular cadence.',
        anchors: {
          1: 'AI investments are not tracked against business outcomes. There is no mechanism to measure the value delivered by AI initiatives.',
          2: 'Some ad-hoc tracking occurs for individual high-profile projects, but there is no consistent methodology or reporting cadence.',
          3: 'Business outcomes are defined for most AI investments, but tracking is manual, infrequent, and not systematically reported to leadership.',
          4: 'A formal AI value-tracking process reports realized business outcomes (cost savings, revenue, efficiency) to leadership on at least a quarterly basis.',
          5: 'Real-time AI value dashboards are accessible to leadership and initiative owners. Every active AI investment has a named outcome owner, baseline, target, and current actuals reported in business reviews.',
        },
      },
      {
        text: 'We have a multi-year roadmap for AI adoption and organizational capability building.',
        anchors: {
          1: 'No multi-year AI roadmap exists. Planning is entirely short-term and reactive.',
          2: 'A rough list of potential AI projects exists for the next 12 months, but there is no structured multi-year roadmap with milestones or capability dependencies mapped.',
          3: 'A 2–3 year AI roadmap exists but focuses primarily on technology projects and does not adequately address organizational capability development (talent, culture, process).',
          4: 'A 3-year AI roadmap exists covering technology, data, talent, and governance workstreams with defined milestones, owners, and dependencies. It is reviewed annually.',
          5: 'A living 3–5 year AI capability roadmap integrates technology, data, talent, governance, and organizational change. It is reviewed quarterly, version-controlled, and aligned to the corporate strategic plan.',
        },
      },
      {
        text: 'Business units are aligned on the strategic value and expected outcomes of AI investments.',
        anchors: {
          1: 'Business units have limited awareness of the AI strategy and do not see AI as relevant to their operations.',
          2: 'Some business unit leaders are aware of the AI strategy, but alignment is superficial and does not translate into active collaboration or co-ownership of outcomes.',
          3: 'Most business unit leaders are familiar with the AI strategy and express general support, but few have actively co-designed initiatives or accepted accountability for AI-driven outcomes.',
          4: 'All major business units have participated in AI strategy development, have named AI initiative owners, and are accountable for defined business outcomes in their areas.',
          5: 'Business units are full co-owners of the AI strategy. Each unit has an embedded AI champion, an AI initiative portfolio, and regular reviews with the central AI function to track cross-functional value realization.',
        },
      },
      {
        text: 'There is a dedicated and sufficient budget allocated specifically to AI initiatives.',
        anchors: {
          1: 'No dedicated AI budget exists. AI work is funded opportunistically from project budgets or discretionary spend.',
          2: 'A small amount of funding is earmarked for AI, but it is insufficient to execute the stated strategy and is at risk of reallocation.',
          3: 'A dedicated AI budget exists and covers near-term initiatives, but it does not adequately fund long-term capability building (talent, infrastructure, governance).',
          4: 'A multi-year AI budget is approved, covers technology, talent, and operations, and is protected at the executive level from opportunistic reallocation.',
          5: 'AI funding is treated as a strategic investment with a defined portfolio allocation model. Budget is reviewed annually, benchmarked against industry peers, and adjusted based on realized value.',
        },
      },
      {
        text: 'We have a defined process for scaling successful AI pilots into full production.',
        anchors: {
          1: 'No scaling process exists. Successful pilots remain as pilots or are abandoned due to lack of a transition path.',
          2: 'Scaling is handled case-by-case with ad-hoc decisions about resourcing, infrastructure, and ownership. No standard playbook exists.',
          3: 'A rough scaling checklist or gate review process exists, but it is not consistently applied and often lacks the organizational support to move from pilot to production reliably.',
          4: 'A formal pilot-to-production process exists with defined gates, a technology handover process, business readiness criteria, and named owners for production support.',
          5: 'A fully operationalized AI scaling factory exists with standardized gates, production readiness assessments, change management protocols, and a center of excellence that supports every transition from pilot to production.',
        },
      },
      {
        text: 'We have a deliberate strategic position on generative AI and foundation models, including investment priorities, prioritized use cases, and governance boundaries.',
        anchors: {
          1: 'No strategic position exists. Generative AI adoption is entirely ad-hoc — employees are independently using tools like ChatGPT or Copilot without organizational direction, investment rationale, or any guidance on appropriate use cases or data handling.',
          2: 'Leadership has acknowledged generative AI in informal discussions, but no formal position, investment thesis, or use case guidance has been documented or communicated. Adoption is driven by individual initiative rather than organizational intent.',
          3: 'A high-level generative AI position has been published (e.g., "we are investing in GenAI for productivity") but lacks specificity on prioritized use cases, build/buy/partner guidance for foundation model selection, funding model, or governance integration.',
          4: 'A formal generative AI strategy document defines investment priorities, prioritized use cases by business function, a foundation model selection framework (build/buy/partner/API), and governance principles aligned to the enterprise AI risk framework. The position has executive sign-off and has been communicated to all business units.',
          5: 'Generative AI is fully integrated into the enterprise AI strategy with a dedicated investment allocation, a production portfolio of use cases mapped to business value, a foundation model selection and vendor management process, regular horizon-scanning for emerging capabilities, and governance requirements embedded in the enterprise AI risk and policy framework.',
        },
      },
      {
        text: 'Leadership broadly understands both the potential and the limitations of AI.',
        anchors: {
          1: 'Leadership has minimal AI literacy. Expectations are either unrealistically high (AI as a silver bullet) or dismissively low. Decisions are made without understanding AI constraints.',
          2: 'A few leaders have developed some AI understanding, but the majority of the leadership team lacks the foundational literacy needed to make informed decisions about AI investments and risks.',
          3: 'Most leaders have completed basic AI awareness training and can articulate high-level opportunities, but understanding of limitations, risks, and responsible AI principles is shallow.',
          4: 'The full leadership team has completed structured AI literacy programs and demonstrates informed decision-making on AI investments, risk trade-offs, and ethical considerations.',
          5: 'Leadership AI literacy is a defined competency assessed annually. All leaders can critically evaluate AI proposals, challenge vendor claims, articulate responsible AI requirements, and translate AI capabilities into business strategy.',
        },
      },
    ],
  },

  // ─── DIMENSION 2 ─────────────────────────────────────────────────────────
  {
    id: 2,
    name: 'Data & Infrastructure Readiness',
    shortName: 'Data',
    color: '#17A589',
    bgColor: '#E8F8F5',
    description:
      'Evaluates the quality, accessibility, governance, and scalability of data and technical infrastructure to support AI workloads.',
    questions: [
      {
        text: 'Our data is centrally managed with clear ownership, stewardship, and accountability.',
        anchors: {
          1: 'Data is fully siloed across business units with no central management, undefined ownership, and no accountability for data quality or access.',
          2: 'Some datasets have informal owners, but roles are undocumented and accountability for data quality is absent or unclear across most of the portfolio.',
          3: 'A data ownership model exists on paper with named data stewards for key domains, but stewardship is a secondary responsibility and accountability mechanisms are weak.',
          4: 'Formal data ownership roles (data owners, stewards, custodians) are defined, documented, and embedded in job responsibilities. Accountability for key data domains is actively enforced.',
          5: 'Enterprise data ownership is fully operationalized with defined roles at domain, subdomain, and dataset level. Stewardship is a primary job function for key roles, accountabilities are measured in performance reviews, and cross-domain data governance is active.',
        },
      },
      {
        text: 'We regularly assess and actively maintain high data quality standards across key datasets.',
        anchors: {
          1: 'Data quality is not measured or managed. Issues are discovered reactively when they cause downstream failures or business errors.',
          2: 'Informal data quality checks exist for some critical datasets, but there is no consistent methodology, measurement framework, or remediation process.',
          3: 'A data quality assessment process exists for key datasets, covering dimensions like completeness and accuracy, but assessments are infrequent (annually or less) and remediation is slow.',
          4: 'Regular (at least quarterly) data quality assessments cover key datasets across completeness, accuracy, timeliness, and consistency. Findings are tracked and remediation is formally owned.',
          5: 'Automated, continuous data quality monitoring with defined SLAs is in place for all AI-critical datasets. Quality metrics are published on a data catalog dashboard, anomalies trigger automated alerts, and remediation SLAs are enforced.',
        },
      },
      {
        text: 'We have a formal, enterprise-wide data governance framework in place.',
        anchors: {
          1: 'No data governance framework exists. Data decisions are made locally without enterprise standards, policies, or oversight.',
          2: 'A few data-related policies exist (e.g., a data retention policy) but they are isolated, not enforced, and do not constitute a coherent governance framework.',
          3: 'A data governance framework has been developed and includes policies, standards, and a governance committee, but adoption is limited to select data domains and enforcement is inconsistent across the enterprise.',
          4: 'A fully documented data governance framework is operational with active executive sponsorship, a functioning data governance committee, defined policies, and measurable compliance.',
          5: 'Enterprise data governance is a mature capability integrated into all data-producing and data-consuming processes. Governance outcomes are measured quarterly, policies are reviewed annually, and the framework covers AI-specific data requirements including bias, lineage, and consent.',
        },
      },
      {
        text: 'Our data pipelines are automated, reliable, and continuously monitored.',
        anchors: {
          1: 'Data pipelines are largely manual (e.g., spreadsheet exports, manual file transfers) with no monitoring, documentation, or SLAs.',
          2: 'Some pipelines are automated, but reliability is inconsistent, failures are discovered reactively, and there is no systematic monitoring in place.',
          3: 'Most critical pipelines are automated with basic monitoring (e.g., failure alerts), but monitoring coverage is incomplete and mean time to recovery is not tracked.',
          4: 'All production data pipelines are automated, documented, and monitored with defined SLAs for availability and latency. Incidents are tracked and post-mortems are conducted for failures.',
          5: 'A mature DataOps practice governs all pipelines with automated testing, lineage tracking, real-time monitoring, SLA dashboards, and self-healing capabilities. Pipeline health is a measured operational metric reviewed weekly.',
        },
      },
      {
        text: 'We have scalable cloud or on-premises infrastructure purpose-built for AI/ML workloads.',
        anchors: {
          1: 'No dedicated AI/ML infrastructure exists. Data scientists use personal laptops or repurpose general-purpose servers, creating severe bottlenecks.',
          2: 'Some compute resources are available for AI workloads (e.g., a shared GPU server) but they are not scalable, often contended, and not purpose-configured for ML.',
          3: 'A dedicated AI/ML compute environment exists but lacks auto-scaling, proper MLOps tooling integration, and capacity planning for production workloads.',
          4: 'Purpose-built, scalable AI/ML infrastructure (cloud or hybrid) is in place with auto-scaling, GPU/TPU access, MLflow or equivalent, and capacity to support current production workloads.',
          5: 'A fully optimized, multi-region AI/ML platform supports the entire model lifecycle from development through production at enterprise scale. Infrastructure-as-code, cost optimization, and capacity modeling are standard practices.',
        },
      },
      {
        text: 'Data is accessible to authorized users through secure, governed, and well-documented APIs.',
        anchors: {
          1: 'No data access APIs exist. Data is accessed through direct database connections, file shares, or manual extraction, with no governance or documentation.',
          2: 'Some data is exposed via basic APIs or data warehouse queries, but access is ungoverned, undocumented, and security controls are inconsistent.',
          3: 'Data access APIs exist for key datasets with basic authentication, but documentation is incomplete, access controls are not role-based, and audit logging is limited.',
          4: 'A governed data access layer provides APIs for key datasets with role-based access control, comprehensive documentation, usage tracking, and audit logs reviewed regularly.',
          5: 'An enterprise data mesh or equivalent provides discoverable, self-service data products via well-documented APIs with automated access governance, real-time audit logging, usage analytics, and SLAs. Data products are treated as first-class assets.',
        },
      },
      {
        text: 'We have real-time or near-real-time data processing capabilities where the business requires it.',
        anchors: {
          1: 'All data processing is batch-based with multi-hour or multi-day latency. No streaming or real-time infrastructure exists.',
          2: 'Real-time processing has been explored but not implemented. Some near-real-time batch jobs run hourly, but latency requirements for AI use cases are not formally defined.',
          3: 'Near-real-time processing exists for one or two use cases (e.g., fraud detection) but the capability is siloed, not reusable, and latency SLAs are informally defined.',
          4: 'A reusable streaming data platform (e.g., Kafka, Kinesis) supports multiple near-real-time use cases with defined latency SLAs and operational monitoring.',
          5: 'An enterprise-grade event streaming platform supports sub-second data processing for all latency-sensitive AI use cases. The platform is multi-tenant, self-service for data teams, and has 99.9%+ availability SLAs with active monitoring.',
        },
      },
      {
        text: 'We maintain comprehensive data catalogs, lineage documentation, and metadata management.',
        anchors: {
          1: 'No data catalog or lineage documentation exists. Data discovery requires direct engagement with data engineers or manual exploration of databases.',
          2: 'An informal spreadsheet or wiki documents some key datasets, but it is incomplete, out-of-date, and not widely used or maintained.',
          3: 'A data catalog tool is deployed and covers the majority of key datasets, but lineage tracking is manual or partial, and metadata quality is inconsistent.',
          4: 'A comprehensive data catalog is actively maintained and covers all AI-critical datasets with automated lineage tracking, business glossary integration, and ownership metadata.',
          5: 'An enterprise-grade data catalog with automated metadata ingestion, end-to-end lineage visualization (from source to ML model), semantic search, and data quality scores is used daily by data teams and audited quarterly for completeness.',
        },
      },
      {
        text: 'Sensitive and regulated data is properly identified, classified, and protected throughout its lifecycle.',
        anchors: {
          1: 'No data classification scheme exists. Sensitive data (PII, PHI, financial) is handled inconsistently with no systematic identification or protection controls.',
          2: 'Sensitive data is informally identified in some areas, but classification is incomplete, inconsistently applied, and protection controls are not systematically enforced.',
          3: 'A data classification policy exists with defined categories, and the majority of known sensitive data has been classified, but automated discovery and enforcement are limited.',
          4: 'Comprehensive data classification covers all known sensitive data types. Classification is enforced through access controls, encryption, masking, and is integrated into the data pipeline lifecycle.',
          5: 'Automated data discovery and classification tools continuously scan all data stores. Classification-driven controls are enforced in real time and audited quarterly. AI training data undergoes specific sensitivity review.',
        },
      },
      {
        text: 'We can easily onboard and integrate new internal and external data sources.',
        anchors: {
          1: 'Integrating a new data source is a multi-month, resource-intensive effort requiring bespoke engineering work each time.',
          2: 'New data source integrations take weeks to months and rely on individual engineers rather than a standardized process or reusable integration patterns.',
          3: 'A reference architecture for data integration exists with some reusable connectors, but onboarding a new source still requires significant custom development and lacks self-service capability.',
          4: 'A data integration platform with pre-built connectors, standardized ingestion patterns, and a defined onboarding process enables new source integration within days for standard source types.',
          5: 'A self-service data integration platform enables authorized teams to onboard new sources in hours using a catalog of pre-certified connectors, automated data profiling, and governed approval workflows. Time-to-integrate is measured as a KPI.',
        },
      },
      {
        text: 'We have controls governing what internal data employees may include in prompts, fine-tuning datasets, or API calls to third-party AI services.',
        anchors: {
          1: 'No controls exist. Employees routinely use third-party AI tools (ChatGPT, Copilot, etc.) with internal business data — including customer records, financial data, and confidential IP — without organizational awareness, classification requirements, or technical restrictions.',
          2: 'The risk of sharing internal data with AI tools is recognized and informal guidance has been communicated (e.g., "be careful with client data"), but no formal classification-based policy, approved tool list, or technical enforcement mechanisms are in place.',
          3: 'A data handling policy for AI tool usage specifies which data classifications cannot be included in prompts or shared with external AI APIs. Enforcement is primarily through training and awareness, with limited technical controls and inconsistent employee application of the policy.',
          4: 'A formal AI data handling policy tied to the enterprise data classification framework governs which data types may be used with which AI services. Employees receive role-specific training. Technical controls (e.g., DLP policies, approved tool catalog, API gateway restrictions) enforce restrictions for high-sensitivity classifications.',
          5: 'A comprehensive AI data governance framework governs all interactions between internal data and external AI services, including prompt content classification, contractual data residency and non-training terms with all AI vendors, fine-tuning dataset approval processes, and automated enforcement through enterprise DLP and API gateway controls. Controls are audited quarterly and reviewed after any significant AI vendor policy change.',
        },
      },
      {
        text: 'Our storage and compute infrastructure can scale cost-effectively to production AI workloads.',
        anchors: {
          1: 'Infrastructure cannot support production AI workloads. Training runs are bottlenecked, production inference is too slow or costly, and there is no scalability plan.',
          2: 'Infrastructure can support small-scale AI workloads but has not been tested or designed for production scale. Cost is not tracked or optimized for AI workloads specifically.',
          3: 'Infrastructure can handle current production workloads but struggles with peak demand or large-scale model training. AI-specific cost monitoring and FinOps practices are nascent or absent.',
          4: 'Scalable, cloud-based or hybrid infrastructure handles current production AI workloads efficiently. Cost monitoring, right-sizing, and basic FinOps practices are applied to AI infrastructure.',
          5: 'AI infrastructure is fully elastic, cost-optimized, and governed by a mature FinOps practice that tracks cost-per-inference, cost-per-training-run, and ROI per AI workload. Infrastructure capacity planning is integrated into the AI roadmap process.',
        },
      },
    ],
  },

  // ─── DIMENSION 3 ─────────────────────────────────────────────────────────
  {
    id: 3,
    name: 'Governance & Compliance',
    shortName: 'Governance',
    color: '#8E44AD',
    bgColor: '#F5EEF8',
    description:
      'Reviews the maturity of AI risk management, ethical frameworks, regulatory compliance, and audit capabilities.',
    questions: [
      {
        text: 'We have AI-specific policies, standards, and ethical guidelines that are documented and socialized.',
        anchors: {
          1: 'No AI-specific policies exist. AI systems are governed (if at all) by general IT or data policies that do not address AI-specific risks.',
          2: 'AI ethical principles have been articulated informally, but no formal policies, standards, or guidelines have been documented or approved.',
          3: 'A set of AI principles or a responsible AI policy exists and has been published, but it is aspirational rather than operational and has not been translated into enforceable standards.',
          4: 'Formal AI policies covering ethical principles, acceptable use, risk assessment, and disclosure requirements are documented, approved, and communicated to all relevant staff.',
          5: 'A comprehensive AI governance policy framework includes tiered policies by AI risk level, mandatory training requirements, annual policy reviews, and enforcement mechanisms. All AI systems are assessed against the policy framework before deployment.',
        },
      },
      {
        text: 'There is a formal, repeatable process for assessing AI-related risks before deployment.',
        anchors: {
          1: 'No AI risk assessment process exists. AI systems are deployed without systematic evaluation of potential risks.',
          2: 'Informal risk discussions occur for some high-profile AI projects, but there is no standard framework, template, or required approval gate.',
          3: 'An AI risk assessment template exists and is used for some projects, but completion is not a mandatory deployment gate and assessment quality is inconsistent.',
          4: 'A mandatory AI risk assessment with defined risk categories (bias, privacy, explainability, safety) is required before any AI system deployment. A risk committee reviews high-risk assessments.',
          5: 'A tiered AI risk assessment framework (aligned to EU AI Act or equivalent) is mandatory for all AI deployments. Assessments are independently reviewed for high-risk systems, documented in a central registry, and re-assessed when systems are materially updated.',
        },
      },
      {
        text: 'AI model decisions are auditable and can be explained to regulators and business stakeholders.',
        anchors: {
          1: 'AI models operate as black boxes with no explainability. Neither regulators nor business users can understand or challenge AI-driven decisions.',
          2: 'Explainability is considered informally for some models, but no standardized explainability methods are applied and audit trails do not exist.',
          3: 'Basic explainability methods (e.g., SHAP, LIME) are applied to some models, and model decision logs exist, but coverage is inconsistent and documentation is not audit-ready.',
          4: 'All production AI models have documented explainability approaches appropriate to their risk level. Decision logs are maintained and have been successfully used to respond to regulatory or business inquiries.',
          5: 'A comprehensive AI explainability framework mandates appropriate techniques by model type and risk tier. Explainability documentation is audit-ready, decision logs are immutable and retained per regulatory requirements, and regular explainability reviews are conducted by an independent team.',
        },
      },
      {
        text: 'We perform systematic bias and fairness testing on AI models prior to and during deployment.',
        anchors: {
          1: 'No bias or fairness testing is performed. The organization is unaware of or has not engaged with the risk of biased AI outcomes.',
          2: 'Bias is acknowledged as a risk and some teams informally check for it, but no standardized testing methodology, protected attribute coverage, or formal sign-off exists.',
          3: 'Bias testing is performed for high-risk models using defined metrics (e.g., demographic parity, equalized odds) but testing is pre-deployment only and lacks ongoing monitoring.',
          4: 'Formal bias and fairness testing is a required gate for all customer-facing and high-risk AI models, covering defined protected attributes. Post-deployment fairness monitoring is in place for key models.',
          5: 'A comprehensive bias and fairness program uses multiple fairness metrics appropriate to each use case, tests across intersectional demographic combinations, includes external red-teaming for high-risk models, and continuously monitors production models for fairness drift.',
        },
      },
      {
        text: 'We comply with all relevant data privacy and AI regulations (e.g., GDPR, CCPA, EU AI Act).',
        anchors: {
          1: 'Regulatory compliance requirements applicable to AI are not identified, mapped, or actively managed. No accountability exists for monitoring or responding to relevant data privacy or AI-specific obligations.',
          2: 'Key regulations are known at a high level, but compliance mapping is incomplete, accountability is unclear, and no formal compliance program addresses AI-specific requirements.',
          3: 'A regulatory compliance mapping exists for the most material regulations, and compliance gaps have been identified, but remediation plans are incomplete or behind schedule.',
          4: 'Formal compliance programs address all material AI-related regulations with assigned owners, documented controls, evidence repositories, and annual compliance assessments.',
          5: 'A proactive AI regulatory compliance program monitors evolving global regulations, conducts impact assessments for new regulations, has pre-certified compliance controls for all current requirements, and participates in industry working groups to influence regulatory development.',
        },
      },
      {
        text: 'There is a clear accountability framework with named owners for each AI system in production.',
        anchors: {
          1: 'No accountability framework exists for AI systems. It is unclear who owns production AI systems and who is responsible when they fail or cause harm.',
          2: 'Technical owners (e.g., the team that built it) can be identified informally, but business ownership, executive accountability, and public-facing accountability are undefined.',
          3: 'An AI system registry exists with named technical owners, but business accountability (outcome owner) and escalation paths for incidents or harms are not clearly defined for all systems.',
          4: 'All production AI systems are registered with a named technical owner, business outcome owner, executive sponsor, and defined escalation path. Ownership is reviewed when systems are updated.',
          5: 'A comprehensive AI system accountability matrix assigns clear roles for every AI system. Ownership is formally accepted, included in role descriptions, reviewed annually, and updated within 30 days of any significant system change.',
        },
      },
      {
        text: 'We have an acceptable use policy specifically for generative AI tools that governs approved platforms, permitted data handling, required human oversight, and employee accountability.',
        anchors: {
          1: 'No acceptable use policy exists for generative AI tools. Employees use personal and commercial AI tools (ChatGPT, Claude, Copilot, Gemini, etc.) without any organizational guidance on which tools are permitted, what data can be processed, or when outputs require human review.',
          2: 'An informal memo or email has been circulated discouraging specific behaviors (e.g., "do not input client data into ChatGPT"), but no formal policy, approved tool list, accountability mechanism, or enforcement approach exists, and compliance cannot be verified.',
          3: 'A generative AI acceptable use policy has been drafted and published covering approved tools and prohibited data categories, but it lacks specificity on required human review gates for regulated or high-stakes outputs, technical enforcement, and accountability for violations.',
          4: 'A formal generative AI acceptable use policy — reviewed by legal, compliance, and security — covers: an approved tool catalog, data classification requirements for prompts, mandatory human review gates for regulated or high-stakes decisions, employee attestation, and disciplinary provisions. Policy is integrated into onboarding and annual compliance training.',
          5: 'A comprehensive generative AI governance framework integrates the acceptable use policy with technical enforcement (approved tool catalog with SSO enforcement, prompt audit logging for regulated use cases), role-specific usage guidance, quarterly policy reviews for regulatory alignment, a formal exception and waiver process, and annual policy effectiveness assessments.',
        },
      },
      {
        text: 'Incident response plans exist specifically for AI system failures, errors, and harms.',
        anchors: {
          1: 'No AI-specific incident response plans exist. AI failures are handled reactively without defined procedures, communication protocols, or escalation paths.',
          2: 'AI incidents are handled under the general IT incident response process, which does not address AI-specific scenarios such as biased outputs, unexplained decisions, or data poisoning.',
          3: 'AI-specific incident response procedures have been drafted but not tested, and coverage of AI-specific harm scenarios (e.g., discriminatory outputs, privacy breaches via inference) is incomplete.',
          4: 'Documented AI incident response plans cover the most material failure scenarios with defined severity levels, response SLAs, communication templates, and assigned response owners. Plans are tested annually.',
          5: 'A comprehensive AI incident response framework covers technical failures, ethical harms, regulatory breaches, and reputational incidents. Playbooks are scenario-specific, tested via tabletop exercises bi-annually, and integrated with the enterprise crisis management process.',
        },
      },
      {
        text: 'We conduct regular audits of AI systems, their outputs, and their downstream business impacts.',
        anchors: {
          1: 'No AI audits are conducted. AI systems are deployed and never independently reviewed for accuracy, fairness, or unintended consequences.',
          2: 'Informal reviews of AI outputs occur in some areas, but they are not structured, independent, or comprehensive enough to constitute a meaningful audit.',
          3: 'Annual audits occur for the highest-risk AI systems covering key metrics such as accuracy and fairness, but reviews lack independence, downstream business impact analysis is absent, and audit documentation is insufficient for governance reporting.',
          4: 'Annual independent audits of all high-risk AI systems cover technical performance, fairness, explainability, and downstream business impacts. Findings are reported to governance bodies and remediation is tracked.',
          5: 'A tiered audit program conducts risk-proportionate reviews. High-risk systems receive semi-annual independent audits, medium-risk systems annual reviews. Audits cover the full AI lifecycle and critical findings trigger mandatory remediation within defined SLAs.',
        },
      },
      {
        text: 'Third-party AI vendors and tools are assessed for compliance, security, and alignment with our policies.',
        anchors: {
          1: 'Third-party AI vendors are not assessed beyond general IT procurement. AI-specific risks (data handling, model bias, regulatory compliance) are not evaluated.',
          2: 'Some high-profile AI vendors have been informally reviewed for obvious compliance issues, but there is no standard assessment framework or required documentation.',
          3: 'An AI vendor assessment questionnaire exists and is used for significant new vendors, but it is not comprehensive, not consistently applied, and post-contract monitoring is absent.',
          4: 'A formal AI vendor risk assessment framework covers data privacy, AI ethics, security, and regulatory compliance for all new AI vendor engagements. Material findings gate contract approval.',
          5: 'All AI vendors are assessed against a comprehensive framework before onboarding and re-assessed annually. Assessments cover data handling, model bias practices, regulatory compliance, SLAs, and audit rights. High-risk vendor relationships include contractual AI-specific obligations.',
        },
      },
      {
        text: 'We have a defined process for retiring and decommissioning AI systems, including criteria for end-of-life decisions, data disposal obligations, and documentation of system closure.',
        anchors: {
          1: 'No decommissioning process exists. AI systems continue running indefinitely regardless of degraded performance, obsolescence, or data retention obligations. No accountable owner decides when a system should be retired, and no documentation is produced when systems are taken offline.',
          2: 'Systems are occasionally shut down when they become obviously problematic or unused, but the decision is informal and ad-hoc. Data disposal and regulatory retention obligations are not systematically addressed, and no documentation is produced when systems are decommissioned.',
          3: 'An informal decommissioning checklist exists for production AI systems. It covers the most obvious steps (disabling endpoints, archiving model artifacts) but is incomplete on data retention obligations, stakeholder notification, knowledge transfer requirements, and post-decommission audit documentation.',
          4: 'A formal AI system decommissioning process defines retirement criteria (performance thresholds, business relevance, compliance triggers), requires a documented business case for shutdown decisions, addresses data retention and disposal obligations aligned to regulatory requirements, specifies stakeholder notification, and produces audit documentation for every system closure.',
          5: 'A comprehensive AI lifecycle closure framework covers: formal retirement criteria with independent review for high-risk system decommissioning, contractual and regulatory data disposal tracked through the closure process, immutable audit documentation for every decommissioned system, mandatory knowledge transfer to capture institutional knowledge before closure, and post-mortem analysis to inform future system design. Decommissioning decisions are logged in the AI system registry.',
        },
      },
      {
        text: 'There is executive-level oversight of AI governance through a committee or equivalent body.',
        anchors: {
          1: 'No executive governance body for AI exists. Decisions about AI risk, policy, and ethics are made at the team level without escalation paths.',
          2: 'AI governance discussions occur informally among senior leaders but there is no formal committee, defined mandate, meeting cadence, or authority over AI risk decisions.',
          3: 'An AI governance committee has been established and meets occasionally, but its mandate is unclear, attendance is inconsistent, and decisions are advisory rather than binding.',
          4: 'A formally chartered AI governance committee with C-suite representation meets at least quarterly, has a defined mandate covering risk, ethics, and policy, and makes binding decisions on high-risk AI issues.',
          5: 'A mature AI governance structure includes a C-suite AI steering committee, an operational AI risk committee, and defined escalation paths from operational to executive levels. The governance body reports to the board on AI risk and ethics at least annually.',
        },
      },
    ],
  },

  // ─── DIMENSION 4 ─────────────────────────────────────────────────────────
  {
    id: 4,
    name: 'Talent, Culture & Enablement',
    shortName: 'Talent',
    color: '#E67E22',
    bgColor: '#FEF5E7',
    description:
      'Measures AI talent depth, organizational culture around data and experimentation, and enablement programs across the workforce.',
    questions: [
      {
        text: 'We have sufficient dedicated AI/ML engineering and data science talent to execute our strategy.',
        anchors: {
          1: 'No dedicated AI/ML talent exists. AI work is assigned to general software engineers or data analysts without the skills to execute the strategy.',
          2: 'A small number of data scientists or ML engineers exist but are insufficient in number and breadth to execute the stated AI strategy. Critical skill gaps are unaddressed.',
          3: 'A functional AI team exists covering core roles (data science, ML engineering) but is operating at capacity, has skill gaps in areas like MLOps or AI governance, and cannot absorb new strategic priorities.',
          4: 'A well-staffed AI team covers all core competencies required by the strategy, with headcount appropriate to the portfolio. Skill gaps are identified, tracked, and actively being closed through hiring or development.',
          5: 'AI talent is a strategic asset with depth across all required specializations (data science, ML engineering, MLOps, AI product, AI ethics). Headcount planning is tied to the AI roadmap, bench strength is maintained, and the team is consistently recognized as a talent destination.',
        },
      },
      {
        text: 'There is a structured, ongoing program for AI skills development and workforce upskilling.',
        anchors: {
          1: 'No AI upskilling program exists. Employees interested in AI must self-fund and self-direct their learning outside of work.',
          2: 'Access to online learning platforms is provided, but there is no structured AI curriculum, learning goals, or manager accountability for skills development.',
          3: 'An AI learning curriculum has been designed and some role-specific tracks are available, but participation is voluntary, completion rates are low, and learning is not connected to role requirements or career progression.',
          4: 'A structured AI upskilling program with role-based learning paths, manager-encouraged participation, completion tracking, and connection to career development is actively used by a majority of target employees.',
          5: 'An enterprise AI academy provides differentiated learning programs by role (executive, business, technical, governance), blending online learning, internal workshops, mentoring, and hands-on AI projects. Learning outcomes are assessed and linked to career progression.',
        },
      },
      {
        text: 'Leadership consistently champions a culture of data-driven decision making at all levels.',
        anchors: {
          1: 'Leadership makes decisions primarily based on intuition and experience. Data is rarely used to challenge or inform significant decisions.',
          2: 'Leadership acknowledges the value of data-driven decisions in principle, but data is inconsistently used, and gut-feel decisions frequently override data-backed analysis.',
          3: 'Data is used in leadership decision-making for significant choices, but the use of data is not consistent across all leaders and levels, and anecdotal or qualitative judgment still prevails in many leadership forums.',
          4: 'Leadership consistently expects and models data-driven decision-making. Business reviews require data-backed analysis and decisions are documented with the data that informed them.',
          5: 'Data-driven decision-making is a core organizational value embedded in all leadership behaviors, performance criteria, and governance processes. Leaders are assessed on their ability to interpret and apply data.',
        },
      },
      {
        text: 'Employees broadly understand how to work effectively alongside AI tools in their workflows.',
        anchors: {
          1: 'Employees are largely unaware of relevant AI tools or how to use them. AI adoption in day-to-day workflows is negligible.',
          2: 'Some employees have independently adopted AI tools in their workflows, but this is self-directed, unsupported by the organization, and unevenly distributed.',
          3: 'AI tools have been rolled out to some functions with basic training, but adoption is inconsistent, effective use is limited, and employees lack confidence in how to apply AI safely and productively.',
          4: 'Most employees in target functions are actively using AI tools in their workflows with structured onboarding, role-specific guidance, and ongoing support. Usage is tracked and adoption metrics are reported.',
          5: 'AI tool adoption is widespread and deeply embedded in daily workflows across the organization. Role-specific AI workflow playbooks are maintained, adoption and productivity metrics are tracked, and champions networks accelerate peer-to-peer adoption.',
        },
      },
      {
        text: 'We have strong, structured change management processes specifically designed for AI adoption.',
        anchors: {
          1: 'No change management process exists for AI initiatives. AI is deployed with a "build it and they will come" approach, resulting in low adoption and resistance.',
          2: 'General IT change management processes are applied to AI projects, but they do not address AI-specific concerns such as employee anxiety about job displacement or trust in AI outputs.',
          3: 'AI projects include some change management activities (e.g., stakeholder comms, basic training), but these are inconsistently applied and often executed too late in the project to be effective.',
          4: 'A structured AI change management methodology is applied to all significant AI deployments, covering stakeholder analysis, communication planning, training, adoption support, and post-go-live reinforcement.',
          5: 'An enterprise AI change management center of excellence provides a proven methodology, toolkit, and dedicated change practitioners for all material AI deployments. Change effectiveness is measured through adoption metrics, sentiment surveys, and business impact.',
        },
      },
      {
        text: 'Business domain experts are actively and meaningfully involved in AI project design and validation.',
        anchors: {
          1: 'AI projects are designed and built entirely by the technical team without business input. Domain experts review outputs only at the end, often leading to misaligned or unusable models.',
          2: 'Business stakeholders are consulted at project initiation but are not engaged during development. Their feedback is gathered informally at the end and often results in costly rework.',
          3: 'Business domain experts participate in requirements gathering and user acceptance testing, but their involvement during model development (feature selection, validation, threshold-setting) is limited.',
          4: 'Business domain experts are embedded in AI project teams from inception through deployment, actively contributing to problem framing, feature engineering, model validation, and deployment criteria.',
          5: 'Business-AI co-design is the standard methodology. Domain experts co-own AI project outcomes, are assessed on AI contribution as part of their performance, and serve as post-deployment champions.',
        },
      },
      {
        text: 'Employees in relevant roles have the generative AI literacy to use these tools productively — including effective prompt crafting, critical evaluation of AI outputs, recognition of hallucination risks, and safe data handling.',
        anchors: {
          1: 'Employees have minimal generative AI literacy. Most cannot use available AI tools effectively, cannot identify AI-generated errors or hallucinations, and are either unaware of or ignoring organizational guidance on safe and responsible GenAI use.',
          2: 'Some employees have self-taught basic generative AI skills through independent experimentation, but there is no consistent literacy baseline across the organization. Critical competencies — prompt crafting for business tasks, hallucination detection, and appropriate data handling — are absent in most roles.',
          3: 'A basic generative AI literacy program has been deployed (e.g., a mandatory online course) and most target employees have completed it. However, role-specific prompt engineering skills, output validation techniques, and safe data handling practices have not been developed to a functional level of proficiency.',
          4: 'Role-specific generative AI training programs develop practical competencies in prompt engineering for the role, hallucination and bias recognition, output validation workflows, and safe data handling. Proficiency is assessed through applied exercises, completion is tracked, and most target employees operate at a functional level.',
          5: 'Generative AI proficiency is a formally defined organizational competency, assessed by role on an annual cycle. Advanced programs cover multi-turn prompting, agentic AI interaction, retrieval-augmented generation (RAG) system use, and domain-specific GenAI application. Function-level GenAI champions sustain peer-to-peer learning, and literacy metrics are reported to leadership as a workforce readiness indicator.',
        },
      },
      {
        text: 'There is meaningful, structured cross-functional collaboration on AI projects.',
        anchors: {
          1: 'AI projects are executed within functional silos. Cross-functional collaboration is absent, leading to technically sound but business-irrelevant or undeployable AI solutions.',
          2: 'Cross-functional collaboration occurs informally when individuals build personal relationships, but there is no structural support for it and it is not the norm.',
          3: 'AI projects include representatives from multiple functions, but collaboration is often superficial (e.g., attendance at meetings without active contribution) and coordination friction is high.',
          4: 'AI projects are staffed with formally cross-functional teams with defined roles for technical, business, data, and governance contributors. Collaboration norms and RACI frameworks are in place.',
          5: 'Cross-functional AI teams are the default operating model. Team composition standards, collaboration tooling, shared outcome ownership, and teaming protocols are standardized and effectiveness is measured.',
        },
      },
      {
        text: 'We have a community of practice or center of excellence that drives AI best practices.',
        anchors: {
          1: 'No AI community of practice or center of excellence exists. Best practices are not shared across teams and each AI team operates in isolation.',
          2: 'Informal knowledge sharing occurs (e.g., occasional tech talks, a shared Slack channel) but there is no structured community with governance, programmed content, or accountability for standards.',
          3: 'An AI community of practice exists and meets regularly, but participation is voluntary, content is uneven, and its connection to organizational AI standards and decision-making is weak.',
          4: 'An active AI community of practice with structured programming (regular meetings, knowledge shares, working groups) and a formal AI center of excellence drives standards, tooling decisions, and best practice adoption.',
          5: 'A mature AI center of excellence with dedicated staff serves as the enterprise hub for AI standards, tooling, reusable assets, best practices, and practitioner development. The CoE measures its own effectiveness through adoption metrics and business value attribution.',
        },
      },
      {
        text: 'Employees have psychological safety to experiment with AI, fail fast, and share learnings.',
        anchors: {
          1: 'Fear of failure is pervasive. Employees do not experiment with AI because failure is penalized, and there is no recognized mechanism for sharing what does not work.',
          2: 'Leadership espouses experimentation in principle, but cultural norms, incentive structures, and performance management implicitly penalize failure, suppressing genuine experimentation.',
          3: 'A rhetoric of experimentation exists and some teams have established safe-to-fail norms, but this is not consistent across the organization and leadership behaviors do not uniformly reinforce it.',
          4: 'Leadership actively models experimentation by openly sharing failures and learnings. Defined innovation time exists, failed experiments are recognized as learning opportunities, and post-mortems are blameless.',
          5: 'Psychological safety for AI experimentation is a measured cultural attribute assessed in annual surveys. Learning from failure is embedded in team rituals, performance criteria reward experimentation velocity, and leadership regularly shares their own AI experiment failures.',
        },
      },
      {
        text: 'AI literacy is formally measured, tracked, and improving across the organization over time.',
        anchors: {
          1: 'AI literacy is not measured. The organization has no understanding of its current AI literacy baseline or how it is changing over time.',
          2: 'Training completion rates are tracked for some AI courses but there is no assessment of actual AI literacy, no baseline, and no target for improvement.',
          3: 'An AI literacy assessment has been conducted once to establish a baseline, but there is no systematic tracking, improvement target, or connection to business outcomes.',
          4: 'Annual AI literacy assessments are conducted across defined employee populations, results are tracked against baseline and targets, and gaps inform the annual upskilling program.',
          5: 'AI literacy is a formally tracked organizational capability measured through annual assessments, training completion data, and on-the-job application metrics. Progress against targets is reported to the executive team and informs AI talent strategy.',
        },
      },
      {
        text: 'We have a clear career path and professional development program for AI practitioners.',
        anchors: {
          1: 'No defined career path exists for AI practitioners. Advancement is unclear, which contributes to attrition as high performers leave for organizations with clearer growth trajectories.',
          2: 'General engineering or analytics career paths are loosely applied to AI roles, but the paths are not differentiated for AI competencies and do not reflect the market for AI talent.',
          3: 'An AI career framework has been drafted with some defined levels and competencies, but it is not fully implemented, is inconsistently applied by managers, and lacks connection to compensation.',
          4: 'A defined AI career framework covers multiple tracks (e.g., IC, management, research) with clear level definitions, competency expectations, and connection to compensation bands. Annual calibration ensures consistent application.',
          5: 'A comprehensive AI career architecture covers multiple tracks, provides clear advancement criteria, is competitively benchmarked annually, and is supported by structured development plans, mentoring programs, and stretch assignment rotations.',
        },
      },
    ],
  },

  // ─── DIMENSION 5 ─────────────────────────────────────────────────────────
  {
    id: 5,
    name: 'AI Operations & Engineering Process',
    shortName: 'Operations',
    color: '#27AE60',
    bgColor: '#EAFAF1',
    description:
      'Examines the rigor and maturity of MLOps practices, deployment pipelines, monitoring, and engineering processes for AI systems.',
    questions: [
      {
        text: 'We use mature MLOps practices and tooling for end-to-end model development and deployment.',
        anchors: {
          1: 'No MLOps practices exist. Models are trained in notebooks, deployed manually, and operations are entirely manual with no reproducibility.',
          2: 'Basic MLOps tooling is in place (e.g., a shared code repository) but there is no experiment tracking, automated deployment, or standardized model lifecycle management.',
          3: 'Core MLOps tools are deployed (experiment tracking, model registry, basic CI/CD) but are not used consistently across all teams and full lifecycle automation is incomplete.',
          4: 'A mature MLOps platform covers the full model lifecycle (experimentation, training, evaluation, deployment, monitoring) and is consistently used by all AI/ML teams. Platform adoption is tracked.',
          5: 'A world-class MLOps platform enables fully automated model lifecycle management from feature engineering through production monitoring. The platform is treated as a product with a dedicated engineering team, SLAs, and a roadmap aligned to the AI strategy.',
        },
      },
      {
        text: 'AI models are version-controlled with fully reproducible training pipelines.',
        anchors: {
          1: 'Models are not version-controlled. Training is not reproducible — the same inputs produce different results, and previous model versions cannot be recovered.',
          2: 'Model artifacts are saved to shared storage, but versioning is inconsistent, metadata is minimal, and training pipelines cannot be reliably reproduced.',
          3: 'Models are version-controlled in a model registry, but full reproducibility (including data version, hyperparameters, environment, and random seeds) is achieved only for some models.',
          4: 'All production models are version-controlled with complete lineage (code, data, hyperparameters, environment, metrics) and training pipelines are reproducible by any team member with access.',
          5: 'Complete model reproducibility is enforced by the MLOps platform. All training pipeline runs are logged and comparable. Reproducibility is tested as part of the model promotion process.',
        },
      },
      {
        text: 'We have automated testing (unit, integration, regression) specifically for AI systems.',
        anchors: {
          1: 'No automated testing exists for AI systems. Models are evaluated manually or not at all before deployment.',
          2: 'Some manual evaluation of model outputs occurs (e.g., reviewing a sample of predictions) but no automated tests, test suites, or quality gates exist.',
          3: 'Basic automated tests exist for some models (e.g., performance threshold checks), but unit testing of ML code, integration tests, and regression testing against a holdout set are not consistently applied.',
          4: 'A standardized AI testing suite covers data validation, model performance thresholds, behavioral testing (e.g., invariance, directional tests), and integration tests. Tests are run automatically on every model update.',
          5: 'Comprehensive AI system testing includes unit tests for ML code, data validation, model performance regression, adversarial testing, fairness checks, and production shadow testing. All tests are automated in CI/CD pipelines with mandatory passing gates.',
        },
      },
      {
        text: 'CI/CD pipelines are in place for automated, low-risk AI model deployment.',
        anchors: {
          1: 'No CI/CD pipelines exist for AI models. Deployment is entirely manual and requires significant engineering effort for every release.',
          2: 'Basic CI exists for model code (e.g., unit test runs on commit) but no CD pipeline automates model deployment. Releases are manual, infrequent, and inconsistent.',
          3: 'A CI/CD pipeline exists for some AI models but does not cover all deployment scenarios, lacks automated rollback capability, and does not enforce quality gates before production deployment.',
          4: 'Automated CI/CD pipelines handle code testing, model training, evaluation, and deployment for all production models. Quality gates block promotion of underperforming models and automated rollback is available.',
          5: 'Fully automated CI/CD pipelines with multi-stage promotion environments (dev → staging → canary → production), automated quality gates, performance benchmarking, one-click rollback, and deployment frequency metrics are standard for all AI systems.',
        },
      },
      {
        text: 'We continuously monitor model performance, reliability, and quality in production.',
        anchors: {
          1: 'No production monitoring exists for AI models. The organization learns about degraded model performance from user complaints or business metric declines.',
          2: 'Basic logging of model inputs and outputs occurs, but no systematic performance monitoring, alerting, or SLA tracking is in place.',
          3: 'Performance monitoring is in place for the most critical models, covering key metrics (e.g., accuracy, latency), but alert coverage is incomplete and response procedures are not defined.',
          4: 'Comprehensive production monitoring covers all deployed models with dashboards for performance, reliability, latency, and data quality. Alerts are calibrated to business impact and trigger defined response procedures.',
          5: 'Real-time model observability is provided through dedicated monitoring infrastructure covering prediction quality, data drift, feature distribution, latency, availability, and business outcome correlation for every production model.',
        },
      },
      {
        text: 'There is a defined, reliable, and tested process for model retraining and updates.',
        anchors: {
          1: 'No systematic retraining process exists. When models show obvious performance degradation, retraining is performed manually and reactively, without defined triggers, schedules, or validation steps.',
          2: 'Retraining occurs on an ad-hoc basis when performance issues are noticed, but there is no trigger criteria, automation, or validation process for retrained models.',
          3: 'A retraining process is documented for key models with some automated triggers (e.g., scheduled retraining), but validation of retrained models before deployment is inconsistent.',
          4: 'A defined retraining process with automated triggers (performance degradation thresholds, data drift alerts, scheduled retraining), automated re-evaluation, and a promotion process exists for all production models.',
          5: 'Continuous training pipelines automatically retrain models based on drift detection, new data availability, or scheduled triggers. Retrained models go through the full CI/CD pipeline with automated comparison to the current production model.',
        },
      },
      {
        text: 'AI experiments are systematically tracked and results are fully reproducible by any team member.',
        anchors: {
          1: 'Experiments are tracked only in individual notebooks or personal files. Results are not shared, not reproducible, and lost when the experimenter leaves.',
          2: 'Some teams share experiment results informally (e.g., in a shared wiki or Slack channel), but there is no standardized tracking tool, metadata format, or reproducibility standard.',
          3: 'An experiment tracking tool is deployed and used by most teams, but logged metadata is inconsistent, reproducibility is partial, and cross-team visibility into experiments is limited.',
          4: 'All ML experiments are logged in a centralized tracking platform with standardized metadata (code version, data version, parameters, metrics, environment). Any team member can reproduce any logged experiment.',
          5: 'A comprehensive ML experimentation platform captures all experiments with complete reproducibility metadata, enables cross-team search and comparison, supports systematic hyperparameter optimization, and provides experiment cost tracking.',
        },
      },
      {
        text: 'We have defined and actively monitored SLAs for AI system performance, availability, and latency.',
        anchors: {
          1: 'No SLAs are defined for AI systems. There are no commitments to business users on performance, availability, or response time.',
          2: 'Informal expectations exist (e.g., "the model should be available during business hours") but these are not documented as formal SLAs, measured, or reported.',
          3: 'SLAs are defined for the most critical AI systems, but measurement is manual, reporting is infrequent, and escalation procedures for SLA breaches are not defined.',
          4: 'Formal SLAs covering latency, availability, and prediction quality are defined for all production AI systems. SLA performance is automatically measured and reported in dashboards reviewed weekly.',
          5: 'Comprehensive, risk-tiered SLAs cover latency (p50, p95, p99), availability, batch processing deadlines, and prediction quality for all production AI systems. SLA tracking is real-time with automated alerts for breaches and monthly reports to business stakeholders.',
        },
      },
      {
        text: 'Model documentation (model cards, data sheets) is standardized and consistently maintained.',
        anchors: {
          1: 'No model documentation exists beyond code comments. Institutional knowledge about models is informal and lost when team members leave.',
          2: 'Some high-profile models have informal documentation (e.g., a README or wiki page), but there is no standard template, maintenance process, or completeness requirement.',
          3: 'A model documentation template (e.g., based on model cards) exists and is used for most new models, but historical models are undocumented and template completion is not enforced.',
          4: 'Standardized model documentation (including intended use, performance metrics, limitations, training data description, and ethical considerations) is required for all production models and is reviewed at each update.',
          5: 'Comprehensive, version-controlled model documentation following an industry-standard framework is mandatory for all models at every lifecycle stage. Documentation is automatically generated from experiment tracking data where possible and is accessible to auditors and business stakeholders.',
        },
      },
      {
        text: 'AI development best practices and standards are documented and consistently followed.',
        anchors: {
          1: 'No AI development standards exist. Each team or individual follows their own practices, resulting in inconsistent code quality, reproducibility, and security.',
          2: 'Some informal best practices are shared through team knowledge-sharing, but they are not documented, enforced, or consistently followed.',
          3: 'An AI development standards guide exists covering key areas (code quality, experimentation, documentation), but adoption is voluntary, enforcement is absent, and the guide is not regularly updated.',
          4: 'Documented AI development standards covering code quality, experimentation practices, documentation, security, and testing are enforced through code review and CI gates. Standards are reviewed annually.',
          5: 'A living AI development standards framework is maintained by the CoE, enforced through automated linting and CI gates, embedded in onboarding, and regularly updated based on emerging best practices. Compliance with standards is measured and reported.',
        },
      },
      {
        text: 'We have operational practices for managing generative AI and LLM-based applications in production — including prompt versioning, output validation, hallucination monitoring, inference cost management, and provider substitution capability.',
        anchors: {
          1: 'No operational practices exist for LLM-based applications. Prompts are hardcoded in application code, outputs are not validated before use, inference costs are untracked, and there is no ability to switch AI providers or models if a service degrades or a provider changes terms.',
          2: 'LLM-based applications are in production but managed ad-hoc. Some teams informally track inference costs and manually review outputs, but there is no standardized prompt management, output validation, or LLM-specific observability in place.',
          3: 'Core LLMOps practices exist for the most critical applications — prompts are version-controlled, basic output quality checks are automated (e.g., safety filters), and inference costs are monitored. However, practices are not standardized across all LLM applications and hallucination detection is limited to obvious cases.',
          4: 'A standardized LLMOps framework applies to all production LLM applications, covering: prompt versioning and change management, automated output validation (hallucination checks, content safety, accuracy sampling), inference cost dashboards with per-use-case attribution, defined SLAs for LLM API dependencies, and tested failover procedures for critical applications.',
          5: 'A mature LLMOps platform treats LLM-based applications as first-class production systems with full prompt lifecycle management (versioning, A/B testing, rollback), multi-model routing and provider abstraction, continuous output quality monitoring (hallucination rate, latency, toxicity), RAG pipeline observability, cost-per-query optimization, and regular red-teaming for adversarial robustness and prompt injection risks.',
        },
      },
      {
        text: 'We measure and actively optimize AI system efficiency, resource utilization, and cost.',
        anchors: {
          1: 'AI system costs are not tracked at the individual system level. There is no visibility into resource utilization, cost-per-inference, or cost-per-training-run.',
          2: 'Aggregate cloud or infrastructure spend on AI is visible but is not broken down by system, workload, or use case. No optimization practices are in place.',
          3: 'Cost tracking by AI system or workload exists for major systems, but systematic optimization practices (right-sizing, spot instances, model compression) are not applied and cost accountability rests with central IT rather than AI teams.',
          4: 'A FinOps practice for AI tracks cost by system, optimizes infrastructure right-sizing, uses spot/preemptible compute for training, and reports cost efficiency metrics to AI team leads monthly.',
          5: 'A mature AI FinOps program tracks cost-per-inference, cost-per-training-run, and ROI-per-workload for every AI system. AI teams have cost accountability and optimization targets. Model compression, quantization, caching, and hardware acceleration are systematically evaluated.',
        },
      },
    ],
  },
]

// ── Runtime integrity guard ───────────────────────────────────────────────
// Catches bundler issues, circular dependency problems, or accidental truncation
// of this file before they cascade into cryptic "Cannot read property of undefined"
// errors throughout the app.
if (!Array.isArray(dimensions) || dimensions.length !== 5) {
  throw new Error(
    `questions.js integrity check failed: expected 5 dimensions, got ${Array.isArray(dimensions) ? dimensions.length : typeof dimensions}. Check for syntax errors or circular imports.`
  )
}
dimensions.forEach((d, i) => {
  if (!d.id || !Array.isArray(d.questions) || d.questions.length !== 12) {
    throw new Error(
      `questions.js integrity check failed: dimension at index ${i} is malformed (id=${d?.id}, questions=${d?.questions?.length}). Check for accidental edits.`
    )
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// Scoring helpers
// ─────────────────────────────────────────────────────────────────────────────

// Full behaviorally-anchored scale labels — used on the assessment form buttons
export const scaleLabels = {
  1: 'Not at all / No capability',
  2: 'Early / Ad-hoc',
  3: 'Developing / Inconsistent',
  4: 'Established / Mostly consistent',
  5: 'Advanced / Fully optimized',
}

// Short labels — used in compact UI contexts (summary pills, progress bar legend)
// Previously duplicated inline in DimensionAssessment.jsx as scaleSummaryLabels
export const scaleShortLabels = ['Not at all', 'Early / Ad-hoc', 'Developing', 'Established', 'Advanced']

export const maturityLevels = [
  {
    label: 'Beginning', min: 0, max: 19, color: '#E74C3C', bg: '#FDEDEC',
    context: 'AI is largely absent or entirely ad-hoc. Foundational decisions about strategy, data ownership, and governance have not been made. Most organizations at this stage have not yet run a sustained AI initiative — the priority is establishing executive sponsorship and making the first deliberate, sequenced investments.',
  },
  {
    label: 'Developing', min: 20, max: 39, color: '#E67E22', bg: '#FEF5E7',
    context: 'AI initiatives exist but are fragmented, inconsistently governed, and not reliably delivering value. This is the most common starting point for organizations beginning a structured AI program — typically reflecting 0–2 years of active, but uncoordinated, investment. The priority is moving from reactive to intentional.',
  },
  {
    label: 'Maturing', min: 40, max: 59, color: '#F1C40F', bg: '#FEFCE8',
    context: 'Core AI capabilities are established and beginning to operate consistently. The organization has moved past early fragmentation but has not yet achieved reliable, governed, enterprise-scale delivery. This reflects 2–4 years of active, sponsored AI investment and is where most mid-market programs plateau without deliberate governance and scaling investment.',
  },
  {
    label: 'Advanced', min: 60, max: 79, color: '#2EA3F2', bg: '#E8F4FD',
    context: 'AI operates at enterprise scale with established governance, reliable delivery infrastructure, and demonstrable business value. Remaining gaps are actively managed rather than ignored. Characteristic of organizations with 3–5 years of sustained, executive-sponsored AI programs and a dedicated AI function.',
  },
  {
    label: 'Leading', min: 80, max: 100, color: '#27AE60', bg: '#EAFAF1',
    context: 'AI is a core organizational capability with mature governance, consistent delivery, measurable value attribution, and a culture of continuous improvement. This level typically requires 4+ years of sustained, well-funded investment and is characteristic of organizations where AI is a primary competitive differentiator — not just an efficiency tool.',
  },
]

export function getMaturityLevel(score) {
  const s = Math.max(0, Math.min(100, score ?? 0))
  return maturityLevels.find(l => s >= l.min && s <= l.max) ?? maturityLevels[0]
}

// ── Risk profile detector ──────────────────────────────────────────────────
// Accepts either {id, score}[] (single-session) or {dimId, avg}[] (composite).
// Returns a named risk profile when a dangerous imbalance is detected, or null.
export function getRiskProfile(scores) {
  const get = id => {
    const item = scores.find(d => (d.id ?? d.dimId) === id)
    return item != null ? (item.score ?? item.avg) : null
  }
  const strat = get(1), data = get(2), gov = get(3), tal = get(4), ops = get(5)

  // Ungoverned deployment: capable delivery/data, no governance controls
  if (gov != null && gov < 30 && ((ops != null && ops > 55) || (data != null && data > 55))) {
    const capDim = ops != null && ops > 55 ? `Operations (${ops}/100)` : `Data (${data}/100)`
    return {
      label: 'Ungoverned Deployment Risk',
      color: '#DC2626',
      bg: '#FEE2E2',
      description: `${capDim} significantly outpaces Governance (${gov}/100). AI systems are being deployed or data capabilities built at scale without adequate risk controls, policies, or accountability structures. This is a material compliance, ethical, and reputational liability that compounds as deployment accelerates. Governance investment should be treated as urgent — not a Phase 2 option.`,
    }
  }

  // Vision without execution: strong strategy, operations haven't followed
  if (strat != null && ops != null && strat > 55 && ops < 30 && strat - ops >= 25) {
    return {
      label: 'Vision Without Execution',
      color: '#D97706',
      bg: '#FEF3C7',
      description: `Strategic intent (${strat}/100) significantly outpaces delivery capability (Operations ${ops}/100). The organization has invested in planning and direction but has not yet built the engineering and deployment infrastructure to act on it. Without closing this gap, AI strategy documents will not translate into deployed systems — and leadership confidence in AI will erode.`,
    }
  }

  // Platform without people: infrastructure built, team to operate it isn't
  if (data != null && ops != null && tal != null && data > 55 && ops > 55 && tal < 30) {
    return {
      label: 'Platform Without People',
      color: '#7C3AED',
      bg: '#EDE9FE',
      description: `Technical infrastructure is well-developed (Data ${data}/100, Operations ${ops}/100) but talent and organizational enablement are critically low (Talent ${tal}/100). Platforms built without the people to operate and continuously improve them create fragility — and the AI practitioners who do exist will leave when they see no organizational investment in their development.`,
    }
  }

  return null
}

// Sentinel value for "Don't Know / Outside my area" — excluded from scoring
export const DK = 'dk'

// Returns null if all answers are DK (no scoreable data) — prevents false 0/100
export function computeScore(answers) {
  const numeric = Object.values(answers || {}).filter(v => typeof v === 'number')
  if (!numeric.length) return null  // null = no visibility, not a true score of 0
  const sum = numeric.reduce((a, b) => a + b, 0)
  return Math.round(((sum - numeric.length) / (numeric.length * 4)) * 100)
}

// Returns score + visibility metadata per dimension
export function computeDimensionMeta(answers, numQuestions) {
  const all     = Object.values(answers || {})
  const numeric = all.filter(v => typeof v === 'number')
  const dkCount = all.filter(v => v === DK).length
  const score   = computeScore(answers)
  return {
    score,                        // null = all-DK, no scoreable data
    answered: numeric.length,
    dkCount,
    total: numQuestions,
    noVisibility: numeric.length === 0 && dkCount > 0,  // true when entirely DK
  }
}

export function computeDimensionScores(allAnswers) {
  return dimensions.map(d => ({
    ...d,
    score: computeScore(allAnswers[d.id]),
  }))
}

export function computeOverallScore(dimensionScores) {
  // Exclude null-score dimensions (all-DK) from the overall average
  const scoreable = dimensionScores.filter(d => d.score !== null && d.score !== undefined)
  if (!scoreable.length) return 0
  const total = scoreable.reduce((acc, d) => acc + d.score, 0)
  return Math.round(total / scoreable.length)
}

// ── Executive summary narrative generator ─────────────────────────────────
//
// generateNarrative returns an array of diagnostic sentences tailored to the
// specific score pattern, cross-dimension relationships, and visibility gaps
// surfaced by this assessment. Each call produces differentiated output.
//
// dimMeta is optional — { [dimId]: { dkCount, total, answered } }
// When provided, dimensions with high DK rates are called out explicitly.

// Cross-dimension diagnostic patterns — checked in priority order
const DIAGNOSTIC_PATTERNS = [
  // Vision–execution gap: strategy strong, operations weak
  {
    id: 'strategy_ops_gap',
    test: (s) => {
      const strat = s.find(d => d.id === 1)
      const ops   = s.find(d => d.id === 5)
      return strat && ops && strat.score >= 50 && ops.score < 40 && (strat.score - ops.score) >= 20
    },
    message: (s) => {
      const strat = s.find(d => d.id === 1)
      const ops   = s.find(d => d.id === 5)
      return `A significant vision–execution gap exists: AI Strategy scores ${strat.score}/100 while AI Operations scores ${ops.score}/100. The organization has invested in planning and intent but has not yet built the engineering and deployment infrastructure to deliver on it. Closing this gap is typically the highest-leverage near-term investment.`
    },
  },
  // Deployment risk: operations strong, governance weak
  {
    id: 'ops_governance_risk',
    test: (s) => {
      const ops  = s.find(d => d.id === 5)
      const gov  = s.find(d => d.id === 3)
      return ops && gov && ops.score >= 50 && gov.score < 40 && (ops.score - gov.score) >= 20
    },
    message: (s) => {
      const ops = s.find(d => d.id === 5)
      const gov = s.find(d => d.id === 3)
      return `The organization is deploying AI faster than it is governing it — Operations scores ${ops.score}/100 while Governance scores ${gov.score}/100. This is a material risk posture: capable delivery infrastructure without the controls, policies, and accountability structures to manage it safely at scale. Governance investment should be treated as urgent, not optional.`
    },
  },
  // Data bottleneck: strategy and talent exist, data is the constraint
  {
    id: 'data_bottleneck',
    test: (s) => {
      const data  = s.find(d => d.id === 2)
      const strat = s.find(d => d.id === 1)
      const tal   = s.find(d => d.id === 4)
      return data && strat && tal && data.score < 40 && strat.score >= 45 && tal.score >= 45
    },
    message: (s) => {
      const data = s.find(d => d.id === 2)
      return `Data & Infrastructure Readiness (${data.score}/100) is the primary bottleneck constraining an otherwise capable organization. Strategy intent and talent capacity exist, but without reliable, accessible, and governed data, AI initiatives will stall at the pilot stage regardless of investment elsewhere. Data infrastructure investment should be the immediate focus.`
    },
  },
  // Talent gap constraining delivery
  {
    id: 'talent_constraint',
    test: (s) => {
      const tal  = s.find(d => d.id === 4)
      const ops  = s.find(d => d.id === 5)
      const data = s.find(d => d.id === 2)
      return tal && ops && data && tal.score < 35 && ops.score >= 45 && data.score >= 45
    },
    message: (s) => {
      const tal = s.find(d => d.id === 4)
      return `Talent, Culture & Enablement (${tal.score}/100) is a critical constraint. The organization has meaningful data and operational infrastructure but lacks the human capacity — skills, culture, and enablement — to use it effectively. AI programs at this stage often stall not from technology limitations but from the inability to attract, develop, and retain the people required to build and operate them.`
    },
  },
  // Broad uniform weakness — no clear anchor strength
  {
    id: 'uniform_low',
    test: (s) => s.every(d => d.score < 40),
    message: () =>
      `Scores are uniformly low across all five dimensions, indicating the organization is at a foundational stage of AI maturity. No single dimension provides a strong anchor to build from. The recommended approach is to sequence investment deliberately — establishing strategic direction and executive sponsorship first before accelerating data, governance, and operational investments in parallel.`,
  },
  // Uneven maturity: wide spread between best and worst
  {
    id: 'uneven_maturity',
    test: (s) => {
      const scores = s.map(d => d.score)
      return (Math.max(...scores) - Math.min(...scores)) >= 35
    },
    message: (s) => {
      const sorted = [...s].sort((a, b) => b.score - a.score)
      const top = sorted[0]
      const bot = sorted[sorted.length - 1]
      return `There is significant unevenness across dimensions — a ${top.score - bot.score}-point spread between ${top.shortName} (${top.score}/100) and ${bot.shortName} (${bot.score}/100). Highly uneven maturity profiles often indicate siloed AI investment: isolated pockets of capability that have not yet been integrated into a coherent enterprise practice. The weakest dimensions are likely creating drag on the stronger ones.`
    },
  },
]

export function generateNarrative(company, dimScores, overallScore, dimMeta = {}) {
  // Guard: no scored dimensions — can happen when all sessions are all-DK
  if (!dimScores || dimScores.length === 0) {
    return [
      'Insufficient scored data to generate a narrative. All respondents may have selected "Don\'t Know" for every question, or no sessions have been completed. Complete at least one dimension with numeric scores to generate analysis.',
    ]
  }

  const maturity  = getMaturityLevel(overallScore)
  const sorted    = [...dimScores].sort((a, b) => b.score - a.score)
  const strongest = sorted[0]
  const weakest   = sorted[sorted.length - 1]
  const orgName   = company?.name || 'This organization'
  const industry  = company?.industry

  const sentences = []

  // ── 1. Opening: score + maturity + session context ─────────────────────
  sentences.push(
    `${orgName} scores ${overallScore}/100 overall, placing it at the ${maturity.label} maturity level across the five assessed AI readiness dimensions.`
  )

  // ── 2. Diagnostic patterns: surface up to 2 cross-dimension insights ───
  // Filter all matching patterns, exclude redundant combos (uniform_low + uneven_maturity
  // tells the same structural story — keep only uniform_low in that case).
  let matchedPatterns = DIAGNOSTIC_PATTERNS.filter(p => p.test(dimScores))
  const hasUniformLow = matchedPatterns.some(p => p.id === 'uniform_low')
  if (hasUniformLow) {
    matchedPatterns = matchedPatterns.filter(p => p.id !== 'uneven_maturity')
  }
  matchedPatterns = matchedPatterns.slice(0, 2)

  if (matchedPatterns.length > 0) {
    matchedPatterns.forEach(p => sentences.push(p.message(dimScores)))
  } else if (sorted.length === 1) {
    // Single dimension scored — different narrative path
    sentences.push(
      `Only ${strongest.name} could be fully assessed in this engagement (${strongest.score}/100 — ${getMaturityLevel(strongest.score).label}). The remaining dimensions had insufficient respondent coverage to score. Further discovery interviews across those areas are recommended before investment decisions are made.`
    )
  } else {
    // Fallback: standard strongest/weakest observation
    const spreadMsg = strongest.score - weakest.score >= 20
      ? ` The ${strongest.score - weakest.score}-point spread between these dimensions indicates uneven investment across the AI capability portfolio.`
      : ''
    sentences.push(
      `${strongest.name} is the strongest dimension at ${strongest.score}/100 (${getMaturityLevel(strongest.score).label}), while ${weakest.name} represents the most significant gap at ${weakest.score}/100 (${getMaturityLevel(weakest.score).label}).${spreadMsg}`
    )
  }

  // ── 3. DK visibility flag (Priority 6) ─────────────────────────────────
  const lowVisDims = dimScores.filter(d => {
    const meta = dimMeta[d.id]
    return meta && meta.total > 0 && (meta.dkCount / meta.total) >= 0.4
  })
  if (lowVisDims.length) {
    const names = lowVisDims.map(d => d.shortName).join(' and ')
    const plural = lowVisDims.length > 1
    sentences.push(
      `Note: ${names} ${plural ? 'have' : 'has'} a high rate of "Don\'t Know" responses (40%+ of questions). ${plural ? 'These scores' : 'This score'} should be treated as preliminary — the organization may lack sufficient internal visibility to self-assess in ${plural ? 'these areas' : 'this area'}, which is itself a maturity finding. Deeper discovery interviews with domain specialists are recommended before acting on ${plural ? 'these results' : 'this result'}.`
    )
  }

  // ── 4. Industry-specific sequencing guidance ────────────────────────────
  const INDUSTRY_SEQUENCING = {
    'Financial Services & Banking':
      'For financial institutions, Governance is not a Phase 2 investment — it is a regulatory prerequisite. SR 11-7, DORA, and FCRA create direct liability for AI systems used in credit, fraud, and trading decisions. Governance maturity must advance in parallel with Data infrastructure, and Operations investment should not accelerate until model risk management controls are in place and defensible.',
    'Healthcare & Life Sciences':
      'In healthcare, FDA SaMD pathway requirements and HIPAA de-identification obligations are hard prerequisites before AI can touch clinical workflows or patient data. Data Infrastructure (specifically PHI governance) and AI Governance must reach a minimum viable threshold before AI Operations can scale — and the AI Strategy must explicitly allocate budget for the compliance overhead these requirements create.',
    'Technology & Software':
      'For technology companies, the primary competitive risk is speed: AI differentiation windows narrow quickly. However, the pattern to avoid is scaling Operations (deployment velocity) ahead of Governance — EU AI Act obligations and enterprise client contract requirements are creating governance gates that block sales cycles and deployment approvals when not addressed proactively.',
    'Manufacturing & Industrial':
      'Manufacturers face the unique challenge of OT/IT convergence: AI deployed in operational technology environments requires data infrastructure that spans both domains, governance controls that address IEC 62443 industrial cybersecurity standards, and talent with process engineering expertise. Prioritize building the data bridge between OT and IT environments before scaling AI Operations — the highest-value manufacturing use cases depend on it.',
    'Retail & Consumer Goods':
      'Retail AI programs should prioritize Data Infrastructure first — fragmented transactional, behavioral, and supply chain data is the primary constraint on personalization accuracy and demand forecasting quality. Governance should advance in parallel to address FTC consumer protection requirements and state-level algorithmic pricing regulations, which are creating enforcement risk for retail AI programs that scale without documented controls.',
    'Energy & Utilities':
      'Energy sector AI programs require Governance to lead, not follow. NERC CIP cybersecurity standards and FERC reliability obligations apply to AI systems deployed in grid-connected environments — uncontrolled AI in OT settings carries grid stability and national security consequences. The AI Strategy must explicitly define OT safety constraints as investment boundaries before technology and Operations work begins.',
    'Government & Public Sector':
      'Federal and state agencies must sequence AI investment around OMB M-24-10 compliance, Chief AI Officer designation, and use case inventory completion as foundational requirements. Governance and Strategy must reach minimum compliance thresholds before Data and Operations investment can scale — without ATO processes and FedRAMP-compliant infrastructure, AI systems cannot be deployed regardless of technical readiness.',
    'Professional Services':
      'Professional services firms must resolve the conflict between AI capability building and client data confidentiality before scaling any dimension. Data Infrastructure must treat engagement data segregation as a non-negotiable design requirement. Governance investment — specifically AI disclosure policies and client contract frameworks — must precede any client-facing AI deployment, as breach of confidentiality in this sector creates both legal liability and irreversible reputational damage.',
    'Telecommunications':
      'Telecom AI programs benefit from prioritizing Data Infrastructure first, given the high-volume, high-velocity network telemetry and CDR data that most AI use cases require. Operations and Governance should advance in parallel, with specific attention to FCC regulatory requirements and CPNI data protection obligations that apply to customer-facing AI decisions — these create deployment gates that are more costly to retrofit than to build in from the start.',
    'Media & Entertainment':
      'Media organizations must resolve content rights and licensing metadata governance before AI can reliably use content assets — unresolved rights data creates legal exposure and constrains permissible AI scope. Governance investment must address EU DSA/DMA algorithmic transparency requirements for recommendation systems operating in European markets. The AI Strategy should explicitly distinguish first-party content AI from third-party content use cases, as the risk and governance profiles are fundamentally different.',
    'Education':
      'Educational institutions must establish FERPA-compliant data governance and CIPA compliance for minors as legal prerequisites before any AI system can access student records — Governance is a legal gate, not a maturity milestone. Strategy must explicitly address equity obligations: AI investments that benefit some student populations while disadvantaging others create civil rights exposure under Title VI. Invest in Governance before, not after, Data and Operations capabilities are built.',
    'Transportation & Logistics':
      'Transportation AI programs operating in safety-critical environments must integrate AI Governance into existing safety management systems (SMS) before scaling Operations. FMCSA regulations, DOT safety requirements, and potential NTSB oversight apply to AI-assisted decisions — governance gaps in operational AI carry direct liability. The AI Strategy must explicitly define which decisions require human override regardless of model confidence, and that boundary must be established before Operations investment scales.',
    'Real Estate & Construction':
      'Real estate organizations must address ECOA fair lending and FHA fair housing requirements for any AI involved in underwriting, property valuation, or tenant screening before scaling Data and Operations investment — algorithmic bias in these applications is actively enforced and carries significant legal exposure. Governance investment should include bias monitoring for AI valuation and screening systems as a deployment prerequisite, not a post-deployment improvement.',
  }

  const industryNote = industry ? INDUSTRY_SEQUENCING[industry] : null
  if (industryNote) {
    sentences.push(industryNote)
  }

  // ── 5. Closing: forward-looking priority statement ──────────────────────
  // Only when 2+ dims scored — single-dim path already added its own closing above
  if (sorted.length > 1) {
    const criticalDims = dimScores.filter(d => d.score < 40)
    if (criticalDims.length >= 3) {
      sentences.push(
        `With ${criticalDims.length} dimensions in the Developing or Beginning range, the priority is not to address everything in parallel — it is to establish the prerequisite foundations (strategy, then data and governance) that unlock progress across the remaining dimensions.`
      )
    } else if (weakest.score < 40) {
      sentences.push(
        `Closing the gap in ${weakest.name} is the highest-leverage near-term priority. Progress in this dimension will directly unblock improvements across the broader AI capability portfolio.`
      )
    } else {
      sentences.push(
        `With a strong foundation established across most dimensions, the focus should shift from capability building to optimization, scaling, and competitive differentiation — ensuring AI investment translates into durable business outcomes rather than sustained best-practice maintenance.`
      )
    }
  }

  return sentences
}

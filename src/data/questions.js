// ─────────────────────────────────────────────────────────────────────────────
// Enterprise AI Readiness Assessment — Question Bank v1.1.0
// Each question carries 5 behaviorally-anchored score descriptors so that
// respondents rate against observable evidence, not vague impressions.
// ─────────────────────────────────────────────────────────────────────────────

export const dimensions = [
  {
    id: 1,
    name: 'AI Strategy & Value Realization',
    shortName: 'Strategy',
    color: '#4F46E5',
    bgColor: '#EEF2FF',
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
          5: 'AI strategy is fully embedded in the corporate strategic plan, reviewed semi-annually with real-time outcome dashboards and a formal refresh process tied to business planning cycles.',
        },
      },
      {
        text: 'Senior leadership actively sponsors and publicly advocates for AI initiatives.',
        anchors: {
          1: 'No executive is visibly sponsoring AI. Leadership is either unengaged or skeptical, and AI is not discussed in leadership forums.',
          2: 'One or two executives express interest in AI informally, but there is no formal sponsorship, budget ownership, or public advocacy.',
          3: 'A named executive sponsor exists for some AI projects, but sponsorship is inconsistent across the portfolio and not visible to the broader organization.',
          4: 'A C-suite AI sponsor (e.g., CDAO, CTO, or equivalent) actively champions AI in all-hands meetings, external communications, and budget discussions.',
          5: 'The CEO and multiple C-suite members publicly champion AI internally and externally. An AI steering committee with board representation provides governance and sustained advocacy.',
        },
      },
      {
        text: 'We have identified specific AI use cases with clearly defined, measurable ROI targets.',
        anchors: {
          1: 'No formal use case identification process exists. AI projects are started based on interest or vendor pitches without business case validation.',
          2: 'A list of potential AI use cases exists informally, but few have defined ROI targets or business sponsor accountability.',
          3: 'A use case pipeline exists with estimated ROI for some initiatives, but the methodology is inconsistent and targets are rarely tracked post-deployment.',
          4: 'A structured use case pipeline with standardized ROI templates, business case sign-off, and post-deployment tracking exists for the majority of initiatives.',
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
          3: 'Most business unit leaders are familiar with the AI strategy and support it verbally, but few have actively co-designed initiatives or taken ownership of AI-driven outcomes.',
          4: 'All major business units have participated in AI strategy development, have named AI initiative owners, and are accountable for defined business outcomes in their areas.',
          5: 'Business units are full co-owners of the AI strategy. Each unit has an embedded AI champion, an AI initiative portfolio, and regular reviews with the central AI function to track cross-functional value realization.',
        },
      },
      {
        text: 'We have achieved measurable, repeatable results from AI initiatives beyond pilot stage.',
        anchors: {
          1: 'No AI initiative has reached production or delivered measurable business value. Activity is limited to exploration or proof-of-concept.',
          2: '1–2 AI pilots have been completed with some measured outcomes, but none have been scaled to production or replicated across the organization.',
          3: 'Several AI initiatives are in production and have delivered measured value, but scaling is inconsistent and results are not yet repeatable across business units.',
          4: 'Multiple AI initiatives are live in production across at least two business units with documented, repeatable business impact. A scaling playbook exists.',
          5: 'AI is delivering measurable business value at scale across multiple business units. A proven, repeatable model for taking AI from concept to production value exists and is continuously optimized.',
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
        text: 'Our AI strategy is reviewed and updated regularly based on performance and market changes.',
        anchors: {
          1: 'The AI strategy, if it exists, has never been formally reviewed or updated since it was written.',
          2: 'The strategy is reviewed informally when significant market events occur, but there is no regular review cycle or documented update process.',
          3: 'Annual reviews of the AI strategy occur, but they are surface-level and rarely result in substantive changes based on performance data.',
          4: 'Semi-annual strategy reviews incorporate performance-to-target data, market intelligence, and stakeholder input, resulting in documented strategy updates.',
          5: 'Quarterly strategy health checks with monthly performance monitoring trigger real-time adjustments. A version-controlled strategy document captures all changes with rationale, and board-level review occurs annually.',
        },
      },
      {
        text: 'We have an ecosystem and partnership strategy to augment internal AI capabilities.',
        anchors: {
          1: 'No ecosystem strategy exists. External AI capabilities are engaged purely reactively (e.g., responding to vendor pitches).',
          2: 'The organization works with 1–2 AI vendors but these relationships are transactional and not strategically managed as part of a broader ecosystem approach.',
          3: 'A loose vendor and partner landscape has been mapped, but there is no formal ecosystem strategy, preferred partner program, or structured management of external AI relationships.',
          4: 'A documented AI ecosystem strategy identifies preferred partners across key capability areas (e.g., cloud, data, specialized AI). Partnerships are managed with defined governance and mutual roadmaps.',
          5: 'A mature AI ecosystem strategy includes strategic partnerships, startup/accelerator relationships, academic collaborations, and open-source contributions. Partner value is measured and the ecosystem is actively cultivated as a competitive asset.',
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
      {
        text: 'We have a process to communicate AI value and progress to all key stakeholders.',
        anchors: {
          1: 'No structured AI communications process exists. Stakeholders learn about AI progress through informal channels or not at all.',
          2: 'Ad-hoc updates on major AI initiatives are shared occasionally but there is no defined audience, format, or cadence.',
          3: 'Periodic AI progress updates are shared with some stakeholders, but coverage is inconsistent and the format varies making it difficult to track progress over time.',
          4: 'A structured AI communications cadence delivers regular updates (at least quarterly) to defined stakeholder groups using consistent formats that track KPIs and milestones.',
          5: 'A comprehensive AI communications program includes executive briefings, all-hands updates, an internal AI newsletter/portal, and external communications. All stakeholders receive tailored, relevant updates on a predictable cadence.',
        },
      },
    ],
  },

  // ─── DIMENSION 2 ───────────────────────────────────────────────────────────
  {
    id: 2,
    name: 'Data & Infrastructure Readiness',
    shortName: 'Data',
    color: '#0EA5E9',
    bgColor: '#F0F9FF',
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
          3: 'A data governance framework has been developed and includes policies, standards, and a governance committee, but adoption is incomplete and enforcement is inconsistent.',
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
        text: 'We have established processes for data labeling and annotation at the scale AI requires.',
        anchors: {
          1: 'No data labeling capability or process exists. Labeled datasets for supervised learning must be sourced externally or created manually with no tooling.',
          2: 'Ad-hoc labeling occurs for individual projects using manual methods (e.g., spreadsheets), but there is no standard tooling, quality control, or scalable process.',
          3: 'A data labeling tool is in use for some projects, with basic quality control (e.g., inter-annotator agreement), but the process is not standardized across the organization.',
          4: 'A standardized data labeling platform supports multiple projects with defined annotation guidelines, quality review workflows, and the ability to leverage both internal and external annotators.',
          5: 'An enterprise labeling operation combines automated pre-labeling (active learning), a governed internal annotation team, and vetted external vendors. Quality metrics, throughput SLAs, and cost-per-label tracking are standard.',
        },
      },
      {
        text: 'Sensitive and regulated data is properly identified, classified, and protected throughout its lifecycle.',
        anchors: {
          1: 'No data classification scheme exists. Sensitive data (PII, PHI, financial) is handled inconsistently with no systematic identification or protection controls.',
          2: 'Sensitive data is informally identified in some areas, but classification is incomplete, inconsistently applied, and protection controls are not systematically enforced.',
          3: 'A data classification policy exists with defined categories, and the majority of known sensitive data has been classified, but automated discovery and enforcement are limited.',
          4: 'Comprehensive data classification covers all known sensitive data types. Classification is enforced through access controls, encryption, masking, and is integrated into the data pipeline lifecycle.',
          5: 'Automated data discovery and classification tools continuously scan all data stores to identify sensitive data. Classification-driven controls (encryption, masking, access restrictions, retention) are enforced in real time and audited quarterly. AI training data undergoes specific sensitivity review.',
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
        text: 'We have monitoring in place for data quality degradation and pipeline health.',
        anchors: {
          1: 'No monitoring exists. Data quality issues and pipeline failures are discovered by downstream consumers — often after business impact has already occurred.',
          2: 'Basic pipeline failure alerts exist (e.g., job completion notifications) but there is no proactive data quality monitoring or anomaly detection.',
          3: 'Pipeline monitoring covers job completion and basic SLA adherence. Some data quality checks are run post-ingestion, but coverage is limited and alert fatigue is common.',
          4: 'Comprehensive pipeline monitoring with SLA dashboards, automated data quality checks at ingestion, and proactive anomaly detection covers all production pipelines. An on-call rotation manages incidents.',
          5: 'ML-driven data observability tools (e.g., Monte Carlo, Soda) provide end-to-end monitoring of data freshness, volume, schema, distribution, and lineage across all pipelines. Anomalies auto-trigger remediation workflows and are tracked to resolution.',
        },
      },
      {
        text: 'Our storage and compute infrastructure can scale cost-effectively to production AI workloads.',
        anchors: {
          1: 'Infrastructure cannot support production AI workloads. Training runs are bottlenecked, production inference is too slow or costly, and there is no scalability plan.',
          2: 'Infrastructure can support small-scale AI workloads but has not been tested or designed for production scale. Cost is not tracked or optimized for AI workloads specifically.',
          3: 'Infrastructure can handle current production workloads but struggles with peak demand or large model training. FinOps practices for AI are not well established.',
          4: 'Scalable, cloud-based or hybrid infrastructure handles current production AI workloads efficiently. Cost monitoring, right-sizing, and basic FinOps practices are applied to AI infrastructure.',
          5: 'AI infrastructure is fully elastic, cost-optimized, and governed by a mature FinOps practice that tracks cost-per-inference, cost-per-training-run, and ROI per AI workload. Infrastructure capacity planning is integrated into the AI roadmap process.',
        },
      },
      {
        text: 'We have a feature store or equivalent capability for sharing ML features across teams.',
        anchors: {
          1: 'No feature sharing mechanism exists. Each team recomputes features independently, leading to inconsistencies and duplicated effort.',
          2: 'Some teams share feature code via shared repositories, but there is no runtime feature store, online serving capability, or governance for feature reuse.',
          3: 'A feature store has been deployed and is used by one or two teams, but adoption is limited, feature discoverability is poor, and online/offline consistency is not guaranteed.',
          4: 'An enterprise feature store is deployed with offline and online serving, feature versioning, monitoring, and governance. Multiple teams actively contribute to and consume from the shared feature repository.',
          5: 'The feature store is a core platform component used by all AI/ML teams. It includes automated feature validation, backfill capabilities, point-in-time correct retrieval, usage analytics, and a feature marketplace for cross-team discovery and reuse.',
        },
      },
      {
        text: 'Data silos are actively being identified and reduced across the organization.',
        anchors: {
          1: 'Data silos are pervasive and no program to address them exists. Each business unit maintains separate, inaccessible data stores with no cross-organizational visibility.',
          2: 'Leadership acknowledges data silos as a problem but no concrete program to address them has been initiated beyond ad-hoc point-to-point integrations.',
          3: 'A data silo reduction initiative is underway and has produced a documented silo inventory, but progress is slow, gains are isolated to specific domains, and a comprehensive strategy is lacking.',
          4: 'An active enterprise data integration program is systematically reducing silos by domain, with measurable progress tracked against a baseline silo inventory and executive reporting on reduction milestones.',
          5: 'Data silo reduction is a funded, multi-year program with measurable KPIs (e.g., % of enterprise data accessible via governed APIs). A federated data architecture enables cross-domain data sharing while preserving domain ownership, and progress is reported at the board level.',
        },
      },
    ],
  },

  // ─── DIMENSION 3 ───────────────────────────────────────────────────────────
  {
    id: 3,
    name: 'Governance & Compliance',
    shortName: 'Governance',
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
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
          1: 'No bias or fairness testing is performed. The organization is unaware of or unengaged with the risk of biased AI outcomes.',
          2: 'Bias is acknowledged as a risk and some teams informally check for it, but no standardized testing methodology, protected attribute coverage, or formal sign-off exists.',
          3: 'Bias testing is performed for high-risk models using defined metrics (e.g., demographic parity, equalized odds) but testing is pre-deployment only and lacks ongoing monitoring.',
          4: 'Formal bias and fairness testing is a required gate for all customer-facing and high-risk AI models, covering defined protected attributes. Post-deployment fairness monitoring is in place for key models.',
          5: 'A comprehensive bias and fairness program uses multiple fairness metrics appropriate to each use case, tests across intersectional demographic combinations, includes external red-teaming for high-risk models, and continuously monitors production models for fairness drift. Findings are reported to the AI governance committee.',
        },
      },
      {
        text: 'We comply with all relevant data privacy and AI regulations (e.g., GDPR, CCPA, EU AI Act).',
        anchors: {
          1: 'Regulatory compliance requirements for AI are not identified or mapped. The organization has no systematic approach to AI-related regulatory compliance.',
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
          5: 'A comprehensive AI system accountability matrix assigns clear roles (technical owner, business owner, risk owner, executive sponsor) for every AI system. Ownership is formally accepted, included in role descriptions, reviewed annually, and updated within 30 days of any significant system change.',
        },
      },
      {
        text: 'We have model monitoring and drift detection in place for all production AI models.',
        anchors: {
          1: 'No production model monitoring exists. Model degradation is detected only when business users report poor outcomes.',
          2: 'Basic output monitoring (e.g., error rates, prediction volume) exists for some models, but there is no statistical drift detection or automated alerting.',
          3: 'Drift detection (data drift and/or concept drift) is implemented for the highest-risk models, but coverage is incomplete and alert thresholds are not calibrated to business impact.',
          4: 'All production models have automated monitoring covering prediction quality, data drift, concept drift, and business outcome metrics. Alerts trigger defined response procedures.',
          5: 'Comprehensive model observability covers all production models with real-time dashboards, automated drift detection, business impact correlation, SLA-based alerting, and integration into the incident response process. Model health is reviewed weekly by the MLOps team.',
        },
      },
      {
        text: 'Incident response plans exist specifically for AI system failures, errors, and harms.',
        anchors: {
          1: 'No AI-specific incident response plans exist. AI failures are handled reactively without defined procedures, communication protocols, or escalation paths.',
          2: 'AI incidents are handled under the general IT incident response process, which does not address AI-specific scenarios such as biased outputs, unexplained decisions, or data poisoning.',
          3: 'AI-specific incident response procedures have been drafted but not tested, and coverage of AI-specific harm scenarios (e.g., discriminatory outputs, privacy breaches via inference) is incomplete.',
          4: 'Documented AI incident response plans cover the most material failure scenarios with defined severity levels, response SLAs, communication templates, and assigned response owners. Plans are tested annually.',
          5: 'A comprehensive AI incident response framework covers technical failures, ethical harms, regulatory breaches, and reputational incidents. Playbooks are scenario-specific, tested via tabletop exercises bi-annually, and integrated with the enterprise crisis management process. Post-incident reviews drive systematic improvements.',
        },
      },
      {
        text: 'We conduct regular audits of AI systems, their outputs, and their downstream business impacts.',
        anchors: {
          1: 'No AI audits are conducted. AI systems are deployed and never independently reviewed for accuracy, fairness, or unintended consequences.',
          2: 'Informal reviews of AI outputs occur in some areas, but they are not structured, independent, or comprehensive enough to constitute a meaningful audit.',
          3: 'Annual audits occur for the highest-risk AI systems covering key metrics (accuracy, fairness) but independent review, downstream impact analysis, and audit documentation are limited.',
          4: 'Annual independent audits of all high-risk AI systems cover technical performance, fairness, explainability, and downstream business impacts. Findings are reported to governance bodies and remediation is tracked.',
          5: 'A tiered audit program conducts risk-proportionate reviews: high-risk systems receive semi-annual independent audits, medium-risk systems annual reviews. Audits cover the full AI lifecycle, outputs are published in an internal transparency report, and critical findings trigger mandatory remediation within defined SLAs.',
        },
      },
      {
        text: 'Third-party AI vendors and tools are assessed for compliance, security, and alignment with our policies.',
        anchors: {
          1: 'Third-party AI vendors are not assessed beyond general IT procurement. AI-specific risks (data handling, model bias, regulatory compliance) are not evaluated.',
          2: 'Some high-profile AI vendors have been informally reviewed for obvious compliance issues, but there is no standard assessment framework or required documentation.',
          3: 'An AI vendor assessment questionnaire exists and is used for significant new vendors, but it is not comprehensive, not consistently applied, and post-contract monitoring is absent.',
          4: 'A formal AI vendor risk assessment framework covers data privacy, AI ethics, security, and regulatory compliance for all new AI vendor engagements. Material findings gate contract approval.',
          5: 'All AI vendors are assessed against a comprehensive framework before onboarding and re-assessed annually. Assessments cover data handling, model bias practices, regulatory compliance, SLAs, and audit rights. High-risk vendor relationships include contractual AI-specific obligations and regular compliance reviews.',
        },
      },
      {
        text: 'We have version control and change management processes specifically for AI models.',
        anchors: {
          1: 'No version control or change management for AI models exists. Models are overwritten without versioning, making rollback or audit impossible.',
          2: 'Some models are stored in version-controlled repositories, but model metadata, training data versions, hyperparameters, and deployment history are not systematically tracked.',
          3: 'Key models are version-controlled in an ML tracking system (e.g., MLflow) with experiment tracking, but formal change management (approval gates, rollback procedures) is not established.',
          4: 'All production models are version-controlled with full lineage (code, data, parameters) tracked. A change management process governs model updates with approval gates, deployment logs, and tested rollback procedures.',
          5: 'A comprehensive model lifecycle management system enforces version control, lineage tracking, and change management for all models. Every deployment is logged with a full audit trail, changes above defined thresholds require multi-stakeholder approval, and rollback can be executed within defined RTO. Lineage is queryable for regulatory reporting.',
        },
      },
      {
        text: 'There is executive-level oversight of AI governance through a committee or equivalent body.',
        anchors: {
          1: 'No executive governance body for AI exists. Decisions about AI risk, policy, and ethics are made at the team level without escalation paths.',
          2: 'AI governance discussions occur informally among senior leaders but there is no formal committee, defined mandate, meeting cadence, or authority over AI risk decisions.',
          3: 'An AI governance committee has been established and meets occasionally, but its mandate is unclear, attendance is inconsistent, and decisions are advisory rather than binding.',
          4: 'A formally chartered AI governance committee with C-suite representation meets at least quarterly, has a defined mandate covering risk, ethics, and policy, and makes binding decisions on high-risk AI issues.',
          5: 'A mature AI governance structure includes a C-suite AI steering committee, an operational AI risk committee, and defined escalation paths from operational to executive levels. The governance body has a formal charter, published meeting cadence, documented decisions, and reports to the board on AI risk and ethics at least annually.',
        },
      },
      {
        text: 'We have clear policies governing the use of AI-generated content across the enterprise.',
        anchors: {
          1: 'No policies govern AI-generated content. Employees use generative AI tools freely without guidance on disclosure, accuracy verification, copyright, or appropriate use cases.',
          2: 'General guidance on AI tool usage exists informally, but specific policies for AI-generated content (disclosure requirements, prohibited uses, IP considerations) have not been formalized.',
          3: 'An AI-generated content policy exists and covers disclosure requirements and prohibited content types, but enforcement mechanisms are absent and employee awareness is limited.',
          4: 'A comprehensive AI content policy covers acceptable use, disclosure requirements, quality review obligations, IP and copyright considerations, and prohibited use cases. The policy is communicated to all staff and referenced in acceptable use agreements.',
          5: 'An AI content governance framework includes tiered policies by risk and content type, mandatory training, automated disclosure tagging for high-risk content, regular policy reviews aligned to technology evolution, and clear disciplinary consequences for policy violations. Policy effectiveness is measured through compliance audits.',
        },
      },
      {
        text: 'Employees are trained on responsible AI principles, policies, and appropriate usage.',
        anchors: {
          1: 'No responsible AI training exists. Employees receive no guidance on ethical AI use, company policies, or potential risks of AI misuse.',
          2: 'Some awareness materials on AI ethics exist (e.g., a wiki page or one-time presentation) but there is no mandatory training, knowledge assessment, or regular refresher.',
          3: 'An introductory responsible AI training module is available, and some roles are required to complete it, but coverage is incomplete, training is not tailored by role, and no competency assessment occurs.',
          4: 'Role-based responsible AI training is mandatory for all staff interacting with AI systems. Training covers company policy, ethical principles, bias awareness, and regulatory obligations. Completion is tracked and reported.',
          5: 'A comprehensive responsible AI learning program includes role-differentiated curricula (awareness, practitioner, governance), annual mandatory refreshers, competency assessments, practical scenario-based training, and integration into onboarding. Completion rates and assessment scores are reported to the governance committee annually.',
        },
      },
      {
        text: 'There is a defined process for receiving, investigating, and resolving AI-related complaints or harms.',
        anchors: {
          1: 'No mechanism exists for reporting AI-related complaints or harms. Affected individuals or employees have no clear channel to raise concerns.',
          2: 'AI concerns can be raised through general feedback channels (e.g., IT helpdesk), but there is no AI-specific intake, investigation process, or accountability for resolution.',
          3: 'An AI complaints process exists with a named intake point, but investigation procedures are informal, timelines are not defined, and outcomes are not systematically tracked or disclosed.',
          4: 'A formal AI complaints and harm reporting process includes a dedicated intake channel, defined investigation procedures with SLAs, named investigators, and outcome tracking. Material findings are escalated to the governance committee.',
          5: 'A comprehensive AI complaints management system provides a user-friendly intake mechanism (internal and external), structured investigation procedures with defined SLAs by severity, independent review for material complaints, transparent outcome communication, and a publicly available summary report of aggregate complaint categories and resolution outcomes published annually.',
        },
      },
    ],
  },

  // ─── DIMENSION 4 ───────────────────────────────────────────────────────────
  {
    id: 4,
    name: 'Talent, Culture & Enablement',
    shortName: 'Talent',
    color: '#F59E0B',
    bgColor: '#FFFBEB',
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
          2: 'Access to online learning platforms (e.g., Coursera, LinkedIn Learning) is provided, but there is no structured AI curriculum, learning goals, or manager accountability for skills development.',
          3: 'An AI learning curriculum has been designed and some role-specific tracks are available, but participation is voluntary, completion rates are low, and learning is not connected to role requirements or career progression.',
          4: 'A structured AI upskilling program with role-based learning paths, manager-encouraged participation, completion tracking, and connection to career development is actively used by a majority of target employees.',
          5: 'An enterprise AI academy provides differentiated learning programs by role (executive, business, technical, governance), blending online learning, internal workshops, mentoring, and hands-on AI projects. Learning outcomes are assessed, linked to career progression, and measured against business capability needs annually.',
        },
      },
      {
        text: 'Leadership consistently champions a culture of data-driven decision making at all levels.',
        anchors: {
          1: 'Leadership makes decisions primarily based on intuition and experience. Data is rarely used to challenge or inform significant decisions.',
          2: 'Leadership acknowledges the value of data-driven decisions in principle, but data is inconsistently used, and gut-feel decisions frequently override data-backed analysis.',
          3: 'Data is used in leadership decision-making for significant choices, but the use of data is not consistent across all leaders and levels, and qualitative analysis still dominates in many forums.',
          4: 'Leadership consistently expects and models data-driven decision-making. Business reviews require data-backed analysis and decisions are documented with the data that informed them.',
          5: 'Data-driven decision-making is a core organizational value embedded in all leadership behaviors, performance criteria, and governance processes. Leaders are assessed on their ability to interpret and apply data. Decisions without data support require explicit justification.',
        },
      },
      {
        text: 'Employees broadly understand how to work effectively alongside AI tools in their workflows.',
        anchors: {
          1: 'Employees are largely unaware of relevant AI tools or how to use them. AI adoption in day-to-day workflows is negligible.',
          2: 'Some employees have independently adopted AI tools in their workflows, but this is self-directed, unsupported by the organization, and unevenly distributed.',
          3: 'AI tools have been rolled out to some functions with basic training, but adoption is inconsistent, effective use is limited, and employees lack confidence in how to apply AI safely and productively.',
          4: 'Most employees in target functions are actively using AI tools in their workflows with structured onboarding, role-specific guidance, and ongoing support. Usage is tracked and adoption metrics are reported.',
          5: 'AI tool adoption is widespread and deeply embedded in daily workflows across the organization. Role-specific AI workflow playbooks are maintained, adoption and productivity metrics are tracked, and employees are regularly surveyed on AI effectiveness and satisfaction. Champions networks accelerate peer-to-peer adoption.',
        },
      },
      {
        text: 'We have strong, structured change management processes specifically designed for AI adoption.',
        anchors: {
          1: 'No change management process exists for AI initiatives. AI is deployed with a "build it and they will come" approach, resulting in low adoption and resistance.',
          2: 'General IT change management processes are applied to AI projects, but they do not address AI-specific concerns such as employee anxiety about job displacement or trust in AI outputs.',
          3: 'AI projects include some change management activities (e.g., stakeholder comms, basic training), but these are inconsistently applied and often executed too late in the project to be effective.',
          4: 'A structured AI change management methodology is applied to all significant AI deployments, covering stakeholder analysis, communication planning, training, adoption support, and post-go-live reinforcement.',
          5: 'An enterprise AI change management center of excellence provides a proven methodology, toolkit, and dedicated change practitioners for all material AI deployments. Change effectiveness is measured through adoption metrics, sentiment surveys, and business impact, with findings feeding back into the methodology.',
        },
      },
      {
        text: 'Business domain experts are actively and meaningfully involved in AI project design and validation.',
        anchors: {
          1: 'AI projects are designed and built entirely by the technical team without business input. Domain experts review outputs only at the end, often leading to misaligned or unusable models.',
          2: 'Business stakeholders are consulted at project initiation but are not engaged during development. Their feedback is gathered informally at the end and often results in costly rework.',
          3: 'Business domain experts participate in requirements gathering and user acceptance testing, but their involvement during model development (feature selection, validation, threshold-setting) is limited.',
          4: 'Business domain experts are embedded in AI project teams from inception through deployment, actively contributing to problem framing, feature engineering, model validation, and deployment criteria.',
          5: 'Business-AI co-design is the standard methodology. Domain experts co-own AI project outcomes, are assessed on AI contribution as part of their performance, and serve as post-deployment champions. Feedback loops between business and technical teams are formalized and continuous.',
        },
      },
      {
        text: 'We attract and retain top AI talent effectively relative to market competition.',
        anchors: {
          1: 'AI talent attraction and retention are unstructured and largely unsuccessful. The organization struggles to fill AI roles and experiences high turnover in its existing AI team.',
          2: 'Standard recruiting processes are applied to AI roles without differentiated employer value proposition, competitive compensation benchmarking, or specific AI talent retention strategies.',
          3: 'AI talent acquisition has some differentiated elements (e.g., technical challenges, AI research exposure), and compensation is partially competitive, but retention is below the desired level and key AI talent loss is a recurring issue.',
          4: 'A targeted AI talent strategy with competitive compensation benchmarking, differentiated employer branding, structured onboarding, and retention programs results in AI talent attrition below industry average.',
          5: 'The organization is recognized as a top-tier AI employer. A comprehensive AI talent strategy covers employer brand, competitive total compensation, research publishing opportunities, learning investment, career progression clarity, and an alumni network. AI talent retention exceeds industry benchmarks and the organization is frequently cited in industry surveys as a destination employer.',
        },
      },
      {
        text: 'There is meaningful, structured cross-functional collaboration on AI projects.',
        anchors: {
          1: 'AI projects are executed within functional silos. Cross-functional collaboration is absent, leading to technically sound but business-irrelevant or undeployable AI solutions.',
          2: 'Cross-functional collaboration occurs informally when individuals build personal relationships, but there is no structural support for it and it is not the norm.',
          3: 'AI projects include representatives from multiple functions, but collaboration is often superficial (e.g., attendance at meetings without active contribution) and coordination friction is high.',
          4: 'AI projects are staffed with formally cross-functional teams with defined roles for technical, business, data, and governance contributors. Collaboration norms and RACI frameworks are in place.',
          5: 'Cross-functional AI teams are the default operating model. Team composition standards, collaboration tooling, shared outcome ownership, and co-location or virtual teaming protocols are standardized. Cross-functional team effectiveness is measured and improvement actions are systematically applied.',
        },
      },
      {
        text: 'We have a community of practice or center of excellence that drives AI best practices.',
        anchors: {
          1: 'No AI community of practice or center of excellence exists. Best practices are not shared across teams and each AI team operates in isolation.',
          2: 'Informal knowledge sharing occurs (e.g., occasional tech talks, a shared Slack channel) but there is no structured community with governance, programmed content, or accountability for standards.',
          3: 'An AI community of practice exists and meets regularly, but participation is voluntary, content is uneven, and its connection to organizational AI standards and decision-making is weak.',
          4: 'An active AI community of practice with structured programming (regular meetings, knowledge shares, working groups) and a formal AI center of excellence drives standards, tooling decisions, and best practice adoption.',
          5: 'A mature AI center of excellence with dedicated staff serves as the enterprise hub for AI standards, tooling, reusable assets, best practices, and practitioner development. The CoE measures its own effectiveness through adoption metrics, capability assessments, and business value attribution.',
        },
      },
      {
        text: 'Employees have psychological safety to experiment with AI, fail fast, and share learnings.',
        anchors: {
          1: 'Fear of failure is pervasive. Employees do not experiment with AI because failure is penalized, and there is no recognized mechanism for sharing what does not work.',
          2: 'Leadership espouses experimentation in principle, but cultural norms, incentive structures, and performance management implicitly penalize failure, suppressing genuine experimentation.',
          3: 'A rhetoric of experimentation exists and some teams have established safe-to-fail norms, but this is not consistent across the organization and leadership behaviors do not uniformly reinforce it.',
          4: 'Leadership actively models experimentation by openly sharing failures and learnings. Defined "innovation time" exists, failed experiments are recognized as learning opportunities, and post-mortems are blameless.',
          5: 'Psychological safety for AI experimentation is a measured cultural attribute assessed in annual surveys. Learning from failure is embedded in team rituals, performance criteria reward experimentation velocity, a public internal "failure wall" celebrates learning, and leadership regularly shares their own AI experiment failures at all-hands forums.',
        },
      },
      {
        text: 'AI literacy is formally measured, tracked, and improving across the organization over time.',
        anchors: {
          1: 'AI literacy is not measured. The organization has no understanding of its current AI literacy baseline or how it is changing over time.',
          2: 'Training completion rates are tracked for some AI courses but there is no assessment of actual AI literacy, no baseline, and no target for improvement.',
          3: 'An AI literacy assessment has been conducted once to establish a baseline, but there is no systematic tracking, improvement target, or connection to business outcomes.',
          4: 'Annual AI literacy assessments are conducted across defined employee populations, results are tracked against baseline and targets, and gaps inform the annual upskilling program.',
          5: 'AI literacy is a formally tracked organizational capability measured through annual assessments, training completion data, and on-the-job application metrics. Results are segmented by role, function, and level. Progress against targets is reported to the executive team and informs AI talent strategy and upskilling investment decisions.',
        },
      },
      {
        text: 'We have a clear career path and professional development program for AI practitioners.',
        anchors: {
          1: 'No defined career path exists for AI practitioners. Advancement is unclear, which contributes to attrition as high performers leave for organizations with clearer growth trajectories.',
          2: 'General engineering or analytics career paths are loosely applied to AI roles, but the paths are not differentiated for AI competencies and do not reflect the market for AI talent.',
          3: 'An AI career framework has been drafted with some defined levels and competencies, but it is not fully implemented, is inconsistently applied by managers, and lacks connection to compensation.',
          4: 'A defined AI career framework covers multiple tracks (e.g., IC, management, research) with clear level definitions, competency expectations, and connection to compensation bands. Annual calibration ensures consistent application.',
          5: 'A comprehensive AI career architecture covers multiple tracks, provides clear advancement criteria, is competitively benchmarked annually, and is supported by structured development plans, mentoring programs, and stretch assignment rotations. Career path transparency is cited as a key retention factor in exit interviews.',
        },
      },
      {
        text: 'There is a culture of continuous learning, curiosity, and experimentation enterprise-wide.',
        anchors: {
          1: 'Learning is not a cultural value. Most employees view training as a compliance obligation rather than a growth opportunity, and intellectual curiosity is not modeled by leadership.',
          2: 'Learning is encouraged in principle but not structurally supported. There is no dedicated learning time, learning budget is minimal, and managers do not actively coach development.',
          3: 'A learning culture is emerging in pockets of the organization, particularly in the technology function, but it is not enterprise-wide and is not reinforced by consistent leadership behavior.',
          4: 'Learning is a stated corporate value with structural support: dedicated learning time, adequate training budgets, manager accountability for team development, and regular learning events.',
          5: 'Continuous learning is a measurable cultural attribute. Enterprise learning investment per employee is benchmarked against top-quartile companies, dedicated learning time (e.g., 20% time, hackathons) is protected, leadership actively participates in and promotes learning events, and learning outcomes are tied to business performance metrics.',
        },
      },
      {
        text: 'Business units have embedded AI and data expertise, rather than relying solely on a central team.',
        anchors: {
          1: 'All AI and data expertise is centralized. Business units have no AI capability and are entirely dependent on a central team that cannot meet demand.',
          2: 'A few business units have individual data analysts or "AI enthusiasts," but these are informal, isolated, and not part of a deliberate federated model.',
          3: 'Some business units have embedded data or AI roles, but coverage is uneven, embedded roles lack career support from the central team, and there is no federated operating model connecting central and embedded capability.',
          4: 'Most business units have embedded AI or data roles within a federated operating model. Embedded talent receives technical leadership from the central AI team while having business unit alignment. Coverage gaps are tracked and addressed.',
          5: 'A mature federated AI operating model is in place with embedded AI and data roles in all major business units. Embedded practitioners are competency-credentialed, connected to the central AI CoE, and serve as the first line of AI capability and demand management. The operating model is formally governed and reviewed annually.',
        },
      },
      {
        text: 'We partner with universities, startups, or research institutions to access AI talent and ideas.',
        anchors: {
          1: 'No external academic or startup partnerships for AI exist. The organization is fully inward-looking for AI talent and ideas.',
          2: 'Individual managers have informal relationships with universities or attend AI conferences, but these are personal rather than organizational, and there is no structured partnership program.',
          3: 'One or two university partnerships or startup collaborations exist, but they are tactical (e.g., an internship program or a one-off research engagement) rather than strategically managed.',
          4: 'A portfolio of external AI partnerships is actively managed, including at least one university research partnership, a startup collaboration or accelerator relationship, and structured conference participation.',
          5: 'A comprehensive external AI ecosystem engagement strategy includes multiple university research partnerships, a corporate AI research lab with published output, an AI startup program, and active engagement in open-source AI communities. The value of the ecosystem is measured annually through talent pipeline contribution, research insights, and capability acceleration.',
        },
      },
    ],
  },

  // ─── DIMENSION 5 ───────────────────────────────────────────────────────────
  {
    id: 5,
    name: 'AI Operations & Engineering Process',
    shortName: 'Operations',
    color: '#10B981',
    bgColor: '#ECFDF5',
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
          5: 'Complete model reproducibility is enforced by the MLOps platform. All training pipeline runs are logged, compared, and traceable. Reproducibility is tested as part of the model promotion process. Any trained model can be exactly reproduced from its registry entry.',
        },
      },
      {
        text: 'We have automated testing (unit, integration, regression) specifically for AI systems.',
        anchors: {
          1: 'No automated testing exists for AI systems. Models are evaluated manually or not at all before deployment.',
          2: 'Some manual evaluation of model outputs occurs (e.g., reviewing a sample of predictions) but no automated tests, test suites, or quality gates exist.',
          3: 'Basic automated tests exist for some models (e.g., performance threshold checks), but unit testing of ML code, integration tests, and regression testing against a holdout set are not consistently applied.',
          4: 'A standardized AI testing suite covers data validation, model performance thresholds, behavioral testing (e.g., invariance, directional tests), and integration tests. Tests are run automatically on every model update.',
          5: 'Comprehensive AI system testing includes unit tests for ML code, data validation, model performance regression, adversarial testing, fairness checks, and production shadow testing. All tests are automated in CI/CD pipelines with mandatory passing gates. Test coverage is measured and reported.',
        },
      },
      {
        text: 'CI/CD pipelines are in place for automated, low-risk AI model deployment.',
        anchors: {
          1: 'No CI/CD pipelines exist for AI models. Deployment is entirely manual and requires significant engineering effort for every release.',
          2: 'Basic CI exists for model code (e.g., unit test runs on commit) but no CD pipeline automates model deployment. Releases are manual, infrequent, and inconsistent.',
          3: 'A CI/CD pipeline exists for some AI models but does not cover all deployment scenarios, lacks automated rollback capability, and does not enforce quality gates before production deployment.',
          4: 'Automated CI/CD pipelines handle code testing, model training, evaluation, and deployment for all production models. Quality gates block promotion of underperforming models and automated rollback is available.',
          5: 'Fully automated CI/CD pipelines with multi-stage promotion environments (dev → staging → canary → production), automated quality gates, performance benchmarking, one-click rollback, and deployment frequency metrics are standard for all AI systems. Deployment lead time and change failure rate are tracked as KPIs.',
        },
      },
      {
        text: 'We continuously monitor model performance, reliability, and quality in production.',
        anchors: {
          1: 'No production monitoring exists for AI models. The organization learns about degraded model performance from user complaints or business metric declines.',
          2: 'Basic logging of model inputs and outputs occurs, but no systematic performance monitoring, alerting, or SLA tracking is in place.',
          3: 'Performance monitoring is in place for the most critical models, covering key metrics (e.g., accuracy, latency), but alert coverage is incomplete and response procedures are not defined.',
          4: 'Comprehensive production monitoring covers all deployed models with dashboards for performance, reliability, latency, and data quality. Alerts are calibrated to business impact and trigger defined response procedures.',
          5: 'Real-time model observability is provided through dedicated monitoring infrastructure covering prediction quality, data drift, feature distribution, latency, availability, and business outcome correlation for every production model. Anomalies trigger automated runbooks, and a weekly model health review is held by the MLOps team.',
        },
      },
      {
        text: 'There is a defined, reliable, and tested process for model retraining and updates.',
        anchors: {
          1: 'No retraining process exists. Models are retrained manually and infrequently in response to obvious failures, without any systematic triggers or schedule.',
          2: 'Retraining occurs on an ad-hoc basis when performance issues are noticed, but there is no trigger criteria, automation, or validation process for retrained models.',
          3: 'A retraining process is documented for key models with some automated triggers (e.g., scheduled retraining), but validation of retrained models before deployment is inconsistent.',
          4: 'A defined retraining process with automated triggers (performance degradation thresholds, data drift alerts, scheduled retraining), automated re-evaluation, and a promotion process exists for all production models.',
          5: 'Continuous training pipelines automatically retrain models based on drift detection, new data availability, or scheduled triggers. Retrained models go through the full CI/CD pipeline with automated comparison to the current production model. Champion/challenger deployments are the standard promotion mechanism.',
        },
      },
      {
        text: 'AI experiments are systematically tracked and results are fully reproducible by any team member.',
        anchors: {
          1: 'Experiments are tracked only in individual notebooks or personal files. Results are not shared, not reproducible, and lost when the experimenter leaves.',
          2: 'Some teams share experiment results informally (e.g., in a shared wiki or Slack channel), but there is no standardized tracking tool, metadata format, or reproducibility standard.',
          3: 'An experiment tracking tool is deployed and used by most teams, but logged metadata is inconsistent, reproducibility is partial, and cross-team visibility into experiments is limited.',
          4: 'All ML experiments are logged in a centralized tracking platform with standardized metadata (code version, data version, parameters, metrics, environment). Any team member can reproduce any logged experiment.',
          5: 'A comprehensive ML experimentation platform captures all experiments with complete reproducibility metadata, enables cross-team search and comparison, supports systematic hyperparameter optimization, and provides experiment cost tracking. Experiment results feed directly into the model registry promotion process.',
        },
      },
      {
        text: 'We have defined and actively monitored SLAs for AI system performance, availability, and latency.',
        anchors: {
          1: 'No SLAs are defined for AI systems. There are no commitments to business users on performance, availability, or response time.',
          2: 'Informal expectations exist (e.g., "the model should be available during business hours") but these are not documented as formal SLAs, measured, or reported.',
          3: 'SLAs are defined for the most critical AI systems, but measurement is manual, reporting is infrequent, and penalties or escalation procedures for SLA breaches are not defined.',
          4: 'Formal SLAs covering latency, availability, and prediction quality are defined for all production AI systems. SLA performance is automatically measured and reported in dashboards reviewed weekly.',
          5: 'Comprehensive, risk-tiered SLAs cover latency (p50, p95, p99), availability, batch processing deadlines, and prediction quality for all production AI systems. SLA tracking is real-time with automated alerts for breaches. SLA compliance is reported to business stakeholders monthly and historical performance is published in an internal SLA report.',
        },
      },
      {
        text: 'Model documentation (model cards, data sheets) is standardized and consistently maintained.',
        anchors: {
          1: 'No model documentation exists beyond code comments. Institutional knowledge about models is informal and lost when team members leave.',
          2: 'Some high-profile models have informal documentation (e.g., a README or wiki page), but there is no standard template, maintenance process, or completeness requirement.',
          3: 'A model documentation template (e.g., based on model cards) exists and is used for most new models, but historical models are undocumented and template completion is not enforced.',
          4: 'Standardized model documentation (including intended use, performance metrics, limitations, training data description, and ethical considerations) is required for all production models and is reviewed at each update.',
          5: 'Comprehensive, version-controlled model documentation following an industry-standard framework (model cards + data sheets) is mandatory for all models at every lifecycle stage. Documentation is automatically generated from experiment tracking data where possible, human-reviewed, linked in the model registry, and accessible to auditors and business stakeholders.',
        },
      },
      {
        text: 'We have infrastructure and processes for A/B testing and shadow deployment of AI models.',
        anchors: {
          1: 'No A/B testing or shadow deployment capability exists. New models replace old ones with a hard cutover and no ability to compare live performance.',
          2: 'Manual A/B testing has been done for some models using application-level logic, but there is no platform support, traffic splitting capability, or statistical analysis tooling.',
          3: 'A/B testing infrastructure exists and has been used for major model updates, but shadow deployment (running a new model in parallel without serving its output) is not available, and statistical rigor of A/B analyses is inconsistent.',
          4: 'A standardized A/B testing and shadow deployment platform supports controlled rollouts for all production model updates. Statistical significance calculations, traffic splitting, and result dashboards are provided out of the box.',
          5: 'Flexible experimentation infrastructure supports A/B testing, multi-armed bandit, shadow deployment, and canary releases for all AI systems. Statistical analysis is automated and results are surfaced to both technical and business stakeholders. All model promotions use one of these controlled rollout methods.',
        },
      },
      {
        text: 'AI development best practices and standards are documented and consistently followed.',
        anchors: {
          1: 'No AI development standards exist. Each team or individual follows their own practices, resulting in inconsistent code quality, reproducibility, and security.',
          2: 'Some informal best practices are shared through team knowledge-sharing, but they are not documented, enforced, or consistently followed.',
          3: 'An AI development standards guide exists covering key areas (code quality, experimentation, documentation), but adoption is voluntary, enforcement is absent, and the guide is not regularly updated.',
          4: 'Documented AI development standards covering code quality, experimentation practices, documentation, security, and testing are enforced through code review and CI gates. Standards are reviewed annually.',
          5: 'A living AI development standards framework is maintained by the CoE, enforced through automated linting and CI gates, embedded in onboarding, and regularly updated based on emerging best practices. Compliance with standards is measured and reported. Teams self-assess against the standards quarterly.',
        },
      },
      {
        text: 'We have robust processes for detecting, responding to, and recovering from model degradation.',
        anchors: {
          1: 'No model degradation detection exists. Degraded models continue serving poor predictions until a business user reports a significant problem.',
          2: 'Basic performance thresholds trigger email alerts for critical models, but response procedures are undefined and recovery (retraining or rollback) is ad-hoc.',
          3: 'Degradation detection with automated alerts exists for key models, and informal response procedures are understood by the team, but formal runbooks, recovery time objectives, and post-incident reviews are absent.',
          4: 'Automated degradation detection triggers defined response runbooks for all production models. Recovery options (rollback, emergency retraining, fallback logic) are documented and tested. Post-incident reviews drive systematic improvements.',
          5: 'A comprehensive model degradation management system provides early warning through leading indicators (data drift, feature distribution shifts) before output quality degrades. Automated responses (traffic throttling, fallback to rules, emergency retraining) are triggered by defined thresholds. RTO and RPO are defined and tested quarterly through degradation fire drills.',
        },
      },
      {
        text: 'Tooling and workflows effectively support collaboration between data scientists and engineers.',
        anchors: {
          1: 'A significant "last mile" gap exists between data scientists and engineers. Models hand off as notebooks or scripts that engineers must fully re-implement, causing delays and quality loss.',
          2: 'Some tools are shared (e.g., a common code repository), but workflows diverge significantly between data science and engineering, causing friction in every deployment.',
          3: 'Shared tooling and handoff procedures are improving, but deployment friction is still significant, requiring manual translation work between data science prototypes and production code.',
          4: 'Standardized tooling, workflow templates, and clear handoff protocols enable relatively smooth collaboration between data scientists and engineers, with most models deployable without major re-engineering.',
          5: 'A unified MLOps platform dissolves the traditional handoff boundary between data scientists and engineers. Data scientists can deploy models directly through automated pipelines, with engineers focusing on platform reliability rather than per-model work. Collaboration tooling, code review processes, and pair-programming norms are standardized.',
        },
      },
      {
        text: 'We measure and actively optimize AI system efficiency, resource utilization, and cost.',
        anchors: {
          1: 'AI system costs are not tracked at the individual system level. There is no visibility into resource utilization, cost-per-inference, or cost-per-training-run.',
          2: 'Aggregate cloud or infrastructure spend on AI is visible but is not broken down by system, workload, or use case. No optimization practices are in place.',
          3: 'Cost tracking by AI system or workload exists for major systems, but systematic optimization practices (right-sizing, spot instances, model compression) are not applied, and cost accountability rests with central IT rather than AI teams.',
          4: 'A FinOps practice for AI tracks cost by system, optimizes infrastructure right-sizing, uses spot/preemptible compute for training, and reports cost efficiency metrics to AI team leads monthly.',
          5: 'A mature AI FinOps program tracks cost-per-inference, cost-per-training-run, and ROI-per-workload for every AI system. AI teams have cost accountability and optimization targets. Model compression, quantization, caching, and hardware acceleration are systematically evaluated. Cost efficiency metrics are reviewed in quarterly AI business reviews.',
        },
      },
      {
        text: 'We conduct structured post-deployment reviews to systematically capture AI system learnings.',
        anchors: {
          1: 'No post-deployment reviews occur. Knowledge gained from AI deployments is lost and the same mistakes are repeated across projects.',
          2: 'Informal discussions about lessons learned occur within project teams, but these are not documented, shared across the organization, or used to improve future projects.',
          3: 'Post-deployment reviews are conducted for major AI projects, but the format is inconsistent, findings are not systematically tracked, and action items are rarely followed through.',
          4: 'Structured post-deployment reviews are conducted for all AI projects within 30–90 days of deployment, following a standard template. Key learnings are documented in a shared knowledge base and reviewed by the CoE.',
          5: 'A mandatory post-deployment review program produces structured retrospectives for every AI deployment, covering technical performance, business impact, process effectiveness, and unintended consequences. Findings are categorized, prioritized, and used to update development standards, training content, and the AI operating model. A bi-annual synthesis of learnings across all reviews is presented to the AI governance committee.',
        },
      },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Scoring helpers
// ─────────────────────────────────────────────────────────────────────────────

export const scaleLabels = {
  1: 'Not at all / No capability',
  2: 'Early / Ad-hoc',
  3: 'Developing / Inconsistent',
  4: 'Established / Mostly consistent',
  5: 'Advanced / Fully optimized',
}

export const maturityLevels = [
  { label: 'Beginning',  min: 0,  max: 20,  color: '#EF4444', bg: '#FEF2F2' },
  { label: 'Developing', min: 20, max: 40,  color: '#F97316', bg: '#FFF7ED' },
  { label: 'Maturing',   min: 40, max: 60,  color: '#EAB308', bg: '#FEFCE8' },
  { label: 'Advanced',   min: 60, max: 80,  color: '#3B82F6', bg: '#EFF6FF' },
  { label: 'Leading',    min: 80, max: 101, color: '#10B981', bg: '#ECFDF5' },
]

export function getMaturityLevel(score) {
  return maturityLevels.find(l => score >= l.min && score < l.max) || maturityLevels[0]
}

export function computeScore(answers, numQuestions) {
  const keys = Object.keys(answers)
  if (keys.length === 0) return 0
  const sum = keys.reduce((acc, k) => acc + answers[k], 0)
  return Math.round(((sum - keys.length) / (keys.length * 4)) * 100)
}

export function computeDimensionScores(allAnswers) {
  return dimensions.map(d => ({
    ...d,
    score: computeScore(allAnswers[d.id], d.questions.length),
  }))
}

export function computeOverallScore(dimensionScores) {
  const total = dimensionScores.reduce((acc, d) => acc + d.score, 0)
  return Math.round(total / dimensionScores.length)
}

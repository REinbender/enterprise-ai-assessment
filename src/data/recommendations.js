// Recommendations keyed by dimension id, then score tier: 'low' (<40), 'medium' (40-70), 'high' (70-75), 'sustain' (>=75)
// Each entry includes: title, priority, description, actions[], effort (1-5), impact (1-5), phases[]
// phases: [{ label, theme, actions[] }] — 30/60/90-day implementation roadmap
import { getIndustryContext, getSizeNote } from './industryContext'

export const recommendationData = {
  1: {
    low: {
      title: 'Establish a Formal AI Strategy',
      priority: 'Critical',
      description: 'Your organization lacks foundational strategic direction for AI. Without this, AI efforts will remain fragmented and fail to deliver business value.',
      keyRisk: 'Without executive-sponsored AI strategy, AI investments remain fragmented and unable to demonstrate ROI — increasing the risk of budget reallocation away from AI as competing priorities arise.',
      effort: 4,
      impact: 5,
      actions: [
        'Appoint an executive AI sponsor (CAIO or equivalent) with authority and accountability within 60 days.',
        'Run a facilitated AI opportunity workshop with C-suite and business leads to identify the top 3–5 priority use cases.',
        'Develop a 12-month AI strategy document with explicit goals, KPIs, and an associated funding model.',
        'Create a lightweight AI governance structure (steering committee) to provide oversight and resolve conflicts.',
        'Commission a rapid competitive landscape scan to understand where AI is reshaping your industry.',
      ],
      phases: [
        {
          label: 'Days 0–30',
          theme: 'Foundation',
          actions: [
            'Appoint or designate an executive AI sponsor with explicit accountability.',
            'Conduct stakeholder interviews to surface top AI priorities and blockers.',
            'Commission a competitive landscape scan of AI adoption in your industry.',
          ],
        },
        {
          label: 'Days 31–60',
          theme: 'Build',
          actions: [
            'Facilitate a C-suite AI opportunity workshop to align on top 3–5 use cases.',
            'Draft a 12-month AI strategy document with goals, KPIs, and funding model.',
            'Stand up an AI steering committee with representation from business and technology.',
          ],
        },
        {
          label: 'Days 61–90',
          theme: 'Scale',
          actions: [
            'Secure board or C-suite sign-off on the AI strategy document.',
            'Publish the strategy internally and begin stakeholder communication plan.',
            'Kick off the first priority use case with defined success metrics.',
          ],
        },
      ],
    },
    medium: {
      title: 'Mature & Operationalize Your AI Strategy',
      priority: 'High',
      description: 'You have the basics of an AI strategy in place, but need to strengthen execution rigor, value tracking, and organizational alignment.',
      keyRisk: 'The absence of rigorous execution governance means AI investments may deliver isolated wins but fail to compound into enterprise-scale value — widening the gap between AI spend and measurable business outcomes over time.',
      effort: 3,
      impact: 4,
      actions: [
        'Implement quarterly AI business reviews to formally track ROI and realign investment priorities.',
        'Build a formal AI opportunity pipeline with a scoring model to evaluate and rank new initiatives.',
        'Develop an AI value dashboard visible to senior leadership showing investment-to-outcome performance.',
        'Create an AI communications program to build broad stakeholder confidence and drive cultural buy-in.',
        'Establish a portfolio balance model—explicitly allocating budget between quick wins and longer-term bets.',
      ],
      phases: [
        {
          label: 'Days 0–30',
          theme: 'Foundation',
          actions: [
            'Audit existing AI initiatives against current strategy goals to identify misalignment.',
            'Define a scoring rubric for evaluating and ranking new AI opportunities.',
            'Identify the metrics for the AI value dashboard and assign data owners.',
          ],
        },
        {
          label: 'Days 31–60',
          theme: 'Build',
          actions: [
            'Launch the formal AI opportunity pipeline and score the existing backlog.',
            'Stand up the AI value dashboard in beta for leadership review.',
            'Run the first quarterly AI business review using the new framework.',
          ],
        },
        {
          label: 'Days 61–90',
          theme: 'Scale',
          actions: [
            'Publish the portfolio balance model and secure leadership alignment on budget allocation.',
            'Launch the AI communications program with regular internal updates.',
            'Embed AI ROI reviews into existing budget and planning cycles.',
          ],
        },
      ],
    },
    high: {
      title: 'Drive AI-Led Competitive Advantage',
      priority: 'Medium',
      description: 'Your AI strategy is mature. Focus now on using AI for differentiation, new business models, and ecosystem influence.',
      keyRisk: 'Failure to continuously evolve AI strategy alongside rapidly shifting technology and competitive landscapes risks obsolescence — directing resources toward sustaining current capabilities rather than building differentiated future ones.',
      effort: 2,
      impact: 3,
      actions: [
        'Explore AI-native product or service offerings that create net-new revenue streams.',
        'Develop an AI ecosystem and partnership strategy to access external capabilities and talent.',
        'Benchmark your AI strategy against peer leaders and emerging practices at least annually.',
        'Create a rapid experimentation program to identify and fast-track transformational AI opportunities.',
      ],
      phases: [
        {
          label: 'Days 0–30',
          theme: 'Foundation',
          actions: [
            'Conduct annual peer benchmarking against top-quartile AI companies in your sector.',
            'Identify 2–3 AI-native product or service concepts worth incubating.',
            'Map potential ecosystem partners and evaluate partnership structures.',
          ],
        },
        {
          label: 'Days 31–60',
          theme: 'Build',
          actions: [
            'Launch a rapid experimentation program with executive sponsorship and a defined budget.',
            'Initiate conversations with ecosystem partners or academic institutions.',
            'Develop business cases for the top AI-native product concept.',
          ],
        },
        {
          label: 'Days 61–90',
          theme: 'Scale',
          actions: [
            'Formalize at least one ecosystem partnership agreement.',
            'Present AI-native business case to leadership for investment decision.',
            'Publish externally facing AI innovation narrative to reinforce market positioning.',
          ],
        },
      ],
    },
    sustain: {
      title: 'Sustain & Leverage AI Strategy Leadership',
      priority: 'Sustain',
      description: 'Your AI strategy is mature and well-integrated with business objectives. Maintain momentum by continuously scanning the horizon, refreshing strategic priorities, and leveraging your position to drive ecosystem influence and competitive differentiation.',
      keyRisk: 'Strategic atrophy — mature AI strategies require continuous refresh as the technology and competitive landscape evolves; failing to revisit priorities annually risks your organization falling behind peers who are advancing rapidly.',
      effort: 1,
      impact: 2,
      actions: [
        'Conduct an annual AI strategy review tied to board-level planning cycles to keep priorities current.',
        'Benchmark against external peers and publish insights to reinforce thought leadership.',
        'Use your strategic clarity to attract talent and partners who gravitate toward organizations with a clear AI vision.',
        'Embed AI opportunity scanning into existing M&A and partnership evaluation processes.',
      ],
    },
  },

  2: {
    low: {
      title: 'Build Your Data & AI Infrastructure Foundation',
      priority: 'Critical',
      description: 'Significant gaps in data quality, governance, and infrastructure will directly limit your ability to build and deploy reliable AI systems.',
      keyRisk: 'Data quality and governance gaps will directly undermine model reliability in production — AI systems built on unreliable foundations will erode stakeholder trust and create operational risk that compounds as deployment scales.',
      effort: 5,
      impact: 5,
      actions: [
        'Conduct a data estate audit to catalog existing data assets, owners, quality levels, and accessibility.',
        'Appoint data stewards for the top 5–10 critical data domains needed for priority AI use cases.',
        'Establish a basic data quality program with defined standards, measurement, and remediation workflows.',
        'Assess current infrastructure against AI workload requirements and develop a modernization plan.',
        'Begin breaking down the 2–3 most critical data silos blocking your highest-priority AI use cases.',
      ],
      phases: [
        {
          label: 'Days 0–30',
          theme: 'Foundation',
          actions: [
            'Complete a data estate audit — catalog assets, owners, quality ratings, and AI-readiness.',
            'Appoint data stewards for the top 5–10 domains critical to priority AI use cases.',
            'Assess current infrastructure against minimum AI workload requirements.',
          ],
        },
        {
          label: 'Days 31–60',
          theme: 'Build',
          actions: [
            'Define data quality standards and stand up a measurement and remediation workflow.',
            'Develop a prioritized infrastructure modernization roadmap with cost and timeline estimates.',
            'Begin decoupling the 2–3 highest-priority data silos blocking initial AI use cases.',
          ],
        },
        {
          label: 'Days 61–90',
          theme: 'Scale',
          actions: [
            'Deliver initial data quality dashboards to data stewards for ongoing monitoring.',
            'Secure funding approval for the infrastructure modernization roadmap.',
            'Complete first silo integration and validate data accessibility for the lead AI use case.',
          ],
        },
      ],
    },
    medium: {
      title: 'Strengthen Data Quality & Infrastructure Scalability',
      priority: 'High',
      description: 'Your data capabilities are developing but inconsistencies in quality, pipeline reliability, and scalability are creating risk for AI at scale.',
      keyRisk: 'Unresolved pipeline inconsistencies and silo gaps become a bottleneck as AI scales — increasing development costs and introducing reliability risk that grows disproportionately in customer-facing or regulated use cases.',
      effort: 4,
      impact: 4,
      actions: [
        'Implement automated data quality monitoring with alerting across all production data pipelines.',
        'Formalize a data catalog with lineage documentation to accelerate AI feature development.',
        'Build or adopt a feature store to enable reuse of ML features and reduce duplicated engineering effort.',
        'Develop a scalable, cost-optimized cloud or hybrid infrastructure strategy for ML training and serving.',
        'Establish a robust data labeling operation (internal or outsourced) to support supervised learning pipelines.',
      ],
      phases: [
        {
          label: 'Days 0–30',
          theme: 'Foundation',
          actions: [
            'Implement automated data quality monitoring with alerting on all production pipelines.',
            'Begin formalizing the data catalog with lineage documentation for top AI data assets.',
            'Assess feature engineering duplication across teams and identify consolidation opportunities.',
          ],
        },
        {
          label: 'Days 31–60',
          theme: 'Build',
          actions: [
            'Deploy or adopt a feature store and migrate the highest-reuse features from existing codebases.',
            'Finalize and publish the scalable ML infrastructure strategy (cloud/hybrid cost model).',
            'Stand up or contract a data labeling operation for the primary supervised learning pipeline.',
          ],
        },
        {
          label: 'Days 61–90',
          theme: 'Scale',
          actions: [
            'Expand the data catalog to cover all production AI systems.',
            'Run first infrastructure cost-optimization review with FinOps team.',
            'Establish SLAs for data pipeline reliability and labeling throughput.',
          ],
        },
      ],
    },
    high: {
      title: 'Optimize for AI-Scale Data Operations',
      priority: 'Medium',
      description: 'Strong data and infrastructure foundations are in place. Focus on optimization, real-time capabilities, and next-generation AI infrastructure.',
      keyRisk: 'Without proactive investment in real-time capabilities and infrastructure cost governance, the data estate will constrain AI scaling — particularly as large model inference and streaming workloads increase infrastructure demand.',
      effort: 2,
      impact: 3,
      actions: [
        'Invest in real-time data streaming capabilities to enable lower-latency AI applications.',
        'Optimize AI infrastructure costs through spot instances, model compression, and efficient serving.',
        'Expand the feature store to cover all major ML domains and establish cross-team sharing practices.',
        'Explore synthetic data generation to address gaps in training data coverage and diversity.',
      ],
      phases: [
        {
          label: 'Days 0–30',
          theme: 'Foundation',
          actions: [
            'Identify the top 3 use cases that would benefit most from real-time data streaming.',
            'Audit AI infrastructure costs and identify top optimization opportunities.',
            'Evaluate synthetic data tooling options for gaps in training data coverage.',
          ],
        },
        {
          label: 'Days 31–60',
          theme: 'Build',
          actions: [
            'Pilot a streaming data pipeline for the highest-value low-latency use case.',
            'Implement spot instance and model compression strategies for non-critical workloads.',
            'Expand feature store coverage to remaining ML domains with cross-team onboarding.',
          ],
        },
        {
          label: 'Days 61–90',
          theme: 'Scale',
          actions: [
            'Productionize real-time pipeline and measure latency improvements against baseline.',
            'Publish infrastructure cost savings achieved and set targets for the next quarter.',
            'Launch synthetic data capability for training data augmentation in priority domains.',
          ],
        },
      ],
    },
    sustain: {
      title: 'Sustain & Leverage Data & Infrastructure Excellence',
      priority: 'Sustain',
      description: 'Your data infrastructure is a genuine AI enabler. Sustain this advantage by investing in next-generation capabilities — real-time data, synthetic data generation, and AI-optimized cost governance.',
      keyRisk: 'Infrastructure debt accumulation — as AI workloads scale and new model types emerge, data infrastructure can lag adoption without proactive investment; costs can also grow faster than value without FinOps discipline.',
      effort: 1,
      impact: 2,
      actions: [
        'Expand real-time streaming capabilities to enable lower-latency AI applications and reduce time-to-insight.',
        'Invest in synthetic data generation to address training data gaps and reduce regulatory risk from real data use.',
        'Institutionalize AI FinOps practices to keep infrastructure costs proportional to business value delivered.',
        'Leverage your data maturity as a recruiting asset — highlight data culture and tooling in talent acquisition.',
      ],
    },
  },

  3: {
    low: {
      title: 'Implement Core AI Governance & Risk Management',
      priority: 'Critical',
      description: 'Without foundational governance, AI systems pose significant legal, reputational, and operational risks as you scale.',
      keyRisk: 'Continued AI deployment without formal governance creates material liability under the EU AI Act and analogous regulations — a single high-profile AI incident without established accountability structures can trigger regulatory scrutiny across the entire portfolio.',
      effort: 3,
      impact: 5,
      actions: [
        'Develop and publish an AI policy document covering acceptable use, ethical principles, and employee obligations.',
        'Create a mandatory pre-deployment AI risk assessment process for all AI systems.',
        'Establish a cross-functional AI Ethics & Risk Committee with executive representation.',
        'Map all current and planned AI systems against applicable regulations (GDPR, CCPA, EU AI Act, etc.).',
        'Implement basic model documentation standards (model cards) as a non-negotiable deployment gate.',
      ],
      phases: [
        {
          label: 'Days 0–30',
          theme: 'Foundation',
          actions: [
            'Draft an AI acceptable use policy covering ethical principles and employee obligations.',
            'Map existing AI systems against applicable regulations (GDPR, CCPA, EU AI Act).',
            'Establish a cross-functional AI Ethics & Risk Committee with executive representation.',
          ],
        },
        {
          label: 'Days 31–60',
          theme: 'Build',
          actions: [
            'Publish the AI policy document and communicate it company-wide.',
            'Design and implement the mandatory pre-deployment AI risk assessment process.',
            'Create model card templates and make them a required deployment artifact.',
          ],
        },
        {
          label: 'Days 61–90',
          theme: 'Scale',
          actions: [
            'Conduct risk assessments for all existing production AI systems using the new framework.',
            'Complete model cards for all production AI systems.',
            'Schedule the first quarterly AI Ethics & Risk Committee review.',
          ],
        },
      ],
    },
    medium: {
      title: 'Strengthen AI Risk Controls & Auditability',
      priority: 'High',
      description: 'Governance foundations exist but are not consistently applied, leaving gaps in bias controls, auditability, and incident readiness.',
      keyRisk: 'Inconsistent governance application leaves the organization with uneven audit readiness — a targeted regulatory audit or AI failure could expose structural gaps disproportionate to the risk actually present.',
      effort: 3,
      impact: 4,
      actions: [
        'Deploy automated model monitoring and drift detection across all production AI systems.',
        'Build and test AI-specific incident response playbooks for model failures and harmful outputs.',
        'Implement systematic bias and fairness testing integrated into the model development lifecycle.',
        'Establish a third-party AI vendor due diligence program for compliance and security assessment.',
        'Create a role-based responsible AI training program mandatory for all AI practitioners.',
      ],
      phases: [
        {
          label: 'Days 0–30',
          theme: 'Foundation',
          actions: [
            'Deploy automated model monitoring and drift detection on the top 3 production AI systems.',
            'Draft AI-specific incident response playbooks for model failures and harmful outputs.',
            'Identify bias and fairness testing requirements for all models in production.',
          ],
        },
        {
          label: 'Days 31–60',
          theme: 'Build',
          actions: [
            'Run a tabletop exercise to test AI incident response playbooks.',
            'Integrate bias and fairness testing into the CI/CD pipeline for all new AI systems.',
            'Launch the role-based responsible AI training program for all practitioners.',
          ],
        },
        {
          label: 'Days 61–90',
          theme: 'Scale',
          actions: [
            'Extend model monitoring to all remaining production AI systems.',
            'Stand up the third-party AI vendor due diligence program and assess top 5 vendors.',
            'Publish a governance compliance dashboard for the AI Ethics & Risk Committee.',
          ],
        },
      ],
    },
    high: {
      title: 'Lead on AI Trust & Responsible AI Practices',
      priority: 'Medium',
      description: 'Governance is well-established. Now focus on becoming a recognized leader in responsible AI and using it as a competitive differentiator.',
      keyRisk: 'Failure to actively leverage governance maturity as a market signal misses a competitive opportunity — as clients, regulators, and partners increasingly require evidence of responsible AI practices, governance leadership becomes a differentiator.',
      effort: 2,
      impact: 3,
      actions: [
        'Publish an external responsible AI report to demonstrate transparency and build stakeholder trust.',
        'Implement advanced explainability tooling for high-stakes AI decisions facing customers or regulators.',
        'Develop an AI audit program using independent internal audit or third-party assessors.',
        'Proactively engage with regulators and industry bodies to shape responsible AI standards.',
      ],
      phases: [
        {
          label: 'Days 0–30',
          theme: 'Foundation',
          actions: [
            'Define the scope and structure of an external responsible AI transparency report.',
            'Evaluate and select advanced explainability tooling for high-stakes AI decisions.',
            'Identify relevant regulators and industry bodies for proactive engagement.',
          ],
        },
        {
          label: 'Days 31–60',
          theme: 'Build',
          actions: [
            'Deploy explainability tooling in production for the top high-stakes AI systems.',
            'Draft and internally review the responsible AI transparency report.',
            'Design the independent AI audit program scope and select an assessor.',
          ],
        },
        {
          label: 'Days 61–90',
          theme: 'Scale',
          actions: [
            'Publish the responsible AI report externally and distribute to stakeholders.',
            'Complete the first independent AI audit and address findings.',
            'Establish an engagement cadence with at least one regulator or industry body.',
          ],
        },
      ],
    },
    sustain: {
      title: 'Sustain & Leverage Responsible AI Leadership',
      priority: 'Sustain',
      description: 'Your governance posture is strong and regulatory-ready. Translate this into a competitive asset by publishing your practices externally, engaging with regulators proactively, and helping shape industry standards.',
      keyRisk: 'Regulatory complacency — the AI governance landscape is evolving rapidly; organizations with strong frameworks can still face exposure if they fail to update controls in response to new regulations, model types, or deployment contexts.',
      effort: 1,
      impact: 2,
      actions: [
        'Publish an annual Responsible AI Transparency Report to signal governance maturity to clients, regulators, and partners.',
        'Engage proactively with regulators and industry bodies to help shape evolving AI standards.',
        'Conduct regular third-party governance audits to validate controls and identify emerging blind spots.',
        'Use governance leadership as a differentiator in enterprise sales cycles and procurement evaluations.',
      ],
    },
  },

  4: {
    low: {
      title: 'Build Your AI Talent & Cultural Foundation',
      priority: 'Critical',
      description: 'Significant talent gaps and cultural barriers will prevent AI initiatives from succeeding regardless of technology investment.',
      keyRisk: 'Without deliberate AI capability building, the organization will face an accelerating talent deficit as AI scales — increasing vendor dependency, elevating costs, and making it impossible to build proprietary AI capabilities that require internal expertise.',
      effort: 5,
      impact: 4,
      actions: [
        'Conduct an AI skills gap assessment across the organization to quantify the talent deficit.',
        'Create an AI literacy program mandatory for all managers and optional for all employees.',
        'Begin targeted recruitment for the 3–5 most critical AI roles (e.g., ML engineers, data scientists, AI product managers).',
        'Identify and empower 3–5 internal AI champions in key business units to drive grassroots adoption.',
        'Launch a culture initiative celebrating data-driven decision making and rewarding experimentation.',
      ],
      phases: [
        {
          label: 'Days 0–30',
          theme: 'Foundation',
          actions: [
            'Conduct an AI skills gap assessment across all business units.',
            'Identify 3–5 internal AI champions in key business units and brief them on their role.',
            'Open targeted recruitment for the top 3 critical AI roles.',
          ],
        },
        {
          label: 'Days 31–60',
          theme: 'Build',
          actions: [
            'Launch an AI literacy program for all managers (mandatory) and employees (optional).',
            'Design and announce a culture initiative rewarding data-driven decisions and experimentation.',
            'Onboard first cohort of external AI hires and pair with internal mentors.',
          ],
        },
        {
          label: 'Days 61–90',
          theme: 'Scale',
          actions: [
            'Hold the first AI champion community of practice meeting.',
            'Complete 90-day review of literacy program completion rates and adjust delivery.',
            'Close the remaining critical AI role searches and onboard new hires.',
          ],
        },
      ],
    },
    medium: {
      title: 'Accelerate AI Talent Development & Cultural Adoption',
      priority: 'High',
      description: 'You have some AI talent and cultural momentum, but gaps in enablement and cross-functional collaboration are slowing AI adoption.',
      keyRisk: 'Unresolved enablement and change management gaps will sustain low AI adoption — making technology investments ineffective and creating organizational disillusionment that can permanently undermine AI program credibility.',
      effort: 3,
      impact: 4,
      actions: [
        'Implement a formal AI skills development program with defined learning paths and certifications.',
        'Establish a Center of Excellence (CoE) to standardize best practices and accelerate knowledge sharing.',
        'Create embedded AI/data roles within business units to reduce dependence on a central team.',
        'Build a structured change management program specifically designed for AI workflow transformations.',
        'Develop partnerships with universities and coding bootcamps to build an ongoing talent pipeline.',
      ],
      phases: [
        {
          label: 'Days 0–30',
          theme: 'Foundation',
          actions: [
            'Define learning paths and certification targets for each AI role tier in the organization.',
            'Draft the AI CoE charter and identify founding members from existing teams.',
            'Identify 2–3 business units ready to pilot embedded AI/data roles.',
          ],
        },
        {
          label: 'Days 31–60',
          theme: 'Build',
          actions: [
            'Launch the AI skills development program and enroll the first cohort.',
            'Stand up the AI CoE with an initial set of standards and a shared resource library.',
            'Design a structured change management playbook for AI workflow transformations.',
          ],
        },
        {
          label: 'Days 61–90',
          theme: 'Scale',
          actions: [
            'Place the first embedded AI/data roles in pilot business units.',
            'Sign at least one university or bootcamp partnership for talent pipeline development.',
            'Report on CoE adoption metrics and refine the knowledge sharing model.',
          ],
        },
      ],
    },
    high: {
      title: 'Sustain AI Talent Leadership & Innovation Culture',
      priority: 'Medium',
      description: 'Strong AI culture and talent. Focus on retention, advanced skill development, and creating an environment that attracts world-class AI talent.',
      keyRisk: 'Failure to retain and develop frontier AI talent will cause critical capability loss to competitors — at this maturity level, talent is the primary differentiator and the hardest organizational capability to rebuild once lost.',
      effort: 2,
      impact: 2,
      actions: [
        'Develop a premier AI talent brand through publications, conference presence, and open-source contributions.',
        'Create advanced technical tracks and sabbatical programs to retain top AI practitioners long-term.',
        'Build an AI innovation lab where practitioners can explore frontier research with commercial potential.',
        'Establish an AI fellowship or residency program in partnership with leading research universities.',
      ],
      phases: [
        {
          label: 'Days 0–30',
          theme: 'Foundation',
          actions: [
            'Survey top AI talent on retention risks and innovation aspirations.',
            'Identify 2–3 research university partners for a potential fellowship or residency program.',
            'Define the scope and budget for an AI innovation lab or incubator.',
          ],
        },
        {
          label: 'Days 31–60',
          theme: 'Build',
          actions: [
            'Launch advanced technical tracks and design sabbatical program structure.',
            'Submit or publish the first co-authored research paper or open-source contribution.',
            'Negotiate at least one university fellowship agreement.',
          ],
        },
        {
          label: 'Days 61–90',
          theme: 'Scale',
          actions: [
            'Open the AI innovation lab with initial projects and dedicated practitioner time.',
            'Launch the fellowship or residency program with first cohort.',
            'Present AI talent brand strategy to leadership with external visibility metrics.',
          ],
        },
      ],
    },
    sustain: {
      title: 'Sustain & Leverage AI Talent Leadership',
      priority: 'Sustain',
      description: 'Your AI culture and talent base are genuine competitive advantages. Focus on retention, frontier capability development, and becoming the employer of choice for AI professionals in your sector.',
      keyRisk: 'Talent attrition risk — at this maturity level, top AI practitioners are actively recruited by hyperscalers and well-funded competitors; losing key talent without deep bench strength can set programs back significantly.',
      effort: 1,
      impact: 2,
      actions: [
        'Develop a premier AI employer brand through publications, open-source contributions, and conference presence.',
        'Create advanced technical tracks and sabbatical programs to retain top practitioners long-term.',
        'Build an AI innovation lab or incubator that gives practitioners time to explore frontier capabilities with commercial potential.',
        'Establish a fellowship or residency program with leading research institutions to deepen your external talent pipeline.',
      ],
    },
  },

  5: {
    low: {
      title: 'Establish Core MLOps & AI Engineering Practices',
      priority: 'Critical',
      description: 'Without foundational MLOps practices, AI systems cannot be deployed reliably, monitored effectively, or improved systematically.',
      keyRisk: 'Without foundational MLOps practices, AI models will fail to deliver consistent production value — creating a cycle of expensive redevelopment that prevents the organization from moving beyond costly proof-of-concept stages.',
      effort: 4,
      impact: 5,
      actions: [
        'Adopt a standard ML experiment tracking tool (e.g., MLflow, Weights & Biases) as the mandatory starting point.',
        'Implement model version control and establish basic deployment gates (testing, review, approval).',
        'Create a minimum viable MLOps pipeline for your highest-priority AI use case as a reference implementation.',
        'Define SLAs for model performance and establish basic production monitoring dashboards.',
        'Develop model card documentation standards and make them a non-negotiable deployment requirement.',
      ],
      phases: [
        {
          label: 'Days 0–30',
          theme: 'Foundation',
          actions: [
            'Adopt and enforce a standard ML experiment tracking tool across all AI teams.',
            'Implement model version control and define minimum deployment gate criteria.',
            'Define SLAs for model performance and identify monitoring tooling gaps.',
          ],
        },
        {
          label: 'Days 31–60',
          theme: 'Build',
          actions: [
            'Build a minimum viable MLOps pipeline for the highest-priority AI use case.',
            'Stand up basic production monitoring dashboards covering all active models.',
            'Draft and publish model card standards; update existing models retroactively.',
          ],
        },
        {
          label: 'Days 61–90',
          theme: 'Scale',
          actions: [
            'Use the reference pipeline to onboard the next 2–3 highest-priority use cases.',
            'Run the first formal deployment gate review using the new standards.',
            'Report on SLA compliance for all production models and address violations.',
          ],
        },
      ],
    },
    medium: {
      title: 'Mature MLOps & Accelerate Deployment Velocity',
      priority: 'High',
      description: 'Basic MLOps practices are in place but automation gaps and inconsistent standards are creating bottlenecks and reliability risks.',
      keyRisk: 'Automation gaps will constrain AI iteration velocity — directly limiting the ability to respond to changing business requirements and eroding the competitive advantage of AI investments over time.',
      effort: 4,
      impact: 4,
      actions: [
        'Build CI/CD pipelines for automated model testing and deployment across all AI systems.',
        'Implement automated retraining pipelines with drift detection triggers for production models.',
        'Develop a feature store to eliminate duplicate feature engineering across teams.',
        'Establish A/B testing and shadow deployment infrastructure to safely validate model updates.',
        'Create a structured post-deployment review process to systematically capture and share learnings.',
      ],
      phases: [
        {
          label: 'Days 0–30',
          theme: 'Foundation',
          actions: [
            'Audit existing MLOps practices and identify the top 3 automation gaps causing bottlenecks.',
            'Design CI/CD pipeline architecture for automated model testing and deployment.',
            'Define the target feature store schema and ownership model.',
          ],
        },
        {
          label: 'Days 31–60',
          theme: 'Build',
          actions: [
            'Deploy CI/CD pipelines for the top 3 highest-volume AI systems.',
            'Implement automated drift detection and retraining triggers for all production models.',
            'Build the feature store MVP and migrate the first high-reuse feature set.',
          ],
        },
        {
          label: 'Days 61–90',
          theme: 'Scale',
          actions: [
            'Roll out CI/CD pipelines to all remaining production AI systems.',
            'Launch A/B and shadow deployment infrastructure for safe model validation.',
            'Formalize the post-deployment review process and run the first structured retrospective.',
          ],
        },
      ],
    },
    high: {
      title: 'Optimize AI Engineering Efficiency & Scale',
      priority: 'Medium',
      description: 'MLOps is mature and reliable. Focus on engineering efficiency, cost optimization, and enabling the next generation of AI capabilities.',
      keyRisk: 'Failure to advance toward self-service infrastructure and FinOps discipline will create unsustainable cost scaling as AI workloads grow — potentially making production AI economically unviable at scale.',
      effort: 3,
      impact: 3,
      actions: [
        'Implement FinOps practices for AI — model distillation, quantization, and serving cost optimization.',
        'Build self-service ML infrastructure that enables business teams to deploy AI without engineering bottlenecks.',
        'Invest in advanced observability — causal drift analysis, data quality attribution, and anomaly detection.',
        'Explore LLMOps patterns for managing foundation model-based systems in production at scale.',
      ],
      phases: [
        {
          label: 'Days 0–30',
          theme: 'Foundation',
          actions: [
            'Conduct an AI infrastructure cost audit and identify the highest ROI optimization opportunities.',
            'Survey business users to identify self-service ML tooling needs and gaps.',
            'Evaluate LLMOps tooling options (e.g., LangSmith, Phoenix, Arize) for foundation model observability.',
          ],
        },
        {
          label: 'Days 31–60',
          theme: 'Build',
          actions: [
            'Apply model distillation and quantization to the top 3 highest-cost production models.',
            'Launch a self-service ML platform pilot with 2–3 business unit power users.',
            'Deploy advanced observability including causal drift analysis for production models.',
          ],
        },
        {
          label: 'Days 61–90',
          theme: 'Scale',
          actions: [
            'Publish AI FinOps cost savings report and set next-cycle optimization targets.',
            'Expand self-service ML platform to all qualifying business units.',
            'Implement LLMOps practices for any production foundation model–based systems.',
          ],
        },
      ],
    },
    sustain: {
      title: 'Sustain & Leverage Engineering Excellence',
      priority: 'Sustain',
      description: 'Your MLOps practice is mature and production-reliable. Build on this foundation with self-service infrastructure, FinOps discipline, and next-generation observability to stay ahead as AI workloads scale.',
      keyRisk: 'Scaling cost risk — mature MLOps teams face increasing pressure as model counts and inference costs grow; without proactive FinOps and self-service infrastructure, engineering teams become bottlenecks and costs can erode program ROI.',
      effort: 1,
      impact: 2,
      actions: [
        'Implement model distillation, quantization, and inference optimization to keep production costs proportional to value.',
        'Build self-service ML infrastructure enabling business teams to deploy AI without central engineering bottlenecks.',
        'Invest in advanced observability — causal drift analysis and anomaly detection for proactive model health management.',
        'Explore LLMOps patterns for managing foundation model-based systems as this workload type rapidly scales.',
      ],
    },
  },
}

// Alias used by PDFExport and ResultsPage
export const generateRecommendations = (dimensionScores, company) => getRecommendations(dimensionScores, company)

export function getRecommendations(dimensionScores, company) {
  // Sort by score ascending (lowest first = highest priority)
  const sorted = [...dimensionScores].sort((a, b) => a.score - b.score)
  const industry = company?.industry || null
  const sizeNote = company?.size ? getSizeNote(company.size) : null

  return sorted.map(dim => {
    const tier = dim.score < 40 ? 'low' : dim.score < 70 ? 'medium' : dim.score < 75 ? 'high' : 'sustain'
    const rec = recommendationData[dim.id][tier]
    const industryContext = industry ? getIndustryContext(dim.id, tier, industry) : null
    return {
      dimensionId: dim.id,
      dimensionName: dim.name,
      dimensionColor: dim.color,
      score: dim.score,
      tier,
      industryContext,
      sizeNote,
      ...rec,
    }
  })
}

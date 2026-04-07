// Recommendations keyed by dimension id, then score tier: 'low' (<40), 'medium' (40-70), 'high' (>70)
export const recommendationData = {
  1: {
    low: {
      title: 'Establish a Formal AI Strategy',
      priority: 'Critical',
      description: 'Your organization lacks foundational strategic direction for AI. Without this, AI efforts will remain fragmented and fail to deliver business value.',
      actions: [
        'Appoint an executive AI sponsor (CAIO or equivalent) with authority and accountability within 60 days.',
        'Run a facilitated AI opportunity workshop with C-suite and business leads to identify the top 3–5 priority use cases.',
        'Develop a 12-month AI strategy document with explicit goals, KPIs, and an associated funding model.',
        'Create a lightweight AI governance structure (steering committee) to provide oversight and resolve conflicts.',
        'Commission a rapid competitive landscape scan to understand where AI is reshaping your industry.',
      ],
    },
    medium: {
      title: 'Mature & Operationalize Your AI Strategy',
      priority: 'High',
      description: 'You have the basics of an AI strategy in place, but need to strengthen execution rigor, value tracking, and organizational alignment.',
      actions: [
        'Implement quarterly AI business reviews to formally track ROI and realign investment priorities.',
        'Build a formal AI opportunity pipeline with a scoring model to evaluate and rank new initiatives.',
        'Develop an AI value dashboard visible to senior leadership showing investment-to-outcome performance.',
        'Create an AI communications program to build broad stakeholder confidence and drive cultural buy-in.',
        'Establish a portfolio balance model—explicitly allocating budget between quick wins and longer-term bets.',
      ],
    },
    high: {
      title: 'Drive AI-Led Competitive Advantage',
      priority: 'Medium',
      description: 'Your AI strategy is mature. Focus now on using AI for differentiation, new business models, and ecosystem influence.',
      actions: [
        'Explore AI-native product or service offerings that create net-new revenue streams.',
        'Develop an AI ecosystem and partnership strategy to access external capabilities and talent.',
        'Benchmark your AI strategy against peer leaders and emerging practices at least annually.',
        'Create a rapid experimentation program to identify and fast-track transformational AI opportunities.',
      ],
    },
  },
  2: {
    low: {
      title: 'Build Your Data & AI Infrastructure Foundation',
      priority: 'Critical',
      description: 'Significant gaps in data quality, governance, and infrastructure will directly limit your ability to build and deploy reliable AI systems.',
      actions: [
        'Conduct a data estate audit to catalog existing data assets, owners, quality levels, and accessibility.',
        'Appoint data stewards for the top 5–10 critical data domains needed for priority AI use cases.',
        'Establish a basic data quality program with defined standards, measurement, and remediation workflows.',
        'Assess current infrastructure against AI workload requirements and develop a modernization plan.',
        'Begin breaking down the 2–3 most critical data silos blocking your highest-priority AI use cases.',
      ],
    },
    medium: {
      title: 'Strengthen Data Quality & Infrastructure Scalability',
      priority: 'High',
      description: 'Your data capabilities are developing but inconsistencies in quality, pipeline reliability, and scalability are creating risk for AI at scale.',
      actions: [
        'Implement automated data quality monitoring with alerting across all production data pipelines.',
        'Formalize a data catalog with lineage documentation to accelerate AI feature development.',
        'Build or adopt a feature store to enable reuse of ML features and reduce duplicated engineering effort.',
        'Develop a scalable, cost-optimized cloud or hybrid infrastructure strategy for ML training and serving.',
        'Establish a robust data labeling operation (internal or outsourced) to support supervised learning pipelines.',
      ],
    },
    high: {
      title: 'Optimize for AI-Scale Data Operations',
      priority: 'Medium',
      description: 'Strong data and infrastructure foundations are in place. Focus on optimization, real-time capabilities, and next-generation AI infrastructure.',
      actions: [
        'Invest in real-time data streaming capabilities to enable lower-latency AI applications.',
        'Optimize AI infrastructure costs through spot instances, model compression, and efficient serving.',
        'Expand the feature store to cover all major ML domains and establish cross-team sharing practices.',
        'Explore synthetic data generation to address gaps in training data coverage and diversity.',
      ],
    },
  },
  3: {
    low: {
      title: 'Implement Core AI Governance & Risk Management',
      priority: 'Critical',
      description: 'Without foundational governance, AI systems pose significant legal, reputational, and operational risks as you scale.',
      actions: [
        'Develop and publish an AI policy document covering acceptable use, ethical principles, and employee obligations.',
        'Create a mandatory pre-deployment AI risk assessment process for all AI systems.',
        'Establish a cross-functional AI Ethics & Risk Committee with executive representation.',
        'Map all current and planned AI systems against applicable regulations (GDPR, CCPA, EU AI Act, etc.).',
        'Implement basic model documentation standards (model cards) as a non-negotiable deployment gate.',
      ],
    },
    medium: {
      title: 'Strengthen AI Risk Controls & Auditability',
      priority: 'High',
      description: 'Governance foundations exist but are not consistently applied, leaving gaps in bias controls, auditability, and incident readiness.',
      actions: [
        'Deploy automated model monitoring and drift detection across all production AI systems.',
        'Build and test AI-specific incident response playbooks for model failures and harmful outputs.',
        'Implement systematic bias and fairness testing integrated into the model development lifecycle.',
        'Establish a third-party AI vendor due diligence program for compliance and security assessment.',
        'Create a role-based responsible AI training program mandatory for all AI practitioners.',
      ],
    },
    high: {
      title: 'Lead on AI Trust & Responsible AI Practices',
      priority: 'Medium',
      description: 'Governance is well-established. Now focus on becoming a recognized leader in responsible AI and using it as a competitive differentiator.',
      actions: [
        'Publish an external responsible AI report to demonstrate transparency and build stakeholder trust.',
        'Implement advanced explainability tooling for high-stakes AI decisions facing customers or regulators.',
        'Develop an AI audit program using independent internal audit or third-party assessors.',
        'Proactively engage with regulators and industry bodies to shape responsible AI standards.',
      ],
    },
  },
  4: {
    low: {
      title: 'Build Your AI Talent & Cultural Foundation',
      priority: 'Critical',
      description: 'Significant talent gaps and cultural barriers will prevent AI initiatives from succeeding regardless of technology investment.',
      actions: [
        'Conduct an AI skills gap assessment across the organization to quantify the talent deficit.',
        'Create an AI literacy program mandatory for all managers and optional for all employees.',
        'Begin targeted recruitment for the 3–5 most critical AI roles (e.g., ML engineers, data scientists, AI product managers).',
        'Identify and empower 3–5 internal AI champions in key business units to drive grassroots adoption.',
        'Launch a culture initiative celebrating data-driven decision making and rewarding experimentation.',
      ],
    },
    medium: {
      title: 'Accelerate AI Talent Development & Cultural Adoption',
      priority: 'High',
      description: 'You have some AI talent and cultural momentum, but gaps in enablement and cross-functional collaboration are slowing AI adoption.',
      actions: [
        'Implement a formal AI skills development program with defined learning paths and certifications.',
        'Establish a Center of Excellence (CoE) to standardize best practices and accelerate knowledge sharing.',
        'Create embedded AI/data roles within business units to reduce dependence on a central team.',
        'Build a structured change management program specifically designed for AI workflow transformations.',
        'Develop partnerships with universities and coding bootcamps to build an ongoing talent pipeline.',
      ],
    },
    high: {
      title: 'Sustain AI Talent Leadership & Innovation Culture',
      priority: 'Medium',
      description: 'Strong AI culture and talent. Focus on retention, advanced skill development, and creating an environment that attracts world-class AI talent.',
      actions: [
        'Develop a premier AI talent brand through publications, conference presence, and open-source contributions.',
        'Create advanced technical tracks and sabbatical programs to retain top AI practitioners long-term.',
        'Build an AI innovation lab where practitioners can explore frontier research with commercial potential.',
        'Establish an AI fellowship or residency program in partnership with leading research universities.',
      ],
    },
  },
  5: {
    low: {
      title: 'Establish Core MLOps & AI Engineering Practices',
      priority: 'Critical',
      description: 'Without foundational MLOps practices, AI systems cannot be deployed reliably, monitored effectively, or improved systematically.',
      actions: [
        'Adopt a standard ML experiment tracking tool (e.g., MLflow, Weights & Biases) as the mandatory starting point.',
        'Implement model version control and establish basic deployment gates (testing, review, approval).',
        'Create a minimum viable MLOps pipeline for your highest-priority AI use case as a reference implementation.',
        'Define SLAs for model performance and establish basic production monitoring dashboards.',
        'Develop model card documentation standards and make them a non-negotiable deployment requirement.',
      ],
    },
    medium: {
      title: 'Mature MLOps & Accelerate Deployment Velocity',
      priority: 'High',
      description: 'Basic MLOps practices are in place but automation gaps and inconsistent standards are creating bottlenecks and reliability risks.',
      actions: [
        'Build CI/CD pipelines for automated model testing and deployment across all AI systems.',
        'Implement automated retraining pipelines with drift detection triggers for production models.',
        'Develop a feature store to eliminate duplicate feature engineering across teams.',
        'Establish A/B testing and shadow deployment infrastructure to safely validate model updates.',
        'Create a structured post-deployment review process to systematically capture and share learnings.',
      ],
    },
    high: {
      title: 'Optimize AI Engineering Efficiency & Scale',
      priority: 'Medium',
      description: 'MLOps is mature and reliable. Focus on engineering efficiency, cost optimization, and enabling the next generation of AI capabilities.',
      actions: [
        'Implement FinOps practices for AI — model distillation, quantization, and serving cost optimization.',
        'Build self-service ML infrastructure that enables business teams to deploy AI without engineering bottlenecks.',
        'Invest in advanced observability — causal drift analysis, data quality attribution, and anomaly detection.',
        'Explore LLMOps patterns for managing foundation model-based systems in production at scale.',
      ],
    },
  },
}

// Alias used by PDFExport and ResultsPage
export const generateRecommendations = (dimensionScores) => getRecommendations(dimensionScores)

export function getRecommendations(dimensionScores) {
  // Sort by score ascending (lowest first = highest priority)
  const sorted = [...dimensionScores].sort((a, b) => a.score - b.score)

  return sorted.map(dim => {
    const tier = dim.score < 40 ? 'low' : dim.score < 70 ? 'medium' : 'high'
    const rec = recommendationData[dim.id][tier]
    return {
      dimensionId: dim.id,
      dimensionName: dim.name,
      dimensionColor: dim.color,
      score: dim.score,
      tier,
      ...rec,
    }
  })
}

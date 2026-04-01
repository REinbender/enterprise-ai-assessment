export const dimensions = [
  {
    id: 1,
    name: 'AI Strategy & Value Realization',
    shortName: 'Strategy',
    color: '#4F46E5',
    bgColor: '#EEF2FF',
    description: 'Assesses whether AI is strategically anchored to business goals, sponsored at the executive level, and delivering measurable value.',
    questions: [
      'Our organization has a formal, documented AI strategy that is aligned to business objectives.',
      'Senior leadership actively sponsors and publicly advocates for AI initiatives.',
      'We have identified specific AI use cases with clearly defined, measurable ROI targets.',
      'AI capabilities are a deliberate part of our competitive differentiation strategy.',
      'We have a structured, repeatable process for prioritizing and evaluating AI opportunities.',
      'AI investments are tracked against quantifiable business outcomes on a regular cadence.',
      'We have a multi-year roadmap for AI adoption and organizational capability building.',
      'Business units are aligned on the strategic value and expected outcomes of AI investments.',
      'We have achieved measurable, repeatable results from AI initiatives beyond pilot stage.',
      'There is a dedicated and sufficient budget allocated specifically to AI initiatives.',
      'We have a defined process for scaling successful AI pilots into full production.',
      'Our AI strategy is reviewed and updated regularly based on performance and market changes.',
      'We have an ecosystem and partnership strategy to augment internal AI capabilities.',
      'Leadership broadly understands both the potential and the limitations of AI.',
      'We have a process to communicate AI value and progress to all key stakeholders.',
    ],
  },
  {
    id: 2,
    name: 'Data & Infrastructure Readiness',
    shortName: 'Data',
    color: '#0EA5E9',
    bgColor: '#F0F9FF',
    description: 'Evaluates the quality, accessibility, governance, and scalability of data and technical infrastructure to support AI workloads.',
    questions: [
      'Our data is centrally managed with clear ownership, stewardship, and accountability.',
      'We regularly assess and actively maintain high data quality standards across key datasets.',
      'We have a formal, enterprise-wide data governance framework in place.',
      'Our data pipelines are automated, reliable, and continuously monitored.',
      'We have scalable cloud or on-premises infrastructure purpose-built for AI/ML workloads.',
      'Data is accessible to authorized users through secure, governed, and well-documented APIs.',
      'We have real-time or near-real-time data processing capabilities where the business requires it.',
      'We maintain comprehensive data catalogs, lineage documentation, and metadata management.',
      'We have established processes for data labeling and annotation at the scale AI requires.',
      'Sensitive and regulated data is properly identified, classified, and protected throughout its lifecycle.',
      'We can easily onboard and integrate new internal and external data sources.',
      'We have monitoring in place for data quality degradation and pipeline health.',
      'Our storage and compute infrastructure can scale cost-effectively to production AI workloads.',
      'We have a feature store or equivalent capability for sharing ML features across teams.',
      'Data silos are actively being identified and reduced across the organization.',
    ],
  },
  {
    id: 3,
    name: 'Governance & Compliance',
    shortName: 'Governance',
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
    description: 'Reviews the maturity of AI risk management, ethical frameworks, regulatory compliance, and audit capabilities.',
    questions: [
      'We have AI-specific policies, standards, and ethical guidelines that are documented and socialized.',
      'There is a formal, repeatable process for assessing AI-related risks before deployment.',
      'AI model decisions are auditable and can be explained to regulators and business stakeholders.',
      'We perform systematic bias and fairness testing on AI models prior to and during deployment.',
      'We comply with all relevant data privacy and AI regulations (e.g., GDPR, CCPA, EU AI Act).',
      'There is a clear accountability framework with named owners for each AI system in production.',
      'We have model monitoring and drift detection in place for all production AI models.',
      'Incident response plans exist specifically for AI system failures, errors, and harms.',
      'We conduct regular audits of AI systems, their outputs, and their downstream business impacts.',
      'Third-party AI vendors and tools are assessed for compliance, security, and alignment with our policies.',
      'We have version control and change management processes specifically for AI models.',
      'There is executive-level oversight of AI governance through a committee or equivalent body.',
      'We have clear policies governing the use of AI-generated content across the enterprise.',
      'Employees are trained on responsible AI principles, policies, and appropriate usage.',
      'There is a defined process for receiving, investigating, and resolving AI-related complaints or harms.',
    ],
  },
  {
    id: 4,
    name: 'Talent, Culture & Enablement',
    shortName: 'Talent',
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    description: 'Measures AI talent depth, organizational culture around data and experimentation, and enablement programs across the workforce.',
    questions: [
      'We have sufficient dedicated AI/ML engineering and data science talent to execute our strategy.',
      'There is a structured, ongoing program for AI skills development and workforce upskilling.',
      'Leadership consistently champions a culture of data-driven decision making at all levels.',
      'Employees broadly understand how to work effectively alongside AI tools in their workflows.',
      'We have strong, structured change management processes specifically designed for AI adoption.',
      'Business domain experts are actively and meaningfully involved in AI project design and validation.',
      'We attract and retain top AI talent effectively relative to market competition.',
      'There is meaningful, structured cross-functional collaboration on AI projects.',
      'We have a community of practice or center of excellence that drives AI best practices.',
      'Employees have psychological safety to experiment with AI, fail fast, and share learnings.',
      'AI literacy is formally measured, tracked, and improving across the organization over time.',
      'We have a clear career path and professional development program for AI practitioners.',
      'There is a culture of continuous learning, curiosity, and experimentation enterprise-wide.',
      'Business units have embedded AI and data expertise, rather than relying solely on a central team.',
      'We partner with universities, startups, or research institutions to access AI talent and ideas.',
    ],
  },
  {
    id: 5,
    name: 'AI Operations & Engineering Process',
    shortName: 'Operations',
    color: '#10B981',
    bgColor: '#ECFDF5',
    description: 'Examines the rigor and maturity of MLOps practices, deployment pipelines, monitoring, and engineering processes for AI systems.',
    questions: [
      'We use mature MLOps practices and tooling for end-to-end model development and deployment.',
      'AI models are version-controlled with fully reproducible training pipelines.',
      'We have automated testing (unit, integration, regression) specifically for AI systems.',
      'CI/CD pipelines are in place for automated, low-risk AI model deployment.',
      'We continuously monitor model performance, reliability, and quality in production.',
      'There is a defined, reliable, and tested process for model retraining and updates.',
      'AI experiments are systematically tracked and results are fully reproducible by any team member.',
      'We have defined and actively monitored SLAs for AI system performance, availability, and latency.',
      'Model documentation (model cards, data sheets) is standardized and consistently maintained.',
      'We have infrastructure and processes for A/B testing and shadow deployment of AI models.',
      'AI development best practices and standards are documented and consistently followed.',
      'We have robust processes for detecting, responding to, and recovering from model degradation.',
      'Tooling and workflows effectively support collaboration between data scientists and engineers.',
      'We measure and actively optimize AI system efficiency, resource utilization, and cost.',
      'We conduct structured post-deployment reviews to systematically capture AI system learnings.',
    ],
  },
]

export const scaleLabels = {
  1: 'Not at all / No capability',
  2: 'Early / Ad-hoc',
  3: 'Developing / Inconsistent',
  4: 'Established / Mostly consistent',
  5: 'Advanced / Fully optimized',
}

export const maturityLevels = [
  { label: 'Beginning',   min: 0,  max: 20,  color: '#EF4444', bg: '#FEF2F2' },
  { label: 'Developing',  min: 20, max: 40,  color: '#F97316', bg: '#FFF7ED' },
  { label: 'Maturing',    min: 40, max: 60,  color: '#EAB308', bg: '#FEFCE8' },
  { label: 'Advanced',    min: 60, max: 80,  color: '#3B82F6', bg: '#EFF6FF' },
  { label: 'Leading',     min: 80, max: 101, color: '#10B981', bg: '#ECFDF5' },
]

export function getMaturityLevel(score) {
  return maturityLevels.find(l => score >= l.min && score < l.max) || maturityLevels[0]
}

export function computeScore(answers, numQuestions) {
  const keys = Object.keys(answers)
  if (keys.length === 0) return 0
  const sum = keys.reduce((acc, k) => acc + answers[k], 0)
  // Normalize: all 1s → 0%, all 5s → 100%
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

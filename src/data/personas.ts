import type {
  CareerGpsResult,
  ChatMessage,
  EmployeeTwin,
  PersonaId,
} from "@/types/sakha";

export const personas: EmployeeTwin[] = [
  {
    id: "priya",
    name: "Priya",
    fullName: "Priya Sharma",
    employeeId: "EMP-51626927",
    role: "Delivery Manager",
    level: "E4",
    education: "B.Tech — Information Technology",
    band: 4,
    stage: "10 yrs as Delivery Manager · 18 yrs total",
    stageColor: "blue",
    manager: "Vikram",
    location: "Chennai",
    yearsExp: 18,
    daysAtCompany: 6205,
    skills: ["Delivery leadership", "Client governance", "Commercial planning", "Portfolio oversight", "Stakeholder management"],
    certifications: ["HCLTech Agile Practitioner", "PMP", "Azure AI Fundamentals (AI-900)"],
    projects: ["Java / Full Stack delivery portfolio", "AI transformation readiness"],
    currentProject: "3-account delivery portfolio with shifting AI customer demand",
    careerGoal: "AI Delivery Manager",
    dreyfus: "Competent",
    mission: {
      title: "AI Delivery Manager",
      deadline: "Dec 2026",
      successProbability: 84,
      targetReadiness: 89,
    },
    tracks: [
      { name: "AI Delivery", focus: "AI delivery frameworks, governance, operating model", progress: 38, primary: true },
      { name: "Commercial", focus: "Outcome-based pricing, margin, and value realization", progress: 52 },
      { name: "Talent", focus: "AI team design, hiring, and capability planning", progress: 41 },
    ],
    careerHealth: {
      score: 79,
      growthVelocity: "Good",
      marketRelevance: "Excellent",
      promotionReadiness: "Moderate",
    },
    kpps: [
      { name: "Customer Satisfaction (CSAT)", category: "Customer", weight: 10, target: "80", achievement: "78", score: 7, signal: "Slightly below — delivery quality gap in newer tech areas", status: "behind" },
      { name: "Gross Margin", category: "Financial", weight: 15, target: "2.8M", achievement: "2.4M", score: 7, signal: "−400K miss — commercial structuring gap", status: "behind" },
      { name: "Revenue", category: "Financial", weight: 25, target: "5.2M", achievement: "5.8M", score: 9, signal: "+600K overperformance — proven revenue driver", status: "ahead" },
      { name: "DEI — Gender Diversity", category: "Operations", weight: 5, target: "30%", achievement: "22%", score: 6, signal: "Below target — limited diverse talent model experience", status: "behind" },
      { name: "Economic Utilisation — Offshore", category: "Operations", weight: 5, target: "88%", achievement: "84%", score: 7, signal: "Cluster-level gap", status: "ontrack" },
      { name: "Economic Utilisation — Onsite", category: "Operations", weight: 5, target: "92%", achievement: "90%", score: 8, signal: "Near target", status: "ontrack" },
      { name: "Fresher / NV Adoption", category: "Operations", weight: 10, target: "25%", achievement: "18%", score: 6, signal: "Below — limited new talent model experience", status: "behind" },
      { name: "Internal Fulfilment", category: "Operations", weight: 15, target: "85%", achievement: "80%", score: 7, signal: "Manageable gap", status: "ontrack" },
      { name: "ARC Reduction", category: "Operations", weight: 10, target: "3600", achievement: "3750", score: 7, signal: "At cluster level", status: "ontrack" },
    ],
    overallRating: "Consistently Meets Expectations",
    promotion: {
      overall: 52,
      target: 75,
      targetWindowDays: 90,
      dimensions: [
        { label: "Revenue performance", current: 112, status: "exceeds" },
        { label: "Margin performance", current: 86, status: "development" },
        { label: "DEI score", current: 73, status: "development" },
        { label: "AI delivery experience", current: 0, status: "critical" },
        { label: "Learning completion", current: 40, status: "ontrack" },
      ],
    },
    selfAssessment: [
      {
        heading: "Revenue delivery",
        body: "Delivered 5.8M against a 5.2M target, a 12% overperformance. Primary growth drivers were stable account expansion and proactive client engagement — a strong indicator of the account-management capability that AI transformation programmes require.",
      },
      {
        heading: "Margin — development area",
        body: "Achieved 2.4M against a 2.8M margin target. Gap attributed to rate stagnation and limited commercial restructuring. Enrolled in the HCLTech Commercial Excellence Programme to close this ahead of AI delivery engagements, where outcome-based pricing is standard.",
      },
      {
        heading: "DEI commitment",
        body: "Achieved 22% gender diversity against a 30% target. Identified a specific gap in diverse hiring at senior technical roles. Enrolled in the DEI in AI Teams module and partnering with HR to revise the FY26 hiring pipeline.",
      },
      {
        heading: "FY26 priorities",
        body: "Transition into AI Delivery Management via the 90-day Career GPS plan. Shadow AI Studio as Associate Delivery Lead from Q1. Target: own an AI transformation account by Q3 FY26.",
      },
    ],
    managerFeedback: {
      from: "Vikram Nair",
      date: "FY25 review",
      sentiment: "constructive",
      summary:
        "Priya is one of my most dependable delivery managers — revenue growth is consistently strong and clients trust her. To move into AI delivery she needs hands-on AI programme exposure and tighter commercial structuring; the willingness and aptitude are clearly there.",
      strengths: ["Revenue growth and account expansion", "Client trust and stakeholder management", "Steady, reliable delivery"],
      developmentAreas: ["No AI/GenAI delivery experience yet", "Margin and commercial structuring", "Diverse and fresher talent hiring"],
    },
    learning: {
      currentCourse: "AI Delivery Management Foundations",
      completion: 28,
      hoursPerWeek: 5,
    },
    leaveBalance: { casual: 8, sick: 4, earned: 12, optional: 3 },
    wellbeing: {
      pulseScore: 4,
      consecutiveLateNights: 2,
      trend: "stable",
      lastCheckin: "2026-06-10",
    },
    lastKudos: "Client appreciation from FinCorp",
  },
  {
    id: "arjun",
    name: "Arjun",
    fullName: "Arjun Mehta",
    employeeId: "EMP-78234501",
    role: "Graduate Trainee — AI Engineering track",
    level: "E1",
    band: 2,
    stage: "Day 8 · Onboarding",
    stageColor: "green",
    manager: "Vikram",
    location: "Noida",
    yearsExp: 0,
    daysAtCompany: 8,
    skills: ["Python", "HTML", "CSS", "Git"],
    certifications: ["Campus Java Foundations"],
    projects: ["Graduate onboarding cohort"],
    currentProject: null,
    careerGoal: "Full Stack Developer",
    kpps: [
      { name: "Onboarding Completion", category: "Learning", weight: 20, target: "100%", achievement: "92%", score: 9, signal: "Fastest in the June cohort", status: "ahead" },
      { name: "Foundation Training", category: "Learning", weight: 20, target: "100%", achievement: "60%", score: 7, signal: "Java + Git done; React and Node pending", status: "ontrack" },
      { name: "First Commit Velocity", category: "Operations", weight: 15, target: "by Day 10", achievement: "Day 4", score: 9, signal: "Shipped first commit early", status: "ahead" },
      { name: "Code Review Pass Rate", category: "Operations", weight: 15, target: "80%", achievement: "78%", score: 7, signal: "Solid; minor rework on early PRs", status: "ontrack" },
      { name: "Buddy & Team Engagement", category: "Learning", weight: 15, target: "100%", achievement: "100%", score: 9, signal: "Highly engaged, asks sharp questions", status: "ahead" },
      { name: "Goal Clarity", category: "Learning", weight: 15, target: "mapped", achievement: "in progress", score: 6, signal: "Full Stack goal set; path not yet mapped", status: "ontrack" },
    ],
    overallRating: "On track · pre-appraisal (early tenure)",
    promotion: {
      overall: 45,
      target: 70,
      targetWindowDays: 120,
      dimensions: [
        { label: "Team integration", current: 100, status: "exceeds" },
        { label: "Foundation training", current: 60, status: "ontrack" },
        { label: "Hands-on delivery", current: 40, status: "development" },
        { label: "Backend / React depth", current: 20, status: "development" },
      ],
    },
    managerFeedback: {
      from: "Vikram Nair",
      date: "Day-8 check-in",
      sentiment: "positive",
      summary:
        "Arjun has made the strongest start in the June cohort — fastest to first commit, genuinely curious, great team fit. Now it's about converting that energy into full-stack depth: JavaScript and React, then a backend, and one feature shipped end to end.",
      strengths: ["Fast ramp — first commit on Day 4", "Strong curiosity and team fit", "Solid Python and Git foundation"],
      developmentAreas: ["JavaScript / TypeScript and React depth", "Backend (Node / REST) fundamentals", "Ship one full-stack feature end to end"],
    },
    selfAssessment: [
      {
        heading: "Early momentum",
        body: "Completed onboarding ahead of the cohort and shipped my first commit on Day 4. Comfortable with Python and Git, and getting up to speed on the team's review process.",
      },
      {
        heading: "Development focus",
        body: "My goal is to become a Full Stack Developer. Priority is JavaScript/TypeScript and React depth, then Node and REST APIs, so I can own a feature end to end.",
      },
    ],
    leaveBalance: { casual: 12, sick: 6, earned: 0, optional: 3 },
    wellbeing: {
      pulseScore: 3,
      consecutiveLateNights: 0,
      trend: "stable",
      lastCheckin: null,
    },
    lastKudos: "Fastest laptop-to-first-commit in the June cohort",
  },
  {
    id: "rajan",
    name: "Rajan",
    fullName: "Rajan Krishnan",
    employeeId: "EMP-34891203",
    role: "Senior QA Engineer",
    level: "E3",
    band: 5,
    stage: "Year 4 · Delivery plateau",
    stageColor: "orange",
    manager: "Vikram",
    location: "Bengaluru",
    yearsExp: 8,
    daysAtCompany: 1536,
    skills: ["Manual Testing", "Selenium", "API Testing", "Jira"],
    certifications: ["ISTQB Foundation"],
    projects: ["Retail Modernisation", "Claims QA"],
    currentProject: "Claims QA",
    careerGoal: "Automation Architect",
    kpps: [
      { name: "Defect Leakage", category: "Customer", weight: 15, target: "<2%", achievement: "1.4%", score: 9, signal: "Strong quality outcomes — core strength", status: "ahead" },
      { name: "Test Automation Coverage", category: "Operations", weight: 15, target: "70%", achievement: "52%", score: 6, signal: "Below — still manual-heavy; automation depth is the key gap for Architect", status: "behind" },
      { name: "Release Predictability", category: "Operations", weight: 10, target: "95%", achievement: "97%", score: 9, signal: "Reliable sign-off under pressure", status: "ahead" },
      { name: "Economic Utilisation", category: "Operations", weight: 10, target: "85%", achievement: "92%", score: 7, signal: "92% vs 85% — chronic over-allocation feeding the 8 late nights", status: "behind" },
      { name: "Automation Contributions", category: "Operations", weight: 10, target: "4", achievement: "2", score: 6, signal: "Below — limited framework / tooling output", status: "behind" },
      { name: "Mentoring", category: "Operations", weight: 10, target: "3", achievement: "1", score: 6, signal: "Few mentees — leadership signal needed for the Architect track", status: "behind" },
      { name: "Customer Satisfaction (CSAT)", category: "Customer", weight: 10, target: "80", achievement: "84", score: 9, signal: "Clients value his rigor", status: "ahead" },
      { name: "Skill Currency", category: "Operations", weight: 10, target: "2 certs", achievement: "1 cert", score: 6, signal: "ISTQB on file; no automation certification yet", status: "behind" },
      { name: "Engagement (Pulse)", category: "Operations", weight: 10, target: "75", achievement: "48", score: 4, signal: "Engagement down 27% — flight-risk signal, retention priority", status: "behind" },
    ],
    overallRating: "Meets Expectations",
    promotion: {
      overall: 50,
      target: 75,
      targetWindowDays: 90,
      dimensions: [
        { label: "Quality delivery", current: 120, status: "exceeds" },
        { label: "Automation depth", current: 52, status: "development" },
        { label: "Technical leadership", current: 40, status: "development" },
        { label: "Innovation output", current: 50, status: "development" },
        { label: "Engagement / retention", current: 48, status: "critical" },
      ],
    },
    managerFeedback: {
      from: "Vikram Nair",
      date: "FY25 review",
      sentiment: "watch",
      summary:
        "Rajan is the most technically rigorous QA on the team and the safest pair of hands on a release — but he's plateaued and I'm worried about burnout. He has the depth to become an Automation Architect; he needs automation breadth, visible leadership, and honestly some load relief.",
      strengths: ["Deep QA rigor — lowest defect leakage on the team", "Reliable release sign-off under pressure", "Trusted by clients"],
      developmentAreas: ["Automation framework depth (still manual-heavy)", "Mentoring and technical leadership", "Workload and engagement — burnout risk"],
    },
    selfAssessment: [
      {
        heading: "Quality strength",
        body: "Held defect leakage at 1.4% against a sub-2% target and kept release predictability at 97%. Quality and reliability remain my strongest contribution.",
      },
      {
        heading: "Development area",
        body: "Automation coverage sits at 52% against a 70% target — I'm still doing too much manually. To move toward Automation Architect I need framework depth and a CI-integrated suite.",
      },
      {
        heading: "Workload",
        body: "Utilisation has run at 92% for two quarters and it's showing — the late nights aren't sustainable. I'd value rebalancing alongside the growth plan.",
      },
    ],
    leaveBalance: { casual: 3, sick: 8, earned: 24, optional: 1 },
    wellbeing: {
      pulseScore: 2,
      consecutiveLateNights: 8,
      trend: "watch",
      lastCheckin: "2026-05-30",
    },
    lastKudos: "Peer recognition for steadying the Aurora release",
  },
];

export const personaById = (id: PersonaId): EmployeeTwin =>
  personas.find((p) => p.id === id) ?? personas[0];

export const priyaCareerGps: CareerGpsResult = {
  matchPercentage: 38,
  readinessDays: 90,
  successProbability: 84,
  sakhaMessage:
    "Priya, your 17 years of delivery and customer trust gives you a strong base. The fastest path is to translate that into AI delivery frameworks, commercial structuring, talent shaping, and technical fluency.",
  missingSkills: [
    {
      skill: "AI delivery frameworks",
      priority: 1,
      monthToAcquire: 1,
      recommendedCourse: "HCLTech AI Delivery Certification",
      estimatedHoursPerWeek: 4,
    },
    {
      skill: "Commercial structuring for AI engagements",
      priority: 2,
      monthToAcquire: 2,
      recommendedCourse: "AI ROI and Outcome Pricing",
      estimatedHoursPerWeek: 3,
    },
    {
      skill: "AI talent acquisition and management",
      priority: 3,
      monthToAcquire: 3,
      recommendedCourse: "AI Hiring Manager Certification",
      estimatedHoursPerWeek: 3,
    },
    {
      skill: "Technical fluency for AI delivery",
      priority: 4,
      monthToAcquire: 4,
      recommendedCourse: "Prompt Engineering and LLM Evaluation",
      estimatedHoursPerWeek: 3,
    },
  ],
  learningPath: [
    {
      month: 1,
      skill: "AI delivery foundations",
      milestone: "Complete AI delivery basics and commercial structuring modules tied to current customer demand.",
    },
    {
      month: 2,
      skill: "Core learning",
      milestone: "Finish AI project management and outcome-based pricing coursework for real client situations.",
    },
    {
      month: 3,
      skill: "Apply and practice",
      milestone: "Shadow an AI studio delivery lead and sponsor one customer-facing AI adoption session.",
    },
  ],
  openRoles: [
    { title: "Associate AI Delivery Manager", team: "AI Studio Pilot", match: 89 },
    { title: "GenAI Centre of Excellence Delivery Lead", team: "Enterprise AI Studio", match: 72 },
    { title: "AI Transformation Co-Delivery Manager", team: "Truist AI Transformation", match: 65 },
  ],
  nextAction:
    "Enroll Priya in AI Delivery Management Foundations and block 5 hours per week for the 90-day plan.",
};

export const chatMessages: ChatMessage[] = [
  {
    id: "m1",
    role: "sakha",
    text: "Good morning Priya. Your delivery portfolio is ready, your AI-900 credential is recorded, and I noticed your AI Delivery Manager goal from the last check-in.",
    time: "09:02",
    quickReplies: ["How do I move into AI Delivery Management?", "How many leaves do I have?"],
  },
];

export const managerSignals = [
  { label: "Team health", value: "84%", detail: "5 point dip over 14 days" },
  { label: "Priya", value: "On track", detail: "Day 92 · AI path created" },
  { label: "Rajan", value: "Watch", detail: "Engagement down 27%" },
  { label: "Certifications", value: "4", detail: "Completed this month" },
];

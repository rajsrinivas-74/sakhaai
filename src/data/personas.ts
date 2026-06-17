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
    role: "Java Full Stack Developer",
    band: 4,
    stage: "Day 92 · Project Helix",
    stageColor: "blue",
    manager: "Vikram",
    location: "Chennai",
    yearsExp: 3,
    daysAtCompany: 92,
    skills: ["Java", "Spring Boot", "SQL", "React", "Azure Fundamentals"],
    certifications: ["Azure AZ-900", "HCLTech Agile Practitioner"],
    projects: ["Project Atlas", "Project Helix"],
    currentProject: "Project Helix",
    careerGoal: "AI Engineer",
    dreyfus: "Competent",
    mission: {
      title: "AI Engineer",
      deadline: "Dec 2026",
      successProbability: 89,
      targetReadiness: 90,
    },
    tracks: [
      { name: "AI", focus: "Python · applied ML · LLM app patterns", progress: 34, primary: true },
      { name: "Java Full Stack", focus: "Carry forward — Spring Boot, React depth", progress: 78 },
      { name: "DevOps", focus: "CI/CD, containers, cloud deploy for AI apps", progress: 22 },
    ],
    careerHealth: {
      score: 82,
      growthVelocity: "Good",
      marketRelevance: "Excellent",
      promotionReadiness: "Moderate",
    },
    learning: {
      currentCourse: "Python for Java Developers",
      completion: 34,
      hoursPerWeek: 4,
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
    role: "Graduate Engineer Trainee",
    band: 2,
    stage: "Day 8 · Onboarding",
    stageColor: "green",
    manager: "Sneha",
    location: "Noida",
    yearsExp: 0,
    daysAtCompany: 8,
    skills: ["Python", "HTML", "CSS", "Git"],
    certifications: ["Campus Java Foundations"],
    projects: ["Graduate onboarding cohort"],
    currentProject: null,
    careerGoal: "Full Stack Developer",
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
  matchPercentage: 42,
  readinessDays: 86,
  successProbability: 88,
  sakhaMessage:
    "Priya, your Java and cloud foundation gives you a strong base. The fastest path is Python, applied ML, LLM app patterns, and evaluation discipline.",
  missingSkills: [
    {
      skill: "Python for AI engineering",
      priority: 1,
      monthToAcquire: 1,
      recommendedCourse: "Python for Java Developers",
      estimatedHoursPerWeek: 5,
    },
    {
      skill: "Machine learning foundations",
      priority: 2,
      monthToAcquire: 2,
      recommendedCourse: "Applied ML Foundations",
      estimatedHoursPerWeek: 4,
    },
    {
      skill: "LLM application patterns",
      priority: 3,
      monthToAcquire: 2,
      recommendedCourse: "Building Agentic AI Apps",
      estimatedHoursPerWeek: 4,
    },
    {
      skill: "Evaluation and guardrails",
      priority: 4,
      monthToAcquire: 3,
      recommendedCourse: "AI Quality and Evaluation",
      estimatedHoursPerWeek: 3,
    },
  ],
  learningPath: [
    {
      month: 1,
      skill: "Python + data handling",
      milestone:
        "Build two data transformation notebooks and one API-backed mini app.",
    },
    {
      month: 2,
      skill: "ML + LLM patterns",
      milestone:
        "Ship a small role-matching prototype with structured outputs.",
    },
    {
      month: 3,
      skill: "Evaluation + production readiness",
      milestone: "Add test cases, fallback handling, and human approval points.",
    },
  ],
  openRoles: [
    { title: "Associate AI Engineer", team: "Enterprise AI Studio", match: 82 },
    { title: "GenAI Application Developer", team: "Digital Foundation", match: 76 },
    { title: "AI Platform Engineer", team: "Cloud Native Labs", match: 71 },
  ],
  nextAction:
    "Enroll Priya in Python for Java Developers and block 2 hours every Tuesday.",
};

export const chatMessages: ChatMessage[] = [
  {
    id: "m1",
    role: "sakha",
    text: "Good morning Priya. Project Helix access is ready, your Azure certification is recorded, and I noticed your AI Engineer goal from the last check-in.",
    time: "09:02",
    quickReplies: ["How do I become an AI Engineer?", "How many leaves do I have?"],
  },
];

export const managerSignals = [
  { label: "Team health", value: "84%", detail: "5 point dip over 14 days" },
  { label: "Priya", value: "On track", detail: "Day 92 · AI path created" },
  { label: "Rajan", value: "Watch", detail: "Engagement down 27%" },
  { label: "Certifications", value: "4", detail: "Completed this month" },
];

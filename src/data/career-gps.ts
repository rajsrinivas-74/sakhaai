import type { CareerGpsResult, PersonaId } from "@/types/sakha";
import { priyaCareerGps } from "@/data/personas";

/**
 * Goal-specific fallbacks, keyed by normalised goal text. These let an
 * off-script goal (one that isn't a persona's default) still render a
 * pixel-perfect, role-accurate result with NO API key — so the demo can
 * showcase any headline goal reliably.
 */
export const goalFallback: Record<string, CareerGpsResult> = {
  "ai governance consultant": {
    matchPercentage: 72,
    readinessDays: 90,
    successProbability: 88,
    sakhaMessage:
      "Your experience in delivery, governance, and audit controls puts you closer than you think — the fastest path runs through the EU AI Act, a governance certification, and one hands-on project.",
    missingSkills: [
      {
        skill: "EU AI Act & global AI regulation",
        priority: 1,
        monthToAcquire: 1,
        recommendedCourse: "EU AI Act Practitioner",
        estimatedHoursPerWeek: 4,
      },
      {
        skill: "AI risk & assurance frameworks",
        priority: 2,
        monthToAcquire: 1,
        recommendedCourse: "NIST AI RMF Essentials",
        estimatedHoursPerWeek: 3,
      },
      {
        skill: "Model governance & evaluation",
        priority: 3,
        monthToAcquire: 2,
        recommendedCourse: "Responsible AI Evaluation",
        estimatedHoursPerWeek: 3,
      },
      {
        skill: "Policy & stakeholder communication",
        priority: 4,
        monthToAcquire: 3,
        recommendedCourse: "Governance Influence & Reporting",
        estimatedHoursPerWeek: 2,
      },
    ],
    learningPath: [
      {
        month: 1,
        skill: "AI regulation foundations",
        milestone: "Complete EU AI Act and NIST AI RMF essentials.",
      },
      {
        month: 2,
        skill: "Governance frameworks",
        milestone: "Run a model risk assessment on a live use case.",
      },
      {
        month: 3,
        skill: "Applied governance",
        milestone: "Join an AI Governance project and present a controls review.",
      },
    ],
    openRoles: [
      { title: "AI Governance Consultant", team: "Responsible AI Office", match: 84 },
      { title: "AI Risk & Assurance Lead", team: "Enterprise AI Studio", match: 78 },
      { title: "Responsible AI Specialist", team: "Trust & Safety", match: 73 },
    ],
    nextAction:
      "Enrol you in the EU AI Act Practitioner track and block 2 hours every Tuesday for governance study.",
  },
};

const normalizeGoal = (goal: string) => goal.trim().toLowerCase();

/** Best deterministic result for a (persona, goal) pair: goal-specific first, then persona default. */
export function resolveFallback(persona: PersonaId, goal: string): CareerGpsResult {
  return goalFallback[normalizeGoal(goal)] ?? careerGpsFallback[persona];
}

/**
 * Deterministic Career GPS fallbacks per persona. Used whenever the OpenAI
 * call is unavailable or fails, so the demo never blocks on the network.
 */
export const careerGpsFallback: Record<PersonaId, CareerGpsResult> = {
  priya: priyaCareerGps,
  arjun: {
    matchPercentage: 31,
    readinessDays: 120,
    successProbability: 79,
    sakhaMessage:
      "Arjun, you have momentum from week one. Build depth in JavaScript, then a backend framework, then ship one full-stack feature end to end.",
    missingSkills: [
      {
        skill: "Modern JavaScript + TypeScript",
        priority: 1,
        monthToAcquire: 1,
        recommendedCourse: "JavaScript to TypeScript Fast Track",
        estimatedHoursPerWeek: 5,
      },
      {
        skill: "React fundamentals",
        priority: 2,
        monthToAcquire: 2,
        recommendedCourse: "React Essentials",
        estimatedHoursPerWeek: 4,
      },
      {
        skill: "Node + REST APIs",
        priority: 3,
        monthToAcquire: 3,
        recommendedCourse: "Backend APIs with Node",
        estimatedHoursPerWeek: 4,
      },
      {
        skill: "Databases + deployment",
        priority: 4,
        monthToAcquire: 4,
        recommendedCourse: "Full Stack Delivery Basics",
        estimatedHoursPerWeek: 3,
      },
    ],
    learningPath: [
      {
        month: 1,
        skill: "JavaScript + TypeScript",
        milestone: "Rebuild your onboarding to-do app with typed components.",
      },
      {
        month: 2,
        skill: "React",
        milestone: "Ship a small dashboard with reusable components.",
      },
      {
        month: 3,
        skill: "Node + APIs",
        milestone: "Add a REST backend with auth to your dashboard.",
      },
    ],
    openRoles: [
      { title: "Junior Full Stack Developer", team: "Digital Foundation", match: 64 },
      { title: "Frontend Engineer", team: "Experience Studio", match: 58 },
    ],
    nextAction:
      "Enroll Arjun in JavaScript to TypeScript Fast Track and pair him with a buddy reviewer.",
  },
  rajan: {
    matchPercentage: 58,
    readinessDays: 75,
    successProbability: 91,
    sakhaMessage:
      "Rajan, your QA depth is a real advantage. Convert that into automation architecture: framework design, CI integration, and quality strategy.",
    missingSkills: [
      {
        skill: "Test automation frameworks",
        priority: 1,
        monthToAcquire: 1,
        recommendedCourse: "Designing Scalable Test Frameworks",
        estimatedHoursPerWeek: 4,
      },
      {
        skill: "CI/CD pipelines",
        priority: 2,
        monthToAcquire: 2,
        recommendedCourse: "CI/CD for Quality Engineers",
        estimatedHoursPerWeek: 4,
      },
      {
        skill: "Performance + API automation",
        priority: 3,
        monthToAcquire: 2,
        recommendedCourse: "Performance Testing at Scale",
        estimatedHoursPerWeek: 3,
      },
      {
        skill: "Quality strategy + leadership",
        priority: 4,
        monthToAcquire: 3,
        recommendedCourse: "Quality Architecture & Influence",
        estimatedHoursPerWeek: 2,
      },
    ],
    learningPath: [
      {
        month: 1,
        skill: "Framework design",
        milestone: "Refactor Claims QA suite into a reusable automation framework.",
      },
      {
        month: 2,
        skill: "CI integration",
        milestone: "Wire the suite into the delivery pipeline with gated checks.",
      },
      {
        month: 3,
        skill: "Strategy + mentoring",
        milestone: "Publish a quality strategy and mentor two QA engineers.",
      },
    ],
    openRoles: [
      { title: "Automation Architect", team: "Quality Engineering CoE", match: 79 },
      { title: "SDET Lead", team: "Retail Modernisation", match: 72 },
    ],
    nextAction:
      "Enroll Rajan in Designing Scalable Test Frameworks and surface the Automation Architect role to Vikram.",
  },
};

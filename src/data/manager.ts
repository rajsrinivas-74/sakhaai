import type { Accent } from "@/lib/accents";

export type AttritionRisk = {
  name: string;
  initial: string;
  role: string;
  riskLevel: "high" | "medium" | "low";
  tag?: string;
  signal: string;
  daysAtRisk: number;
  actionLabel: string;
  draftTitle: string;
  draft: string;
};

export type OnboardingTracker = {
  name: string;
  initial: string;
  day: number;
  status: "on_track" | "watch" | "blocked";
  lastIssue: string;
  nextMilestone: string;
};

export type CertType = "cloud" | "management" | "devops" | "agile";

export type Certification = {
  name: string;
  initial: string;
  cert: string;
  type: CertType;
  date: string;
};

export type Recommendation = {
  text: string;
  rationale: string;
  verb: "Draft" | "Notify" | "Write";
  draftTitle: string;
  draft: string;
  accent: Accent;
};

export const CERT_ACCENT: Record<CertType, Accent> = {
  cloud: "blue",
  management: "purple",
  devops: "cyan",
  agile: "orange",
};

export type ReadinessStatus = "ready" | "ready-soon" | "gap" | "risk";

export type ReadinessMember = {
  name: string;
  initial: string;
  status: ReadinessStatus;
  note: string;
};

export const READINESS_STATUS: Record<ReadinessStatus, { label: string; accent: Accent }> = {
  ready: { label: "Ready", accent: "cyan" },
  "ready-soon": { label: "Ready soon", accent: "blue" },
  gap: { label: "Skill gap", accent: "orange" },
  risk: { label: "Burnout risk", accent: "pink" },
};

export const managerData = {
  manager: "Vikram Nair",
  managerTitle: "Senior Delivery Director",
  managerLevel: "E5",
  weekEnding: "June 20, 2026",
  teamHealthScore: 84,
  teamHealthTrend: [89, 91, 88, 86, 84],
  teamSize: 18,

  healthBreakdown: { engaged: 13, atRisk: 4, onLeave: 1 },

  // The project Vikram is staffing toward, with member-level readiness (RAG).
  readinessProject: "AI Transformation Project",
  projectReadiness: 82,
  readinessTeam: [
    { name: "Priya Sharma", initial: "P", status: "ready-soon", note: "AI delivery path · 89% ready" },
    { name: "Arjun Mehta", initial: "A", status: "ready", note: "Full-stack, AI-curious" },
    { name: "Rajan Krishnan", initial: "R", status: "risk", note: "Burnout · 8 late nights" },
    { name: "Meera Kumar", initial: "M", status: "gap", note: "Needs GenAI fundamentals" },
  ] as ReadinessMember[],

  // Future supply, not current allocation.
  talentPipeline: { readyToday: 4, ready30: 6, ready90: 8 },

  // The one person Sakha says to focus on this week.
  spotlight: {
    name: "Priya Sharma",
    initial: "P",
    role: "Delivery Manager",
    goal: "AI Delivery Manager",
    readiness: 89,
    promotionReadiness: 52,
    promotionTarget: 75,
    suggestedAction: "Assign to AI Studio Pilot",
  },

  attritionSuggestion:
    "Schedule Rajan's 1:1 before Thursday. Meera may benefit from a casual coffee chat. Both have been high performers — early intervention matters.",

  metricTrends: {
    health: [89, 91, 88, 86, 84],
    attrition: [1, 1, 2, 2, 2],
    onboarding: [2, 2, 1, 1, 1],
    certs: [0, 1, 2, 3, 4],
  },

  attritionRisks: [
    {
      name: "Rajan Krishnan",
      initial: "RK",
      role: "Senior QA Engineer",
      riskLevel: "high",
      tag: "Burnout signal",
      signal: "Engagement down 27% over 60 days · 8 late nights this week",
      daysAtRisk: 14,
      actionLabel: "1:1 draft",
      draftTitle: "1:1 invite — Rajan",
      draft:
        "Hi Rajan, do you have 30 minutes this week? I'd love to hear how Claims QA is going and talk through the Automation Architect path we mapped together. Pick any slot that works for you. — Vikram",
    },
    {
      name: "Meera Kumar",
      initial: "MK",
      role: "Software Engineer",
      riskLevel: "medium",
      signal: "3 pulse check-ins skipped · LMS activity dropped 40%",
      daysAtRisk: 7,
      actionLabel: "Outreach",
      draftTitle: "Coffee chat — Meera",
      draft:
        "Hi Meera, fancy a coffee this week? No agenda — I'd just like to catch up and hear how things are going. — Vikram",
    },
  ] as AttritionRisk[],

  onboarding: [
    {
      name: "Arjun Mehta",
      initial: "A",
      day: 8,
      status: "on_track",
      lastIssue: "VPN — resolved Day 1",
      nextMilestone: "Day 30 check-in",
    },
  ] as OnboardingTracker[],

  certifications: [
    { name: "Priya Sharma", initial: "P", cert: "Azure AI Fundamentals (AI-900)", type: "cloud", date: "Jun 15" },
    { name: "Dev Rao", initial: "D", cert: "PMP", type: "management", date: "Jun 12" },
    { name: "Anita Menon", initial: "A", cert: "Kubernetes CKA", type: "devops", date: "Jun 10" },
    { name: "Kiran Bose", initial: "K", cert: "Scrum Master", type: "agile", date: "Jun 8" },
  ] as Certification[],

  recommendations: [
    {
      text: "Schedule Rajan's 1:1 before Friday",
      rationale: "Risk window is 14 days and closing — earlier is better.",
      verb: "Draft",
      draftTitle: "1:1 invite — Rajan",
      draft:
        "Hi Rajan, do you have 30 minutes this week? I'd love to hear how Claims QA is going and talk through the Automation Architect path. Any slot works. — Vikram",
      accent: "pink",
    },
    {
      text: "Notify 2 members eligible for the GenAI gig",
      rationale: "Innovation Lab stretch assignment — no approval needed.",
      verb: "Notify",
      draftTitle: "GenAI gig — team notify",
      draft:
        "Hi team — a 3-month GenAI gig just opened in the Innovation Lab and your skills are a strong match. It's a stretch assignment, so no manager approval needed. Interested? — via Sakha",
      accent: "purple",
    },
    {
      text: "Celebrate 4 certifications this month",
      rationale: "Recognition lifts team health — momentum worth naming.",
      verb: "Write",
      draftTitle: "Kudos — certifications",
      draft:
        "Team — what a week: 4 certifications cleared (AWS, PMP, CKA, Scrum Master). Genuinely proud of the growth on show here. 🎉 — Vikram",
      accent: "orange",
    },
  ] as Recommendation[],
};

import type { HrInsights, SkillDemand, WorkforceSignal, HrAction } from "@/types/sakha";

/**
 * The shared workforce-level model — the HR (Anita) lens, and the single
 * source of truth the Manager and Employee lenses roll up into. One employee
 * event (e.g. Priya committing to her AI path) must read consistently here,
 * in the Manager Copilot, and in Priya's own Digital Twin.
 */

export const skillDemand: SkillDemand[] = [
  { family: "AI / GenAI Engineering", demand: 92, supply: 38, trend: "rising", inTransition: 24 },
  { family: "Cloud & Platform", demand: 74, supply: 61, trend: "steady", inTransition: 12 },
  { family: "Full Stack", demand: 68, supply: 64, trend: "steady", inTransition: 9 },
  { family: "Quality & Automation", demand: 55, supply: 47, trend: "rising", inTransition: 7 },
  { family: "Cybersecurity", demand: 71, supply: 44, trend: "rising", inTransition: 5 },
  { family: "Legacy / Manual QA", demand: 22, supply: 58, trend: "cooling", inTransition: 0 },
];

/** Workforce segments Sakha's Workforce Agent triages employees into. */
export const workforceSignals: WorkforceSignal[] = [
  {
    segment: "reskilling",
    label: "Reskilling candidates",
    count: 38,
    members: ["priya", "rajan"],
    note: "Strong base skills + expressed growth intent toward AI demand.",
  },
  {
    segment: "stagnant",
    label: "Stagnant > 3 yrs in role",
    count: 116,
    members: ["rajan"],
    note: "No role change or new cert in 36+ months — attrition precursor.",
  },
  {
    segment: "flight-risk",
    label: "Flight risk",
    count: 19,
    members: ["rajan"],
    note: "Engagement decline + market-hot skills. Retention window open.",
  },
  {
    segment: "rising",
    label: "Rising — fast learners",
    count: 27,
    members: ["priya", "arjun"],
    note: "Above-cohort learning velocity. Pull-forward for stretch roles.",
  },
];

export const hrActions: HrAction[] = [
  {
    id: "hr-priya-crosstrain",
    title: "Approve AI delivery cross-training for Priya Sharma",
    rationale:
      "38% → AI Delivery Manager match with a strong delivery and revenue base. Closes a critical-demand gap at internal-mobility cost, not hire cost.",
    about: "priya",
    impact: "reskilling",
    verb: "Approve",
    draftTitle: "Cross-training approval — Priya",
    draft:
      "Approving Priya Sharma (EMP-51626927) for the 90-day AI Delivery Manager reskilling track. Funding from the GenAI capability budget. Manager Vikram aligned. Target role: Associate AI Delivery Manager, AI Studio Pilot. — via Sakha",
    accent: "purple",
  },
  {
    id: "hr-priya-mobility",
    title: "Align Priya to the AI Studio Pilot pipeline",
    rationale:
      "Associate AI Delivery Manager is an 89% match and an open critical role. Pre-tagging her shortens the fill once she's ready.",
    about: "priya",
    impact: "mobility",
    verb: "Align",
    draftTitle: "Talent pipeline — Priya",
    draft:
      "Tagging Priya Sharma to the AI Studio Pilot talent pipeline for Associate AI Delivery Manager (ready in ~90 days). Notifying the studio's hiring lead to hold a slot. — via Sakha",
    accent: "blue",
  },
  {
    id: "hr-rajan-retention",
    title: "Prioritise retention intervention for Rajan Krishnan",
    rationale:
      "Flight risk + stagnant + market-hot QA-to-automation skills. Intervention is far cheaper than backfilling a Band 5.",
    about: "rajan",
    impact: "retention",
    verb: "Prioritise",
    draftTitle: "Retention plan — Rajan",
    draft:
      "Flagging Rajan Krishnan for priority retention: fund the Automation Architect path, align to Quality Engineering CoE, and have Vikram run a growth 1:1 this week. — via Sakha",
    accent: "pink",
  },
];

/** Role-level demand vs supply (headcounts) — the hero gap story. */
export const roleGaps = [
  { role: "AI Engineers", demand: 92, supply: 38 },
  { role: "AI Delivery Managers", demand: 12, supply: 3 },
  { role: "AI Consultants", demand: 56, supply: 21 },
  { role: "Data Engineers", demand: 41, supply: 35 },
];

/**
 * Reskilling economics for the AI Delivery Manager cohort — the build-vs-buy
 * case Anita approves. 23 delivery managers share Priya's profile (revenue
 * strong, commercial gap, no AI experience yet).
 */
export const reskillEconomics = {
  cohortSize: 23,
  supplyToday: 3,
  supplyAfter180: 19,
  reskillCostCr: 2.3,
  externalHireCostCr: 16.2,
  savingCr: 13.9,
  reskilledTimeToProductivityDays: 90,
  externalHireTimeToProductivityDays: 210,
};

/** Talent Sakha *discovered* (not who applied). */
export const talentDiscovery = [
  { name: "Priya Sharma", initial: "P", match: 89, reason: "Delivery + commercial base, AI delivery path underway" },
  { name: "Arjun Mehta", initial: "A", match: 84, reason: "Fast learner, AI-curious" },
  { name: "Sneha Iyer", initial: "S", match: 82, reason: "Strong fundamentals, mentors others" },
];

/** AI-ready headcount over the next quarter as reskilling lands. */
export const workforceForecast = [
  { label: "Today", value: 38 },
  { label: "30 days", value: 54 },
  { label: "60 days", value: 89 },
  { label: "90 days", value: 127 },
];

/** Retention as prediction, not a report. */
export const retentionIntel = {
  atRisk: 38,
  retainable: 24,
  lever: "Internal mobility",
};

/* ── Transformation scorecard ──────────────────────────────────────────────
 * The CPO's OKRs — each metric tracked against a target with a 5-point trend.
 * `better` is the direction of improvement, so progress-to-target colours right. */
export type ScorecardMetric = {
  label: string;
  value: number;
  target: number;
  unit: string;
  trend: number[];
  better: "up" | "down";
};

export const transformationScorecard: ScorecardMetric[] = [
  { label: "AI readiness", value: 38, target: 75, unit: "%", trend: [29, 31, 33, 35, 38], better: "up" },
  { label: "Internal fill rate", value: 46, target: 70, unit: "%", trend: [38, 40, 42, 44, 46], better: "up" },
  { label: "Time to fill", value: 64, target: 35, unit: "d", trend: [82, 78, 74, 69, 64], better: "down" },
  { label: "Reskill throughput", value: 23, target: 60, unit: "/qtr", trend: [8, 12, 15, 19, 23], better: "up" },
  { label: "Attrition risk", value: 11, target: 7, unit: "%", trend: [9, 10, 10, 11, 11], better: "down" },
];

/* ── Strategic program demand tracker ──────────────────────────────────────
 * Named transformation programs, each declaring its skill demand and tracked
 * to fulfilment: demand → committed supply → gap → agent fill plan → status. */
export type ProgramStatus = "on-track" | "at-risk" | "blocked";

export type TransformationProgram = {
  id: string;
  name: string;
  sponsor: string;
  skill: string;
  demand: number;
  supply: number;
  reskill: number;
  hire: number;
  deadline: string;
  status: ProgramStatus;
  note: string;
};

export const transformationPrograms: TransformationProgram[] = [
  {
    id: "ai-studio",
    name: "Enterprise AI Studio scale-up",
    sponsor: "CTO Office",
    skill: "AI Delivery + GenAI Eng",
    demand: 24,
    supply: 9,
    reskill: 12,
    hire: 3,
    deadline: "Q3 FY26",
    status: "at-risk",
    note: "Priya Sharma tagged to 1 of 15 open delivery seats.",
  },
  {
    id: "genai-coe",
    name: "GenAI Centre of Excellence",
    sponsor: "Chief AI Office",
    skill: "GenAI Engineering",
    demand: 18,
    supply: 7,
    reskill: 9,
    hire: 2,
    deadline: "Q4 FY26",
    status: "at-risk",
    note: "Reskill cohort forming; 9 candidates identified.",
  },
  {
    id: "cyber-uplift",
    name: "Cyber Uplift programme",
    sponsor: "CISO",
    skill: "Cybersecurity",
    demand: 15,
    supply: 6,
    reskill: 4,
    hire: 5,
    deadline: "Q3 FY26",
    status: "blocked",
    note: "External hiring slow; internal reskill pool is thin.",
  },
  {
    id: "cloud-modern",
    name: "Cloud & Platform modernization",
    sponsor: "Head of Platform",
    skill: "Cloud & Platform",
    demand: 14,
    supply: 11,
    reskill: 3,
    hire: 0,
    deadline: "Q2 FY26",
    status: "on-track",
    note: "Supply nearly covers demand; reskilling 3 from adjacent skills.",
  },
  {
    id: "legacy-winddown",
    name: "Legacy QA wind-down",
    sponsor: "Delivery Ops",
    skill: "Manual QA → Automation",
    demand: 0,
    supply: 20,
    reskill: 20,
    hire: 0,
    deadline: "Q2 FY26",
    status: "on-track",
    note: "Redeploying 20 from cooling Legacy QA into Automation.",
  },
];

/* ── Build-vs-buy portfolio ─────────────────────────────────────────────────
 * Reskill vs external-hire economics across every critical role gap, with a
 * portfolio total saving — the board-level ROI case. ₹ in crore. */
export type BuildVsBuyRole = {
  role: string;
  gap: number;
  reskillCr: number;
  hireCr: number;
  savingCr: number;
  reskillDays: number;
  hireDays: number;
};

export const buildVsBuy: BuildVsBuyRole[] = [
  { role: "AI Delivery Manager", gap: 9, reskillCr: 2.3, hireCr: 16.2, savingCr: 13.9, reskillDays: 90, hireDays: 210 },
  { role: "GenAI Engineer", gap: 11, reskillCr: 1.8, hireCr: 12.1, savingCr: 10.3, reskillDays: 120, hireDays: 180 },
  { role: "Security Engineer", gap: 9, reskillCr: 1.5, hireCr: 9.9, savingCr: 8.4, reskillDays: 120, hireDays: 160 },
  { role: "Cloud Engineer", gap: 3, reskillCr: 0.4, hireCr: 3.3, savingCr: 2.9, reskillDays: 90, hireDays: 150 },
];

export const buildVsBuyTotalSavingCr = buildVsBuy.reduce((s, r) => s + r.savingCr, 0);

/* ── Capability depth ───────────────────────────────────────────────────────
 * Supply numbers hide maturity. Depth = headcount at each proficiency level, so
 * a capability with few Experts reads as a depth risk even if total supply looks
 * healthy. `minExperts` is the floor the active programs need. */
export type CapabilityDepth = {
  capability: string;
  expert: number;
  proficient: number;
  competent: number;
  learning: number;
  minExperts: number;
};

export const capabilityDepth: CapabilityDepth[] = [
  { capability: "AI / GenAI Engineering", expert: 4, proficient: 9, competent: 25, learning: 38, minExperts: 12 },
  { capability: "Cloud & Platform", expert: 11, proficient: 22, competent: 28, learning: 14, minExperts: 10 },
  { capability: "Cybersecurity", expert: 5, proficient: 12, competent: 27, learning: 9, minExperts: 9 },
  { capability: "Quality & Automation", expert: 8, proficient: 18, competent: 21, learning: 7, minExperts: 6 },
  { capability: "AI Governance", expert: 1, proficient: 3, competent: 6, learning: 11, minExperts: 5 },
];

/* ── Alliance & certification pipeline ──────────────────────────────────────
 * Partner tiers require certified headcount for status, co-sell and margin
 * benefits. Tracks certified vs the next-tier threshold and the velocity to
 * close it. */
export type Alliance = {
  partner: string;
  tier: string;
  nextTier: string;
  certified: number;
  threshold: number;
  velocityPerQtr: number;
  benefit: string;
  accent: "blue" | "purple" | "cyan" | "orange";
};

export const alliances: Alliance[] = [
  { partner: "OpenAI", tier: "Build Partner", nextTier: "Solutions Partner", certified: 18, threshold: 30, velocityPerQtr: 6, benefit: "Co-sell + early model access", accent: "cyan" },
  { partner: "Microsoft", tier: "Solutions Partner", nextTier: "AI Specialization", certified: 42, threshold: 60, velocityPerQtr: 9, benefit: "Azure AI specialization badge", accent: "blue" },
  { partner: "AWS", tier: "Advanced Tier", nextTier: "Premier Tier", certified: 64, threshold: 100, velocityPerQtr: 11, benefit: "Premier margin & funding tier", accent: "orange" },
];

/* ── Emerging skills radar ──────────────────────────────────────────────────
 * Skills by maturity stage with momentum (YoY demand change) and current supply
 * — so capability can be pre-built before a skill hits the gap map. */
export type SkillStage = "emerging" | "growing" | "mature" | "declining";

export type EmergingSkill = {
  skill: string;
  stage: SkillStage;
  momentum: number;
  supply: number;
};

export const emergingSkills: EmergingSkill[] = [
  { skill: "Agentic AI & orchestration", stage: "emerging", momentum: 220, supply: 6 },
  { skill: "AI governance & EU AI Act", stage: "emerging", momentum: 180, supply: 4 },
  { skill: "Prompt & context engineering", stage: "growing", momentum: 140, supply: 19 },
  { skill: "LLM evaluation & guardrails", stage: "growing", momentum: 120, supply: 11 },
  { skill: "GenAI app development", stage: "mature", momentum: 60, supply: 38 },
  { skill: "Manual QA", stage: "declining", momentum: -35, supply: 58 },
];

/* ── Deal pipeline → capability demand ──────────────────────────────────────
 * Open deals create skill demand on win. Probability-weighting the headcount
 * turns the sales pipeline into a forward capability plan. */
export type Deal = {
  name: string;
  valueCr: number;
  probability: number;
  skill: string;
  headcount: number;
  needBy: string;
};

export const dealPipeline: Deal[] = [
  { name: "Truist — AI Transformation", valueCr: 48, probability: 70, skill: "GenAI + AI Delivery", headcount: 14, needBy: "Q3 FY26" },
  { name: "FinCorp — GenAI Modernization", valueCr: 32, probability: 55, skill: "GenAI Engineering", headcount: 9, needBy: "Q3 FY26" },
  { name: "RetailCo — Agentic Automation", valueCr: 21, probability: 40, skill: "Agentic AI + Automation", headcount: 7, needBy: "Q4 FY26" },
];

export const baseHrInsights: HrInsights = {
  hrPartner: "Anita Desai",
  hrPartnerTitle: "Chief People Officer",
  asOf: "Week of June 20, 2026",
  aiReadiness: 38,
  attritionRiskPct: 11,
  internalFillRate: 46,
  openCriticalRoles: 31,
  readinessTrend: [29, 31, 33, 35, 38],
  skillDemand,
  signals: workforceSignals,
  actions: hrActions,
  headline:
    "AI demand is outrunning supply 92 to 38. Your fastest lever is internal reskilling — 38 candidates are ready to move, led by Priya Sharma.",
};

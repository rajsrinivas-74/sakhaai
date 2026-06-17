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
    title: "Approve AI cross-training for Priya Sharma",
    rationale:
      "42% → AI Engineer match with a strong Java/cloud base. Closes a critical-demand gap at internal-mobility cost, not hire cost.",
    about: "priya",
    impact: "reskilling",
    verb: "Approve",
    draftTitle: "Cross-training approval — Priya",
    draft:
      "Approving Priya Sharma (EMP-51626927) for the 86-day AI Engineer reskilling track. Funding from the GenAI capability budget. Manager Vikram aligned. Target role: Associate AI Engineer, Enterprise AI Studio. — via Sakha",
    accent: "purple",
  },
  {
    id: "hr-priya-mobility",
    title: "Align Priya to the Enterprise AI Studio pipeline",
    rationale:
      "Associate AI Engineer is an 82% match and an open critical role. Pre-tagging her shortens the fill once she's ready.",
    about: "priya",
    impact: "mobility",
    verb: "Align",
    draftTitle: "Talent pipeline — Priya",
    draft:
      "Tagging Priya Sharma to the Enterprise AI Studio talent pipeline for Associate AI Engineer (ready in ~86 days). Notifying the studio's hiring lead to hold a slot. — via Sakha",
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
  { role: "AI Consultants", demand: 56, supply: 21 },
  { role: "Data Engineers", demand: 41, supply: 35 },
];

/** Talent Sakha *discovered* (not who applied). */
export const talentDiscovery = [
  { name: "Priya Sharma", initial: "P", match: 89, reason: "Java + cloud base, AI path underway" },
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

export const baseHrInsights: HrInsights = {
  hrPartner: "Anita Desai",
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

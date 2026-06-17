import type { AskAnswer } from "@/components/AskSakha";
import { talentDiscovery, retentionIntel } from "@/data/workforce";

/**
 * Deterministic "Ask Sakha" responders, shared by the dedicated Ask Sakha view.
 * Each persona reasons over its own data; demo-safe with no model required.
 */

export const managerSuggestions = [
  "Who can support the new AI project?",
  "Who is at flight risk?",
  "Who's ready for promotion?",
];

export function managerResponder(q: string): AskAnswer {
  const s = q.toLowerCase();
  if (/risk|attrition|flight|leav|resign/.test(s)) {
    return {
      text: "2 people are at elevated flight risk — Rajan highest (market-hot skills + burnout signals).",
      matches: [
        { label: "Rajan Krishnan", sub: "Burnout · −27% engagement", score: 73 },
        { label: "Meera Kumar", sub: "Skipped check-ins · LMS −40%", score: 41 },
      ],
      cta: "Open retention plans",
    };
  }
  if (/promot|ready|grow/.test(s)) {
    return {
      text: "3 team members are promotion-ready this cycle.",
      matches: [
        { label: "Priya Sharma", sub: "AI path on track", score: 88 },
        { label: "Arjun Mehta", sub: "Fast ramp from onboarding", score: 71 },
        { label: "Kiran Bose", sub: "Scrum leadership", score: 67 },
      ],
    };
  }
  return {
    text: "I found 5 candidates who can support the new AI project. Best matches:",
    matches: [
      { label: "Priya Sharma", sub: "Learning path complete · AI cert underway", score: 91 },
      { label: "Arjun Mehta", sub: "Full-stack + AI-curious", score: 84 },
      { label: "Kiran Bose", sub: "Cloud foundation", score: 76 },
    ],
    cta: "Notify candidates",
  };
}

export const hrSuggestions = [
  "How can I close the AI skills gap before Q3?",
  "Who is at flight risk?",
  "Reskill or hire externally?",
];

export function hrResponder(q: string): AskAnswer {
  const s = q.toLowerCase();
  if (/retention|attrition|flight|leav|resign/.test(s)) {
    return {
      text: `${retentionIntel.atRisk} employees are flight-risk; ${retentionIntel.retainable} are retainable via ${retentionIntel.lever.toLowerCase()}.`,
      matches: talentDiscovery.slice(0, 2).map((t) => ({ label: t.name, sub: "Reskill + mobility", score: t.match })),
      cta: "Build retention plans",
    };
  }
  if (/hire|external|cost|budget/.test(s)) {
    return {
      text: "Reskilling 127 internally costs ₹2.3 Cr vs ₹6.5 Cr to hire externally — ₹4.2 Cr saved, and faster.",
      cta: "Create the cohort",
    };
  }
  return {
    text: "I found 127 employees suitable for reskilling. Estimated cost ₹2.3 Cr · expected readiness 90 days.",
    matches: talentDiscovery.map((t) => ({ label: t.name, sub: t.reason, score: t.match })),
    cta: "Create the cohort",
  };
}

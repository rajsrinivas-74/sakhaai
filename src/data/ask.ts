import type { AskAnswer } from "@/components/AskSakha";
import {
  talentDiscovery,
  retentionIntel,
  skillDemand,
  workforceSignals,
  transformationPrograms,
  buildVsBuy,
  buildVsBuyTotalSavingCr,
  type ProgramStatus,
} from "@/data/workforce";
import { managerData } from "@/data/manager";

/**
 * Deterministic "Ask Sakha" responders — the fallback when the live model is
 * unavailable. These reason over the real workforce / team data so the answer
 * is specific and useful even with no OpenAI key, not a generic catch-all.
 */

export const managerSuggestions = [
  "Who can support the new AI project?",
  "Who is at flight risk?",
  "Who should I groom for a lead role?",
];

export function managerResponder(q: string): AskAnswer {
  const s = q.toLowerCase();

  if (/risk|attrition|flight|leav|resign|burnout/.test(s)) {
    return {
      text: "2 people are at elevated flight risk — Rajan highest (market-hot skills + burnout signals).",
      matches: managerData.attritionRisks.map((r) => ({
        label: r.name,
        sub: r.signal,
        score: r.riskLevel === "high" ? 73 : 41,
      })),
      cta: "Open retention plans",
    };
  }

  if (/promot|ready|grow|groom|lead|succession|next role/.test(s)) {
    const ready = managerData.readinessTeam.filter(
      (m) => m.status === "ready" || m.status === "ready-soon",
    );
    const sp = managerData.spotlight;
    const matches = [
      { label: sp.name, sub: `${sp.readiness}% ready for ${sp.goal}`, score: sp.readiness },
      ...ready
        .filter((m) => m.name !== sp.name)
        .map((m) => ({ label: m.name, sub: m.note, score: m.status === "ready" ? 80 : 72 })),
    ].slice(0, 4);
    return {
      text: `${ready.length} of your team are growth-ready this cycle. Strongest candidates to groom:`,
      matches,
      cta: "Draft growth plans",
    };
  }

  if (/skill|gap|upskill|train|capab|weak/.test(s)) {
    const gaps = managerData.readinessTeam.filter((m) => m.status === "gap" || m.status === "risk");
    return {
      text: `Readiness gaps on ${managerData.readinessProject} (team readiness ${managerData.projectReadiness}%):`,
      matches: gaps.map((m) => ({ label: m.name, sub: m.note, score: m.status === "gap" ? 55 : 40 })),
      cta: "Approve upskilling cohort",
    };
  }

  return {
    text: `I found ${managerData.talentPipeline.readyToday} people ready today who can support the new AI project. Best matches:`,
    matches: [
      { label: "Priya Sharma", sub: "Delivery base + AI delivery path underway", score: 91 },
      { label: "Arjun Mehta", sub: "Fast ramp from onboarding, AI-curious", score: 84 },
      { label: "Kiran Bose", sub: "Cloud foundation", score: 76 },
    ],
    cta: "Notify candidates",
  };
}

export const hrSuggestions = [
  "What skills should we plan for?",
  "Which programs are most at risk?",
  "Reskill or hire externally?",
];

const STATUS_RANK: Record<ProgramStatus, number> = { blocked: 0, "at-risk": 1, "on-track": 2 };

export function hrResponder(q: string): AskAnswer {
  const s = q.toLowerCase();

  // Build vs buy / cost — checked before "skills" so "reskill or hire" lands here.
  if (/reskill|\bhire|external|cost|budget|saving|build vs|build-vs|buy|cheaper|afford/.test(s)) {
    return {
      text: `Reskilling beats external hiring across every critical role — ₹${buildVsBuyTotalSavingCr.toFixed(
        1,
      )} Cr saved in total, and reskilled talent is productive far sooner. By role:`,
      matches: buildVsBuy.map((r) => ({
        label: r.role,
        sub: `reskill ₹${r.reskillCr}Cr vs hire ₹${r.hireCr}Cr · ${r.reskillDays}d vs ${r.hireDays}d`,
        score: Math.round((r.savingCr / r.hireCr) * 100),
      })),
      cta: "Open build-vs-buy portfolio",
    };
  }

  // Future / to-be-planned skills — reason over the demand/supply record.
  if (/skill|demand|plan|invest|future|capabilit|where.*gap|what.*gap/.test(s)) {
    const rising = [...skillDemand]
      .filter((d) => d.trend === "rising")
      .sort((a, b) => b.demand - b.supply - (a.demand - a.supply));
    const cooling = skillDemand.filter((d) => d.trend === "cooling");
    return {
      text: `Plan capacity around the rising-demand families where the gap is widest${
        cooling.length ? `, and wind down ${cooling.map((c) => c.family).join(", ")} (cooling, oversupplied)` : ""
      }. Biggest gaps to plan for:`,
      matches: rising.slice(0, 4).map((d) => ({
        label: d.family,
        sub: `demand ${d.demand} · supply ${d.supply} · ${d.trend}`,
        score: d.demand - d.supply,
      })),
      cta: "Open program demand tracker",
    };
  }

  // Programs at risk.
  if (/program|initiative|at risk|track|status|deliver|behind|blocked/.test(s)) {
    const ranked = [...transformationPrograms].sort((a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status]);
    const off = transformationPrograms.filter((p) => p.status !== "on-track").length;
    return {
      text: `${off} of ${transformationPrograms.length} transformation programs need attention. Most at risk:`,
      matches: ranked.slice(0, 4).map((p) => ({
        label: p.name,
        sub: `${p.status} · gap ${Math.max(0, p.demand - p.supply)} · ${p.deadline}`,
        score: Math.max(0, p.demand - p.supply),
      })),
      cta: "Approve fill plans",
    };
  }

  // Retention.
  if (/retention|attrition|flight|leav|resign/.test(s)) {
    return {
      text: `${retentionIntel.atRisk} employees are flight-risk; ${retentionIntel.retainable} are retainable via ${retentionIntel.lever.toLowerCase()}.`,
      matches: talentDiscovery.slice(0, 2).map((t) => ({ label: t.name, sub: "reskill + mobility", score: t.match })),
      cta: "Build retention plans",
    };
  }

  // Promotion-ready / mobility.
  if (/promot|ready|mobility|move|grow|surface|discover/.test(s)) {
    return {
      text: "Top internal movers Sakha discovered for AI roles:",
      matches: talentDiscovery.map((t) => ({ label: t.name, sub: t.reason, score: t.match })),
      cta: "Open talent pipeline",
    };
  }

  // Default — point to the biggest lever, with handles into the data.
  const reskillCount = workforceSignals.find((w) => w.segment === "reskilling")?.count ?? 38;
  return {
    text: `AI demand is outrunning supply ${skillDemand[0].demand} to ${skillDemand[0].supply}. Your fastest lever is internal reskilling — ${reskillCount} candidates are ready to move. Try asking about future skills, programs at risk, or reskill-vs-hire economics.`,
    matches: talentDiscovery.map((t) => ({ label: t.name, sub: t.reason, score: t.match })),
    cta: "Create the cohort",
  };
}

import { z } from "zod";
import { getOpenAI, OPENAI_MODEL } from "@/lib/openai";
import type { AskAnswer } from "@/components/AskSakha";
import { managerResponder, hrResponder } from "@/data/ask";
import {
  baseHrInsights,
  skillDemand,
  workforceSignals,
  roleGaps,
  workforceForecast,
  reskillEconomics,
  retentionIntel,
} from "@/data/workforce";
import { managerData } from "@/data/manager";

const AskSchema = z.object({
  text: z.string().min(1),
  matches: z
    .array(
      z.object({
        label: z.string(),
        sub: z.string().optional(),
        score: z.number().min(0).max(100),
      }),
    )
    .max(5)
    .optional(),
  cta: z.string().optional(),
});

function hrContext(): string {
  return `Workforce data (HCLTech, as of ${baseHrInsights.asOf}):
- Org AI readiness ${baseHrInsights.aiReadiness}%, attrition risk ${baseHrInsights.attritionRiskPct}%, internal fill rate ${baseHrInsights.internalFillRate}%, open critical roles ${baseHrInsights.openCriticalRoles}.
- Skill demand vs supply (0-100 index, with two-quarter trend):
${skillDemand
  .map((s) => `  • ${s.family}: demand ${s.demand}, supply ${s.supply}, gap ${s.demand - s.supply}, ${s.trend}`)
  .join("\n")}
- Role gaps (headcount demand/supply): ${roleGaps.map((r) => `${r.role} ${r.demand}/${r.supply}`).join("; ")}.
- Workforce segments: ${workforceSignals.map((w) => `${w.label} ${w.count}`).join("; ")}.
- AI-ready headcount forecast: ${workforceForecast.map((f) => `${f.label} ${f.value}`).join(" -> ")}.
- Reskilling economics: AI Delivery Manager cohort ${reskillEconomics.cohortSize}, supply ${reskillEconomics.supplyToday} -> ${reskillEconomics.supplyAfter180} in 180 days, reskill Rs.${reskillEconomics.reskillCostCr}Cr vs hire Rs.${reskillEconomics.externalHireCostCr}Cr (saving Rs.${reskillEconomics.savingCr}Cr).
- Retention: ${retentionIntel.atRisk} flight-risk, ${retentionIntel.retainable} retainable via ${retentionIntel.lever.toLowerCase()}.`;
}

function managerContext(): string {
  return `Team data for ${managerData.manager} (${managerData.managerTitle ?? "Manager"}), ${managerData.teamSize} reports:
- Team health ${managerData.teamHealthScore}% (trend ${managerData.teamHealthTrend.join("->")}).
- Readiness on ${managerData.readinessProject} (${managerData.projectReadiness}%):
${managerData.readinessTeam.map((m) => `  • ${m.name}: ${m.status} — ${m.note}`).join("\n")}
- Attrition risks: ${managerData.attritionRisks.map((r) => `${r.name} (${r.riskLevel}) — ${r.signal}`).join("; ")}.
- Talent pipeline: ready today ${managerData.talentPipeline.readyToday}, in 30d ${managerData.talentPipeline.ready30}, in 90d ${managerData.talentPipeline.ready90}.
- Certifications this month: ${managerData.certifications.map((c) => `${c.name} ${c.cert}`).join("; ")}.
- Spotlight: ${managerData.spotlight.name} ${managerData.spotlight.readiness}% ready for ${managerData.spotlight.goal}.`;
}

export type AskOutcome = { answer: AskAnswer; source: "openai" | "fallback" };

/**
 * Live "Ask Sakha" — answers a manager/HR question by reasoning over the real
 * workforce/team data. Falls back to the deterministic responder on any failure
 * or when no OpenAI key is configured, so the demo never blocks.
 */
export async function answerAsk(
  role: "manager" | "hr",
  question: string,
): Promise<AskOutcome> {
  const fallback = role === "manager" ? managerResponder(question) : hrResponder(question);

  const client = getOpenAI();
  if (!client) return { answer: fallback, source: "fallback" };

  try {
    const ctx = role === "manager" ? managerContext() : hrContext();
    const system =
      role === "manager"
        ? "You are Sakha's Manager Copilot intelligence for a delivery manager at HCLTech. Answer about THIS manager's team using only the data provided. You only ever respond with valid JSON."
        : "You are Sakha's Workforce Intelligence for a Capability Manager / Chief People Officer at HCLTech. Answer about the workforce using only the data provided. You only ever respond with valid JSON.";

    const completion = await client.chat.completions.create({
      model: OPENAI_MODEL,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: `${ctx}

Question: "${question}"

Answer ONLY from the data above, using the specific numbers. Return JSON in exactly this shape:
{ "text": "<1-3 sentence answer>", "matches": [ { "label": "<skill family, role, or person>", "sub": "<short detail>", "score": <0-100> } ], "cta": "<short next action>" }
Include "matches" only when the answer lists items (skills, roles, or people) — 2-5 of them, most relevant first. For a question about future or to-be-planned skills, list the skill families to invest in with their demand/supply gap as the score, and name any that are cooling. Omit "matches" and "cta" if they don't apply.`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return { answer: fallback, source: "fallback" };
    const parsed = AskSchema.parse(JSON.parse(raw));
    return { answer: parsed, source: "openai" };
  } catch {
    return { answer: fallback, source: "fallback" };
  }
}

import { z } from "zod";
import { getOpenAI, OPENAI_MODEL } from "@/lib/openai";
import { baseHrInsights } from "@/data/workforce";
import { getOverlay } from "@/lib/workforce-store";
import type { HrInsights } from "@/types/sakha";

const HeadlineSchema = z.object({ headline: z.string().min(1).max(320) });

export type HrOutcome = { insights: HrInsights; source: "openai" | "fallback" };

function buildPrompt(base: HrInsights, committed: string[]): string {
  const demand = base.skillDemand
    .map((s) => `${s.family}: demand ${s.demand}, supply ${s.supply} (${s.trend})`)
    .join("; ");
  const movers = committed.length
    ? `Employees who just committed to reskilling: ${committed.join(", ")}.`
    : "No new reskilling commitments this hour.";
  return `You are Sakha's Workforce Agent briefing Capability Manager ${base.hrPartner}.
Skill demand vs supply (0-100): ${demand}.
AI readiness ${base.aiReadiness}%, attrition risk ${base.attritionRiskPct}%, internal fill rate ${base.internalFillRate}%.
${movers}
Write ONE punchy sentence (max 40 words) naming the single biggest workforce lever right now. Reference internal reskilling and, if any committed, name a mover.
Return ONLY JSON: {"headline":"<sentence>"}`;
}

/** HR rollup with an optionally model-generated headline; always demo-safe. */
export async function getHrInsights(): Promise<HrOutcome> {
  const overlay = getOverlay();
  const committed = overlay.commitments.map((c) => c.name.split(" ")[0]);

  // Live commitments nudge AI readiness up a touch — supply is moving.
  const aiReadiness = Math.min(100, baseHrInsights.aiReadiness + committed.length);
  const base: HrInsights = { ...baseHrInsights, aiReadiness };

  const client = getOpenAI();
  if (!client) return { insights: base, source: "fallback" };

  try {
    const completion = await client.chat.completions.create({
      model: OPENAI_MODEL,
      temperature: 0.5,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are Sakha's Workforce Agent. You only ever respond with valid JSON.",
        },
        { role: "user", content: buildPrompt(base, committed) },
      ],
    });
    const raw = completion.choices[0]?.message?.content;
    if (!raw) return { insights: base, source: "fallback" };
    const parsed = HeadlineSchema.parse(JSON.parse(raw));
    return { insights: { ...base, headline: parsed.headline }, source: "openai" };
  } catch {
    return { insights: base, source: "fallback" };
  }
}

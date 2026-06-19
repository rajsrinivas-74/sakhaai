import { z } from "zod";
import { getOpenAI, OPENAI_MODEL } from "@/lib/openai";
import { resolveFallback } from "@/data/career-gps";
import { personaById } from "@/data/personas";
import type { CareerGpsResult, EmployeeTwin, PersonaId } from "@/types/sakha";

const ResultSchema = z.object({
  matchPercentage: z.number().min(0).max(100),
  readinessDays: z.number().min(7).max(365),
  successProbability: z.number().min(0).max(100).optional(),
  sakhaMessage: z.string().min(1),
  missingSkills: z
    .array(
      z.object({
        skill: z.string(),
        priority: z.number(),
        monthToAcquire: z.number(),
        recommendedCourse: z.string(),
        estimatedHoursPerWeek: z.number(),
      }),
    )
    .min(1),
  learningPath: z
    .array(
      z.object({
        month: z.number(),
        skill: z.string(),
        milestone: z.string(),
      }),
    )
    .min(1),
  openRoles: z
    .array(
      z.object({
        title: z.string(),
        team: z.string(),
        match: z.number(),
      }),
    )
    .min(1),
  nextAction: z.string().min(1),
});

function buildPrompt(employee: EmployeeTwin, goal: string): string {
  const kppBlock = employee.kpps?.length
    ? `\nPerformance record (KPP appraisal — target vs achievement, score /10):\n${employee.kpps
        .map(
          (k) =>
            `- ${k.name} (${k.category}, ${k.weight}% weight): ${k.achievement} vs ${k.target} target · ${k.score}/10 — ${k.signal}`,
        )
        .join("\n")}${employee.overallRating ? `\n- Overall rating: ${employee.overallRating}` : ""}`
    : "";

  const promoBlock = employee.promotion
    ? `\nPromotion readiness: ${employee.promotion.overall}% today, target ${employee.promotion.target}% in ${employee.promotion.targetWindowDays} days.\n${employee.promotion.dimensions
        .map((d) => `- ${d.label}: ${d.current}% (${d.status})`)
        .join("\n")}`
    : "";

  const mgrBlock = employee.managerFeedback
    ? `\nManager feedback (${employee.managerFeedback.from}, ${employee.managerFeedback.date} · ${employee.managerFeedback.sentiment}):\n"${employee.managerFeedback.summary}"\n- Strengths: ${employee.managerFeedback.strengths.join("; ")}\n- Development areas: ${employee.managerFeedback.developmentAreas.join("; ")}`
    : "";

  return `You are Sakha's Career GPS engine for HCLTech.

Employee Digital Twin:
- Name: ${employee.name}
- Current role: ${employee.role}${employee.level ? ` (${employee.level})` : ""}
- Current skills: ${employee.skills.join(", ")}
- Certifications: ${employee.certifications.join(", ") || "none"}
- Years experience: ${employee.yearsExp}
- Current project: ${employee.currentProject ?? "none"}
- Career goal: ${goal}${kppBlock}${promoBlock}${mgrBlock}

Analyse the skill gap from this employee's CURRENT skills toward the goal "${goal}".
Ground your reasoning in the EVIDENCE above: use the KPP performance record and the
manager feedback to justify which gaps are real. Where a KPP missed its target or the
manager flagged a development area, prioritise the matching skill and reference the
evidence in the milestone or course. Do NOT recommend generic gaps the evidence doesn't support.
Return ONLY valid JSON in exactly this shape (no markdown, no commentary):
{
  "matchPercentage": <number 0-100, readiness today>,
  "readinessDays": <number, a realistic ramp e.g. 60-150>,
  "successProbability": <number 0-100, probability of reaching the goal within the readiness window — usually higher than matchPercentage>,
  "sakhaMessage": "<one warm, encouraging sentence addressed to ${employee.name}>",
  "missingSkills": [
    { "skill": "<skill>", "priority": <1-4>, "monthToAcquire": <1-4>, "recommendedCourse": "<short course name>", "estimatedHoursPerWeek": <number> }
  ],
  "learningPath": [ { "month": <1-4>, "skill": "<theme>", "milestone": "<one concrete achievement>" } ],
  "openRoles": [ { "title": "<internal role title>", "team": "<HCLTech team name>", "match": <number 0-100> } ],
  "nextAction": "<one concrete action Sakha will take next>"
}
Include 3-4 missingSkills, 3 learningPath months, and 2-3 openRoles.`;
}

/** Light shaping so even valid model output stays demo-clean. */
function shape(result: CareerGpsResult): CareerGpsResult {
  return {
    ...result,
    matchPercentage: Math.round(result.matchPercentage),
    missingSkills: [...result.missingSkills].sort((a, b) => a.priority - b.priority),
    learningPath: [...result.learningPath].sort((a, b) => a.month - b.month),
    openRoles: [...result.openRoles].sort((a, b) => b.match - a.match),
  };
}

export type CareerGpsOutcome = {
  result: CareerGpsResult;
  source: "openai" | "fallback";
};

export async function analyseSkillGap(
  personaId: PersonaId,
  goal: string,
): Promise<CareerGpsOutcome> {
  const employee = personaById(personaId);
  const fallback = resolveFallback(personaId, goal);

  const client = getOpenAI();
  if (!client) {
    return { result: fallback, source: "fallback" };
  }

  try {
    const completion = await client.chat.completions.create({
      model: OPENAI_MODEL,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are Sakha, a warm, precise enterprise career companion. You only ever respond with valid JSON.",
        },
        { role: "user", content: buildPrompt(employee, goal) },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return { result: fallback, source: "fallback" };

    const parsed = ResultSchema.parse(JSON.parse(raw));
    return { result: shape(parsed), source: "openai" };
  } catch {
    // Any failure (network, key, parse, schema) → deterministic demo result.
    return { result: fallback, source: "fallback" };
  }
}

import { z } from "zod";
import { getOpenAI, OPENAI_MODEL } from "@/lib/openai";
import { personaById } from "@/data/personas";
import type { AgentId, EmployeeTwin } from "@/types/sakha";

const BodySchema = z.object({
  persona: z.enum(["priya", "arjun", "rajan"]),
  goal: z.string().min(1).max(120),
});

const AGENT_IDS = ["career", "learning", "opportunity", "workforce"] as const;

const StepsSchema = z.object({
  steps: z
    .array(
      z.object({
        agent: z.enum(AGENT_IDS),
        text: z.string().min(1).max(160),
      }),
    )
    .min(3)
    .max(7),
});

type Step = { agent: AgentId; text: string };

function fallbackSteps(e: EmployeeTwin, goal: string): Step[] {
  const steps: Step[] = [
    { agent: "career", text: `Reading ${e.name}'s Digital Twin — ${e.skills.length} skills, ${e.certifications.length} certs on file` },
  ];
  if (e.kpps?.length) {
    const miss = e.kpps.find((k) => k.status === "behind");
    steps.push({
      agent: "career",
      text: miss
        ? `Reading KPP record — ${miss.name} ${miss.achievement}/${miss.target} flags a real gap`
        : `Reading KPP performance record to ground the gap analysis`,
    });
  }
  if (e.managerFeedback) {
    steps.push({
      agent: "career",
      text: `Factoring ${e.managerFeedback.from}'s feedback — ${e.managerFeedback.developmentAreas[0]}`,
    });
  }
  steps.push(
    { agent: "career", text: `Comparing current profile against the ${goal} role across 200+ definitions` },
    { agent: "workforce", text: `Checking ${goal} demand vs supply across the org` },
    { agent: "opportunity", text: `Scanning open internal roles for the strongest matches` },
    { agent: "learning", text: `Sequencing courses and calendar into a ${Math.max(1, Math.round((e.daysAtCompany % 90) / 30) + 2)}-month plan` },
  );
  return steps;
}

async function modelSteps(e: EmployeeTwin, goal: string): Promise<Step[] | null> {
  const client = getOpenAI();
  if (!client) return null;
  try {
    const completion = await client.chat.completions.create({
      model: OPENAI_MODEL,
      temperature: 0.6,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are Sakha's multi-agent reasoning trace. Agents: career (reads the profile + gap analysis), learning (course/calendar planning), opportunity (internal role matching), workforce (org demand vs supply). Respond ONLY with valid JSON.",
        },
        {
          role: "user",
          content: `Employee: ${e.name}, ${e.role}. Skills: ${e.skills.join(", ")}. Goal: ${goal}.${
            e.kpps?.length
              ? `\nKPP performance: ${e.kpps
                  .map((k) => `${k.name} ${k.achievement}/${k.target} (${k.score}/10)`)
                  .join("; ")}.`
              : ""
          }${
            e.managerFeedback
              ? `\nManager (${e.managerFeedback.from}) flagged development areas: ${e.managerFeedback.developmentAreas.join(", ")}.`
              : ""
          }
Return JSON {"steps":[{"agent":"career|learning|opportunity|workforce","text":"<reasoning step, max 14 words>"}]} with 5-6 steps showing how the fleet reasons from current skills to the goal, in order. If KPP performance or manager feedback is given, have the career agent explicitly reference it when isolating gaps.`,
        },
      ],
    });
    const raw = completion.choices[0]?.message?.content;
    if (!raw) return null;
    return StepsSchema.parse(JSON.parse(raw)).steps;
  } catch {
    return null;
  }
}

/** Streams the agent reasoning trace as newline-delimited JSON steps. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) return new Response("Invalid request", { status: 400 });

  const employee = personaById(parsed.data.persona);
  const steps = (await modelSteps(employee, parsed.data.goal)) ?? fallbackSteps(employee, parsed.data.goal);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (const step of steps) {
        controller.enqueue(encoder.encode(JSON.stringify(step) + "\n"));
        await new Promise((r) => setTimeout(r, 560));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}

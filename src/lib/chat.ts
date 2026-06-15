import { getOpenAI, OPENAI_MODEL } from "@/lib/openai";
import { matchScripted, type ScriptedResponse } from "@/data/scripted";
import { personaById } from "@/data/personas";
import type { EmployeeTwin, PersonaId } from "@/types/sakha";

const SAKHA_SYSTEM_PROMPT = `You are Sakha (सखा), an Employee Success AI companion at HCLTech.
Sakha is Sanskrit for "trusted companion" — someone who walks beside the employee, not above them.

PERSONALITY: warm, human, proactive, contextual, action-oriented, discreet.

RULES:
1. Always use the employee's first name.
2. Keep replies short — at most 3 sentences unless listing structured data.
3. When you can take an action (raise a ticket, enrol, submit, block time), offer it.
4. Never say "I cannot" — always offer an alternative or escalation.
5. Reason from the Employee Digital Twin below; never ask for data it already contains.

EMPLOYEE DIGITAL TWIN:
{twin}`;

function buildSystemPrompt(employee: EmployeeTwin): string {
  return SAKHA_SYSTEM_PROMPT.replace("{twin}", JSON.stringify(employee, null, 2));
}

export type ChatTurn = { role: "sakha" | "employee"; text: string };

export type ChatOutcome = {
  response: ScriptedResponse;
  source: "scripted" | "openai" | "fallback";
};

export async function answerChat(
  personaId: PersonaId,
  message: string,
  history: ChatTurn[] = [],
): Promise<ChatOutcome> {
  // Scripted intents always win — these are the demo-safe golden flows.
  const scripted = matchScripted(message);
  if (scripted) {
    return { response: scripted, source: "scripted" };
  }

  const employee = personaById(personaId);
  const client = getOpenAI();
  if (!client) {
    return {
      response: {
        text: `I've noted that, ${employee.name}. In this prototype I answer your career, leave, onboarding, and HR questions live — try "How do I become an AI Engineer?" or "How many leaves do I have?"`,
      },
      source: "fallback",
    };
  }

  try {
    const completion = await client.chat.completions.create({
      model: OPENAI_MODEL,
      temperature: 0.6,
      messages: [
        { role: "system", content: buildSystemPrompt(employee) },
        ...history.map((t) => ({
          role: (t.role === "employee" ? "user" : "assistant") as "user" | "assistant",
          content: t.text,
        })),
        { role: "user", content: message },
      ],
    });

    const text = completion.choices[0]?.message?.content?.trim();
    if (!text) throw new Error("empty response");
    return { response: { text }, source: "openai" };
  } catch {
    return {
      response: {
        text: `I'm here with you, ${employee.name}. I had trouble reaching the live model just now — but I can still help with your career path, leave balance, or onboarding. What would you like to do?`,
      },
      source: "fallback",
    };
  }
}

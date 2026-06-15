import { NextResponse } from "next/server";
import { z } from "zod";
import { answerChat } from "@/lib/chat";

const BodySchema = z.object({
  persona: z.enum(["priya", "arjun", "rajan"]),
  message: z.string().min(1).max(2000),
  history: z
    .array(
      z.object({
        role: z.enum(["sakha", "employee"]),
        text: z.string(),
      }),
    )
    .max(20)
    .optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { persona, message, history } = parsed.data;
  const { response, source } = await answerChat(persona, message, history ?? []);
  return NextResponse.json({ response, source });
}

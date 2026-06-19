import { NextResponse } from "next/server";
import { z } from "zod";
import { answerAsk } from "@/lib/ask";

const BodySchema = z.object({
  role: z.enum(["manager", "hr"]),
  question: z.string().min(1).max(300),
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

  const { role, question } = parsed.data;
  const { answer, source } = await answerAsk(role, question);
  return NextResponse.json({ answer, source });
}

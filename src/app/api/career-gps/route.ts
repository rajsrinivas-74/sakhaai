import { NextResponse } from "next/server";
import { z } from "zod";
import { analyseSkillGap } from "@/lib/career-gps";

const BodySchema = z.object({
  persona: z.enum(["priya", "arjun", "rajan"]),
  goal: z.string().min(1).max(120),
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

  const { persona, goal } = parsed.data;
  const { result, source } = await analyseSkillGap(persona, goal);
  return NextResponse.json({ result, source });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { getOverlay, recordCommitment } from "@/lib/workforce-store";

const BodySchema = z.object({
  persona: z.enum(["priya", "arjun", "rajan"]),
  name: z.string().min(1).max(80),
  goal: z.string().min(1).max(120),
  matchPercentage: z.number().min(0).max(100),
  readinessDays: z.number().min(1).max(365),
});

/** The Manager and HR lenses poll this to read propagated commitments. */
export async function GET() {
  return NextResponse.json(getOverlay());
}

/** The Employee lens posts here when a path is committed. */
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

  const { persona, name, goal, matchPercentage, readinessDays } = parsed.data;
  const overlay = recordCommitment({ personaId: persona, name, goal, matchPercentage, readinessDays });
  return NextResponse.json(overlay);
}

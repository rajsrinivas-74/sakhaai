import { NextResponse } from "next/server";
import { z } from "zod";
import { recordCohort } from "@/lib/workforce-store";

const BodySchema = z.object({ count: z.number().min(1).max(500) });

/** HR approves a reskilling cohort — fans out into a batch of agent actions. */
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
  const overlay = recordCohort(parsed.data.count);
  return NextResponse.json(overlay);
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { recordIntervention } from "@/lib/workforce-store";

const BodySchema = z.object({
  label: z.string().min(1).max(160),
  riskTo: z.number().min(0).max(100),
});

/** Manager applies a retention intervention — propagates to the timeline. */
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
  const { label, riskTo } = parsed.data;
  return NextResponse.json(recordIntervention(label, riskTo));
}

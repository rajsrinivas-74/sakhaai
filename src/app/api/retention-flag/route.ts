import { NextResponse } from "next/server";
import { z } from "zod";
import { recordRetentionFlag } from "@/lib/workforce-store";

const BodySchema = z.object({ persona: z.enum(["priya", "arjun", "rajan"]) });

/** Employee raised a retention signal in chat — propagate to manager + HR. */
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
  return NextResponse.json(recordRetentionFlag(parsed.data.persona));
}

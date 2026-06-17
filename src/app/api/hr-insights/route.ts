import { NextResponse } from "next/server";
import { getHrInsights } from "@/lib/hr-insights";

/** Anita's Workforce Command rollup — model-generated headline, demo-safe fallback. */
export async function GET() {
  const { insights, source } = await getHrInsights();
  return NextResponse.json({ insights, source });
}

import { NextResponse } from "next/server";
import { resetStore } from "@/lib/workforce-store";

/** Clears all propagated demo state for a clean run. */
export async function POST() {
  return NextResponse.json(resetStore());
}

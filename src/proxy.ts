import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { GATE_COOKIE, gateToken } from "@/lib/gate";

/**
 * Demo passcode gate. When DEMO_PASSCODE is set, every page is held behind the
 * /unlock screen until the visitor enters it. When it's unset (e.g. local dev),
 * the gate is OFF so nobody can lock themselves out.
 */
export async function proxy(req: NextRequest) {
  const passcode = process.env.DEMO_PASSCODE;
  if (!passcode) return NextResponse.next();

  const token = req.cookies.get(GATE_COOKIE)?.value;
  const expected = await gateToken(passcode);
  if (token === expected) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/unlock";
  url.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(url);
}

// Run on everything except the unlock flow, Next internals, and static assets.
export const config = {
  matcher: [
    "/((?!unlock|api/unlock|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|woff|woff2)).*)",
  ],
};

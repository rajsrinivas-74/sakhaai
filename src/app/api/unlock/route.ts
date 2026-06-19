import { NextResponse } from "next/server";
import { GATE_COOKIE, gateToken } from "@/lib/gate";

/** Keep redirects internal — never honour an absolute/off-site `next`. */
function safeNext(next: string): string {
  return next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

export async function POST(req: Request) {
  const form = await req.formData();
  const passcode = String(form.get("passcode") ?? "");
  const next = safeNext(String(form.get("next") ?? "/"));
  const expected = process.env.DEMO_PASSCODE ?? "";

  if (expected && passcode === expected) {
    const res = NextResponse.redirect(new URL(next, req.url));
    res.cookies.set(GATE_COOKIE, await gateToken(expected), {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 12, // 12 hours
    });
    return res;
  }

  const back = new URL("/unlock", req.url);
  back.searchParams.set("error", "1");
  back.searchParams.set("next", next);
  return NextResponse.redirect(back);
}

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
    // 303 See Other → the browser follows with a GET (307 would re-POST to a
    // page route and 405). Cookie still rides on the redirect response.
    const res = NextResponse.redirect(new URL(next, req.url), 303);
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
  return NextResponse.redirect(back, 303);
}

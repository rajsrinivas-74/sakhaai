/**
 * Shared helper for the lightweight demo passcode gate. The cookie never holds
 * the raw passcode — it holds a SHA-256 token derived from it, computed the
 * same way in the middleware and the unlock route. The passcode itself lives
 * only in the DEMO_PASSCODE env var (Vercel), never in the repo.
 */
export async function gateToken(passcode: string): Promise<string> {
  const data = new TextEncoder().encode("sakha::" + passcode);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const GATE_COOKIE = "sakha_access";

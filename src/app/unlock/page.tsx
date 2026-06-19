import { Lock } from "lucide-react";
import { SakhaLogo } from "@/components/SakhaLogo";

export const metadata = {
  title: "Sakha AI · Enter passcode",
};

export default async function UnlockPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const next = sp.next ?? "/";
  const error = sp.error === "1";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2">
          <SakhaLogo className="h-9 w-9" />
          <span className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
            Sakha AI
          </span>
        </div>

        <div className="surface mt-6 rounded-2xl p-7">
          <div className="flex flex-col items-center text-center">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ background: "rgba(107,95,167,0.16)", color: "var(--ai-purple)" }}
            >
              <Lock className="h-5 w-5" />
            </span>
            <h1 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">
              This demo is passcode-protected
            </h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Enter the access passcode to continue to the Sakha AI demo.
            </p>
          </div>

          <form method="POST" action="/api/unlock" className="mt-6 space-y-3">
            <input type="hidden" name="next" value={next} />
            <input
              name="passcode"
              type="password"
              autoFocus
              required
              autoComplete="off"
              placeholder="Passcode"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--ai-purple)]"
            />
            {error && (
              <p className="text-xs font-medium text-[var(--ai-pink)]">
                Incorrect passcode — please try again.
              </p>
            )}
            <button
              type="submit"
              className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-white"
              style={{ background: "var(--ai-purple)" }}
            >
              Enter demo
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-[11px] text-[var(--text-muted)]">
          Prototype for the HCLTech–OpenAI Agentic AI Hackathon. No proprietary data.
        </p>
      </div>
    </main>
  );
}

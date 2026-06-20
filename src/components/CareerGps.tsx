"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Compass, Leaf, ListChecks } from "lucide-react";
import type {
  AgentId,
  CareerGpsResult,
  EmployeeTwin,
  ProactiveNotification as NotifType,
} from "@/types/sakha";
import { ACCENT_HEX, accentRgba } from "@/lib/accents";
import { AgentChip } from "@/components/AgentChip";
import { MissionControl } from "@/components/MissionControl";
import { ProactiveNotification } from "@/components/ProactiveNotification";

type ReasoningStep = { agent: AgentId; text: string };

const SUGGESTED = ["AI Engineer", "AI Governance Consultant", "Cloud Architect", "Automation Architect"];

type Phase = "idle" | "loading" | "results";

export function CareerGps({
  twin,
  prefillGoal,
  onResult,
  notif,
  onNotifAction,
  onNotifDismiss,
  autoEngage = false,
}: {
  twin: EmployeeTwin;
  prefillGoal?: string | null;
  onResult: (result: CareerGpsResult) => void;
  notif?: NotifType | null;
  onNotifAction?: (label: string) => void;
  onNotifDismiss?: () => void;
  /** Forwarded to Mission Control to auto-engage Autopilot during the demo. */
  autoEngage?: boolean;
}) {
  const [goal, setGoal] = useState(prefillGoal || twin.careerGoal);
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<CareerGpsResult | null>(null);
  const [source, setSource] = useState<"openai" | "fallback" | null>(null);
  const [reasoning, setReasoning] = useState<ReasoningStep[]>([]);
  const lastPersona = useRef(twin.id);

  // Reset when the active employee changes.
  useEffect(() => {
    if (lastPersona.current !== twin.id) {
      lastPersona.current = twin.id;
      setGoal(twin.careerGoal);
      setPhase("idle");
      setResult(null);
      setSource(null);
      setReasoning([]);
    }
  }, [twin]);

  // Auto-run when chat routes here with a goal.
  useEffect(() => {
    if (prefillGoal) {
      void run(prefillGoal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillGoal]);

  async function streamReasoning(targetGoal: string) {
    try {
      const res = await fetch("/api/agent-reasoning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona: twin.id, goal: targetGoal }),
      });
      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            setReasoning((prev) => [...prev, JSON.parse(line) as ReasoningStep]);
          } catch {
            /* skip malformed line */
          }
        }
      }
    } catch {
      /* reasoning is cosmetic — never block results on it */
    }
  }

  async function run(targetGoal: string) {
    if (!targetGoal.trim()) return;
    setPhase("loading");
    setResult(null);
    setReasoning([]);
    try {
      const resultPromise = fetch("/api/career-gps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona: twin.id, goal: targetGoal }),
      }).then((r) => r.json() as Promise<{ result: CareerGpsResult; source: "openai" | "fallback" }>);

      await streamReasoning(targetGoal);
      const data = await resultPromise;
      await new Promise((r) => setTimeout(r, 350));
      setResult(data.result);
      setSource(data.source);
      setPhase("results");
      onResult(data.result);
    } catch {
      setPhase("idle");
    }
  }

  return (
    <div className="surface flex h-full flex-col overflow-hidden">
      <header className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: accentRgba("purple", 0.16), color: ACCENT_HEX.purple }}
          >
            <Compass className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Career GPS</h2>
            <p className="text-xs text-[var(--text-secondary)]">
              {twin.name}&rsquo;s mission control · agents work continuously
            </p>
          </div>
        </div>
        {source && (
          <span className="rounded-md border border-[var(--border)] px-2 py-1 text-[10px] font-medium text-[var(--text-muted)]">
            {source === "openai" ? "Live · OpenAI" : "Local Twin model"}
          </span>
        )}
      </header>

      <div className="thin-scroll flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {notif && onNotifAction && onNotifDismiss && (
                <div className="mb-4">
                  <ProactiveNotification
                    notif={notif}
                    onAction={onNotifAction}
                    onDismiss={onNotifDismiss}
                  />
                </div>
              )}

              {/* YOUR NEXT MOVE — set the mission (key action, pinned at top) */}
              <div
                className="rounded-xl border p-4"
                style={{ borderColor: accentRgba("orange", 0.4), background: accentRgba("orange", 0.05) }}
              >
                <p className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                  <ListChecks className="h-4 w-4 text-[var(--ai-orange)]" />
                  Your next move
                </p>
                <label className="mt-2 block text-sm font-medium text-[var(--text-secondary)]">
                  What&rsquo;s your career mission?
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && run(goal)}
                    placeholder="e.g. AI Engineer"
                    className="flex-1 rounded-xl attr-card bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--ai-purple)]"
                  />
                  <button
                    onClick={() => run(goal)}
                    disabled={!goal.trim()}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
                    style={{ background: ACCENT_HEX.purple }}
                  >
                    Create mission
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SUGGESTED.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGoal(g)}
                      className="surface-hover rounded-full attr-card bg-[var(--bg)] px-3 py-1 text-xs text-[var(--text-secondary)]"
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current skills on file */}
              <div className="mt-4 rounded-xl attr-card bg-[var(--bg)] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Current skills on file
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {twin.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--text-secondary)]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {phase === "loading" && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-6">
              <div className="flex items-center gap-3">
                <motion.span
                  animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ repeat: Infinity, duration: 1.4 }}
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ background: accentRgba("purple", 0.16), color: ACCENT_HEX.purple }}
                >
                  <Leaf className="h-5 w-5" />
                </motion.span>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    Sakha&rsquo;s agents are reasoning over {twin.name}&rsquo;s Digital Twin…
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Live trace — agents hand off as they work
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                {reasoning.map((step, i) => (
                  <motion.div
                    key={`${step.agent}-${i}`}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                    className="flex items-center gap-3 rounded-lg attr-card bg-[var(--bg)] p-3"
                  >
                    <AgentChip agent={step.agent} status={i === reasoning.length - 1 ? "thinking" : "done"} />
                    <p className="min-w-0 flex-1 text-xs leading-5 text-[var(--text-secondary)]">{step.text}</p>
                  </motion.div>
                ))}
                {reasoning.length === 0 && (
                  <p className="text-xs text-[var(--text-muted)]">Spinning up the agent fleet…</p>
                )}
              </div>
            </motion.div>
          )}

          {phase === "results" && result && (
            <MissionControl key="results" twin={twin} goal={goal} result={result} autoEngage={autoEngage} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

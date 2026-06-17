"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, ShieldAlert, Sparkles } from "lucide-react";
import { ACCENT_HEX, accentRgba } from "@/lib/accents";
import { AgentChip } from "@/components/AgentChip";

const BASE_RISK = 73;
const FLOOR = 9;

type Lever = { id: string; label: string; delta: number; why: string };

const LEVERS: Lever[] = [
  { id: "path", label: "Approve Automation Architect path", delta: 52, why: "growth resumes, so market-pull drops sharply" },
  { id: "oneonone", label: "Schedule a growth 1:1 this week", delta: 6, why: "feeling heard lifts engagement" },
  { id: "workload", label: "Rebalance the Claims QA workload", delta: 6, why: "eight late nights ease off" },
];

function exitWindow(risk: number): string {
  if (risk >= 70) return "~5 weeks";
  if (risk >= 50) return "~9 weeks";
  if (risk >= 30) return "~4 months";
  return ">9 months";
}

/**
 * Vikram's what-if. A chart reports the past; this reasons about the future and
 * responds to you — toggle interventions and the flight-risk gauge re-forecasts
 * live, with the Manager Agent narrating the causal chain.
 */
export function AttritionSimulator() {
  const [on, setOn] = useState<Set<string>>(new Set());
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const drop = LEVERS.filter((l) => on.has(l.id)).reduce((s, l) => s + l.delta, 0);
  const risk = Math.max(FLOOR, BASE_RISK - drop);
  const reduced = BASE_RISK - risk;

  const selected = LEVERS.filter((l) => on.has(l.id));
  const narration =
    selected.length === 0
      ? "Rajan is at 73% flight risk — market-hot QA-to-automation skills plus eight late nights. Predicted exit in ~5 weeks if nothing changes."
      : `If you ${selected.map((l) => l.label.toLowerCase()).join(", and ")}, ${selected
          .map((l) => l.why)
          .join("; ")}. Risk re-forecasts 73% → ${risk}%.`;

  function toggle(id: string) {
    if (applied) return;
    setOn((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function apply() {
    if (on.size === 0) return;
    setApplying(true);
    try {
      await fetch("/api/intervention", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: selected.map((l) => l.label).join(" + "), riskTo: risk }),
      });
      setApplied(true);
    } catch {
      /* demo-safe */
    } finally {
      setApplying(false);
    }
  }

  const riskColor = risk >= 60 ? ACCENT_HEX.pink : risk >= 35 ? ACCENT_HEX.orange : ACCENT_HEX.cyan;

  return (
    <div
      className="rounded-xl border p-5"
      style={{ borderColor: accentRgba("pink", 0.4), background: accentRgba("pink", 0.04) }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
          <ShieldAlert className="h-4 w-4 text-[var(--ai-pink)]" />
          Attrition what-if · Rajan Krishnan
        </div>
        <AgentChip agent="wellbeing" status={applied ? "acting" : "thinking"} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[150px_1fr] sm:items-center">
        {/* RISK GAUGE */}
        <div className="flex flex-col items-center">
          <RiskRing value={risk} color={riskColor} />
          <p className="mt-2 text-[11px] text-[var(--text-secondary)]">
            Predicted exit <span className="font-semibold text-[var(--text-primary)]">{exitWindow(risk)}</span>
          </p>
          {reduced > 0 && (
            <span className="mt-1 text-[11px] font-semibold text-[var(--ai-cyan)]">
              ↓ {reduced} pts from intervention
            </span>
          )}
        </div>

        {/* LEVERS */}
        <div className="space-y-2">
          {LEVERS.map((l) => {
            const active = on.has(l.id);
            return (
              <button
                key={l.id}
                onClick={() => toggle(l.id)}
                disabled={applied}
                className="flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition disabled:opacity-70"
                style={{
                  borderColor: active ? accentRgba("cyan", 0.5) : "var(--border)",
                  background: active ? accentRgba("cyan", 0.08) : "var(--bg)",
                }}
              >
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border"
                  style={{
                    borderColor: active ? ACCENT_HEX.cyan : "var(--border)",
                    background: active ? ACCENT_HEX.cyan : "transparent",
                  }}
                >
                  {active && <CheckCircle2 className="h-4 w-4 text-white" />}
                </span>
                <span className="flex-1 text-sm text-[var(--text-primary)]">{l.label}</span>
                <span className="shrink-0 text-[11px] font-semibold text-[var(--ai-cyan)]">−{l.delta}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* NARRATION */}
      <div
        className="mt-4 flex items-start gap-2 rounded-lg border-l-2 p-3"
        style={{ borderColor: ACCENT_HEX.cyan, background: accentRgba("cyan", 0.06) }}
      >
        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--ai-cyan)]" />
        <p className="text-xs leading-5 text-[var(--text-secondary)]">
          <span className="font-semibold text-[var(--text-primary)]">Manager Agent: </span>
          <motion.span key={narration}>{narration}</motion.span>
        </p>
      </div>

      {/* APPLY */}
      {!applied ? (
        <button
          onClick={apply}
          disabled={on.size === 0 || applying}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          style={{ background: ACCENT_HEX.pink }}
        >
          {applying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Applying plan…
            </>
          ) : (
            <>Apply retention plan · lock in {risk}%</>
          )}
        </button>
      ) : (
        <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[var(--ai-cyan)]">
          <CheckCircle2 className="h-4 w-4" />
          Plan applied — Wellbeing &amp; Manager agents executing · see the timeline
        </p>
      )}
    </div>
  );
}

function RiskRing({ value, color }: { value: number; color: string }) {
  const R = 40;
  const C = 2 * Math.PI * R;
  const arc = (C * value) / 100;
  return (
    <div className="relative h-28 w-28">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={R} fill="none" stroke="var(--border)" strokeWidth="9" />
        <motion.circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          animate={{ strokeDasharray: `${arc} ${C - arc}` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span key={value} className="text-3xl font-bold tabular-nums" style={{ color }}>
          {value}%
        </motion.span>
        <span className="text-[10px] text-[var(--text-muted)]">flight risk</span>
      </div>
    </div>
  );
}

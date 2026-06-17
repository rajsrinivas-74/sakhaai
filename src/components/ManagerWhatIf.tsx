"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, TrendingDown, TrendingUp, Zap } from "lucide-react";
import { ACCENT_HEX, accentRgba, type Accent } from "@/lib/accents";
import { AgentChip } from "@/components/AgentChip";

type Metric = { label: string; before: string; after: string; dir: "up" | "down"; accent: Accent };

const METRICS: Metric[] = [
  { label: "Project readiness", before: "82%", after: "91%", dir: "up", accent: "cyan" },
  { label: "Attrition risk", before: "4 flagged", after: "2 flagged", dir: "down", accent: "pink" },
  { label: "Staffing risk", before: "At risk", after: "Covered", dir: "down", accent: "orange" },
];

/**
 * The manager's signature moment — "what happens if I approve this?" One toggle
 * re-forecasts readiness, attrition, and staffing at once. Reporting the past
 * becomes reasoning about the future.
 */
export function ManagerWhatIf() {
  const [approved, setApproved] = useState(false);

  return (
    <div
      className="rounded-xl border p-5"
      style={{ borderColor: accentRgba("cyan", 0.4), background: accentRgba("cyan", 0.05) }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
          <Zap className="h-4 w-4 text-[var(--ai-cyan)]" />
          What if I approve the AI Upskilling Program?
        </div>
        <AgentChip agent="manager" status={approved ? "acting" : "thinking"} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {METRICS.map((m) => {
          const Icon = m.dir === "up" ? TrendingUp : TrendingDown;
          return (
            <div key={m.label} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3 text-center">
              <p className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">{m.label}</p>
              <div className="mt-1 flex items-center justify-center gap-1.5">
                <motion.span
                  key={approved ? m.after : m.before}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-lg font-bold text-[var(--text-primary)]"
                >
                  {approved ? m.after : m.before}
                </motion.span>
                {approved && <Icon className="h-3.5 w-3.5" style={{ color: ACCENT_HEX[m.accent] }} />}
              </div>
            </div>
          );
        })}
      </div>

      {approved && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 flex items-center gap-1.5 text-xs text-[var(--text-secondary)]"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-[var(--ai-cyan)]" />
          Manager Agent: 3 employees become deployable within 60 days.
        </motion.p>
      )}

      <button
        onClick={() => setApproved((a) => !a)}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
        style={{ background: approved ? ACCENT_HEX.blue : ACCENT_HEX.cyan }}
      >
        {approved ? "Reset simulation" : "Simulate approval"}
        {!approved && <ArrowRight className="h-4 w-4" />}
      </button>
    </div>
  );
}

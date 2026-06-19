"use client";

import { motion } from "framer-motion";
import { IndianRupee, Scale } from "lucide-react";
import {
  buildVsBuy,
  buildVsBuyTotalSavingCr,
  type BuildVsBuyRole,
} from "@/data/workforce";
import { ACCENT_HEX, accentRgba } from "@/lib/accents";

/**
 * Build-vs-buy portfolio — reskill vs external-hire economics across every
 * critical role gap, with a portfolio total saving. The board-level ROI case
 * for internal mobility over external hiring.
 */
export function BuildVsBuyPortfolio() {
  const maxCost = Math.max(...buildVsBuy.map((r) => r.hireCr));
  return (
    <div
      className="rounded-xl border p-5"
      style={{ borderColor: accentRgba("purple", 0.4), background: accentRgba("purple", 0.05) }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
          <Scale className="h-4 w-4 text-[var(--ai-purple)]" />
          Build vs buy · critical role portfolio
        </div>
        <div className="flex items-center gap-3 text-[11px] text-[var(--text-secondary)]">
          <Legend color={ACCENT_HEX.cyan} label="Reskill" />
          <Legend color={ACCENT_HEX.pink} label="Hire" />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {buildVsBuy.map((r, i) => (
          <Row key={r.role} role={r} maxCost={maxCost} index={i} />
        ))}
      </div>

      {/* PORTFOLIO TOTAL */}
      <div
        className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg p-3"
        style={{ background: accentRgba("cyan", 0.1) }}
      >
        <div className="flex items-center gap-2">
          <IndianRupee className="h-4 w-4 text-[var(--ai-cyan)]" />
          <span className="text-sm font-semibold text-[var(--text-primary)]">Portfolio saving — reskill over hire</span>
        </div>
        <span className="text-2xl font-bold tabular-nums text-[var(--ai-cyan)]">
          ₹{buildVsBuyTotalSavingCr.toFixed(1)} Cr
        </span>
      </div>
      <p className="mt-1.5 text-[11px] text-[var(--text-muted)]">
        Across {buildVsBuy.length} critical roles · and reskilled talent is productive in a fraction of the time.
      </p>
    </div>
  );
}

function Row({ role: r, maxCost, index }: { role: BuildVsBuyRole; maxCost: number; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-lg attr-card bg-[var(--bg)] p-3"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          {r.role} <span className="text-[11px] font-normal text-[var(--text-muted)]">· gap {r.gap}</span>
        </p>
        <span className="text-sm font-bold tabular-nums text-[var(--ai-cyan)]">save ₹{r.savingCr} Cr</span>
      </div>

      {/* cost bars */}
      <div className="mt-2 space-y-1">
        <CostBar label={`Reskill ₹${r.reskillCr} Cr · ${r.reskillDays}d`} value={(r.reskillCr / maxCost) * 100} color={ACCENT_HEX.cyan} />
        <CostBar label={`Hire ₹${r.hireCr} Cr · ${r.hireDays}d`} value={(r.hireCr / maxCost) * 100} color={ACCENT_HEX.pink} />
      </div>
    </motion.div>
  );
}

function CostBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 rounded-full bg-[var(--border)]">
        <div className="h-2 rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="w-40 shrink-0 text-right text-[10px] text-[var(--text-secondary)]">{label}</span>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

"use client";

import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { alliances, type Alliance } from "@/data/workforce";
import { ACCENT_HEX, accentRgba } from "@/lib/accents";

/**
 * Alliance & certification pipeline — partner tiers require certified headcount
 * for status, co-sell and margin benefits. Tracks certified vs the next-tier
 * threshold and the quarters of cert velocity needed to close it.
 */
export function AlliancePipeline() {
  return (
    <div className="rounded-xl attr-card bg-[var(--bg)] p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
        <BadgeCheck className="h-4 w-4 text-[var(--ai-cyan)]" />
        Alliance &amp; certification pipeline
        <span className="text-[11px] font-normal text-[var(--text-muted)]">· certified headcount → partner tier</span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {alliances.map((a, i) => (
          <Card key={a.partner} alliance={a} index={i} />
        ))}
      </div>
    </div>
  );
}

function Card({ alliance: a, index }: { alliance: Alliance; index: number }) {
  const pct = Math.min(100, Math.round((a.certified / a.threshold) * 100));
  const gap = Math.max(0, a.threshold - a.certified);
  const qtrs = gap > 0 ? Math.ceil(gap / a.velocityPerQtr) : 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-xl border p-3.5"
      style={{ borderColor: accentRgba(a.accent, 0.4), background: accentRgba(a.accent, 0.05) }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[var(--text-primary)]">{a.partner}</p>
        <span
          className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
          style={{ background: accentRgba(a.accent, 0.16), color: ACCENT_HEX[a.accent] }}
        >
          {a.tier}
        </span>
      </div>

      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-2xl font-bold tabular-nums text-[var(--text-primary)]">{a.certified}</span>
        <span className="text-[11px] text-[var(--text-muted)]">/ {a.threshold} certified</span>
      </div>
      <div className="mt-1.5 h-1.5 rounded-full bg-[var(--border)]">
        <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: ACCENT_HEX[a.accent] }} />
      </div>

      <p className="mt-2 text-[11px] text-[var(--text-secondary)]">
        {gap > 0 ? (
          <>
            <span className="font-semibold" style={{ color: ACCENT_HEX[a.accent] }}>
              {gap} more
            </span>{" "}
            → <span className="font-semibold text-[var(--text-primary)]">{a.nextTier}</span> (~{qtrs} qtr at {a.velocityPerQtr}/qtr)
          </>
        ) : (
          <span className="font-semibold text-[var(--ai-cyan)]">Tier threshold met</span>
        )}
      </p>
      <p className="mt-1 text-[10px] text-[var(--text-muted)]">{a.benefit}</p>
    </motion.div>
  );
}

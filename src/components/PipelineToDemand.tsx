"use client";

import { motion } from "framer-motion";
import { Briefcase, Users } from "lucide-react";
import { dealPipeline, type Deal } from "@/data/workforce";
import { ACCENT_HEX, accentRgba, type Accent } from "@/lib/accents";

/**
 * Deal pipeline → capability demand. Open deals create skill demand on win;
 * probability-weighting the headcount turns the sales pipeline into a forward
 * capability plan ("win the likely ones → need N people by Q3").
 */
export function PipelineToDemand() {
  const weighted = Math.round(
    dealPipeline.reduce((s, d) => s + (d.headcount * d.probability) / 100, 0),
  );
  const likely = dealPipeline.filter((d) => d.probability >= 50);
  const likelyHeads = likely.reduce((s, d) => s + d.headcount, 0);

  return (
    <div
      className="rounded-xl border p-5"
      style={{ borderColor: accentRgba("blue", 0.4), background: accentRgba("blue", 0.05) }}
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
        <Briefcase className="h-4 w-4 text-[var(--ai-blue)]" />
        Pipeline → capability demand
        <span className="text-[11px] font-normal text-[var(--text-muted)]">· deals that create skill demand on win</span>
      </div>

      <div className="mt-4 space-y-2">
        {dealPipeline.map((d, i) => (
          <DealRow key={d.name} deal={d} index={i} />
        ))}
      </div>

      {/* ROLLUP */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Summary
          icon={Users}
          value={`${weighted}`}
          label="Probability-weighted headcount demand"
          accent="blue"
        />
        <Summary
          icon={Users}
          value={`${likelyHeads}`}
          label={`If the ${likely.length} likely deals (>50%) land`}
          accent="cyan"
        />
      </div>
      <p className="mt-2 text-[11px] text-[var(--text-muted)]">
        Start reskilling now — these roles need to be ready before the deals close, not after.
      </p>
    </div>
  );
}

function DealRow({ deal: d, index }: { deal: Deal; index: number }) {
  const accent: Accent = d.probability >= 60 ? "cyan" : d.probability >= 45 ? "blue" : "orange";
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg attr-card bg-[var(--bg)] px-3 py-2.5"
    >
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--text-primary)]">{d.name}</span>
      <span className="text-[11px] text-[var(--text-secondary)]">₹{d.valueCr} Cr</span>
      <span
        className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums"
        style={{ background: accentRgba(accent, 0.16), color: ACCENT_HEX[accent] }}
      >
        {d.probability}% win
      </span>
      <span className="w-full text-[11px] text-[var(--text-muted)] sm:w-auto">
        → <span className="font-semibold text-[var(--text-primary)]">{d.headcount}</span> {d.skill} by {d.needBy}
      </span>
    </motion.div>
  );
}

function Summary({ icon: Icon, value, label, accent }: { icon: typeof Users; value: string; label: string; accent: Accent }) {
  return (
    <div className="rounded-lg attr-card bg-[var(--bg)] p-3 text-center">
      <Icon className="mx-auto h-4 w-4" style={{ color: ACCENT_HEX[accent] }} />
      <p className="mt-1 text-2xl font-bold tabular-nums" style={{ color: ACCENT_HEX[accent] }}>{value}</p>
      <p className="text-[10px] leading-3 text-[var(--text-muted)]">{label}</p>
    </div>
  );
}

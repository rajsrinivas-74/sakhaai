"use client";

import { motion } from "framer-motion";
import { ClipboardCheck } from "lucide-react";
import type { Kpp } from "@/types/sakha";
import { ACCENT_HEX, accentRgba, type Accent } from "@/lib/accents";

const STATUS_ACCENT: Record<Kpp["status"], Accent> = {
  ahead: "cyan",
  ontrack: "blue",
  behind: "orange",
};

const STATUS_LABEL: Record<Kpp["status"], string> = {
  ahead: "Ahead",
  ontrack: "On track",
  behind: "Below",
};

/**
 * The KPP appraisal record Career GPS reasons over — the evidence base that
 * turns generic skill advice into performance-grounded recommendations. Each
 * row carries the signal Sakha reads from it.
 */
export function KppScorecard({ kpps, rating }: { kpps: Kpp[]; rating?: string }) {
  const totalWeight = kpps.reduce((s, k) => s + k.weight, 0);
  const weighted = kpps.reduce((s, k) => s + k.weight * k.score, 0) / (totalWeight || 1);

  return (
    <div className="rounded-xl attr-card bg-[var(--bg)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text-primary)]">
          <ClipboardCheck className="h-4 w-4 text-[var(--ai-purple)]" />
          KPP performance · FY25
        </h3>
        <span className="rounded-md border border-[var(--border)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">
          Grounding Career GPS
        </span>
      </div>

      <div className="mt-3 space-y-1.5">
        {kpps.map((k, i) => {
          const accent = STATUS_ACCENT[k.status];
          return (
            <motion.div
              key={k.name}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-lg border border-[var(--border)] p-2.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-[var(--text-primary)]">{k.name}</p>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                    {k.category} · {k.weight}% weight
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-[11px] tabular-nums text-[var(--text-secondary)]">
                    {k.achievement}
                    <span className="text-[var(--text-muted)]"> / {k.target}</span>
                  </span>
                  <span
                    className="rounded-md px-1.5 py-0.5 text-[11px] font-bold tabular-nums"
                    style={{ background: accentRgba(accent, 0.16), color: ACCENT_HEX[accent] }}
                  >
                    {k.score}/10
                  </span>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-[var(--border)]">
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${k.score * 10}%`, background: ACCENT_HEX[accent] }}
                  />
                </div>
                <span className="shrink-0 text-[10px] font-semibold" style={{ color: ACCENT_HEX[accent] }}>
                  {STATUS_LABEL[k.status]}
                </span>
              </div>
              <p className="mt-1.5 text-[11px] leading-4 text-[var(--text-secondary)]">{k.signal}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg attr-card bg-[var(--surface)] px-3 py-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">Overall rating</p>
          <p className="text-xs font-semibold text-[var(--text-primary)]">{rating ?? "—"}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">Weighted score</p>
          <p className="text-sm font-bold tabular-nums text-[var(--ai-cyan)]">{weighted.toFixed(1)}/10</p>
        </div>
      </div>
    </div>
  );
}

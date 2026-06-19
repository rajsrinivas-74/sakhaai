"use client";

import { Target } from "lucide-react";
import { transformationScorecard, type ScorecardMetric } from "@/data/workforce";
import { ACCENT_HEX } from "@/lib/accents";

/**
 * The CPO's transformation OKRs — each metric vs its target with a trend
 * sparkline and progress-to-target. Reframes the page from a dashboard of
 * numbers into a goal-driven command center.
 */
export function TransformationScorecard() {
  return (
    <div className="rounded-xl attr-card bg-[var(--bg)] p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
        <Target className="h-4 w-4 text-[var(--ai-cyan)]" />
        Transformation scorecard
        <span className="text-[11px] font-normal text-[var(--text-muted)]">· tracked vs FY26 target</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {transformationScorecard.map((m) => (
          <MetricCard key={m.label} metric={m} />
        ))}
      </div>
    </div>
  );
}

function progress(m: ScorecardMetric): number {
  // 0-1 attainment toward target, honouring direction of improvement.
  if (m.better === "up") return Math.max(0, Math.min(1, m.value / m.target));
  // lower is better: full credit at/below target, scaled from the worst point.
  const worst = Math.max(...m.trend, m.value);
  if (m.value <= m.target) return 1;
  return Math.max(0, Math.min(1, (worst - m.value) / (worst - m.target)));
}

function MetricCard({ metric: m }: { metric: ScorecardMetric }) {
  const p = progress(m);
  const accent = p >= 0.85 ? "cyan" : p >= 0.5 ? "blue" : "orange";
  return (
    <div className="rounded-lg border border-[var(--border)] p-3">
      <p className="text-[11px] font-medium text-[var(--text-secondary)]">{m.label}</p>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-2xl font-bold tabular-nums text-[var(--text-primary)]">
          {m.value}
          <span className="text-xs text-[var(--text-muted)]">{m.unit}</span>
        </span>
        <span className="text-[10px] text-[var(--text-muted)]">/ {m.target}{m.unit}</span>
      </div>
      <Spark trend={m.trend} color={ACCENT_HEX[accent]} />
      <div className="mt-1.5 h-1 rounded-full bg-[var(--border)]">
        <div className="h-1 rounded-full" style={{ width: `${Math.round(p * 100)}%`, background: ACCENT_HEX[accent] }} />
      </div>
      <p className="mt-1 text-[10px]" style={{ color: ACCENT_HEX[accent] }}>
        {Math.round(p * 100)}% to target
      </p>
    </div>
  );
}

function Spark({ trend, color }: { trend: number[]; color: string }) {
  const w = 80, h = 22;
  const min = Math.min(...trend), max = Math.max(...trend);
  const span = max - min || 1;
  const pts = trend
    .map((v, i) => `${(i / (trend.length - 1)) * w},${h - ((v - min) / span) * h}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-2 h-5 w-full" preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`${pts} ${w},${h} 0,${h}`} fill={color} opacity="0.08" stroke="none" />
    </svg>
  );
}

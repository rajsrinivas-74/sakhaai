"use client";

import { motion } from "framer-motion";
import { GitBranch, IndianRupee, Lightbulb, TrendingUp } from "lucide-react";
import { managerKpp } from "@/data/manager";
import { ACCENT_HEX, accentRgba, type Accent } from "@/lib/accents";
import { AgentChip } from "@/components/AgentChip";

/**
 * Vikram's own KPP, consolidated and role-aware. Revenue & margin roll up only
 * from his revenue-bearing Delivery Managers; engineers carry delivery KPPs but
 * their utilisation flows into margin as cost. The margin bridge shows exactly
 * which accounts/people drive the miss, and the cross-link ties a junior's
 * utilisation to the senior's margin.
 */
export function ManagerKppRollup() {
  const k = managerKpp;
  const revPct = Math.round((k.revenue.actual / k.revenue.target) * 100);
  const marPct = Math.round((k.margin.actual / k.margin.target) * 100);

  return (
    <div
      className="rounded-xl border p-5"
      style={{ borderColor: accentRgba("purple", 0.4), background: accentRgba("purple", 0.05) }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
          <IndianRupee className="h-4 w-4 text-[var(--ai-purple)]" />
          Your KPP · revenue &amp; margin
          <span className="text-[11px] font-normal text-[var(--text-muted)]">· rolled up from your team</span>
        </div>
        <AgentChip agent="manager" status="watching" />
      </div>

      {/* HEADLINE KPPs */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <KppCell label="Revenue" actual={k.revenue.actual} target={k.revenue.target} pct={revPct} good={revPct >= 100} />
        <KppCell label="Gross margin" actual={k.margin.actual} target={k.margin.target} pct={marPct} good={marPct >= 100} />
      </div>

      {/* COMMERCIAL CONTRIBUTORS (revenue-bearing DMs only) */}
      <div className="mt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Commercial contribution · your Delivery Managers
        </p>
        <div className="mt-2 space-y-1.5">
          {k.commercialReports.map((r) => {
            const rev = Math.round((r.revenue / r.revenueTarget) * 100);
            const mar = Math.round((r.margin / r.marginTarget) * 100);
            return (
              <div key={r.name} className="flex items-center gap-3 rounded-lg attr-card bg-[var(--bg)] px-3 py-2">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
                  style={{ background: accentRgba("purple", 0.16), color: ACCENT_HEX.purple }}
                >
                  {r.initial}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-[var(--text-primary)]">{r.name}</span>
                <Pill label="Rev" pct={rev} />
                <Pill label="Margin" pct={mar} />
              </div>
            );
          })}
        </div>
      </div>

      {/* MARGIN BRIDGE — why the margin KPP misses */}
      <div className="mt-4 rounded-lg attr-card bg-[var(--bg)] p-3">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
          <GitBranch className="h-3.5 w-3.5 text-[var(--ai-pink)]" />
          Margin gap, decomposed
        </p>
        <div className="mt-2 space-y-1">
          <BridgeRow label="Margin target" value={`₹${k.margin.target.toFixed(1)} Cr`} bold />
          {k.marginBridge.map((b) => (
            <BridgeRow key={b.label} label={b.label} value={`${b.delta > 0 ? "+" : "−"}₹${Math.abs(b.delta).toFixed(1)} Cr`} accent="pink" indent />
          ))}
          <BridgeRow label="Margin actual" value={`₹${k.margin.actual.toFixed(1)} Cr · ${marPct}%`} bold accent="orange" />
        </div>
      </div>

      {/* DELIVERY BAND (engineers — no revenue/margin KPP) */}
      <div className="mt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Delivery &amp; quality · your engineers
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {k.deliveryReports.map((d) => (
            <div
              key={d.name}
              className="rounded-lg border p-2.5"
              style={{ borderColor: d.flag ? accentRgba("pink", 0.5) : "var(--border)" }}
            >
              <div className="flex items-center justify-between">
                <p className="truncate text-sm font-medium text-[var(--text-primary)]">{d.name}</p>
                {d.flag && (
                  <span className="shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: accentRgba("pink", 0.16), color: ACCENT_HEX.pink }}>
                    {d.flag}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[var(--text-muted)]">{d.role}</p>
              <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-[var(--text-secondary)]">
                <span>Defect {d.defect}</span>
                <span>Automation {d.automation}</span>
                <span>Util {d.util}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CROSS-LINK INSIGHT */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 flex items-start gap-2 rounded-lg border-l-2 p-3"
        style={{ borderColor: ACCENT_HEX.cyan, background: accentRgba("cyan", 0.06) }}
      >
        <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--ai-cyan)]" />
        <div>
          <p className="text-xs leading-5 text-[var(--text-primary)]">{k.crossLink}</p>
          <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-[var(--ai-cyan)]">
            <TrendingUp className="h-3 w-3" />
            {k.forecast}
          </p>
        </div>
      </motion.div>

      <p className="mt-2 text-[10px] text-[var(--text-muted)]">
        Revenue &amp; margin roll up from your Delivery Managers only; engineers carry delivery KPPs. Your reports&rsquo; detail, not other teams&rsquo;.
      </p>
    </div>
  );
}

function KppCell({ label, actual, target, pct, good }: { label: string; actual: number; target: number; pct: number; good: boolean }) {
  const accent: Accent = good ? "cyan" : "orange";
  return (
    <div className="rounded-lg attr-card bg-[var(--bg)] p-3">
      <p className="text-[11px] font-medium text-[var(--text-secondary)]">{label}</p>
      <div className="mt-0.5 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tabular-nums text-[var(--text-primary)]">₹{actual.toFixed(1)}</span>
        <span className="text-[11px] text-[var(--text-muted)]">/ ₹{target.toFixed(1)} Cr</span>
        <span className="ml-auto text-sm font-bold" style={{ color: ACCENT_HEX[accent] }}>{pct}%</span>
      </div>
      <div className="mt-1.5 h-1.5 rounded-full bg-[var(--border)]">
        <div className="h-1.5 rounded-full" style={{ width: `${Math.min(100, pct)}%`, background: ACCENT_HEX[accent] }} />
      </div>
    </div>
  );
}

function Pill({ label, pct }: { label: string; pct: number }) {
  const accent: Accent = pct >= 100 ? "cyan" : "orange";
  return (
    <span
      className="shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums"
      style={{ background: accentRgba(accent, 0.16), color: ACCENT_HEX[accent] }}
    >
      {label} {pct}%
    </span>
  );
}

function BridgeRow({ label, value, bold, accent, indent }: { label: string; value: string; bold?: boolean; accent?: Accent; indent?: boolean }) {
  return (
    <div className={`flex items-center justify-between text-xs ${indent ? "pl-3" : ""}`}>
      <span className={bold ? "font-semibold text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}>{label}</span>
      <span
        className={`tabular-nums ${bold ? "font-semibold" : ""}`}
        style={{ color: accent ? ACCENT_HEX[accent] : "var(--text-primary)" }}
      >
        {value}
      </span>
    </div>
  );
}

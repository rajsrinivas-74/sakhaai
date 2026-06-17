"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, IndianRupee, Loader2, TrendingUp, Users, Zap } from "lucide-react";
import type { AgentEvent } from "@/types/sakha";
import { agentById } from "@/data/agents";
import { ACCENT_HEX, accentRgba } from "@/lib/accents";
import { AgentChip } from "@/components/AgentChip";

const DEMAND = 92;
const BASE_SUPPLY = 38;
const MAX_COHORT = 38;

/**
 * Anita's executive wow moment — most entries stop at the employee; this shows
 * organizational impact. Drag the cohort size and watch the AI demand-supply
 * gap close, with ₹ saved and mobility computed live; approve to fan the
 * decision out into a batch of autonomous agent actions.
 */
export function WorkforceSimulator() {
  const [count, setCount] = useState(0);
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);
  const [batch, setBatch] = useState<AgentEvent[]>([]);

  const supply = BASE_SUPPLY + count;
  const gap = Math.max(0, DEMAND - supply);
  const savingsCr = (count * 0.11).toFixed(1);
  const mobility = Math.round(count * 0.47);
  const closing = count >= 30;

  async function approve() {
    if (count === 0) return;
    setApproving(true);
    try {
      const res = await fetch("/api/cohort", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count }),
      });
      const data = (await res.json()) as { events?: AgentEvent[] };
      setBatch((data.events ?? []).slice(-5));
      setApproved(true);
    } catch {
      /* demo-safe */
    } finally {
      setApproving(false);
    }
  }

  return (
    <div
      className="rounded-xl border p-5"
      style={{ borderColor: accentRgba("blue", 0.4), background: accentRgba("blue", 0.05) }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
          <Zap className="h-4 w-4 text-[var(--ai-blue)]" />
          Reskilling simulator
        </div>
        <AgentChip agent="workforce" status={approved ? "acting" : "thinking"} />
      </div>
      <p className="mt-1 text-xs text-[var(--text-secondary)]">
        Close the AI capability gap with internal talent — not external hiring.
      </p>

      {/* DEMAND VS SUPPLY GAUGE */}
      <div className="mt-4 flex items-end justify-between">
        <Stat label="AI demand" value={DEMAND} color={ACCENT_HEX.pink} />
        <Stat label="AI supply" value={supply} color={ACCENT_HEX.cyan} live />
        <div className="text-right">
          <p className="text-[11px] text-[var(--text-secondary)]">Gap</p>
          <p
            className="text-3xl font-bold tabular-nums"
            style={{ color: gap > 0 ? ACCENT_HEX.orange : ACCENT_HEX.cyan }}
          >
            {gap}
          </p>
        </div>
      </div>

      {/* GAP BAR */}
      <div className="relative mt-3 h-3 overflow-hidden rounded-full bg-[var(--border)]">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: ACCENT_HEX.cyan }}
          animate={{ width: `${supply}%` }}
        />
        <motion.div
          className="absolute inset-y-0 rounded-r-full opacity-50"
          style={{ background: ACCENT_HEX.orange, left: `${supply}%` }}
          animate={{ width: `${gap}%` }}
        />
        <div
          className="absolute inset-y-0 w-0.5 bg-[var(--ai-pink)]"
          style={{ left: `${DEMAND}%` }}
          title="Demand line"
        />
      </div>

      {/* SLIDER */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-medium text-[var(--text-primary)]">
            <Users className="h-3.5 w-3.5 text-[var(--ai-blue)]" />
            Reskill candidates
          </span>
          <span className="font-bold tabular-nums text-[var(--text-primary)]">{count}</span>
        </div>
        <input
          type="range"
          min={0}
          max={MAX_COHORT}
          value={count}
          disabled={approved}
          onChange={(e) => setCount(Number(e.target.value))}
          className="mt-2 w-full accent-[var(--ai-blue)] disabled:opacity-60"
        />
        <p className="mt-1 text-[11px] text-[var(--text-muted)]">
          {closing ? "On track to close the gap by Q3" : "Drag to model the impact"}
        </p>
      </div>

      {/* OUTPUTS */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <Output icon={IndianRupee} label="Saved vs hiring" value={`₹${savingsCr} Cr`} accent="cyan" />
        <Output icon={TrendingUp} label="Internal mobility" value={`+${mobility}%`} accent="purple" />
        <Output icon={Users} label="Cohort size" value={String(count)} accent="blue" />
      </div>

      {/* APPROVE */}
      {!approved ? (
        <button
          onClick={approve}
          disabled={count === 0 || approving}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          style={{ background: ACCENT_HEX.blue }}
        >
          {approving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Fanning out to {count} agents…
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" /> Approve cohort · {count} candidates
            </>
          )}
        </button>
      ) : (
        <div className="mt-4 space-y-1.5">
          <div className="grid grid-cols-3 gap-2">
            <Output icon={TrendingUp} label="Gap closure" value="78%" accent="cyan" />
            <Output icon={Users} label="Internal mobility" value="+18%" accent="purple" />
            <Output icon={IndianRupee} label="Attrition" value="−9%" accent="blue" />
          </div>
          <p className="flex items-center gap-1.5 pt-1 text-xs font-semibold text-[var(--ai-cyan)]">
            <CheckCircle2 className="h-4 w-4" />
            Approved — agents executing across the workforce
          </p>
          {batch.map((e, i) => {
            const def = agentById(e.agent);
            return (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.25 }}
                className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
              >
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[var(--ai-cyan)]" />
                <span
                  className="shrink-0 text-[11px] font-semibold"
                  style={{ color: ACCENT_HEX[def.accent] }}
                >
                  {def.name}
                </span>
                <span className="truncate text-xs text-[var(--text-secondary)]">{e.action}</span>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, color, live }: { label: string; value: number; color: string; live?: boolean }) {
  return (
    <div>
      <p className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)]">
        {label}
        {live && (
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: color }} />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: color }} />
          </span>
        )}
      </p>
      <p className="text-3xl font-bold tabular-nums" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

function Output({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  accent: "blue" | "purple" | "cyan";
}) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-2.5 text-center">
      <Icon className="mx-auto h-4 w-4" style={{ color: ACCENT_HEX[accent] }} />
      <p className="mt-1 text-base font-bold text-[var(--text-primary)] tabular-nums">{value}</p>
      <p className="text-[10px] leading-3 text-[var(--text-muted)]">{label}</p>
    </div>
  );
}

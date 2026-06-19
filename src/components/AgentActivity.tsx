"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Cpu, Loader2, ShieldCheck } from "lucide-react";
import type { AgentEvent } from "@/types/sakha";
import { agentById } from "@/data/agents";
import { ACCENT_HEX, accentRgba } from "@/lib/accents";

/**
 * The live "agents at work" stream. Events reveal progressively so the fleet
 * always looks busy, and any newly-pushed events (e.g. a golden-thread handoff)
 * animate in at the top. This is the component that makes Sakha *feel* agentic.
 */
export function AgentActivity({
  events,
  title = "Agent activity",
  revealMs = 700,
  compact = false,
}: {
  events: AgentEvent[];
  title?: string;
  /** Stagger between seed events revealing on mount. */
  revealMs?: number;
  compact?: boolean;
}) {
  // Most-recent first.
  const ordered = useMemo(() => [...events].reverse(), [events]);
  const [shown, setShown] = useState(1);

  useEffect(() => {
    if (shown >= ordered.length) return;
    const t = setTimeout(() => setShown((n) => Math.min(n + 1, ordered.length)), revealMs);
    return () => clearTimeout(t);
  }, [shown, ordered.length, revealMs]);

  // New live events prepend to the front of `ordered`, so they're always within
  // the visible window — no extra state nudge needed.
  const visible = ordered.slice(0, shown);

  return (
    <div className="rounded-xl attr-card bg-[var(--bg)] p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
          <Cpu className="h-4 w-4 text-[var(--ai-cyan)]" />
          {title}
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--ai-cyan)]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--ai-cyan)] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--ai-cyan)]" />
          </span>
          live
        </span>
      </div>

      <div className={`mt-4 space-y-2.5 ${compact ? "max-h-[260px] overflow-y-auto thin-scroll pr-1" : ""}`}>
        <AnimatePresence initial={false}>
          {visible.map((e) => (
            <AgentRow key={e.id} event={e} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AgentRow({ event }: { event: AgentEvent }) {
  const def = agentById(event.agent);
  const color = ACCENT_HEX[def.accent];
  const active = event.status === "thinking" || event.status === "acting" || event.status === "handoff";
  const handoff = agentById(event.handoffTo ?? event.agent);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className="flex items-start gap-3 rounded-lg border p-3"
      style={{
        borderColor: active ? accentRgba(def.accent, 0.5) : "var(--border)",
        background: active ? accentRgba(def.accent, 0.07) : "transparent",
      }}
    >
      <span
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
        style={{ background: accentRgba(def.accent, 0.16), color }}
      >
        {active ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <ShieldCheck className="h-3.5 w-3.5" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold" style={{ color }}>
            {def.name}
          </span>
          {event.handoffTo && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--text-muted)]">
              <ArrowRight className="h-3 w-3" />
              <span style={{ color: ACCENT_HEX[handoff.accent] }}>{handoff.name}</span>
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs leading-5 text-[var(--text-secondary)]">{event.action}</p>
        {event.detail && (
          <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">{event.detail}</p>
        )}
      </div>
      <span className="shrink-0 text-[10px] text-[var(--text-muted)]">{event.time}</span>
    </motion.div>
  );
}

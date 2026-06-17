"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Cpu } from "lucide-react";
import type { AgentEvent, AgentId, AgentPhase } from "@/types/sakha";
import { agentList, agentById, seedAgentEvents } from "@/data/agents";
import { useOverlay } from "@/lib/useOverlay";
import { ACCENT_HEX, accentRgba } from "@/lib/accents";

const PHASE_LABEL: Record<AgentPhase, string> = { employee: "Employee", manager: "Manager", hr: "HR" };
const PHASE_ACCENT: Record<AgentPhase, string> = {
  employee: ACCENT_HEX.purple,
  manager: ACCENT_HEX.cyan,
  hr: ACCENT_HEX.blue,
};

function timeKey(t: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(t);
  return m ? parseInt(m[1], 10) * 60 + parseInt(m[2], 10) : 100000;
}

/**
 * The always-on right rail — the agent fleet made the visible star, not buried
 * chrome. Six named agents that pulse when working, over a unified, cross-
 * persona timeline. Same data from every lens, so the propagation is always in
 * view without scrolling the main column.
 */
export function LiveRail() {
  const overlay = useOverlay();
  const [burst, setBurst] = useState<Set<AgentId>>(new Set());
  const prevLen = useRef(0);
  const feedRef = useRef<HTMLDivElement | null>(null);

  const events = useMemo(() => {
    return [...seedAgentEvents, ...overlay.events].sort((a, b) => timeKey(a.time) - timeKey(b.time));
  }, [overlay.events]);

  useEffect(() => {
    if (overlay.events.length > prevLen.current) {
      const fresh = overlay.events.slice(prevLen.current);
      setBurst(new Set(fresh.map((e) => e.agent)));
      const t = setTimeout(() => setBurst(new Set()), 6000);
      prevLen.current = overlay.events.length;
      return () => clearTimeout(t);
    }
    prevLen.current = overlay.events.length;
  }, [overlay.events]);

  const resting = useMemo(() => {
    const s = new Set<AgentId>();
    for (const e of events) if (e.status === "thinking" || e.status === "acting") s.add(e.agent);
    return s;
  }, [events]);

  const isActive = (id: AgentId) => burst.has(id) || resting.has(id);
  const activeCount = agentList.filter((a) => isActive(a.id)).length;

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [events.length]);

  return (
    <div className="surface flex h-full min-h-0 flex-col overflow-hidden" style={{ background: "var(--sidebar)" }}>
      {/* FLEET */}
      <div className="border-b border-[var(--border)] p-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text-primary)]">
            <span className="brand-text">🌿</span> Agent Fleet
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--ai-cyan)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--ai-cyan)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--ai-cyan)]" />
            </span>
            {activeCount} active
          </span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {agentList.map((a) => {
            const active = isActive(a.id);
            const color = ACCENT_HEX[a.accent];
            return (
              <span
                key={a.id}
                title={a.remit}
                className="flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[11px] font-medium"
                style={{
                  borderColor: active ? accentRgba(a.accent, 0.5) : "var(--border)",
                  background: active ? accentRgba(a.accent, 0.1) : "transparent",
                  color: active ? color : "var(--text-secondary)",
                }}
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  {active && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: color }} />
                  )}
                  <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: color, opacity: active ? 1 : 0.4 }} />
                </span>
                {a.name.replace(" Agent", "")}
              </span>
            );
          })}
        </div>
      </div>

      {/* UNIFIED TIMELINE */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
          <Cpu className="h-3.5 w-3.5 text-[var(--ai-cyan)]" />
          Unified timeline
        </span>
        <span className="text-[10px] text-[var(--text-muted)]">{events.length} actions</span>
      </div>
      <div ref={feedRef} className="thin-scroll min-h-0 flex-1 space-y-1.5 overflow-y-auto px-3 pb-3">
        {events.map((e) => (
          <TimelineRow key={e.id} event={e} />
        ))}
      </div>
    </div>
  );
}

function TimelineRow({ event }: { event: AgentEvent }) {
  const def = agentById(event.agent);
  const color = ACCENT_HEX[def.accent];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-2.5"
    >
      <div className="flex items-center gap-2">
        <span className="text-[10px] tabular-nums text-[var(--text-muted)]">{event.time}</span>
        {event.phase && (
          <span className="text-[9px] font-semibold uppercase tracking-wide" style={{ color: PHASE_ACCENT[event.phase] }}>
            {PHASE_LABEL[event.phase]}
          </span>
        )}
        <span className="ml-auto h-1.5 w-1.5 rounded-full" style={{ background: color }} />
        <span className="text-[10px] font-semibold" style={{ color }}>
          {def.name.replace(" Agent", "")}
        </span>
      </div>
      <p className="mt-1 text-xs leading-4 text-[var(--text-primary)]">{event.action}</p>
      {event.detail && <p className="text-[10px] text-[var(--text-muted)]">{event.detail}</p>}
    </motion.div>
  );
}

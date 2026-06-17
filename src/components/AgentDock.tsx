"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Cpu, RotateCcw } from "lucide-react";
import type { AgentEvent, AgentId, AgentPhase } from "@/types/sakha";
import { agentList, agentById, seedAgentEvents } from "@/data/agents";
import { useOverlay } from "@/lib/useOverlay";
import { ACCENT_HEX } from "@/lib/accents";

const PHASE_LABEL: Record<AgentPhase, string> = {
  employee: "Employee",
  manager: "Manager",
  hr: "HR",
};
const PHASE_ACCENT: Record<AgentPhase, string> = {
  employee: ACCENT_HEX.purple,
  manager: ACCENT_HEX.cyan,
  hr: ACCENT_HEX.blue,
};

/** "09:02" → minutes; "now"/"just now" sort last (most recent). */
function timeKey(t: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(t);
  if (m) return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  return 100000;
}

/**
 * The persistent Agent Dock — the spine that turns three lenses into one
 * product. A slim always-on bar shows the six-agent fleet (orbs that pulse
 * when working) plus the latest action; expanding it reveals the unified,
 * cross-persona timeline. State is shared via the store, so the same flow is
 * visible from Employee, Manager, and HR.
 */
export function AgentDock() {
  const overlay = useOverlay();
  const [open, setOpen] = useState(false);
  const [burst, setBurst] = useState<Set<AgentId>>(new Set());
  const prevLen = useRef(0);
  const feedRef = useRef<HTMLDivElement | null>(null);

  const events = useMemo(() => {
    const all = [...seedAgentEvents, ...overlay.events];
    return all.sort((a, b) => timeKey(a.time) - timeKey(b.time));
  }, [overlay.events]);

  // When new events land, flare the agents involved for a few seconds.
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

  // Resting-active: agents currently thinking/acting (calm at rest).
  const resting = useMemo(() => {
    const s = new Set<AgentId>();
    for (const e of events) if (e.status === "thinking" || e.status === "acting") s.add(e.agent);
    return s;
  }, [events]);

  const isActive = (id: AgentId) => burst.has(id) || resting.has(id);
  const latest = events[events.length - 1];

  useEffect(() => {
    if (open && feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [open, events.length]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3">
      <div className="pointer-events-auto w-full max-w-[1400px]">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 16, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 16, height: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="surface mb-2 overflow-hidden"
              style={{ background: "var(--sidebar)" }}
            >
              <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2.5">
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  Unified agent timeline
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  one aspiration · {events.length} autonomous actions · Employee → Manager → HR
                </span>
              </div>
              <div ref={feedRef} className="thin-scroll max-h-[40vh] space-y-1.5 overflow-y-auto p-3">
                {events.map((e) => (
                  <TimelineRow key={e.id} event={e} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* COLLAPSED BAR — always visible */}
        <div className="surface flex items-center gap-3 px-4 py-2.5" style={{ background: "var(--sidebar)" }}>
          <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-[var(--text-primary)]">
            <span className="brand-text">🌿</span>
            Agent Fleet
          </span>

          <div className="flex shrink-0 items-center gap-1.5">
            {agentList.map((a) => (
              <FleetOrb key={a.id} id={a.id} active={isActive(a.id)} />
            ))}
          </div>

          <div className="mx-1 hidden h-6 w-px shrink-0 bg-[var(--border)] sm:block" />

          {latest && (
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex min-w-0 flex-1 items-center gap-2 text-left"
            >
              <span className="shrink-0 text-[11px] tabular-nums text-[var(--text-muted)]">
                {latest.time}
              </span>
              <span
                className="shrink-0 text-[11px] font-semibold"
                style={{ color: ACCENT_HEX[agentById(latest.agent).accent] }}
              >
                {agentById(latest.agent).name}
              </span>
              <span className="truncate text-xs text-[var(--text-secondary)]">{latest.action}</span>
            </button>
          )}

          <button
            onClick={() => {
              void fetch("/api/reset", { method: "POST" }).finally(() => window.location.reload());
            }}
            title="Reset demo state"
            aria-label="Reset demo"
            className="surface-hover ml-auto flex shrink-0 items-center justify-center rounded-lg border border-[var(--border)] p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            className="surface-hover flex shrink-0 items-center gap-1 rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-[11px] font-medium text-[var(--text-secondary)]"
          >
            <Cpu className="h-3.5 w-3.5 text-[var(--ai-cyan)]" />
            Timeline
            {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

function FleetOrb({ id, active }: { id: AgentId; active: boolean }) {
  const def = agentById(id);
  const color = ACCENT_HEX[def.accent];
  return (
    <span title={`${def.name} — ${def.remit}`} className="relative flex h-3 w-3 items-center justify-center">
      {active && (
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
          style={{ background: color }}
        />
      )}
      <span
        className="relative inline-flex h-2.5 w-2.5 rounded-full transition-opacity"
        style={{ background: color, opacity: active ? 1 : 0.4 }}
      />
    </span>
  );
}

function TimelineRow({ event }: { event: AgentEvent }) {
  const def = agentById(event.agent);
  const color = ACCENT_HEX[def.accent];
  const phase = event.phase;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 rounded-lg px-2 py-1.5"
    >
      <span className="w-10 shrink-0 text-[11px] tabular-nums text-[var(--text-muted)]">{event.time}</span>
      {phase && (
        <span
          className="hidden w-16 shrink-0 text-[10px] font-semibold uppercase tracking-wide sm:block"
          style={{ color: PHASE_ACCENT[phase] }}
        >
          {PHASE_LABEL[phase]}
        </span>
      )}
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />
      <span className="shrink-0 text-[11px] font-semibold" style={{ color }}>
        {def.name}
      </span>
      <span className="truncate text-xs text-[var(--text-secondary)]">
        {event.action}
        {event.detail && <span className="text-[var(--text-muted)]"> · {event.detail}</span>}
      </span>
    </motion.div>
  );
}

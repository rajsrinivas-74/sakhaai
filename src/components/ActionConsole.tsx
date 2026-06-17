"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Brain,
  CalendarCheck,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Send,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import type { AgentEvent, AgentId, CareerGpsResult, EmployeeTwin } from "@/types/sakha";
import { agentById } from "@/data/agents";
import { ACCENT_HEX, accentRgba } from "@/lib/accents";
import { AutonomyBadge, type AutonomyLevel } from "@/components/AutonomyBadge";

const AGENT_ICON: Record<AgentId, typeof Brain> = {
  career: Brain,
  learning: GraduationCap,
  opportunity: Target,
  workforce: TrendingUp,
  manager: Send,
  wellbeing: Sparkles,
};

const AGENT_AUTONOMY: Record<AgentId, AutonomyLevel> = {
  career: "auto",
  learning: "consented",
  opportunity: "auto",
  workforce: "auto",
  manager: "auto",
  wellbeing: "consented",
};

const ROW_ICON: Record<string, typeof CalendarCheck> = {
  "Reserved learning blocks": CalendarCheck,
};

/**
 * The hero. A goal becomes a cascade of autonomous actions, executed live:
 * each step runs (queued → running → done) and lands a concrete artifact, while
 * the Digital Twin ticks up in real time. This is "decisions becoming actions."
 */
export function ActionConsole({
  events,
  twin,
  result,
}: {
  events: AgentEvent[];
  twin: EmployeeTwin;
  result: CareerGpsResult;
}) {
  const [step, setStep] = useState(0); // index currently "running"
  const done = step >= events.length;
  const completed = Math.min(step, events.length);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => setStep((s) => s + 1), 950);
    return () => clearTimeout(t);
  }, [step, done]);

  // Bring the live console into view the moment Autopilot engages, so the
  // action stream is never stranded below the fold.
  useEffect(() => {
    rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div ref={rootRef} className="space-y-4 scroll-mt-2">
      {/* Sticky progress — stays visible while the user scrolls the plan */}
      <div className="sticky top-0 z-10 flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_92%,transparent)] p-3 backdrop-blur">
        <motion.span
          animate={done ? {} : { scale: [1, 1.12, 1] }}
          transition={{ repeat: Infinity, duration: 1.3 }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{ background: accentRgba("purple", 0.16), color: ACCENT_HEX.purple }}
        >
          <Sparkles className="h-4 w-4" />
        </motion.span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {done ? "Plan executed — autonomously" : "Autopilot is executing your plan…"}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            {done ? `${events.length} actions taken across the agent fleet` : "Each step is logged and reversible"}
          </p>
        </div>
        <span
          className="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums"
          style={{ background: accentRgba(done ? "cyan" : "purple", 0.16), color: done ? ACCENT_HEX.cyan : ACCENT_HEX.purple }}
        >
          {completed}/{events.length} done
        </span>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
        {/* ACTION STREAM */}
        <div className="space-y-2">
          {events.map((e, i) => {
            const state: "queued" | "running" | "done" =
              i < step ? "done" : i === step ? "running" : "queued";
            return <ActionRow key={e.id} event={e} state={state} delay={i * 0.05} />;
          })}
        </div>

        {/* LIVE DIGITAL TWIN TICK */}
        <TwinTick twin={twin} result={result} active={step} total={events.length} />
      </div>
    </div>
  );
}

function ActionRow({
  event,
  state,
  delay,
}: {
  event: AgentEvent;
  state: "queued" | "running" | "done";
  delay: number;
}) {
  const def = agentById(event.agent);
  const color = ACCENT_HEX[def.accent];
  const Icon = ROW_ICON[event.action] ?? AGENT_ICON[event.agent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: state === "queued" ? 0.5 : 1, y: 0 }}
      transition={{ delay }}
      className="flex items-center gap-3 rounded-xl border p-3"
      style={{
        borderColor: state === "running" ? accentRgba(def.accent, 0.5) : "var(--border)",
        background: state === "running" ? accentRgba(def.accent, 0.07) : "var(--bg)",
      }}
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ background: accentRgba(def.accent, 0.16), color }}
      >
        {state === "done" ? (
          <CheckCircle2 className="h-4 w-4 text-[var(--ai-cyan)]" />
        ) : state === "running" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Icon className="h-4 w-4" />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold" style={{ color }}>
            {def.name}
          </span>
          <span className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
            {state}
          </span>
        </div>
        <p className="truncate text-sm text-[var(--text-primary)]">{event.action}</p>
      </div>

      <AnimatePresence>
        {state === "done" && event.artifact && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden shrink-0 rounded-md px-2 py-1 text-[11px] font-medium sm:inline-flex"
            style={{ background: accentRgba(def.accent, 0.14), color }}
          >
            {event.artifact}
          </motion.span>
        )}
      </AnimatePresence>

      {state === "done" && (
        <span className="hidden shrink-0 lg:block">
          <AutonomyBadge level={AGENT_AUTONOMY[event.agent]} />
        </span>
      )}
    </motion.div>
  );
}

function TwinTick({
  twin,
  result,
  active,
  total,
}: {
  twin: EmployeeTwin;
  result: CareerGpsResult;
  active: number;
  total: number;
}) {
  // Readiness climbs as actions complete: from the assessed match toward +6.
  const start = result.matchPercentage;
  const target = Math.min(100, start + 6);
  const progress = total > 0 ? Math.min(1, active / total) : 1;
  const readiness = Math.round(start + (target - start) * progress);
  const hours = result.missingSkills[0]?.estimatedHoursPerWeek ?? 4;
  const newSkillVisible = active >= 3; // after "Enrolled in Python for AI"

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
        <Sparkles className="h-3.5 w-3.5 text-[var(--ai-cyan)]" />
        Digital Twin · updating live
      </p>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-[11px] text-[var(--text-secondary)]">AI readiness</p>
          <p className="text-3xl font-bold text-[var(--text-primary)] tabular-nums">{readiness}%</p>
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-[var(--ai-cyan)]">
          <TrendingUp className="h-3.5 w-3.5" />+{readiness - start}
        </span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-[var(--border)]">
        <motion.div
          className="h-1.5 rounded-full"
          style={{ background: ACCENT_HEX.cyan }}
          animate={{ width: `${readiness}%` }}
        />
      </div>

      <p className="mt-4 text-[11px] text-[var(--text-secondary)]">Skills</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {twin.skills.slice(0, 4).map((s) => (
          <span
            key={s}
            className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[11px] text-[var(--text-secondary)]"
          >
            {s}
          </span>
        ))}
        <AnimatePresence>
          {newSkillVisible && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
              style={{ background: accentRgba("purple", 0.16), color: ACCENT_HEX.purple }}
            >
              + Python · learning
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2">
        <span className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
          <CalendarCheck className="h-3.5 w-3.5 text-[var(--ai-cyan)]" />
          Learning time
        </span>
        <span className="text-xs font-semibold text-[var(--text-primary)]">{hours}h / week</span>
      </div>
    </div>
  );
}

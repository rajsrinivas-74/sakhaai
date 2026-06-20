"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowRightLeft, Compass, Flag, Pause, Play, X } from "lucide-react";
import type { View } from "@/components/Sidebar";
import { ACCENT_HEX, accentRgba, type Accent } from "@/lib/accents";

type TourActor = "priya" | "vikram" | "anita";
export type TourStep = {
  actor: TourActor;
  view: View;
  lens: string;
  title: string;
  caption: string;
  /** Subtle "what's happening" line shown under the caption. */
  detail: string;
  /** Dwell time (ms) before auto-advancing to the next step. */
  dwell: number;
};

/** The cross-persona golden thread — dashboard-first per persona, narration
 * names the agents at work. Dwell times total ~5 minutes for a hands-free run;
 * a presenter can always click Next to move faster. */
export const TOUR: TourStep[] = [
  // ── PRIYA ─────────────────────────────────────────────
  {
    actor: "priya", view: "emp-overview", lens: "Employee · Priya", title: "Priya’s dashboard",
    caption: "Start where Priya starts: performance, growth, learning and opportunities in one place — the evidence Sakha reasons over.",
    detail: "AGENTS: the fleet has already assembled her Digital Twin before she asks a thing.",
    dwell: 20000,
  },
  {
    actor: "priya", view: "chat", lens: "Employee · Priya", title: "Priya asks",
    caption: "She asks a specific question — which career to target to move into AI Delivery Management.",
    detail: "AGENTS: Sakha is a fleet, not a chatbot — it answers from her Twin and KPPs, not a script.",
    dwell: 28000,
  },
  {
    actor: "priya", view: "career", lens: "Employee · Priya", title: "Agents reason — live",
    caption: "Six agents wake up: the Career Agent reads her Twin, then hands off to Learning, Opportunity and Workforce.",
    detail: "AGENTS AT WORK: every reasoning line is a different agent — Career → gaps, Learning → courses, Opportunity → roles, Workforce → org demand.",
    dwell: 50000,
  },
  {
    actor: "priya", view: "emp-performance", lens: "Employee · Priya", title: "Grounded, not guessed",
    caption: "The Career Agent grounded every gap in Priya’s real KPP appraisal and Vikram’s manager feedback.",
    detail: "AGENT EVIDENCE: margin-miss → commercial gap; the manager’s flagged areas become the GPS gaps.",
    dwell: 42000,
  },
  // ── VIKRAM ────────────────────────────────────────────
  {
    actor: "vikram", view: "mgr-overview", lens: "Manager · Vikram", title: "Manager’s dashboard",
    caption: "Same moment, a different lens. Vikram opens to team health and readiness first.",
    detail: "AGENTS: the Manager Agent surfaced Priya’s move to his board — he didn’t go looking.",
    dwell: 22000,
  },
  {
    actor: "vikram", view: "mgr-team", lens: "Manager · Vikram", title: "Ready, and the gap",
    caption: "Priya in his spotlight — the same readiness she sees, plus the drafted action to assign her to AI Studio.",
    detail: "AGENTS: the Manager Agent ranks readiness; the Wellbeing Agent flags Rajan’s burnout right beside it.",
    dwell: 42000,
  },
  {
    actor: "vikram", view: "mgr-performance", lens: "Manager · Vikram", title: "Agents connect the dots",
    caption: "Her margin gap rolls into Vikram’s own KPP — and Rajan’s utilisation shows up as a margin cost.",
    detail: "AGENTIC INSIGHT: a junior’s over-utilisation explains a senior’s margin miss — no static dashboard joins that.",
    dwell: 40000,
  },
  // ── ANITA ─────────────────────────────────────────────
  {
    actor: "anita", view: "hr-overview", lens: "Capability · Anita", title: "Workforce dashboard",
    caption: "Now zoom all the way out. Anita opens to demand vs supply across the workforce.",
    detail: "AGENTS: the Workforce Agent keeps org demand and supply live as commitments land.",
    dwell: 22000,
  },
  {
    actor: "anita", view: "hr-buildbuy", lens: "Capability · Anita", title: "One move fans out",
    caption: "Priya’s move surfaced 23 look-alikes — reskill them and supply goes 3 → 19, ₹13.9 Cr saved vs hiring.",
    detail: "AGENTS SCALE IT: the Workforce Agent sizes the cohort, the Opportunity Agent matches the talent.",
    dwell: 44000,
  },
  {
    actor: "anita", view: "hr-talent", lens: "Capability · Anita", title: "Retention, not just supply",
    caption: "The fleet closes the thread: people inside HCLTech see a path, stay, and move to where demand is.",
    detail: "THE FLEET: Career, Learning, Opportunity, Workforce, Manager, Wellbeing — one event, three lenses.",
    dwell: 8000,
  },
];

const ACTOR_INFO: Record<TourActor, { name: string; role: string; line: string; accent: Accent }> = {
  priya: { name: "Priya Sharma", role: "Employee", line: "The journey starts with one employee asking a question.", accent: "purple" },
  vikram: { name: "Vikram Nair", role: "Manager view", line: "Same moment, a different lens — watch how Priya's move reaches her manager.", accent: "cyan" },
  anita: { name: "Anita Desai", role: "Capability Manager view", line: "Now zoom out — one employee's move becomes workforce strategy.", accent: "blue" },
};

function base(actor: TourActor): string {
  return actor === "vikram" ? "view=manager" : actor === "anita" ? "view=hr" : "persona=priya";
}

/** Build a step URL; `auto` carries the auto-play flag through the persona switch. */
export function tourStepUrl(i: number, auto = false): string {
  const s = TOUR[i];
  return `/app?${base(s.actor)}&section=${s.view}&tour=${i}${auto ? "&auto=1" : ""}`;
}

/** Floating manual launcher — shown on non-dashboard screens so judges can
 * start the walkthrough from anywhere. */
export function StartTourButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(tourStepUrl(0, false))}
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
      style={{ background: ACCENT_HEX.purple }}
    >
      <Compass className="h-4 w-4" />
      Walk the golden thread
    </button>
  );
}

/** Dashboard launch banner — auto-play (hands-free) or self-guided. */
export function TourLaunch() {
  const router = useRouter();
  return (
    <div
      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4"
      style={{ borderColor: accentRgba("purple", 0.45), background: accentRgba("purple", 0.06) }}
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: accentRgba("purple", 0.16), color: ACCENT_HEX.purple }}>
          <Compass className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">Walk the golden thread</p>
          <p className="text-[11px] text-[var(--text-secondary)]">Priya → Vikram → Anita · one question becomes workforce transformation</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.push(tourStepUrl(0, true))}
          className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold text-white"
          style={{ background: ACCENT_HEX.purple }}
        >
          <Play className="h-3.5 w-3.5" />
          Auto-play demo
        </button>
        <button
          onClick={() => router.push(tourStepUrl(0, false))}
          className="surface-hover inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold"
          style={{ borderColor: accentRgba("purple", 0.5), color: ACCENT_HEX.purple }}
        >
          Try it yourself
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

/** The step control — persists across persona switches via the ?tour= URL param. */
export function GuidedTour({ step, auto = false }: { step: number; auto?: boolean }) {
  const router = useRouter();
  const s = TOUR[step];
  const last = step === TOUR.length - 1;
  const prevActor = step > 0 ? TOUR[step - 1]?.actor : undefined;
  const isSwitch = !!s && !!prevActor && prevActor !== s.actor;

  // On a cross-persona step, announce the switch with a centered card for 3s.
  // showSwitch seeds true on the step's remount; the effect just hides it.
  const [showSwitch, setShowSwitch] = useState(isSwitch);
  useEffect(() => {
    if (!isSwitch) return;
    const t = setTimeout(() => setShowSwitch(false), 3000);
    return () => clearTimeout(t);
  }, [isSwitch]);

  // Auto-advance: navigate to the next step after the step's dwell time.
  useEffect(() => {
    if (!auto || !s || last) return;
    const t = setTimeout(() => router.push(tourStepUrl(step + 1, true)), s.dwell);
    return () => clearTimeout(t);
  }, [auto, step, last, s, router]);

  if (!s) return null;
  const exit = () => router.push(`/app?${base(s.actor)}`);
  const info = ACTOR_INFO[s.actor];

  return (
    <>
      {/* Centered persona-switch announcement (5s) */}
      <AnimatePresence>
        {showSwitch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
          >
            <div className="absolute inset-0 bg-black/70" />
            <motion.div
              initial={{ scale: 0.92, y: 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-[min(90vw,420px)] rounded-2xl border p-7 text-center shadow-2xl"
              style={{ borderColor: accentRgba(info.accent, 0.5), background: "var(--card)" }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: ACCENT_HEX[info.accent] }}>
                Switching view
              </p>
              <div
                className="mx-auto mt-3 flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ background: accentRgba(info.accent, 0.16), color: ACCENT_HEX[info.accent] }}
              >
                <ArrowRightLeft className="h-6 w-6" />
              </div>
              <h2 className="mt-3 text-xl font-bold text-[var(--text-primary)]">{info.name}</h2>
              <p className="text-sm font-medium" style={{ color: ACCENT_HEX[info.accent] }}>{info.role}</p>
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{info.line}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 left-1/2 z-40 w-[min(94vw,660px)] -translate-x-1/2 overflow-hidden rounded-2xl border shadow-xl"
      style={{ borderColor: accentRgba("purple", 0.5), background: "var(--card)" }}
    >
      {/* AUTO-ADVANCE COUNTDOWN BAR */}
      {auto && !last && (
        <motion.div
          key={`bar-${step}`}
          className="h-1"
          style={{ background: ACCENT_HEX.purple }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: s.dwell / 1000, ease: "linear" }}
        />
      )}

      <div className="p-3">
        <div className="flex items-center gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
            style={{ background: accentRgba("purple", 0.16), color: ACCENT_HEX.purple }}
          >
            {step + 1}
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              {s.title}
              <span className="rounded-md px-1.5 py-0.5 text-[10px] font-medium" style={{ background: accentRgba("blue", 0.14), color: ACCENT_HEX.blue }}>
                {s.lens}
              </span>
              {auto && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold" style={{ color: ACCENT_HEX.cyan }}>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--ai-cyan)] opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--ai-cyan)]" />
                  </span>
                  auto
                </span>
              )}
            </p>
            <p className="text-[11px] leading-4 text-[var(--text-secondary)]">{s.caption}</p>
            <p className="mt-0.5 text-[10px] leading-4 text-[var(--text-muted)]">▸ {s.detail}</p>
          </div>
          <button onClick={exit} aria-label="Exit tour" className="shrink-0 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-2">
          <div className="flex gap-1">
            {TOUR.map((_, i) => (
              <span key={i} className="h-1.5 w-4 rounded-full" style={{ background: i <= step ? ACCENT_HEX.purple : "var(--border)" }} />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {/* Play / Pause — judges can pause auto-play and take over */}
            {auto ? (
              <button
                onClick={() => router.push(tourStepUrl(step, false))}
                className="surface-hover inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]"
              >
                <Pause className="h-3.5 w-3.5" />
                Pause
              </button>
            ) : (
              !last && (
                <button
                  onClick={() => router.push(tourStepUrl(step, true))}
                  className="surface-hover inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold"
                  style={{ borderColor: accentRgba("cyan", 0.5), color: ACCENT_HEX.cyan }}
                >
                  <Play className="h-3.5 w-3.5" />
                  Auto-play
                </button>
              )
            )}
            <button
              onClick={() => step > 0 && router.push(tourStepUrl(step - 1, false))}
              disabled={step === 0}
              className="surface-hover inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] disabled:opacity-40"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
            {last ? (
              <button onClick={exit} className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold text-white" style={{ background: ACCENT_HEX.cyan }}>
                <Flag className="h-3.5 w-3.5" />
                Finish
              </button>
            ) : (
              <button
                onClick={() => router.push(tourStepUrl(step + 1, false))}
                className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold text-white"
                style={{ background: ACCENT_HEX.purple }}
              >
                Next
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
      </motion.div>
    </>
  );
}

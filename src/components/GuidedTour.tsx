"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Compass, Flag, Pause, Play, X } from "lucide-react";
import type { View } from "@/components/Sidebar";
import { ACCENT_HEX, accentRgba } from "@/lib/accents";

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

/** The cross-persona golden thread, step by step — narration names the agents
 * at work so the agentic nature is explicit. Dwell times total ~5 minutes for
 * a hands-free run; a presenter can always click Next to move faster. */
export const TOUR: TourStep[] = [
  {
    actor: "priya", view: "chat", lens: "Employee · Priya", title: "Priya asks",
    caption: "Sakha is a fleet of agents, not a chatbot. It speaks first, then Priya asks: “How do I move into AI Delivery Management?”",
    detail: "AGENTS: the fabric is already watching her lifecycle — she just asks in plain language.",
    dwell: 35000,
  },
  {
    actor: "priya", view: "career", lens: "Employee · Priya", title: "Agents reason — live",
    caption: "Six agents wake up: the Career Agent reads her Digital Twin, then hands off to the Learning, Opportunity and Workforce agents.",
    detail: "AGENTS AT WORK: watch the reasoning stream — every line is a different agent. Career → gap analysis, Learning → courses, Opportunity → internal roles, Workforce → org demand.",
    dwell: 60000,
  },
  {
    actor: "priya", view: "emp-performance", lens: "Employee · Priya", title: "Grounded, not guessed",
    caption: "The Career Agent didn’t invent gaps — it grounded every one in Priya’s real KPP appraisal and Vikram’s manager feedback.",
    detail: "AGENT EVIDENCE: margin-miss → commercial gap; the manager’s flagged areas become the GPS gaps. The ‘Manager feedback · considered by GPS’ card proves it.",
    dwell: 48000,
  },
  {
    actor: "vikram", view: "mgr-team", lens: "Manager · Vikram", title: "Agents push to the manager",
    caption: "The Manager Agent surfaced Priya to Vikram unprompted, while the Wellbeing Agent flagged Rajan’s burnout.",
    detail: "AGENTS: we switched user to Vikram — no email. The Manager & Wellbeing agents pushed exactly what he needs to act on, with a human-approval gate.",
    dwell: 42000,
  },
  {
    actor: "vikram", view: "mgr-performance", lens: "Manager · Vikram", title: "Agents connect the dots",
    caption: "The Manager Agent rolled Priya’s margin gap into Vikram’s own KPP — and Rajan’s Wellbeing signal shows up as a margin cost.",
    detail: "AGENTIC INSIGHT: the agents link a junior’s over-utilisation to a senior’s margin miss — a connection no static dashboard would make.",
    dwell: 48000,
  },
  {
    actor: "anita", view: "hr-buildbuy", lens: "Capability · Anita", title: "One move fans out",
    caption: "The Workforce Agent found 23 look-alikes to Priya and the Opportunity Agent matched them — a ₹13.9 Cr build-vs-buy case.",
    detail: "AGENTS SCALE IT: switched to Anita. One employee commitment fans out — Workforce Agent sizes the cohort, Opportunity Agent matches the talent.",
    dwell: 52000,
  },
  {
    actor: "anita", view: "hr-overview", lens: "Capability · Anita", title: "The fleet closes the thread",
    caption: "One Digital Twin, six agents, three lenses — an employee goal becomes workforce transformation.",
    detail: "THE FLEET: Career, Learning, Opportunity, Workforce, Manager and Wellbeing agents all worked a single event across all three views.",
    dwell: 8000,
  },
];

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

  // Auto-advance: navigate to the next step after the step's dwell time.
  useEffect(() => {
    if (!auto || !s || last) return;
    const t = setTimeout(() => router.push(tourStepUrl(step + 1, true)), s.dwell);
    return () => clearTimeout(t);
  }, [auto, step, last, s, router]);

  if (!s) return null;
  const exit = () => router.push(`/app?${base(s.actor)}`);

  return (
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
  );
}

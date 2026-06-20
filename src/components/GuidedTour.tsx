"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Compass, Flag, X } from "lucide-react";
import type { View } from "@/components/Sidebar";
import { ACCENT_HEX, accentRgba } from "@/lib/accents";

type TourActor = "priya" | "vikram" | "anita";
export type TourStep = { actor: TourActor; view: View; lens: string; title: string; caption: string };

/** The cross-persona golden thread, step by step. */
export const TOUR: TourStep[] = [
  { actor: "priya", view: "chat", lens: "Employee · Priya", title: "Priya asks", caption: "“How do I move into AI Delivery Management?” — the question every employee is afraid to ask." },
  { actor: "priya", view: "career", lens: "Employee · Priya", title: "Career GPS", caption: "Sakha maps a 90-day path — 38% ready today, reasoned live over her Digital Twin." },
  { actor: "priya", view: "emp-performance", lens: "Employee · Priya", title: "The evidence", caption: "Her real appraisal: revenue strength, a margin gap, and Vikram’s feedback — what the GPS reasoned over." },
  { actor: "vikram", view: "mgr-team", lens: "Manager · Vikram", title: "Manager sees it", caption: "Priya appears in Vikram’s spotlight — same promotion readiness + KPP evidence, surfaced without an email." },
  { actor: "vikram", view: "mgr-performance", lens: "Manager · Vikram", title: "Manager’s own KPP", caption: "Her margin gap rolls into Vikram’s margin KPP — backing her growth also fixes his number." },
  { actor: "anita", view: "hr-buildbuy", lens: "Capability · Anita", title: "Workforce impact", caption: "Priya’s one move surfaces 23 delivery managers like her — ₹13.9 Cr saved vs hiring." },
  { actor: "anita", view: "hr-overview", lens: "Capability · Anita", title: "The thread closes", caption: "One Digital Twin, three lenses. Employee goal → workforce transformation." },
];

function base(actor: TourActor): string {
  return actor === "vikram" ? "view=manager" : actor === "anita" ? "view=hr" : "persona=priya";
}

export function tourStepUrl(i: number): string {
  const s = TOUR[i];
  return `/app?${base(s.actor)}&section=${s.view}&tour=${i}`;
}

/** Floating launcher — starts the walkthrough from step 1. */
export function StartTourButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(tourStepUrl(0))}
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
      style={{ background: ACCENT_HEX.purple }}
    >
      <Compass className="h-4 w-4" />
      Walk the golden thread
    </button>
  );
}

/** The step control — persists across persona switches via the ?tour= URL param. */
export function GuidedTour({ step }: { step: number }) {
  const router = useRouter();
  const s = TOUR[step];
  if (!s) return null;
  const last = step === TOUR.length - 1;
  const exit = () => router.push(`/app?${base(s.actor)}`);

  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 left-1/2 z-40 w-[min(94vw,640px)] -translate-x-1/2 rounded-2xl border p-3 shadow-xl"
      style={{ borderColor: accentRgba("purple", 0.5), background: "var(--card)" }}
    >
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
          </p>
          <p className="truncate text-[11px] text-[var(--text-secondary)] sm:whitespace-normal">{s.caption}</p>
        </div>
        <button onClick={exit} aria-label="Exit tour" className="shrink-0 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-2">
        <div className="flex gap-1">
          {TOUR.map((_, i) => (
            <span
              key={i}
              className="h-1.5 w-5 rounded-full"
              style={{ background: i <= step ? ACCENT_HEX.purple : "var(--border)" }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => step > 0 && router.push(tourStepUrl(step - 1))}
            disabled={step === 0}
            className="surface-hover inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] disabled:opacity-40"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
          {last ? (
            <button
              onClick={exit}
              className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold text-white"
              style={{ background: ACCENT_HEX.cyan }}
            >
              <Flag className="h-3.5 w-3.5" />
              Finish
            </button>
          ) : (
            <button
              onClick={() => router.push(tourStepUrl(step + 1))}
              className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold text-white"
              style={{ background: ACCENT_HEX.purple }}
            >
              Next
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

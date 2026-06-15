"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Compass,
  GraduationCap,
  Leaf,
  MapPin,
  Rocket,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import type { CareerGpsResult, EmployeeTwin } from "@/types/sakha";
import { ACCENT_HEX, accentRgba, type Accent } from "@/lib/accents";
import { AutonomyBadge, type AutonomyLevel } from "@/components/AutonomyBadge";

const SUGGESTED = [
  "AI Engineer",
  "AI Governance Consultant",
  "Cloud Architect",
  "Automation Architect",
];

type Phase = "idle" | "loading" | "results";

export function CareerGps({
  twin,
  prefillGoal,
  onResult,
}: {
  twin: EmployeeTwin;
  prefillGoal?: string | null;
  onResult: (result: CareerGpsResult) => void;
}) {
  const [goal, setGoal] = useState(prefillGoal || twin.careerGoal);
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<CareerGpsResult | null>(null);
  const [source, setSource] = useState<"openai" | "fallback" | null>(null);
  const lastPersona = useRef(twin.id);

  // Reset when the active employee changes.
  useEffect(() => {
    if (lastPersona.current !== twin.id) {
      lastPersona.current = twin.id;
      setGoal(twin.careerGoal);
      setPhase("idle");
      setResult(null);
      setSource(null);
    }
  }, [twin]);

  // Auto-run when chat routes here with a goal. The component remounts on
  // navigation, so `goal` already initialises to prefillGoal above.
  useEffect(() => {
    if (prefillGoal) {
      void run(prefillGoal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillGoal]);

  async function run(targetGoal: string) {
    if (!targetGoal.trim()) return;
    setPhase("loading");
    setResult(null);
    try {
      const res = await fetch("/api/career-gps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona: twin.id, goal: targetGoal }),
      });
      const data = (await res.json()) as {
        result: CareerGpsResult;
        source: "openai" | "fallback";
      };
      // Brief, deliberate reveal so the moment lands in the demo.
      await new Promise((r) => setTimeout(r, 900));
      setResult(data.result);
      setSource(data.source);
      setPhase("results");
      onResult(data.result);
    } catch {
      setPhase("idle");
    }
  }

  return (
    <div className="surface flex h-full flex-col overflow-hidden">
      <header className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: accentRgba("purple", 0.16), color: ACCENT_HEX.purple }}
          >
            <Compass className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Career GPS</h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Map {twin.name}&rsquo;s path against the Digital Twin
            </p>
          </div>
        </div>
        {source && (
          <span className="rounded-md border border-[var(--border)] px-2 py-1 text-[10px] font-medium text-[var(--text-muted)]">
            {source === "openai" ? "Live · OpenAI" : "Local Twin model"}
          </span>
        )}
      </header>

      <div className="thin-scroll flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Current skills on file
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {twin.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--text-secondary)]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <label className="mt-5 block text-sm font-medium text-[var(--text-primary)]">
                Where do you want to go?
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && run(goal)}
                  placeholder="e.g. AI Engineer"
                  className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--ai-purple)]"
                />
                <button
                  onClick={() => run(goal)}
                  disabled={!goal.trim()}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
                  style={{ background: ACCENT_HEX.purple }}
                >
                  Map my path
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {SUGGESTED.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGoal(g)}
                    className="surface-hover rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--text-secondary)]"
                  >
                    {g}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {phase === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <motion.span
                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ background: accentRgba("purple", 0.16), color: ACCENT_HEX.purple }}
              >
                <Leaf className="h-8 w-8" />
              </motion.span>
              <p className="mt-5 text-sm font-medium text-[var(--text-primary)]">
                Analysing {twin.name}&rsquo;s Digital Twin…
              </p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Comparing against 200+ role definitions
              </p>
            </motion.div>
          )}

          {phase === "results" && result && (
            <Results key="results" twin={twin} goal={goal} result={result} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Results({
  twin,
  goal,
  result,
}: {
  twin: EmployeeTwin;
  goal: string;
  result: CareerGpsResult;
}) {
  const prob = result.successProbability ?? Math.min(95, result.matchPercentage + 40);
  const months = Math.max(1, Math.round(result.readinessDays / 30));
  const top = result.missingSkills[0];
  const topRole = result.openRoles[0];

  const actions: { icon: typeof GraduationCap; label: string; level: AutonomyLevel }[] = [
    {
      icon: GraduationCap,
      label: `Enrolled in ${top?.recommendedCourse ?? "your first course"}`,
      level: "consented",
    },
    {
      icon: CalendarCheck,
      label: `Blocked ${top?.estimatedHoursPerWeek ?? 2}h/week of learning time`,
      level: "consented",
    },
    {
      icon: Users,
      label: `Mentor suggested in ${topRole?.team ?? "your domain"}`,
      level: "approval",
    },
    {
      icon: Target,
      label: topRole
        ? `Surfaced ${topRole.title} · ${topRole.match}% match`
        : "Scanning internal opportunities",
      level: "auto",
    },
  ];

  const nodes: {
    icon: typeof MapPin;
    title: string;
    sub: string;
    tag?: string;
    accent: Accent;
  }[] = [
    {
      icon: MapPin,
      title: "Today",
      sub: `${result.matchPercentage}% ready · ${twin.role}`,
      accent: "blue",
    },
    ...result.learningPath.map((m) => ({
      icon: BookOpen,
      title: m.skill,
      sub: m.milestone,
      tag: `Month ${m.month}`,
      accent: "purple" as Accent,
    })),
    {
      icon: Rocket,
      title: `${goal} — ready`,
      sub: `Readiness achieved · Day ${result.readinessDays}`,
      accent: "pink",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* HERO — destination + readiness */}
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-center sm:text-left">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Your destination
          </p>
          <h3 className="mt-1 text-2xl font-bold text-[var(--text-primary)]">{goal}</h3>
          <div className="mt-1 flex items-center justify-center gap-2 text-sm text-[var(--text-secondary)] sm:justify-start">
            <span>{twin.role}</span>
            <ArrowRight className="h-4 w-4 text-[var(--ai-purple)]" />
            <span className="font-medium text-[var(--text-primary)]">{goal}</span>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-1.5 sm:justify-start">
            {result.missingSkills.map((s, i) => (
              <span
                key={s.skill}
                className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[11px] text-[var(--text-secondary)]"
              >
                <span className="font-semibold text-[var(--ai-purple)]">{i + 1}</span> {s.skill}
              </span>
            ))}
          </div>
        </div>
        <MatchRing value={result.matchPercentage} />
      </div>

      {/* AI COACH MESSAGE — the probability statement */}
      <div
        className="rounded-xl border p-4"
        style={{ borderColor: accentRgba("cyan", 0.4), background: accentRgba("cyan", 0.08) }}
      >
        <div className="flex items-start gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            style={{ background: accentRgba("cyan", 0.18), color: ACCENT_HEX.cyan }}
          >
            <Sparkles className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm leading-6 text-[var(--text-secondary)]">{result.sakhaMessage}</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[var(--text-primary)]">
              I estimate a{" "}
              <span className="text-[var(--ai-cyan)]">{prob}% probability</span> of reaching{" "}
              {goal} within {months} {months === 1 ? "month" : "months"}.
            </p>
          </div>
        </div>
      </div>

      {/* ROADMAP + SAKHA ACTIONS */}
      <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
        {/* Vertical roadmap */}
        <section>
          <SectionTitle>Your {result.readinessDays}-day roadmap</SectionTitle>
          <ol className="relative">
            {nodes.map((n, i) => {
              const Icon = n.icon;
              const isLast = i === nodes.length - 1;
              return (
                <li key={`${n.title}-${i}`} className="relative flex gap-4 pb-5 last:pb-0">
                  {!isLast && (
                    <span
                      className="absolute left-[17px] top-9 -bottom-0 w-px"
                      style={{ background: "var(--border)" }}
                    />
                  )}
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.08 * i }}
                    className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: accentRgba(n.accent, 0.16),
                      color: ACCENT_HEX[n.accent],
                      boxShadow: `0 0 0 1px ${accentRgba(n.accent, 0.4)}`,
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.span>
                  <motion.div
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 * i + 0.05 }}
                    className="min-w-0 pt-1"
                  >
                    {n.tag && (
                      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                        {n.tag}
                      </span>
                    )}
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{n.title}</p>
                    <p className="text-xs leading-5 text-[var(--text-secondary)]">{n.sub}</p>
                  </motion.div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Sakha Actions */}
        <section>
          <SectionTitle>
            <Leaf className="mr-1 inline h-4 w-4 text-[var(--ai-cyan)]" />
            Sakha has already acted
          </SectionTitle>
          <div className="space-y-2">
            {actions.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.div
                  key={a.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3"
                >
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ai-cyan)]" />
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1.5 text-sm text-[var(--text-primary)]">
                        <Icon className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                        {a.label}
                      </p>
                      <div className="mt-1.5">
                        <AutonomyBadge level={a.level} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div
            className="mt-3 rounded-xl border p-3"
            style={{ borderColor: accentRgba("pink", 0.35), background: accentRgba("pink", 0.07) }}
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--ai-pink)]">
              <Target className="h-3.5 w-3.5" />
              {result.openRoles.length} internal roles match this goal
            </div>
            <div className="mt-2 space-y-1.5">
              {result.openRoles.map((r) => (
                <div key={r.title} className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-primary)]">{r.title}</span>
                  <span className="text-[var(--text-secondary)]">{r.match}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">{children}</h3>;
}

function MatchRing({ value }: { value: number }) {
  const RADIUS = 46;
  const CIRC = 2 * Math.PI * RADIUS;
  const [display, setDisplay] = useState(0);
  const offset = useMemo(() => CIRC - (CIRC * display) / 100, [CIRC, display]);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = 1300;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg viewBox="0 0 110 110" className="h-full w-full -rotate-90">
        <circle cx="55" cy="55" r={RADIUS} fill="none" stroke="var(--border)" strokeWidth="9" />
        <circle
          cx="55"
          cy="55"
          r={RADIUS}
          fill="none"
          stroke={ACCENT_HEX.purple}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-[var(--text-primary)]">{display}%</span>
        <span className="text-[11px] text-[var(--text-muted)]">ready</span>
      </div>
    </div>
  );
}

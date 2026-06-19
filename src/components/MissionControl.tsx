"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Gauge,
  MapPin,
  MessageSquareQuote,
  Radar,
  Rocket,
  ShieldCheck,
  Target,
  ThumbsUp,
  TrendingUp,
  UserRound,
  Zap,
} from "lucide-react";
import type { AgentEvent, CareerGpsResult, EmployeeTwin, ManagerFeedback, Mission } from "@/types/sakha";
import { ACCENT_HEX, accentRgba, type Accent } from "@/lib/accents";
import { DreyfusBadge } from "@/components/DreyfusBadge";
import { ActionConsole } from "@/components/ActionConsole";
import { ActionCenter, type ActionItem } from "@/components/ActionCenter";
import { KppScorecard } from "@/components/KppScorecard";
import { PromotionReadiness } from "@/components/PromotionReadiness";
import { SelfAssessment } from "@/components/SelfAssessment";
import { useHeartbeat } from "@/lib/useHeartbeat";

type RouteKey = "fastest" | "lowest" | "highest";

/**
 * Career GPS, reframed as Mission Control — Observe → Predict → Plan → Act →
 * Learn. A Mission (not a goal) Sakha works toward continuously; the employee
 * tunes the plan and engages Autopilot, after which the fleet keeps working in
 * the background and surfaces opportunities unprompted.
 */
export function MissionControl({
  twin,
  goal,
  result,
}: {
  twin: EmployeeTwin;
  goal: string;
  result: CareerGpsResult;
}) {
  const mission: Mission =
    twin.mission && twin.mission.title.toLowerCase() === goal.toLowerCase()
      ? twin.mission
      : {
          title: goal,
          deadline: "Dec 2026",
          successProbability: result.successProbability ?? Math.min(95, result.matchPercentage + 40),
          targetReadiness: 90,
        };

  const [route, setRoute] = useState<RouteKey>("fastest");
  const [targetRole, setTargetRole] = useState(result.openRoles[0]?.title ?? "");
  const [hours, setHours] = useState(result.missingSkills[0]?.estimatedHoursPerWeek ?? 5);
  const [autopilot, setAutopilot] = useState(false);
  const [engaging, setEngaging] = useState(false);
  const [events, setEvents] = useState<AgentEvent[]>([]);

  const baseHours = result.missingSkills[0]?.estimatedHoursPerWeek ?? 5;
  const etaDays = Math.max(20, Math.round((result.readinessDays * baseHours) / hours));
  const etaMonths = Math.max(1, Math.round(etaDays / 30));

  // Aligned to the employee's actual stack + mission — a build opportunity, not
  // a governance one. Prefer a matched internal role from the result.
  const opportunity = useMemo(() => {
    const role = result.openRoles[0];
    return {
      title: role ? `${role.title} · ${role.team}` : "GenAI Support Copilot · Innovation Lab",
      match: role?.match ?? 88,
      reason: `${twin.skills.slice(0, 2).join(" + ")} + cloud base maps to building GenAI apps — and ${twin.name} is already in Python for AI`,
    };
  }, [result.openRoles, twin.skills, twin.name]);
  const beat = useHeartbeat({ enabled: autopilot, opportunity });

  async function engage() {
    setEngaging(true);
    try {
      const res = await fetch("/api/commitment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona: twin.id,
          name: twin.fullName,
          goal: mission.title,
          matchPercentage: result.matchPercentage,
          readinessDays: result.readinessDays,
        }),
      });
      const data = (await res.json()) as { events?: AgentEvent[] };
      setEvents((data.events ?? []).filter((e) => e.phase === "employee"));
      setAutopilot(true);
    } catch {
      /* demo-safe */
    } finally {
      setEngaging(false);
    }
  }

  const keyActions: ActionItem[] = [
    {
      label: "Enable Career Autopilot",
      sublabel: "Sakha enrols courses, reserves time, finds mentors — and keeps working in the background",
      verb: engaging ? "…" : "Enable",
      agent: "career",
      accent: "cyan",
      onClick: engage,
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      {/* KEY ACTION — pinned at top until Autopilot is engaged */}
      {!autopilot && <ActionCenter items={keyActions} title="Your next move" />}

      {/* MISSION HEADER */}
      <div
        className="rounded-xl border p-5"
        style={{ borderColor: accentRgba("purple", 0.4), background: accentRgba("purple", 0.06) }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <ReadinessRing value={result.matchPercentage} target={mission.targetReadiness} />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Mission
              </p>
              <h3 className="text-2xl font-bold text-[var(--text-primary)]">{mission.title}</h3>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                <CalendarClock className="h-3.5 w-3.5" />
                by {mission.deadline}
                <span className="text-[var(--text-muted)]">·</span>
                <span className="font-semibold text-[var(--ai-cyan)]">{mission.successProbability}% success probability</span>
              </p>
            </div>
          </div>
          <StatusChip autopilot={autopilot} lastAction={beat.ticks} />
        </div>

        {/* COMMAND CENTER STRIP */}
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Cell label="Days remaining" value={`${result.readinessDays}`} icon={CalendarClock} accent="blue" />
          <Cell
            label="Next critical action"
            value={result.missingSkills[0]?.recommendedCourse ?? "Start first module"}
            icon={Target}
            accent="purple"
          />
          <Cell label="Blockers" value="None" icon={ShieldCheck} accent="cyan" />
        </div>
      </div>

      {/* AUTOPILOT — surfaces at the TOP the moment it engages, so the live
          actions are the first thing in view (no scrolling required). */}
      {autopilot && (
        <div className="space-y-4">
          <ActionConsole events={events} twin={twin} result={result} />
          <BackgroundFeed idleLine={beat.idleLine} ticks={beat.ticks} />
          <AnimatePresence>{beat.opportunity && <NextDecision opp={beat.opportunity} />}</AnimatePresence>
        </div>
      )}

      {/* CAREER TWIN + DREYFUS/HEALTH */}
      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <CareerTwin twin={twin} mission={mission} readiness={result.matchPercentage} />
        <div className="space-y-4">
          {twin.dreyfus && <DreyfusBadge level={twin.dreyfus} />}
          {twin.careerHealth && <CareerHealthCard health={twin.careerHealth} />}
        </div>
      </div>

      {/* TRACKS */}
      {twin.tracks && twin.tracks.length > 0 && (
        <section>
          <SectionTitle icon={Rocket}>Recommended tracks</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-3">
            {twin.tracks.map((t) => (
              <div
                key={t.name}
                className="rounded-xl border p-3"
                style={{
                  borderColor: t.primary ? accentRgba("purple", 0.5) : "var(--border)",
                  background: t.primary ? accentRgba("purple", 0.07) : "var(--bg)",
                }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{t.name}</p>
                  {t.primary && (
                    <span
                      className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
                      style={{ background: accentRgba("purple", 0.16), color: ACCENT_HEX.purple }}
                    >
                      Primary
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[11px] leading-4 text-[var(--text-secondary)]">{t.focus}</p>
                <div className="mt-2 h-1.5 rounded-full bg-[var(--border)]">
                  <div className="h-1.5 rounded-full" style={{ width: `${t.progress}%`, background: ACCENT_HEX.purple }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PERFORMANCE-GROUNDED — promotion readiness + KPP evidence + self-assessment */}
      {(twin.promotion || twin.kpps || twin.selfAssessment) && (
        <section className="space-y-4">
          <SectionTitle icon={Gauge}>Grounded in your performance</SectionTitle>
          <p className="-mt-2 text-[11px] text-[var(--text-muted)]">
            Career GPS reads {twin.name}&rsquo;s actual KPP record — not a generic skills matrix.
          </p>
          <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
            {twin.promotion && <PromotionReadiness data={twin.promotion} />}
            {twin.kpps && <KppScorecard kpps={twin.kpps} rating={twin.overallRating} />}
          </div>
          {twin.managerFeedback && <ManagerFeedbackCard fb={twin.managerFeedback} />}
          {twin.selfAssessment && (
            <SelfAssessment sections={twin.selfAssessment} name={twin.name} />
          )}
        </section>
      )}

      {/* TARGET ROLE SELECTION — the roles matching Priya's mission */}
      <section>
        <SectionTitle icon={Target}>Target role · internal matches</SectionTitle>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {result.openRoles.map((r) => {
            const selected = targetRole === r.title;
            return (
              <button
                key={r.title}
                onClick={() => setTargetRole(r.title)}
                className="rounded-xl border p-3 text-left transition"
                style={{
                  borderColor: selected ? ACCENT_HEX.purple : "var(--border-strong)",
                  background: selected ? accentRgba("purple", 0.1) : "var(--bg)",
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{r.title}</p>
                  {selected && <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--ai-purple)]" />}
                </div>
                <p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">{r.team}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-[var(--border)]">
                    <div className="h-1.5 rounded-full" style={{ width: `${r.match}%`, background: ACCENT_HEX.cyan }} />
                  </div>
                  <span className="text-xs font-bold text-[var(--ai-cyan)]">{r.match}%</span>
                </div>
              </button>
            );
          })}
        </div>
        {targetRole && (
          <p className="mt-2 text-[11px] text-[var(--text-muted)]">
            Targeting <span className="font-semibold text-[var(--text-primary)]">{targetRole}</span> — Autopilot
            aligns your plan to this role.
          </p>
        )}
      </section>

      {/* ROUTE OPTIONS + WHAT-IF */}
      <div className="grid gap-4 xl:grid-cols-2">
        <RouteOptions selected={route} onSelect={setRoute} baseDays={result.readinessDays} />
        <WhatIf hours={hours} onHours={setHours} etaMonths={etaMonths} />
      </div>

    </motion.div>
  );
}

/* ── pieces ─────────────────────────────────────────────────────────────── */

function StatusChip({ autopilot, lastAction }: { autopilot: boolean; lastAction: number }) {
  if (!autopilot)
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full attr-card bg-[var(--bg)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)]">
        <span className="h-2 w-2 rounded-full" style={{ background: ACCENT_HEX.cyan }} />
        On Track
      </span>
    );
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
      style={{ background: accentRgba("cyan", 0.16), color: ACCENT_HEX.cyan }}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--ai-cyan)] opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--ai-cyan)]" />
      </span>
      Autopilot engaged · last action {lastAction * 5 + 2}s ago
    </span>
  );
}

function Cell({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: typeof Target;
  accent: Accent;
}) {
  return (
    <div className="rounded-lg attr-card bg-[var(--bg)] p-3">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
        <Icon className="h-3.5 w-3.5" style={{ color: ACCENT_HEX[accent] }} />
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

function CareerTwin({
  twin,
  mission,
  readiness,
}: {
  twin: EmployeeTwin;
  mission: Mission;
  readiness: number;
}) {
  return (
    <div className="rounded-xl attr-card bg-[var(--bg)] p-4">
      <SectionTitle icon={UserRound}>Career Twin · today → future you</SectionTitle>
      <div className="mt-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold" style={{ background: accentRgba("blue", 0.16), color: ACCENT_HEX.blue }}>
            <MapPin className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[11px] text-[var(--text-muted)]">Today</p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">{twin.role}</p>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-[var(--ai-purple)]" />
        <div className="flex items-center gap-2 text-right">
          <div>
            <p className="text-[11px] text-[var(--text-muted)]">Future you</p>
            <p className="text-sm font-semibold text-[var(--ai-purple)]">{mission.title}</p>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: accentRgba("purple", 0.16), color: ACCENT_HEX.purple }}>
            <Rocket className="h-4 w-4" />
          </span>
        </div>
      </div>
      <div className="mt-3">
        <div className="flex justify-between text-[11px] text-[var(--text-secondary)]">
          <span>{readiness}% complete</span>
          <span>gap {Math.max(0, mission.targetReadiness - readiness)} pts</span>
        </div>
        <div className="mt-1 h-2 rounded-full bg-[var(--border)]">
          <motion.div className="h-2 rounded-full" style={{ background: ACCENT_HEX.purple }} animate={{ width: `${readiness}%` }} />
        </div>
      </div>
    </div>
  );
}

function CareerHealthCard({ health }: { health: NonNullable<EmployeeTwin["careerHealth"]> }) {
  const rows = [
    { label: "Growth velocity", value: health.growthVelocity },
    { label: "Market relevance", value: health.marketRelevance },
    { label: "Promotion readiness", value: health.promotionReadiness },
  ];
  return (
    <div className="rounded-lg attr-card bg-[var(--bg)] p-3">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
          <Gauge className="h-3.5 w-3.5 text-[var(--ai-cyan)]" />
          Career health
        </p>
        <span className="text-lg font-bold text-[var(--text-primary)]">{health.score}<span className="text-xs text-[var(--text-muted)]">/100</span></span>
      </div>
      <div className="mt-2 space-y-1">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between text-[11px]">
            <span className="text-[var(--text-secondary)]">{r.label}</span>
            <span className="font-semibold text-[var(--text-primary)]">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RouteOptions({
  selected,
  onSelect,
  baseDays,
}: {
  selected: RouteKey;
  onSelect: (r: RouteKey) => void;
  baseDays: number;
}) {
  const routes: { key: RouteKey; label: string; steps: string; eta: number }[] = [
    { key: "fastest", label: "Fastest route", steps: "Course → Cert → Project", eta: baseDays },
    { key: "lowest", label: "Lowest effort", steps: "Mentorship → Project", eta: baseDays + 34 },
    { key: "highest", label: "Highest success", steps: "Cert → Mentor → Project", eta: baseDays + 14 },
  ];
  return (
    <div className="rounded-xl attr-card bg-[var(--bg)] p-4">
      <SectionTitle icon={MapPin}>Route optimization</SectionTitle>
      <div className="mt-2 space-y-2">
        {routes.map((r) => {
          const active = selected === r.key;
          return (
            <button
              key={r.key}
              onClick={() => onSelect(r.key)}
              className="flex w-full items-center justify-between rounded-lg border p-2.5 text-left"
              style={{
                borderColor: active ? accentRgba("purple", 0.5) : "var(--border)",
                background: active ? accentRgba("purple", 0.07) : "transparent",
              }}
            >
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{r.label}</p>
                <p className="text-[11px] text-[var(--text-secondary)]">{r.steps}</p>
              </div>
              <span className="shrink-0 text-xs font-semibold text-[var(--ai-purple)]">
                {Math.round(r.eta / 30)} mo
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WhatIf({
  hours,
  onHours,
  etaMonths,
}: {
  hours: number;
  onHours: (h: number) => void;
  etaMonths: number;
}) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{ borderColor: accentRgba("cyan", 0.4), background: accentRgba("cyan", 0.05) }}
    >
      <SectionTitle icon={Zap}>What-if · effort vs ETA</SectionTitle>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="font-medium text-[var(--text-primary)]">{hours}h / week</span>
        <span className="font-bold text-[var(--ai-cyan)]">ETA {etaMonths} {etaMonths === 1 ? "month" : "months"}</span>
      </div>
      <input
        type="range"
        min={2}
        max={10}
        value={hours}
        onChange={(e) => onHours(Number(e.target.value))}
        className="mt-2 w-full accent-[var(--ai-cyan)]"
      />
      <p className="mt-1 text-[11px] text-[var(--text-muted)]">
        Drag to re-forecast — Sakha re-plans the roadmap instantly.
      </p>
    </div>
  );
}

function BackgroundFeed({ idleLine, ticks }: { idleLine: string; ticks: number }) {
  return (
    <div className="flex items-center gap-2 rounded-lg attr-card bg-[var(--bg)] px-3 py-2">
      <Radar className="h-3.5 w-3.5 shrink-0 animate-pulse text-[var(--ai-cyan)]" />
      <p className="text-[11px] text-[var(--text-secondary)]">
        Background · {idleLine}
        <span className="text-[var(--text-muted)]"> · {ticks} sweeps</span>
      </p>
    </div>
  );
}

function NextDecision({ opp }: { opp: { title: string; match: number; reason: string } }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="rounded-xl border p-4"
      style={{ borderColor: accentRgba("orange", 0.5), background: accentRgba("orange", 0.07) }}
    >
      <div className="flex items-center gap-2">
        <Radar className="h-4 w-4 text-[var(--ai-orange)]" />
        <p className="text-sm font-semibold text-[var(--text-primary)]">Opportunity found — proactively</p>
      </div>
      <p className="mt-2 text-sm text-[var(--text-primary)]">
        {opp.title} · <span className="font-bold text-[var(--ai-cyan)]">{opp.match}% match</span>
      </p>
      <p className="text-[11px] text-[var(--text-secondary)]">{opp.reason}</p>
      <div className="mt-3 flex gap-2">
        <button
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
          style={{ background: ACCENT_HEX.orange }}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Apply for me
        </button>
        <button className="surface-hover rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
          Review first
        </button>
      </div>
    </motion.div>
  );
}

function ManagerFeedbackCard({ fb }: { fb: ManagerFeedback }) {
  const accent: Accent = fb.sentiment === "watch" ? "pink" : fb.sentiment === "positive" ? "cyan" : "blue";
  return (
    <div className="rounded-xl attr-card bg-[var(--bg)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text-primary)]">
          <MessageSquareQuote className="h-4 w-4" style={{ color: ACCENT_HEX[accent] }} />
          Manager feedback · considered by GPS
        </h4>
        <span className="text-[11px] text-[var(--text-muted)]">
          {fb.from} · {fb.date}
        </span>
      </div>
      <p className="mt-2 text-xs italic leading-5 text-[var(--text-secondary)]">&ldquo;{fb.summary}&rdquo;</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
            <ThumbsUp className="h-3 w-3 text-[var(--ai-cyan)]" />
            Strengths
          </p>
          <ul className="mt-1 space-y-0.5">
            {fb.strengths.map((s) => (
              <li key={s} className="text-[11px] leading-4 text-[var(--text-secondary)]">· {s}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
            <TrendingUp className="h-3 w-3 text-[var(--ai-orange)]" />
            Development areas → GPS gaps
          </p>
          <ul className="mt-1 space-y-0.5">
            {fb.developmentAreas.map((s) => (
              <li key={s} className="text-[11px] leading-4 text-[var(--text-secondary)]">· {s}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, children }: { icon: typeof Target; children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text-primary)]">
      <Icon className="h-4 w-4 text-[var(--ai-purple)]" />
      {children}
    </h3>
  );
}

function ReadinessRing({ value, target }: { value: number; target: number }) {
  const R = 40;
  const C = 2 * Math.PI * R;
  const arc = (C * value) / 100;
  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={R} fill="none" stroke="var(--border)" strokeWidth="9" />
        <motion.circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          stroke={ACCENT_HEX.purple}
          strokeWidth="9"
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${C}` }}
          animate={{ strokeDasharray: `${arc} ${C - arc}` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-[var(--text-primary)]">{value}%</span>
        <span className="text-[9px] text-[var(--text-muted)]">of {target}% target</span>
      </div>
    </div>
  );
}

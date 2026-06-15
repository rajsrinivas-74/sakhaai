"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Award,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  GraduationCap,
  HeartPulse,
  Leaf,
  Lightbulb,
  Send,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  UserPlus,
  X,
} from "lucide-react";
import { CERT_ACCENT, managerData } from "@/data/manager";
import { ACCENT_HEX, accentRgba, type Accent } from "@/lib/accents";

const RISK_ACCENT: Record<"high" | "medium" | "low", Accent> = {
  high: "pink",
  medium: "orange",
  low: "blue",
};

type Compose = { title: string; body: string } | null;

type MetricTile = {
  label: string;
  value: string;
  suffix?: string;
  accent: Accent;
  note: string;
  noteIcon: typeof TrendingDown;
  noteAccent: Accent;
  progress: number;
};

export function ManagerCopilot() {
  const [compose, setCompose] = useState<Compose>(null);

  const metrics: MetricTile[] = [
    {
      label: "Team health",
      value: String(managerData.teamHealthScore),
      suffix: "%",
      accent: "cyan",
      note: "Down 5 pts from last week",
      noteIcon: TrendingDown,
      noteAccent: "pink",
      progress: managerData.teamHealthScore,
    },
    {
      label: "Attrition risk",
      value: String(managerData.attritionRisks.length),
      accent: "pink",
      note: "Needs attention",
      noteIcon: TriangleAlert,
      noteAccent: "orange",
      progress: Math.round((managerData.attritionRisks.length / managerData.teamSize) * 100),
    },
    {
      label: "Active onboarding",
      value: String(managerData.onboarding.length),
      accent: "blue",
      note: "On track",
      noteIcon: CheckCircle2,
      noteAccent: "cyan",
      progress: Math.round((managerData.onboarding[0].day / 90) * 100),
    },
    {
      label: "Certs this month",
      value: String(managerData.certifications.length),
      accent: "purple",
      note: "Best month this quarter",
      noteIcon: TrendingUp,
      noteAccent: "cyan",
      progress: 67,
    },
  ];

  return (
    <div className="surface relative flex h-full flex-col overflow-hidden">
      {/* TOP BAR */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-6 py-4">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold"
            style={{ background: accentRgba("purple", 0.18), color: ACCENT_HEX.purple }}
          >
            VN
          </span>
          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              {managerData.manager}
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Delivery Manager · {managerData.teamSize} direct reports
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs text-[var(--text-secondary)]">
            <CalendarDays className="h-3.5 w-3.5" />
            Week of {managerData.weekEnding}
          </span>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
            style={{ background: accentRgba("purple", 0.16), color: ACCENT_HEX.purple }}
          >
            <Leaf className="h-3.5 w-3.5" />
            Sakha
          </span>
        </div>
      </header>

      <div className="thin-scroll flex-1 space-y-5 overflow-y-auto p-6">
        {/* METRIC TILES */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--text-secondary)]">{m.label}</p>
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: ACCENT_HEX[m.accent] }}
                />
              </div>
              <p className="mt-2 text-3xl font-bold text-[var(--text-primary)]">
                {m.value}
                {m.suffix && (
                  <span className="text-lg font-semibold text-[var(--text-secondary)]">
                    {m.suffix}
                  </span>
                )}
              </p>
              <p
                className="mt-1 flex items-center gap-1.5 text-xs font-medium"
                style={{ color: ACCENT_HEX[m.noteAccent] }}
              >
                <m.noteIcon className="h-3.5 w-3.5" />
                {m.note}
              </p>
              <div className="mt-3 h-1.5 rounded-full bg-[var(--border)]">
                <div
                  className="h-1.5 rounded-full"
                  style={{ width: `${m.progress}%`, background: ACCENT_HEX[m.accent] }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* NEEDS ATTENTION + HEALTH RING */}
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          {/* Needs attention */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                <CircleAlert className="h-4 w-4 text-[var(--ai-pink)]" />
                Needs attention
              </div>
              <span
                className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                style={{ background: accentRgba("pink", 0.14), color: ACCENT_HEX.pink }}
              >
                {managerData.attritionRisks.length} flagged
              </span>
            </div>

            <div className="mt-4 divide-y divide-[var(--border)]">
              {managerData.attritionRisks.map((r) => {
                const accent = RISK_ACCENT[r.riskLevel];
                return (
                  <div key={r.name} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                      style={{ background: accentRgba(accent, 0.18), color: ACCENT_HEX[accent] }}
                    >
                      {r.initial}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{r.name}</p>
                      <p className="mt-0.5 text-xs leading-5 text-[var(--text-secondary)]">
                        {r.signal}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Badge accent={accent} label={`${cap(r.riskLevel)} risk`} />
                        {r.tag && <Badge accent="orange" label={r.tag} />}
                      </div>
                    </div>
                    <button
                      onClick={() => setCompose({ title: r.draftTitle, body: r.draft })}
                      className="surface-hover inline-flex shrink-0 items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)]"
                    >
                      {r.actionLabel}
                      <ArrowUpRight className="h-3.5 w-3.5" style={{ color: ACCENT_HEX[accent] }} />
                    </button>
                  </div>
                );
              })}
            </div>

            <div
              className="mt-4 rounded-lg border-l-2 p-3"
              style={{ borderColor: ACCENT_HEX.purple, background: accentRgba("purple", 0.08) }}
            >
              <p className="text-xs leading-5 text-[var(--text-secondary)]">
                <span className="font-semibold text-[var(--ai-purple)]">Sakha suggests: </span>
                {managerData.attritionSuggestion}
              </p>
            </div>
          </div>

          {/* Team health score ring */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <HeartPulse className="h-4 w-4 text-[var(--ai-purple)]" />
              Team health score
            </div>

            <div className="mt-4 flex justify-center">
              <HealthRing value={managerData.teamHealthScore} />
            </div>

            <div className="mt-5 space-y-2">
              <LegendRow color={ACCENT_HEX.cyan} label="Engaged" value={`${managerData.healthBreakdown.engaged} members`} />
              <LegendRow color={ACCENT_HEX.orange} label="At risk" value={`${managerData.healthBreakdown.atRisk} members`} />
              <LegendRow color="var(--text-muted)" label="On leave" value={`${managerData.healthBreakdown.onLeave} member`} />
            </div>

            <div className="mt-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                4-week trend
              </p>
              <TrendBars data={managerData.teamHealthTrend} />
            </div>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Onboarding */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <UserPlus className="h-4 w-4 text-[var(--ai-blue)]" />
              Active onboarding
            </div>
            {managerData.onboarding.map((o) => (
              <div key={o.name} className="mt-4">
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold"
                    style={{ background: accentRgba("blue", 0.18), color: ACCENT_HEX.blue }}
                  >
                    {o.initial}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{o.name}</p>
                  </div>
                  <span
                    className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                    style={{ background: accentRgba("cyan", 0.16), color: ACCENT_HEX.cyan }}
                  >
                    Day {o.day}
                  </span>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-[var(--border)]">
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${Math.round((o.day / 90) * 100)}%`, background: ACCENT_HEX.blue }}
                  />
                </div>
                <p className="mt-2 text-xs text-[var(--text-secondary)]">
                  {o.lastIssue} · next: {o.nextMilestone}
                </p>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                <Award className="h-4 w-4 text-[var(--ai-purple)]" />
                Certifications
              </div>
              <span
                className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                style={{ background: accentRgba("purple", 0.14), color: ACCENT_HEX.purple }}
              >
                {managerData.certifications.length} this month
              </span>
            </div>
            <div className="mt-3 space-y-2.5">
              {managerData.certifications.map((c) => {
                const accent = CERT_ACCENT[c.type];
                return (
                  <div key={c.name} className="flex items-center gap-2.5">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: ACCENT_HEX[accent] }} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-[var(--text-primary)]">
                        {c.name}
                      </p>
                      <p className="truncate text-[11px] text-[var(--text-secondary)]">{c.cert}</p>
                    </div>
                    <span className="shrink-0 text-[11px] text-[var(--text-muted)]">{c.date}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sakha recommends */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <Lightbulb className="h-4 w-4 text-[var(--ai-orange)]" />
              Sakha recommends
            </div>
            <div className="mt-3 space-y-2.5">
              {managerData.recommendations.map((rec, i) => (
                <div key={rec.text} className="rounded-lg border border-[var(--border)] p-3">
                  <div className="flex items-start gap-2">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[11px] font-bold"
                      style={{ background: accentRgba(rec.accent, 0.16), color: ACCENT_HEX[rec.accent] }}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-[var(--text-primary)]">{rec.text}</p>
                      <p className="mt-0.5 text-[11px] leading-4 text-[var(--text-secondary)]">
                        {rec.rationale}
                      </p>
                      <button
                        onClick={() => setCompose({ title: rec.draftTitle, body: rec.draft })}
                        className="mt-2 inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold text-white"
                        style={{ background: ACCENT_HEX[rec.accent] }}
                      >
                        {rec.verb}
                        <ArrowUpRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ComposePanel compose={compose} onClose={() => setCompose(null)} />
    </div>
  );
}

function Badge({ accent, label }: { accent: Accent; label: string }) {
  return (
    <span
      className="rounded-md px-2 py-0.5 text-[11px] font-medium"
      style={{ background: accentRgba(accent, 0.16), color: ACCENT_HEX[accent] }}
    >
      {label}
    </span>
  );
}

function LegendRow({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="flex items-center gap-2 text-[var(--text-secondary)]">
        <span className="h-2 w-2 rounded-full" style={{ background: color }} />
        {label}
      </span>
      <span className="font-medium text-[var(--text-primary)]">{value}</span>
    </div>
  );
}

function HealthRing({ value }: { value: number }) {
  const R = 52;
  const C = 2 * Math.PI * R;
  const arc = (C * value) / 100;
  return (
    <div className="relative h-36 w-36">
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
        <circle cx="64" cy="64" r={R} fill="none" stroke="var(--border)" strokeWidth="11" />
        <circle
          cx="64"
          cy="64"
          r={R}
          fill="none"
          stroke={ACCENT_HEX.cyan}
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={`${arc} ${C - arc}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-[var(--text-primary)]">{value}</span>
        <span className="text-[11px] text-[var(--text-muted)]">out of 100</span>
      </div>
    </div>
  );
}

function TrendBars({ data }: { data: number[] }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  return (
    <div className="mt-2 flex h-12 items-end gap-2">
      {data.map((v, i) => {
        const h = max === min ? 100 : 45 + ((v - min) / (max - min)) * 55;
        const isLast = i === data.length - 1;
        return (
          <div
            key={i}
            className="flex-1 rounded-md"
            style={{
              height: `${h}%`,
              background: isLast ? ACCENT_HEX.cyan : accentRgba("cyan", 0.28),
            }}
          />
        );
      })}
    </div>
  );
}

function ComposePanel({ compose, onClose }: { compose: Compose; onClose: () => void }) {
  const [sent, setSent] = useState(false);

  function send() {
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 1300);
  }

  return (
    <AnimatePresence onExitComplete={() => setSent(false)}>
      {compose && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          className="surface absolute bottom-4 right-4 z-30 w-[min(92%,360px)] p-4 shadow-2xl"
          style={{ borderColor: accentRgba("purple", 0.5) }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <Leaf className="h-4 w-4 text-[var(--ai-purple)]" />
              {compose.title}
            </div>
            <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">Sakha drafted this for you</p>
          <div className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3 text-xs leading-5 text-[var(--text-secondary)]">
            {compose.body}
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={send}
              disabled={sent}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-white"
              style={{ background: sent ? ACCENT_HEX.cyan : ACCENT_HEX.purple }}
            >
              {sent ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Sent via Sakha
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Send via Sakha
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="surface-hover rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]"
            >
              Edit
            </button>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]">
            <GraduationCap className="h-3 w-3" />
            Needs your approval before anything is sent · logged to audit trail
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

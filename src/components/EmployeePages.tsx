"use client";

import {
  Briefcase,
  Compass,
  GraduationCap,
  MessageCircle,
  Rocket,
  Target,
} from "lucide-react";
import type { EmployeeTwin } from "@/types/sakha";
import { resolveFallback } from "@/data/career-gps";
import { ACCENT_HEX, accentRgba } from "@/lib/accents";
import type { View } from "@/components/Sidebar";
import { DrillCard } from "@/components/DrillCard";
import { DreyfusBadge } from "@/components/DreyfusBadge";
import { KppScorecard } from "@/components/KppScorecard";
import { PromotionReadiness } from "@/components/PromotionReadiness";
import { SelfAssessment } from "@/components/SelfAssessment";
import { ManagerFeedbackCard } from "@/components/ManagerFeedbackCard";

function Panel({
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  title: string;
  subtitle: string;
  icon: typeof Target;
  children: React.ReactNode;
}) {
  return (
    <div className="surface flex h-full flex-col overflow-hidden">
      <header className="flex items-center gap-3 border-b border-[var(--border)] px-6 py-4">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: accentRgba("purple", 0.16), color: ACCENT_HEX.purple }}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
          <p className="text-xs text-[var(--text-secondary)]">{subtitle}</p>
        </div>
      </header>
      <div className="thin-scroll flex-1 space-y-4 overflow-y-auto p-6">{children}</div>
    </div>
  );
}

/* ── Overview dashboard ─────────────────────────────────────────────────── */
export function EmployeeOverview({ twin, onView }: { twin: EmployeeTwin; onView: (v: View) => void }) {
  const gps = resolveFallback(twin.id, twin.careerGoal);
  return (
    <Panel title={`${twin.name}'s workspace`} subtitle={`Your Career GPS · goal: ${twin.careerGoal}`} icon={Compass}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <DrillCard icon={Target} label="Mission readiness" value={`${gps.matchPercentage}%`} sub={`${twin.careerGoal} · ${gps.readinessDays}d`} accent="purple" onOpen={() => onView("career")} />
        <DrillCard icon={MessageCircle} label="Ask Sakha" value="Chat" sub="career, leave, onboarding, HR" accent="blue" onOpen={() => onView("chat")} />
        {twin.promotion && (
          <DrillCard icon={Target} label="My performance" value={`${twin.promotion.overall}%`} sub="promotion readiness · KPP-grounded" accent="cyan" onOpen={() => onView("emp-performance")} />
        )}
        {twin.learning && (
          <DrillCard icon={GraduationCap} label="Learning" value={`${twin.learning.completion}%`} sub={twin.learning.currentCourse} accent="orange" onOpen={() => onView("emp-growth")} />
        )}
        <DrillCard icon={Briefcase} label="Opportunities" value={`${gps.openRoles.length}`} sub="internal role matches" accent="blue" onOpen={() => onView("emp-opportunities")} />
      </div>

      <div className="rounded-xl attr-card bg-[var(--bg)] p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Current skills on file</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {twin.skills.map((s) => (
            <span key={s} className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--text-secondary)]">{s}</span>
          ))}
        </div>
      </div>
    </Panel>
  );
}

/* ── Performance (KPP-grounded) ─────────────────────────────────────────── */
export function EmployeePerformance({ twin }: { twin: EmployeeTwin }) {
  const has = twin.kpps || twin.promotion || twin.selfAssessment || twin.managerFeedback;
  return (
    <Panel title="My Performance" subtitle="The evidence your Career GPS reasons over" icon={Target}>
      {!has && <p className="text-sm text-[var(--text-secondary)]">No appraisal on file yet for this profile.</p>}
      <div className="grid gap-4 xl:grid-cols-2">
        {twin.promotion && <PromotionReadiness data={twin.promotion} />}
        {twin.kpps && <KppScorecard kpps={twin.kpps} rating={twin.overallRating} />}
      </div>
      {twin.managerFeedback && <ManagerFeedbackCard fb={twin.managerFeedback} />}
      {twin.selfAssessment && <SelfAssessment sections={twin.selfAssessment} name={twin.name} />}
    </Panel>
  );
}

/* ── Growth & Learning ──────────────────────────────────────────────────── */
export function EmployeeGrowth({ twin }: { twin: EmployeeTwin }) {
  return (
    <Panel title="Growth & Learning" subtitle="Your tracks, courses and skill maturity" icon={GraduationCap}>
      {twin.dreyfus && <DreyfusBadge level={twin.dreyfus} />}

      {twin.learning && (
        <div className="rounded-xl attr-card bg-[var(--bg)] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Active course</p>
          <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">{twin.learning.currentCourse}</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 flex-1 rounded-full bg-[var(--border)]">
              <div className="h-1.5 rounded-full" style={{ width: `${twin.learning.completion}%`, background: ACCENT_HEX.cyan }} />
            </div>
            <span className="text-xs font-semibold text-[var(--ai-cyan)]">{twin.learning.completion}%</span>
          </div>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">{twin.learning.hoursPerWeek} hrs / week committed</p>
        </div>
      )}

      {twin.tracks && twin.tracks.length > 0 && (
        <div>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text-primary)]">
            <Rocket className="h-4 w-4 text-[var(--ai-purple)]" />
            Recommended tracks
          </p>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
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
                    <span className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: accentRgba("purple", 0.16), color: ACCENT_HEX.purple }}>
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
        </div>
      )}
    </Panel>
  );
}

/* ── Opportunities ──────────────────────────────────────────────────────── */
export function EmployeeOpportunities({ twin }: { twin: EmployeeTwin }) {
  const gps = resolveFallback(twin.id, twin.careerGoal);
  return (
    <Panel title="Opportunities" subtitle={`Internal roles matching your ${twin.careerGoal} mission`} icon={Briefcase}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {gps.openRoles.map((r) => (
          <div key={r.title} className="rounded-xl border border-[var(--border-strong)] bg-[var(--bg)] p-4">
            <p className="text-sm font-semibold text-[var(--text-primary)]">{r.title}</p>
            <p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">{r.team}</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-[var(--border)]">
                <div className="h-1.5 rounded-full" style={{ width: `${r.match}%`, background: ACCENT_HEX.cyan }} />
              </div>
              <span className="text-xs font-bold text-[var(--ai-cyan)]">{r.match}%</span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-[var(--text-muted)]">
        The Opportunity Agent scans open internal roles continuously and ranks them against your Digital Twin.
      </p>
    </Panel>
  );
}

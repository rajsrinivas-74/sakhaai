"use client";

import { motion } from "framer-motion";
import {
  Award,
  BriefcaseBusiness,
  CalendarDays,
  GraduationCap,
  HeartPulse,
  RefreshCw,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import type { CareerGpsResult, EmployeeTwin } from "@/types/sakha";
import { ACCENT_HEX, accentRgba } from "@/lib/accents";
import { DreyfusBadge } from "@/components/DreyfusBadge";

const TREND_ACCENT = {
  stable: "cyan",
  watch: "orange",
  risk: "pink",
} as const;

const TREND_LABEL = {
  stable: "Engaged",
  watch: "Watch",
  risk: "At risk",
} as const;

export function DigitalTwin({
  twin,
  gps,
  updatedLabel,
  onClose,
}: {
  twin: EmployeeTwin;
  gps?: CareerGpsResult;
  updatedLabel: string;
  onClose?: () => void;
}) {
  const trendAccent = TREND_ACCENT[twin.wellbeing.trend];
  const goalReadiness = gps?.readinessDays;
  const matchPct = gps?.matchPercentage;

  return (
    <div className="surface thin-scroll flex h-full flex-col overflow-y-auto p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[var(--ai-cyan)]" />
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
            Employee Digital Twin
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md border border-[var(--border)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">
            {twin.employeeId}
          </span>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close"
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-semibold"
          style={{ background: accentRgba("cyan", 0.16), color: ACCENT_HEX.cyan }}
        >
          {twin.name.slice(0, 1)}
        </div>
        <div className="min-w-0">
          <p className="text-lg font-semibold text-[var(--text-primary)]">{twin.fullName}</p>
          <p className="text-xs text-[var(--text-secondary)]">
            {twin.role} · {twin.location}
          </p>
        </div>
      </div>

      {twin.dreyfus && <DreyfusBadge level={twin.dreyfus} />}

      <div className="mt-5 space-y-3 text-sm">
        <TwinRow icon={BriefcaseBusiness} label="Stage" value={twin.stage} accent="blue" />
        <TwinRow
          icon={Target}
          label="Goal"
          value={
            matchPct != null
              ? `${twin.careerGoal} · ${matchPct}% ready${goalReadiness ? ` · ${goalReadiness}d` : ""}`
              : twin.careerGoal
          }
          accent="purple"
          highlight={matchPct != null}
        />
        <TwinRow
          icon={GraduationCap}
          label="Learning"
          value={
            twin.learning
              ? `${twin.learning.currentCourse} · ${twin.learning.completion}%`
              : "No active course"
          }
          accent="cyan"
        />
        <TwinRow
          icon={Award}
          label="Skills"
          value={twin.skills.slice(0, 4).join(", ")}
          accent="orange"
        />
        <TwinRow
          icon={CalendarDays}
          label="Leave"
          value={`${twin.leaveBalance.casual} casual · ${twin.leaveBalance.sick} sick · ${twin.leaveBalance.optional} optional`}
          accent="blue"
        />
        <TwinRow
          icon={HeartPulse}
          label="Wellbeing"
          value={`Pulse ${twin.wellbeing.pulseScore}/5 · ${TREND_LABEL[twin.wellbeing.trend]}`}
          accent={trendAccent}
          highlight={twin.wellbeing.trend !== "stable"}
        />
      </div>

      <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
          Last kudos
        </p>
        <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">
          &ldquo;{twin.lastKudos}&rdquo;
        </p>
      </div>

      <motion.div
        key={updatedLabel}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        className="mt-4 flex items-center gap-2 text-[11px] text-[var(--text-muted)]"
      >
        <RefreshCw className="h-3 w-3" />
        Twin updated {updatedLabel}
      </motion.div>
    </div>
  );
}

function TwinRow({
  icon: Icon,
  label,
  value,
  accent,
  highlight = false,
}: {
  icon: typeof Target;
  label: string;
  value: string;
  accent: "blue" | "purple" | "cyan" | "pink" | "orange";
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
        style={{ background: accentRgba(accent, 0.14), color: ACCENT_HEX[accent] }}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
          {label}
        </p>
        <p
          className="text-sm leading-5"
          style={{ color: highlight ? ACCENT_HEX[accent] : "var(--text-primary)" }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

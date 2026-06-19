"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CircleAlert,
  Leaf,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";
import { READINESS_STATUS, managerData, type ReadinessMember } from "@/data/manager";
import { personaById } from "@/data/personas";
import { seedAgentEvents } from "@/data/agents";
import { useOverlay } from "@/lib/useOverlay";
import { ACCENT_HEX, accentRgba, type Accent } from "@/lib/accents";
import { AgentActivity } from "@/components/AgentActivity";
import { AgentChip } from "@/components/AgentChip";
import { AgentDraftPanel, type AgentDraft } from "@/components/AgentDraftPanel";
import { Briefing, type BriefingFinding } from "@/components/Briefing";
import { ActionCenter, type ActionItem } from "@/components/ActionCenter";
import { ManagerWhatIf } from "@/components/ManagerWhatIf";
import { AttritionSimulator } from "@/components/AttritionSimulator";

const RISK_ACCENT: Record<"high" | "medium" | "low", Accent> = {
  high: "pink",
  medium: "orange",
  low: "blue",
};

const BRIEFING_FINDINGS: BriefingFinding[] = [
  { tone: "risk", text: "2 emerging skill gaps on the AI Transformation project" },
  { tone: "risk", text: "1 burnout risk — Rajan, 8 late nights this week" },
  { tone: "opportunity", text: "3 employees ready for AI projects" },
  { tone: "win", text: "4 certifications completed this month" },
];

const BRIEFING_ACTIONS = [
  "Move Priya to the AI Studio Pilot",
  "Check in with Rajan this week",
  "Approve the AI Upskilling Cohort",
];

export function ManagerCopilot() {
  const [draft, setDraft] = useState<AgentDraft>(null);
  const overlay = useOverlay();
  const liveEvents = [
    ...seedAgentEvents.filter((ev) => ev.phase !== "hr"),
    ...overlay.events.filter((ev) => ev.phase !== "hr"),
  ];
  const committed = overlay.commitments;

  const keyActions: ActionItem[] = [
    {
      label: "Move Priya to the AI Studio Pilot",
      sublabel: "89% ready · 91% project match",
      verb: "Assign",
      agent: "career",
      accent: "purple",
      onClick: () =>
        setDraft({
          agent: "career",
          title: "AI Studio Pilot — Priya",
          body: "Assigning Priya Sharma to the AI Studio Pilot — 89% ready for the AI Delivery Manager track, 91% project match. — via Sakha",
          autonomy: "approval",
        }),
    },
    {
      label: "Check in with Rajan",
      sublabel: "burnout risk · 8 late nights",
      verb: "Draft",
      agent: "wellbeing",
      accent: "pink",
      onClick: () =>
        setDraft({
          agent: "wellbeing",
          title: managerData.attritionRisks[0].draftTitle,
          body: managerData.attritionRisks[0].draft,
          autonomy: "approval",
        }),
    },
    {
      label: "Approve the AI Upskilling Cohort",
      sublabel: "+3 deployable in 60 days",
      verb: "Approve",
      agent: "workforce",
      accent: "cyan",
      onClick: () =>
        setDraft({
          agent: "workforce",
          title: "AI Upskilling Cohort",
          body: "Approving the AI upskilling cohort for the team — projected readiness 82% → 91% within 60 days. — via Sakha",
          autonomy: "approval",
        }),
    },
  ];

  return (
    <div className="surface relative flex h-full flex-col overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-6 py-4">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold"
            style={{ background: accentRgba("purple", 0.18), color: ACCENT_HEX.purple }}
          >
            VN
          </span>
          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)]">{managerData.manager}</h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Manager Copilot · {managerData.teamSize} direct reports
            </p>
          </div>
        </div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
          style={{ background: accentRgba("purple", 0.16), color: ACCENT_HEX.purple }}
        >
          <Leaf className="h-3.5 w-3.5" />
          Sakha
        </span>
      </header>

      <div className="thin-scroll flex-1 space-y-5 overflow-y-auto p-6">
        {committed.length > 0 && (
          <div
            className="flex items-center gap-2.5 rounded-xl border p-3"
            style={{ borderColor: accentRgba("cyan", 0.5), background: accentRgba("cyan", 0.09) }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--ai-cyan)] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--ai-cyan)]" />
            </span>
            <p className="text-xs leading-5 text-[var(--text-primary)]">
              {committed.map((c) => `${c.name.split(" ")[0]} → ${c.goal}`).join(", ")} · the Career
              Agent just aligned this to your delivery plan.
            </p>
          </div>
        )}

        {/* KEY ACTIONS — pinned at top */}
        <ActionCenter items={keyActions} />

        {/* HERO BRIEFING */}
        <Briefing
          greeting="Good morning, Vikram"
          lead={`Overnight I analyzed your ${managerData.teamSize} team members.`}
          findings={BRIEFING_FINDINGS}
          actions={BRIEFING_ACTIONS}
          agent="manager"
        />

        {/* TEAM READINESS MAP */}
        <div className="rounded-xl attr-card bg-[var(--bg)] p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <Users className="h-4 w-4 text-[var(--ai-cyan)]" />
              Team readiness · {managerData.readinessProject}
            </div>
            <span className="text-sm font-bold text-[var(--text-primary)]">{managerData.projectReadiness}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-[var(--border)]">
            <div className="h-2 rounded-full" style={{ width: `${managerData.projectReadiness}%`, background: ACCENT_HEX.cyan }} />
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {managerData.readinessTeam.map((m) => (
              <ReadinessRow key={m.name} member={m} />
            ))}
          </div>
        </div>

        {/* WHAT-IF (signature) */}
        <ManagerWhatIf />

        {/* ATTRITION DEEP-DIVE (Rajan) */}
        <AttritionSimulator />

        {/* SPOTLIGHT + RISK CENTER */}
        <div className="grid gap-4 lg:grid-cols-2">
          <EmployeeSpotlight onAct={setDraft} />
          <RiskCenter onAct={setDraft} flags={overlay.retentionFlags} />
        </div>

        {/* TALENT PIPELINE */}
        <div className="rounded-xl attr-card bg-[var(--bg)] p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
            <TrendingUp className="h-4 w-4 text-[var(--ai-purple)]" />
            AI talent pipeline
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <PipelineCell label="Ready today" value={managerData.talentPipeline.readyToday} accent="cyan" />
            <PipelineCell label="Ready in 30 days" value={managerData.talentPipeline.ready30} accent="blue" />
            <PipelineCell label="Ready in 90 days" value={managerData.talentPipeline.ready90} accent="purple" />
          </div>
        </div>

        {/* AGENT ACTIVITY */}
        <AgentActivity events={liveEvents} title="Agent activity" compact />
      </div>

      <AgentDraftPanel draft={draft} onClose={() => setDraft(null)} />
    </div>
  );
}

function ReadinessRow({ member }: { member: ReadinessMember }) {
  const { label, accent } = READINESS_STATUS[member.status];
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[var(--border)] p-2.5">
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
        style={{ background: accentRgba(accent, 0.16), color: ACCENT_HEX[accent] }}
      >
        {member.initial}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[var(--text-primary)]">{member.name}</p>
        <p className="truncate text-[11px] text-[var(--text-secondary)]">{member.note}</p>
      </div>
      <span
        className="shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold"
        style={{ background: accentRgba(accent, 0.16), color: ACCENT_HEX[accent] }}
      >
        {label}
      </span>
    </div>
  );
}

function EmployeeSpotlight({ onAct }: { onAct: (d: AgentDraft) => void }) {
  const s = managerData.spotlight;
  const twin = personaById("priya");
  const dims = twin.promotion?.dimensions ?? [];
  const strength = dims.filter((d) => d.status === "exceeds").sort((a, b) => b.current - a.current)[0];
  const gap = dims.filter((d) => d.status === "critical" || d.status === "development").sort((a, b) => a.current - b.current)[0];
  return (
    <div
      className="rounded-xl border p-5"
      style={{ borderColor: accentRgba("purple", 0.4), background: accentRgba("purple", 0.06) }}
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
        <UserRound className="h-4 w-4 text-[var(--ai-purple)]" />
        Employee spotlight
        <AgentChip agent="career" status="done" />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-xl text-base font-semibold"
          style={{ background: accentRgba("purple", 0.18), color: ACCENT_HEX.purple }}
        >
          {s.initial}
        </span>
        <div>
          <p className="text-base font-semibold text-[var(--text-primary)]">{s.name}</p>
          <p className="text-xs text-[var(--text-secondary)]">{s.role} → {s.goal}</p>
        </div>
        <span className="ml-auto text-right">
          <span className="block text-2xl font-bold text-[var(--text-primary)]">{s.readiness}%</span>
          <span className="block text-[10px] text-[var(--text-muted)]">AI ready</span>
        </span>
      </div>

      {/* PROMOTION READINESS — same KPP-grounded number Priya sees */}
      {twin.promotion && (
        <div className="mt-3 rounded-lg attr-card bg-[var(--bg)] p-3">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              Promotion readiness
            </span>
            <span className="font-bold tabular-nums text-[var(--ai-cyan)]">
              {twin.promotion.overall}%
              <span className="font-medium text-[var(--text-muted)]"> / {twin.promotion.target}%</span>
            </span>
          </div>
          <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--border)]">
            <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${twin.promotion.overall}%`, background: ACCENT_HEX.cyan }} />
            <div className="absolute inset-y-0 w-0.5" style={{ left: `${twin.promotion.target}%`, background: ACCENT_HEX.purple }} />
          </div>
          {(strength || gap) && (
            <p className="mt-2 text-[11px] leading-4 text-[var(--text-secondary)]">
              KPP evidence:{" "}
              {strength && (
                <span className="font-semibold text-[var(--ai-cyan)]">{strength.label} {strength.current}%</span>
              )}
              {strength && gap && " · "}
              {gap && (
                <span className="font-semibold text-[var(--ai-orange)]">{gap.label} {gap.current}%</span>
              )}
            </p>
          )}
        </div>
      )}

      <button
        onClick={() =>
          onAct({
            agent: "career",
            title: "AI Studio Pilot — Priya",
              body: `Assigning Priya Sharma to the AI Studio Pilot. She's ${s.readiness}% ready for the AI Delivery Manager track and a 91% match for the project. Manager: Vikram. — via Sakha`,
            autonomy: "approval",
          })
        }
        className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
        style={{ background: ACCENT_HEX.purple }}
      >
        {s.suggestedAction}
        <ArrowUpRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function RiskCenter({ onAct, flags }: { onAct: (d: AgentDraft) => void; flags: string[] }) {
  const priyaFlagged = flags.includes("priya");
  return (
    <div className="rounded-xl attr-card bg-[var(--bg)] p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
        <CircleAlert className="h-4 w-4 text-[var(--ai-pink)]" />
        Risk center · top 3
      </div>
      <div className="mt-3 space-y-2">
        {priyaFlagged && (
          <motion.button
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() =>
              onAct({
                agent: "wellbeing",
                title: "Growth 1:1 — Priya",
                body: "Hi Priya, do you have 30 minutes this week? I'd love to hear how things are going and talk through your AI Delivery Manager path — there are a couple of internal roles I think you'd be great for. Pick any slot. — Vikram",
                autonomy: "approval",
              })
            }
            className="flex w-full items-center gap-3 rounded-lg border p-2.5 text-left"
            style={{ borderColor: accentRgba("orange", 0.5), background: accentRgba("orange", 0.07) }}
          >
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: ACCENT_HEX.orange }} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--text-primary)]">Priya Sharma</p>
              <p className="truncate text-[11px] text-[var(--text-secondary)]">Retention risk · raised via Sakha just now</p>
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0" style={{ color: ACCENT_HEX.orange }} />
          </motion.button>
        )}
        {managerData.attritionRisks.slice(0, priyaFlagged ? 1 : 2).map((r) => {
          const accent = RISK_ACCENT[r.riskLevel];
          return (
            <button
              key={r.name}
              onClick={() => onAct({ agent: "wellbeing", title: r.draftTitle, body: r.draft, autonomy: "approval" })}
              className="flex w-full items-center gap-3 rounded-lg border border-[var(--border)] p-2.5 text-left"
            >
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: ACCENT_HEX[accent] }} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--text-primary)]">{r.name}</p>
                <p className="truncate text-[11px] text-[var(--text-secondary)]">{r.tag ?? r.signal}</p>
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0" style={{ color: ACCENT_HEX[accent] }} />
            </button>
          );
        })}
        <div className="flex items-center gap-3 rounded-lg border border-[var(--border)] p-2.5">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: ACCENT_HEX.orange }} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[var(--text-primary)]">AI skills shortage</p>
            <p className="truncate text-[11px] text-[var(--text-secondary)]">Demand outpaces team supply</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PipelineCell({ label, value, accent }: { label: string; value: number; accent: Accent }) {
  return (
    <div className="rounded-lg border border-[var(--border)] p-3 text-center">
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold tabular-nums"
        style={{ color: ACCENT_HEX[accent] }}
      >
        {value}
      </motion.p>
      <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">{label}</p>
    </div>
  );
}

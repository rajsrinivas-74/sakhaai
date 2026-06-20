"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  HeartPulse,
  Leaf,
  Radar,
  TrendingUp,
  Users,
} from "lucide-react";
import type {
  AgentEvent,
  AgentId,
  HrAction,
  HrInsights,
  WorkforceSegment,
} from "@/types/sakha";
import {
  baseHrInsights,
  roleGaps,
  talentDiscovery,
  workforceForecast,
  retentionIntel,
  reskillEconomics,
} from "@/data/workforce";
import { seedAgentEvents } from "@/data/agents";
import { personaById } from "@/data/personas";
import { useOverlay } from "@/lib/useOverlay";
import { ACCENT_HEX, accentRgba, type Accent } from "@/lib/accents";
import { AgentActivity } from "@/components/AgentActivity";
import { AgentChip } from "@/components/AgentChip";
import { AgentDraftPanel, type AgentDraft } from "@/components/AgentDraftPanel";
import { WorkforceSimulator } from "@/components/WorkforceSimulator";
import { TransformationScorecard } from "@/components/TransformationScorecard";
import { ProgramDemandTracker } from "@/components/ProgramDemandTracker";
import { BuildVsBuyPortfolio } from "@/components/BuildVsBuyPortfolio";
import { Briefing, type BriefingFinding } from "@/components/Briefing";
import { ActionCenter, type ActionItem } from "@/components/ActionCenter";

const HR_FINDINGS: BriefingFinding[] = [
  { tone: "risk", text: "AI demand exceeds supply by 54 employees" },
  { tone: "opportunity", text: "127 employees are ready for AI transition" },
  { tone: "risk", text: "38 high-potential employees show stagnation risk" },
  { tone: "win", text: "Internal reskilling can save ₹4.2 Cr vs hiring" },
];

const HR_ACTIONS = [
  "Launch the AI Reskilling Cohort",
  "Align Priya to the Enterprise AI Studio pipeline",
  "Prioritise retention for 38 flight-risk employees",
];

const SEGMENT_ACCENT: Record<WorkforceSegment, Accent> = {
  reskilling: "purple",
  stagnant: "orange",
  "flight-risk": "pink",
  rising: "cyan",
};

const IMPACT_AGENT: Record<HrAction["impact"], AgentId> = {
  reskilling: "workforce",
  mobility: "opportunity",
  retention: "wellbeing",
  cost: "workforce",
};

export function HRCommandCenter({
  events = seedAgentEvents,
}: {
  events?: AgentEvent[];
}) {
  const [draft, setDraft] = useState<AgentDraft>(null);
  const [insights, setInsights] = useState<HrInsights>(baseHrInsights);
  const [source, setSource] = useState<"openai" | "fallback" | null>(null);
  const overlay = useOverlay();
  const liveEvents = [...events, ...overlay.events];
  const committed = overlay.commitments;

  // Pull the live rollup (model headline when a key is present), refreshing as
  // commitments land so the headline can name a fresh mover.
  useEffect(() => {
    let active = true;
    fetch("/api/hr-insights", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { insights: HrInsights; source: "openai" | "fallback" } | null) => {
        if (active && d) {
          setInsights(d.insights);
          setSource(d.source);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [overlay.commitments.length]);

  const keyActions: ActionItem[] = insights.actions.map((a) => {
    const agent = IMPACT_AGENT[a.impact];
    return {
      label: a.title,
      verb: a.verb,
      agent,
      accent: a.accent,
      onClick: () => setDraft({ agent, title: a.draftTitle, body: a.draft, autonomy: "approval" }),
    };
  });

  return (
    <div className="surface relative flex h-full flex-col overflow-hidden">
      {/* TOP BAR */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-6 py-4">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold"
            style={{ background: accentRgba("blue", 0.18), color: ACCENT_HEX.blue }}
          >
            AD
          </span>
          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)]">{insights.hrPartner}</h2>
            <p className="text-xs text-[var(--text-secondary)]">
              {insights.hrPartnerTitle ?? "Capability Manager"} · Workforce Transformation
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {source && (
            <span className="rounded-md border border-[var(--border)] px-2 py-1 text-[10px] font-medium text-[var(--text-muted)]">
              {source === "openai" ? "Live · OpenAI" : "Local Twin model"}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs text-[var(--text-secondary)]">
            <CalendarDays className="h-3.5 w-3.5" />
            {insights.asOf}
          </span>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
            style={{ background: accentRgba("blue", 0.16), color: ACCENT_HEX.blue }}
          >
            <Leaf className="h-3.5 w-3.5" />
            Sakha
          </span>
        </div>
      </header>

      <div className="thin-scroll flex-1 space-y-5 overflow-y-auto p-6">
        {/* LIVE GOLDEN-THREAD BANNER */}
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
              {committed.map((c) => c.name.split(" ")[0]).join(", ")} just committed to{" "}
              {committed.length === 1 ? `the ${committed[0].goal} path` : "new growth paths"} —
              propagated to your board by the agent fleet.
            </p>
          </div>
        )}

        {/* KEY ACTIONS — pinned at top */}
        <ActionCenter items={keyActions} />

        {/* RETENTION INTELLIGENCE — high priority for the Capability Manager */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-5"
          style={{ borderColor: accentRgba("pink", 0.4), background: accentRgba("pink", 0.05) }}
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
            <HeartPulse className="h-4 w-4 text-[var(--ai-pink)]" />
            Retention intelligence
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            <span className="font-bold text-[var(--text-primary)]">{retentionIntel.atRisk}</span> flight-risk ·{" "}
            <span className="font-bold text-[var(--ai-cyan)]">{retentionIntel.retainable}</span> retainable via{" "}
            {retentionIntel.lever.toLowerCase()}
          </p>
          <AgentChip agent="wellbeing" status="watching" />
        </div>

        {/* HERO BRIEFING */}
        <Briefing
          greeting={`Good morning, ${insights.hrPartner.split(" ")[0]}`}
          lead="I analyzed 18,432 employees overnight."
          findings={HR_FINDINGS}
          actions={HR_ACTIONS}
          agent="workforce"
          source={source}
        />

        {/* TRANSFORMATION SCORECARD — OKRs vs target */}
        <TransformationScorecard />

        {/* HERO — RESKILLING SIMULATOR */}
        <WorkforceSimulator />

        {/* STRATEGIC PROGRAM DEMAND TRACKER */}
        <ProgramDemandTracker onAct={setDraft} />

        {/* ROLE-LEVEL GAP MAP + AGENT ACTIVITY */}
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-xl attr-card bg-[var(--bg)] p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                <TrendingUp className="h-4 w-4 text-[var(--ai-purple)]" />
                Workforce gap map
              </div>
              <div className="flex items-center gap-3 text-[11px] text-[var(--text-secondary)]">
                <Legend color={ACCENT_HEX.pink} label="Demand" />
                <Legend color={ACCENT_HEX.cyan} label="Supply" />
              </div>
            </div>
            <div className="mt-4 space-y-3.5">
              {roleGaps.map((r) => (
                <GapRow key={r.role} role={r.role} demand={r.demand} supply={r.supply} />
              ))}
            </div>
          </div>

          <AgentActivity events={liveEvents} title="Agent activity" compact />
        </div>

        {/* AI DELIVERY MANAGER — build vs buy (Priya's cohort) */}
        <AiDeliveryManagerCase onAct={setDraft} />

        {/* BUILD VS BUY — full critical-role portfolio */}
        <BuildVsBuyPortfolio />

        {/* WORKFORCE SIGNALS */}
        <div className="rounded-xl attr-card bg-[var(--bg)] p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
            <Users className="h-4 w-4 text-[var(--ai-cyan)]" />
            Workforce signals
            <span className="text-[11px] font-normal text-[var(--text-muted)]">· triaged by the Workforce Agent</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {insights.signals.map((sig) => {
              const accent = SEGMENT_ACCENT[sig.segment];
              return (
                <div
                  key={sig.segment}
                  className="rounded-xl border p-4"
                  style={{ borderColor: accentRgba(accent, 0.4), background: accentRgba(accent, 0.06) }}
                >
                  <p className="text-3xl font-bold text-[var(--text-primary)]">{sig.count}</p>
                  <p className="mt-0.5 text-xs font-semibold" style={{ color: ACCENT_HEX[accent] }}>{sig.label}</p>
                  <p className="mt-1.5 text-[11px] leading-4 text-[var(--text-secondary)]">{sig.note}</p>
                  {sig.members.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {sig.members.map((m) => (
                        <span
                          key={m}
                          className="rounded-md px-2 py-0.5 text-[11px] font-medium"
                          style={{ background: accentRgba(accent, 0.16), color: ACCENT_HEX[accent] }}
                        >
                          {personaById(m).name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* TALENT DISCOVERY + FUTURE WORKFORCE */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl attr-card bg-[var(--bg)] p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <Radar className="h-4 w-4 text-[var(--ai-orange)]" />
              Talent discovery
              <span className="text-[11px] font-normal text-[var(--text-muted)]">· found, not applied</span>
            </div>
            <div className="mt-3 space-y-2">
              {talentDiscovery.map((t) => (
                <div key={t.name} className="flex items-center gap-3 rounded-lg border border-[var(--border)] p-2.5">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                    style={{ background: accentRgba("orange", 0.16), color: ACCENT_HEX.orange }}
                  >
                    {t.initial}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[var(--text-primary)]">{t.name}</p>
                    <p className="truncate text-[11px] text-[var(--text-secondary)]">{t.reason}</p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-[var(--ai-cyan)]">{t.match}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl attr-card bg-[var(--bg)] p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <TrendingUp className="h-4 w-4 text-[var(--ai-cyan)]" />
              Future workforce · AI-ready
            </div>
            <div className="mt-4 flex items-end justify-between gap-2">
              {workforceForecast.map((f, i) => {
                const max = workforceForecast[workforceForecast.length - 1].value;
                const h = 30 + (f.value / max) * 70;
                return (
                  <div key={f.label} className="flex flex-1 flex-col items-center gap-1.5">
                    <span className="text-sm font-bold text-[var(--text-primary)]">{f.value}</span>
                    <div
                      className="w-full rounded-t-md"
                      style={{
                        height: `${h}px`,
                        background: i === workforceForecast.length - 1 ? ACCENT_HEX.cyan : accentRgba("cyan", 0.3),
                      }}
                    />
                    <span className="text-[10px] text-[var(--text-muted)]">{f.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      <AgentDraftPanel draft={draft} onClose={() => setDraft(null)} />
    </div>
  );
}

function AiDeliveryManagerCase({ onAct }: { onAct: (d: AgentDraft) => void }) {
  const e = reskillEconomics;
  return (
    <div
      className="rounded-xl border p-5"
      style={{ borderColor: accentRgba("purple", 0.4), background: accentRgba("purple", 0.05) }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
          <TrendingUp className="h-4 w-4 text-[var(--ai-purple)]" />
          AI Delivery Manager · build vs buy
        </div>
        <AgentChip agent="workforce" status="watching" />
      </div>
      <p className="mt-1 text-xs text-[var(--text-secondary)]">
        Priya&rsquo;s move surfaced <span className="font-semibold text-[var(--text-primary)]">{e.cohortSize} delivery managers</span> with the same
        profile — revenue-strong, commercial gap, no AI experience yet.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <CaseStat label="Supply today" value={String(e.supplyToday)} accent="pink" />
        <CaseStat label="Supply in 180d" value={String(e.supplyAfter180)} accent="cyan" />
        <CaseStat label="Reskill cost" value={`₹${e.reskillCostCr} Cr`} accent="blue" />
        <CaseStat label="Saving vs hiring" value={`₹${e.savingCr} Cr`} accent="purple" />
      </div>

      <button
        onClick={() =>
          onAct({
            agent: "workforce",
            title: "AI Delivery Manager reskilling cohort",
            body: `Launching the AI Delivery Manager reskilling cohort — ${e.cohortSize} delivery managers matching Priya Sharma's profile, Career GPS auto-enrolled. Supply ${e.supplyToday} → ${e.supplyAfter180} in 180 days. Investment ₹${e.reskillCostCr} Cr vs ₹${e.externalHireCostCr} Cr to hire externally (saving ₹${e.savingCr} Cr). — via Sakha`,
            autonomy: "approval",
          })
        }
        className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
        style={{ background: ACCENT_HEX.purple }}
      >
        Launch reskilling cohort · {e.cohortSize} candidates
      </button>
    </div>
  );
}

function CaseStat({ label, value, accent }: { label: string; value: string; accent: Accent }) {
  return (
    <div className="rounded-lg attr-card bg-[var(--bg)] p-3 text-center">
      <p className="text-lg font-bold tabular-nums" style={{ color: ACCENT_HEX[accent] }}>{value}</p>
      <p className="mt-0.5 text-[10px] leading-3 text-[var(--text-muted)]">{label}</p>
    </div>
  );
}

function GapRow({ role, demand, supply }: { role: string; demand: number; supply: number }) {
  const gap = demand - supply;
  // Bars are scaled against the largest demand so headcounts read proportionally.
  const scale = 100 / 92;
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-[var(--text-primary)]">{role}</span>
        <span className="text-[var(--text-secondary)]">
          {demand} / {supply}
          {gap > 0 ? (
            <span className="ml-1.5 font-semibold text-[var(--ai-pink)]">gap −{gap}</span>
          ) : (
            <span className="ml-1.5 text-[var(--ai-cyan)]">covered</span>
          )}
        </span>
      </div>
      <div className="mt-1.5 space-y-1">
        <Bar value={demand * scale} color={ACCENT_HEX.pink} />
        <Bar value={supply * scale} color={ACCENT_HEX.cyan} />
      </div>
    </div>
  );
}

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 rounded-full bg-[var(--border)]">
      <div className="h-1.5 rounded-full" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}


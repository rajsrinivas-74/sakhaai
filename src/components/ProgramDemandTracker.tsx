"use client";

import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import {
  transformationPrograms,
  type ProgramStatus,
  type TransformationProgram,
} from "@/data/workforce";
import { ACCENT_HEX, accentRgba, type Accent } from "@/lib/accents";
import { AgentChip } from "@/components/AgentChip";
import type { AgentDraft } from "@/components/AgentDraftPanel";

const STATUS: Record<ProgramStatus, { label: string; accent: Accent }> = {
  "on-track": { label: "On track", accent: "cyan" },
  "at-risk": { label: "At risk", accent: "orange" },
  blocked: { label: "Blocked", accent: "pink" },
};

/**
 * Strategic program demand tracker — the page's operating spine. Each named
 * transformation programme declares its skill demand and is tracked to
 * fulfilment: demand → committed supply → gap → agent fill plan → status.
 */
export function ProgramDemandTracker({ onAct }: { onAct: (d: AgentDraft) => void }) {
  return (
    <div className="rounded-xl attr-card bg-[var(--bg)] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
          <Layers className="h-4 w-4 text-[var(--ai-purple)]" />
          Program demand tracker
          <span className="text-[11px] font-normal text-[var(--text-muted)]">· skill demand → fulfilment</span>
        </div>
        <AgentChip agent="workforce" status="watching" />
      </div>

      <div className="mt-4 space-y-2.5">
        {transformationPrograms.map((p, i) => (
          <ProgramRow key={p.id} program={p} index={i} onAct={onAct} />
        ))}
      </div>
    </div>
  );
}

function ProgramRow({
  program: p,
  index,
  onAct,
}: {
  program: TransformationProgram;
  index: number;
  onAct: (d: AgentDraft) => void;
}) {
  const s = STATUS[p.status];
  const gap = p.demand - p.supply;
  const covered = p.demand > 0 ? Math.min(100, (p.supply / p.demand) * 100) : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-xl border p-3.5"
      style={{ borderColor: accentRgba(s.accent, 0.35), background: accentRgba(s.accent, 0.04) }}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--text-primary)]">{p.name}</p>
          <p className="text-[11px] text-[var(--text-muted)]">
            {p.sponsor} · {p.skill} · {p.deadline}
          </p>
        </div>
        <span
          className="shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold"
          style={{ background: accentRgba(s.accent, 0.16), color: ACCENT_HEX[s.accent] }}
        >
          {s.label}
        </span>
      </div>

      {/* DEMAND → SUPPLY → GAP */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <Stat label="Demand" value={p.demand} accent="blue" />
        <Stat label="Committed" value={p.supply} accent="cyan" />
        <Stat label={gap > 0 ? "Gap" : "Covered"} value={gap > 0 ? `−${gap}` : "✓"} accent={gap > 0 ? "pink" : "cyan"} />
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--border)]">
        <div className="h-1.5 rounded-full" style={{ width: `${covered}%`, background: ACCENT_HEX[s.accent] }} />
      </div>

      {/* FILL PLAN + ACTION */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] text-[var(--text-secondary)]">
          Fill plan:{" "}
          {p.reskill > 0 && <span className="font-semibold text-[var(--ai-purple)]">reskill {p.reskill}</span>}
          {p.reskill > 0 && p.hire > 0 && " · "}
          {p.hire > 0 && <span className="font-semibold text-[var(--ai-blue)]">hire {p.hire}</span>}
          {p.reskill === 0 && p.hire === 0 && <span>redeploy</span>}
          <span className="text-[var(--text-muted)]"> — {p.note}</span>
        </p>
        {gap > 0 && (
          <button
            onClick={() =>
              onAct({
                agent: "workforce",
                title: `Fill plan — ${p.name}`,
                body: `Approving the fill plan for ${p.name} (${p.skill}): reskill ${p.reskill} + hire ${p.hire} to close a gap of ${gap} against ${p.demand} demand by ${p.deadline}. Career GPS auto-enrols the reskill cohort. — via Sakha`,
                autonomy: "approval",
              })
            }
            className="shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-white"
            style={{ background: ACCENT_HEX[s.accent] }}
          >
            Approve fill plan
          </button>
        )}
      </div>
    </motion.div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number | string; accent: Accent }) {
  return (
    <div className="rounded-lg attr-card bg-[var(--bg)] py-1.5">
      <p className="text-base font-bold tabular-nums" style={{ color: ACCENT_HEX[accent] }}>{value}</p>
      <p className="text-[9px] uppercase tracking-[0.1em] text-[var(--text-muted)]">{label}</p>
    </div>
  );
}

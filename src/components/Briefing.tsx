"use client";

import { motion } from "framer-motion";
import {
  Award,
  Rocket,
  Sparkles,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import type { AgentId } from "@/types/sakha";
import { AgentChip } from "@/components/AgentChip";
import { ACCENT_HEX, accentRgba, type Accent } from "@/lib/accents";

export type BriefingTone = "risk" | "opportunity" | "win" | "info";
export type BriefingFinding = { tone: BriefingTone; text: string };

const TONE: Record<BriefingTone, { icon: LucideIcon; accent: Accent }> = {
  risk: { icon: TriangleAlert, accent: "orange" },
  opportunity: { icon: Rocket, accent: "cyan" },
  win: { icon: Award, accent: "purple" },
  info: { icon: Sparkles, accent: "blue" },
};

/**
 * The AI Briefing — a Chief-of-Staff narrative hero that replaces KPI tiles.
 * "Good morning {name}, overnight I analyzed … here's what I found and what I'd
 * do." Used by Manager Copilot and Workforce Intelligence.
 */
export function Briefing({
  greeting,
  lead,
  findings,
  actions,
  agent = "workforce",
  source,
}: {
  greeting: string;
  lead: string;
  findings: BriefingFinding[];
  actions: string[];
  agent?: AgentId;
  source?: "openai" | "fallback" | null;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border p-5"
      style={{ borderColor: accentRgba("blue", 0.4), background: accentRgba("blue", 0.06) }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AgentChip agent={agent} status="done" />
          {source && (
            <span className="rounded-md border border-[var(--border)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">
              {source === "openai" ? "Live · OpenAI" : "Local model"}
            </span>
          )}
        </div>
        <span className="text-[11px] text-[var(--text-muted)]">briefing · just now</span>
      </div>

      <h3 className="mt-3 text-lg font-bold text-[var(--text-primary)]">{greeting}</h3>
      <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">{lead}</p>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {findings.map((f, i) => {
          const { icon: Icon, accent } = TONE[f.tone];
          return (
            <div key={i} className="flex items-start gap-2">
              <Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: ACCENT_HEX[accent] }} />
              <p className="text-sm leading-5 text-[var(--text-primary)]">{f.text}</p>
            </div>
          );
        })}
      </div>

      {actions.length > 0 && (
        <div className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Recommended actions
          </p>
          <ol className="mt-2 space-y-1.5">
            {actions.map((a, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm text-[var(--text-primary)]">
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[11px] font-bold"
                  style={{ background: accentRgba("blue", 0.16), color: ACCENT_HEX.blue }}
                >
                  {i + 1}
                </span>
                {a}
              </li>
            ))}
          </ol>
        </div>
      )}
    </motion.div>
  );
}

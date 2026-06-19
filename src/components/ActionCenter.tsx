"use client";

import { ArrowUpRight, ListChecks } from "lucide-react";
import type { AgentId } from "@/types/sakha";
import { AgentChip } from "@/components/AgentChip";
import { ACCENT_HEX, accentRgba, type Accent } from "@/lib/accents";

export type ActionItem = {
  label: string;
  sublabel?: string;
  verb: string;
  agent?: AgentId;
  accent?: Accent;
  onClick: () => void;
};

/**
 * The pinned "key actions" strip at the top of every persona — the things to
 * action right now, one click away. Consistent across Employee / Manager / HR
 * so "what do I do next" is always the first thing in view.
 */
export function ActionCenter({
  items,
  title = "Your key actions",
}: {
  items: ActionItem[];
  title?: string;
}) {
  if (items.length === 0) return null;
  return (
    <div
      className="rounded-xl border p-4"
      style={{ borderColor: accentRgba("orange", 0.4), background: accentRgba("orange", 0.05) }}
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
        <ListChecks className="h-4 w-4 text-[var(--ai-orange)]" />
        {title}
        <span className="text-[11px] font-normal text-[var(--text-muted)]">· {items.length} to action</span>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => {
          const accent = a.accent ?? "orange";
          return (
            <button
              key={a.label}
              onClick={a.onClick}
              className="surface-hover group flex items-start gap-2.5 rounded-lg attr-card bg-[var(--bg)] p-3 text-left"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-5 text-[var(--text-primary)]">{a.label}</p>
                {a.sublabel && <p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">{a.sublabel}</p>}
                {a.agent && (
                  <span className="mt-1.5 inline-block">
                    <AgentChip agent={a.agent} status="done" />
                  </span>
                )}
              </div>
              <span
                className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition group-hover:gap-1.5"
                style={{ background: accentRgba(accent, 0.16), color: ACCENT_HEX[accent] }}
              >
                {a.verb}
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

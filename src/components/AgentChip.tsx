"use client";

import type { AgentId, AgentStatus } from "@/types/sakha";
import { agentById } from "@/data/agents";
import { ACCENT_HEX, accentRgba } from "@/lib/accents";

const STATUS_LABEL: Record<AgentStatus, string> = {
  idle: "idle",
  thinking: "thinking",
  acting: "acting",
  done: "done",
  handoff: "handing off",
};

/** A named agent pill with a live status dot — the atom of the "agents at work" UI. */
export function AgentChip({
  agent,
  status = "idle",
  showRemit = false,
}: {
  agent: AgentId;
  status?: AgentStatus;
  showRemit?: boolean;
}) {
  const def = agentById(agent);
  const color = ACCENT_HEX[def.accent];
  const live = status === "thinking" || status === "acting" || status === "handoff";

  return (
    <span
      title={showRemit ? def.remit : undefined}
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{ background: accentRgba(def.accent, 0.14), color }}
    >
      <span className="relative flex h-2 w-2">
        {live && (
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
            style={{ background: color }}
          />
        )}
        <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: color }} />
      </span>
      {def.name}
      {status !== "idle" && (
        <span className="font-medium opacity-70">· {STATUS_LABEL[status]}</span>
      )}
    </span>
  );
}

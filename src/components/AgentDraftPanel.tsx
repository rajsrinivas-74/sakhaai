"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Send, X } from "lucide-react";
import type { AgentId } from "@/types/sakha";
import { agentById } from "@/data/agents";
import { ACCENT_HEX, accentRgba } from "@/lib/accents";
import { AutonomyBadge, type AutonomyLevel } from "@/components/AutonomyBadge";

export type AgentDraft = {
  agent: AgentId;
  title: string;
  body: string;
  autonomy?: AutonomyLevel;
} | null;

/**
 * A Sakha-drafted action surfaced for human approval — attributed to the named
 * agent that wrote it. Reinforces "an agent did this, you stay in control."
 */
export function AgentDraftPanel({ draft, onClose }: { draft: AgentDraft; onClose: () => void }) {
  const [sent, setSent] = useState(false);

  function send() {
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 1300);
  }

  const def = draft ? agentById(draft.agent) : null;
  const accent = def?.accent ?? "purple";

  return (
    <AnimatePresence onExitComplete={() => setSent(false)}>
      {draft && def && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          className="surface absolute bottom-4 right-4 z-30 w-[min(92%,380px)] p-4 shadow-2xl"
          style={{ borderColor: accentRgba(accent, 0.5) }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: ACCENT_HEX[accent] }} />
              {draft.title}
            </div>
            <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">
            Drafted by <span style={{ color: ACCENT_HEX[accent] }}>{def.name}</span>
          </p>
          <div className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3 text-xs leading-5 text-[var(--text-secondary)]">
            {draft.body}
          </div>
          <div className="mt-3">
            <AutonomyBadge level={draft.autonomy ?? "approval"} />
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={send}
              disabled={sent}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-white"
              style={{ background: sent ? ACCENT_HEX.cyan : ACCENT_HEX[accent] }}
            >
              {sent ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Approved · agent executing
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Approve & run
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}

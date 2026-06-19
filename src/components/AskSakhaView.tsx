"use client";

import { Sparkles } from "lucide-react";
import { AskSakha } from "@/components/AskSakha";
import { AgentChip } from "@/components/AgentChip";
import { managerResponder, managerSuggestions, hrResponder, hrSuggestions } from "@/data/ask";
import { ACCENT_HEX, accentRgba } from "@/lib/accents";

/** Ask Sakha promoted to a full-height left-nav view (per persona). */
export function AskSakhaView({ role }: { role: "manager" | "hr" }) {
  const isManager = role === "manager";
  const responder = isManager ? managerResponder : hrResponder;
  const suggestions = isManager ? managerSuggestions : hrSuggestions;
  const agent = isManager ? "manager" : "workforce";
  const scope = isManager ? "your team" : "your workforce";

  return (
    <div className="surface flex h-full flex-col overflow-hidden">
      <header className="flex items-center gap-3 border-b border-[var(--border)] px-6 py-4">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: accentRgba("cyan", 0.16), color: ACCENT_HEX.cyan }}
        >
          <Sparkles className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Ask Sakha</h2>
          <p className="text-xs text-[var(--text-secondary)]">Natural-language answers about {scope}</p>
        </div>
        <AgentChip agent={agent} status="thinking" />
      </header>

      <div className="thin-scroll flex-1 overflow-y-auto p-6">
        <AskSakha agent={agent} role={role} responder={responder} suggestions={suggestions} flat placeholder={`Ask about ${scope}…`} />
      </div>
    </div>
  );
}

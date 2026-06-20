"use client";

import { MessageSquareQuote, ThumbsUp, TrendingUp } from "lucide-react";
import type { ManagerFeedback } from "@/types/sakha";
import { ACCENT_HEX, type Accent } from "@/lib/accents";

/** Latest manager feedback on file — an input the Career GPS reasons over. */
export function ManagerFeedbackCard({ fb }: { fb: ManagerFeedback }) {
  const accent: Accent = fb.sentiment === "watch" ? "pink" : fb.sentiment === "positive" ? "cyan" : "blue";
  return (
    <div className="rounded-xl attr-card bg-[var(--bg)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text-primary)]">
          <MessageSquareQuote className="h-4 w-4" style={{ color: ACCENT_HEX[accent] }} />
          Manager feedback · considered by GPS
        </h4>
        <span className="text-[11px] text-[var(--text-muted)]">
          {fb.from} · {fb.date}
        </span>
      </div>
      <p className="mt-2 text-xs italic leading-5 text-[var(--text-secondary)]">&ldquo;{fb.summary}&rdquo;</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
            <ThumbsUp className="h-3 w-3 text-[var(--ai-cyan)]" />
            Strengths
          </p>
          <ul className="mt-1 space-y-0.5">
            {fb.strengths.map((s) => (
              <li key={s} className="text-[11px] leading-4 text-[var(--text-secondary)]">· {s}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
            <TrendingUp className="h-3 w-3 text-[var(--ai-orange)]" />
            Development areas → GPS gaps
          </p>
          <ul className="mt-1 space-y-0.5">
            {fb.developmentAreas.map((s) => (
              <li key={s} className="text-[11px] leading-4 text-[var(--text-secondary)]">· {s}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

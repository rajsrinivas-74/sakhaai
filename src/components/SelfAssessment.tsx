"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, FileText, Sparkles } from "lucide-react";
import type { SelfAssessmentSection } from "@/types/sakha";
import { ACCENT_HEX, accentRgba } from "@/lib/accents";

/**
 * The FY25 → FY26 self-assessment Sakha auto-drafts from the achievement log
 * and KPP data — the employee reviews and edits rather than starting from a
 * blank page. Collapsed by default to keep the GPS scannable.
 */
export function SelfAssessment({
  sections,
  name,
}: {
  sections: SelfAssessmentSection[];
  name: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-xl border p-4"
      style={{ borderColor: accentRgba("purple", 0.4), background: accentRgba("purple", 0.05) }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div className="flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: accentRgba("purple", 0.16), color: ACCENT_HEX.purple }}
          >
            <FileText className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Self-assessment · FY25 → FY26
            </p>
            <p className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)]">
              <Sparkles className="h-3 w-3 text-[var(--ai-purple)]" />
              Auto-drafted by Sakha for {name} to review
            </p>
          </div>
        </div>
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="shrink-0 text-[var(--text-muted)]">
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-3">
              {sections.map((s) => (
                <div key={s.heading} className="rounded-lg attr-card bg-[var(--bg)] p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ai-purple)]">
                    {s.heading}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">{s.body}</p>
                </div>
              ))}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
                  style={{ background: ACCENT_HEX.purple }}
                >
                  Accept draft
                </button>
                <button className="surface-hover rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
                  Edit before submit
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { GraduationCap } from "lucide-react";
import { DREYFUS_ORDER, type DreyfusLevel } from "@/types/sakha";
import { ACCENT_HEX, accentRgba } from "@/lib/accents";

/**
 * The employee's overall Dreyfus competency, shown as a 5-stage ladder with the
 * current stage lit. Used on the Digital Twin and in Career GPS readiness.
 */
export function DreyfusBadge({
  level,
  compact = false,
}: {
  level: DreyfusLevel;
  compact?: boolean;
}) {
  const idx = DREYFUS_ORDER.indexOf(level);
  return (
    <div className={compact ? "" : "mt-4 rounded-lg attr-card bg-[var(--bg)] p-3"}>
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
          <GraduationCap className="h-3.5 w-3.5 text-[var(--ai-purple)]" />
          Dreyfus competency
        </p>
        <span
          className="rounded-md px-2 py-0.5 text-[11px] font-semibold"
          style={{ background: accentRgba("purple", 0.16), color: ACCENT_HEX.purple }}
        >
          {level}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-1">
        {DREYFUS_ORDER.map((stage, i) => (
          <div key={stage} className="flex-1">
            <div
              className="h-1.5 rounded-full"
              style={{ background: i <= idx ? ACCENT_HEX.purple : "var(--border)" }}
            />
          </div>
        ))}
      </div>
      {!compact && (
        <div className="mt-1 flex justify-between text-[9px] text-[var(--text-muted)]">
          <span>Novice</span>
          <span>Expert</span>
        </div>
      )}
    </div>
  );
}

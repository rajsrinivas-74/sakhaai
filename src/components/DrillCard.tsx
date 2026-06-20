"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ACCENT_HEX, accentRgba, type Accent } from "@/lib/accents";

/**
 * A dashboard summary card that drills into a sub-page. Double-click anywhere
 * opens it (power-user shortcut); the visible "Open" affordance keeps it
 * accessible by click and keyboard.
 */
export function DrillCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
  onOpen,
}: {
  icon: typeof ArrowUpRight;
  label: string;
  value: string;
  sub?: string;
  accent: Accent;
  onOpen: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onDoubleClick={onOpen}
      className="group relative cursor-pointer rounded-xl border p-4 transition hover:brightness-[1.04]"
      style={{ borderColor: accentRgba(accent, 0.4), background: accentRgba(accent, 0.05) }}
      title="Double-click to open"
    >
      <div className="flex items-center justify-between">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ background: accentRgba(accent, 0.16), color: ACCENT_HEX[accent] }}
        >
          <Icon className="h-4 w-4" />
        </span>
        <button
          onClick={onOpen}
          className="flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold opacity-0 transition group-hover:opacity-100 focus:opacity-100"
          style={{ color: ACCENT_HEX[accent] }}
          aria-label={`Open ${label}`}
        >
          Open
          <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>
      <p className="mt-3 text-2xl font-bold tabular-nums text-[var(--text-primary)]">{value}</p>
      <p className="text-xs font-semibold text-[var(--text-primary)]">{label}</p>
      {sub && <p className="mt-0.5 text-[11px] leading-4 text-[var(--text-secondary)]">{sub}</p>}
    </motion.div>
  );
}

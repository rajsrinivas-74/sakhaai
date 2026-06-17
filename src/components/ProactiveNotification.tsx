"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Leaf, X } from "lucide-react";
import type { ProactiveNotification as Notif } from "@/types/sakha";
import { ACCENT_HEX, accentRgba, type Accent } from "@/lib/accents";

const TONE_ACCENT: Record<Notif["tone"], Accent> = {
  welcome: "blue",
  urgent: "orange",
  gentle: "purple",
};

export function ProactiveNotification({
  notif,
  onAction,
  onDismiss,
}: {
  notif: Notif | null;
  onAction: (label: string) => void;
  onDismiss: () => void;
}) {
  const accent = notif ? TONE_ACCENT[notif.tone] : "blue";

  return (
    <AnimatePresence>
      {notif && (
        <motion.div
          initial={{ opacity: 0, x: 28, y: -8 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 28 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          className="surface p-4 shadow-xl"
          style={{ borderColor: accentRgba(accent, 0.5) }}
        >
          <div className="flex items-start gap-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{ background: accentRgba(accent, 0.16), color: ACCENT_HEX[accent] }}
            >
              <Leaf className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[var(--text-primary)]">{notif.title}</p>
                <button
                  onClick={onDismiss}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">{notif.time}</p>
              <p className="mt-2 text-xs leading-5 text-[var(--text-secondary)]">{notif.message}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {notif.actions.map((a, i) => (
                  <button
                    key={a.label}
                    onClick={() => onAction(a.label)}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold"
                    style={
                      i === 0
                        ? { background: ACCENT_HEX[accent], color: "#fff" }
                        : {
                            background: "transparent",
                            color: "var(--text-secondary)",
                            border: "1px solid var(--border)",
                          }
                    }
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

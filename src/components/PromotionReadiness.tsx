"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import type { PromotionDimension, PromotionReadiness as Data } from "@/types/sakha";
import { ACCENT_HEX, accentRgba, type Accent } from "@/lib/accents";

const STATUS_ACCENT: Record<PromotionDimension["status"], Accent> = {
  exceeds: "cyan",
  ontrack: "blue",
  development: "orange",
  critical: "pink",
};

const STATUS_LABEL: Record<PromotionDimension["status"], string> = {
  exceeds: "Exceeds",
  ontrack: "On track",
  development: "Develop",
  critical: "Critical gap",
};

/**
 * Promotion readiness Sakha computes from the KPP record plus Career GPS plan
 * progress — visible to both the employee and (rolled up) the manager. The
 * overall gauge shows today vs the next-window target.
 */
export function PromotionReadiness({ data }: { data: Data }) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{ borderColor: accentRgba("cyan", 0.4), background: accentRgba("cyan", 0.05) }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text-primary)]">
          <TrendingUp className="h-4 w-4 text-[var(--ai-cyan)]" />
          Promotion readiness
        </h3>
        <span className="text-[11px] text-[var(--text-secondary)]">
          Target <span className="font-semibold text-[var(--text-primary)]">{data.target}%</span> in{" "}
          {data.targetWindowDays} days
        </span>
      </div>

      {/* OVERALL GAUGE — today vs target marker */}
      <div className="mt-3">
        <div className="flex items-end justify-between">
          <span className="text-3xl font-bold tabular-nums text-[var(--text-primary)]">
            {data.overall}
            <span className="text-base text-[var(--text-muted)]">%</span>
          </span>
          <span className="text-[11px] text-[var(--text-muted)]">
            +{Math.max(0, data.target - data.overall)} pts to target
          </span>
        </div>
        <div className="relative mt-2 h-2.5 overflow-hidden rounded-full bg-[var(--border)]">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: ACCENT_HEX.cyan }}
            initial={{ width: 0 }}
            animate={{ width: `${data.overall}%` }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
          <div
            className="absolute inset-y-0 w-0.5 bg-[var(--ai-purple)]"
            style={{ left: `${data.target}%` }}
            title={`Target ${data.target}%`}
          />
        </div>
      </div>

      {/* DIMENSIONS */}
      <div className="mt-4 space-y-2">
        {data.dimensions.map((d, i) => {
          const accent = STATUS_ACCENT[d.status];
          return (
            <motion.div
              key={d.label}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3"
            >
              <span className="w-36 shrink-0 text-[11px] text-[var(--text-secondary)]">{d.label}</span>
              <div className="h-1.5 flex-1 rounded-full bg-[var(--border)]">
                <div
                  className="h-1.5 rounded-full"
                  style={{ width: `${Math.min(100, d.current)}%`, background: ACCENT_HEX[accent] }}
                />
              </div>
              <span className="w-12 shrink-0 text-right text-[11px] font-semibold tabular-nums text-[var(--text-primary)]">
                {d.current}%
              </span>
              <span
                className="hidden w-20 shrink-0 text-right text-[10px] font-semibold sm:block"
                style={{ color: ACCENT_HEX[accent] }}
              >
                {STATUS_LABEL[d.status]}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

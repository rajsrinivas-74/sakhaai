"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Radar } from "lucide-react";
import { emergingSkills, type SkillStage, type EmergingSkill } from "@/data/workforce";
import { ACCENT_HEX, accentRgba, type Accent } from "@/lib/accents";

const STAGE: Record<SkillStage, { label: string; accent: Accent }> = {
  emerging: { label: "Emerging", accent: "purple" },
  growing: { label: "Growing", accent: "cyan" },
  mature: { label: "Mature", accent: "blue" },
  declining: { label: "Declining", accent: "orange" },
};

const ORDER: SkillStage[] = ["emerging", "growing", "mature", "declining"];

/**
 * Emerging skills radar — skills by maturity stage with momentum, so capability
 * can be pre-built before a skill hits the demand/supply gap map.
 */
export function EmergingSkillsRadar() {
  return (
    <div className="rounded-xl attr-card bg-[var(--bg)] p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
        <Radar className="h-4 w-4 text-[var(--ai-purple)]" />
        Emerging skills radar
        <span className="text-[11px] font-normal text-[var(--text-muted)]">· build ahead of the gap</span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ORDER.map((stage) => {
          const items = emergingSkills.filter((s) => s.stage === stage);
          if (items.length === 0) return null;
          const st = STAGE[stage];
          return (
            <div key={stage}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: ACCENT_HEX[st.accent] }}>
                {st.label}
              </p>
              <div className="mt-2 space-y-2">
                {items.map((s, i) => (
                  <SkillCard key={s.skill} skill={s} accent={st.accent} index={i} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SkillCard({ skill: s, accent, index }: { skill: EmergingSkill; accent: Accent; index: number }) {
  const up = s.momentum >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="rounded-lg border p-2.5"
      style={{ borderColor: accentRgba(accent, 0.35), background: accentRgba(accent, 0.04) }}
    >
      <p className="text-xs font-medium leading-4 text-[var(--text-primary)]">{s.skill}</p>
      <div className="mt-1.5 flex items-center justify-between">
        <span
          className="flex items-center gap-0.5 text-[11px] font-semibold"
          style={{ color: up ? ACCENT_HEX.cyan : ACCENT_HEX.orange }}
        >
          {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {up ? "+" : ""}{s.momentum}%
        </span>
        <span className="text-[10px] text-[var(--text-muted)]">{s.supply} people</span>
      </div>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import { capabilityDepth, type CapabilityDepth } from "@/data/workforce";
import { ACCENT_HEX } from "@/lib/accents";

const LEVELS = [
  { key: "expert", label: "Expert", color: ACCENT_HEX.purple },
  { key: "proficient", label: "Proficient", color: ACCENT_HEX.cyan },
  { key: "competent", label: "Competent", color: ACCENT_HEX.blue },
  { key: "learning", label: "Learning", color: "var(--border-strong)" },
] as const;

/**
 * Capability depth — headcount by proficiency, so a capability with healthy
 * total supply but few Experts reads as the depth risk it is.
 */
export function CapabilityDepthHeatmap() {
  return (
    <div className="rounded-xl attr-card bg-[var(--bg)] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
          <Layers className="h-4 w-4 text-[var(--ai-purple)]" />
          Capability depth
          <span className="text-[11px] font-normal text-[var(--text-muted)]">· proficiency, not just headcount</span>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 text-[10px] text-[var(--text-secondary)]">
          {LEVELS.map((l) => (
            <span key={l.key} className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-sm" style={{ background: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {capabilityDepth.map((c, i) => (
          <Row key={c.capability} cap={c} index={i} />
        ))}
      </div>
    </div>
  );
}

function Row({ cap, index }: { cap: CapabilityDepth; index: number }) {
  const total = cap.expert + cap.proficient + cap.competent + cap.learning;
  const depthRisk = cap.expert < cap.minExperts;
  return (
    <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[var(--text-primary)]">{cap.capability}</p>
        <p className="text-[11px] text-[var(--text-secondary)]">
          {total} people ·{" "}
          {depthRisk ? (
            <span className="font-semibold text-[var(--ai-pink)]">
              {cap.expert} experts · need {cap.minExperts} ⚠
            </span>
          ) : (
            <span className="text-[var(--ai-cyan)]">{cap.expert} experts · deep enough</span>
          )}
        </p>
      </div>
      <div className="mt-1.5 flex h-3 overflow-hidden rounded-full bg-[var(--border)]">
        {LEVELS.map((l) => {
          const v = cap[l.key] as number;
          const w = (v / total) * 100;
          return <div key={l.key} title={`${l.label}: ${v}`} style={{ width: `${w}%`, background: l.color }} />;
        })}
      </div>
    </motion.div>
  );
}

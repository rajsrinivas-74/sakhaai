"use client";

import { useEffect, useState } from "react";

export type Opportunity = { title: string; match: number; reason: string };

/** Idle "background working" lines the agents emit between real actions. */
const IDLE_LINES = [
  "Opportunity radar swept · 0 new",
  "Learning progress synced",
  "Readiness re-scored against role profile",
  "Mentor network scanned",
  "Market skill trends refreshed",
];

/**
 * The always-on heartbeat. Once engaged (Autopilot), the fleet keeps working in
 * the background: idle ticks keep the feed alive, and after a beat a proactive
 * opportunity surfaces unprompted — the strongest "it never sleeps" signal.
 */
export function useHeartbeat({
  enabled,
  opportunity,
  tickMs = 5000,
  popAfterMs = 9000,
}: {
  enabled: boolean;
  opportunity?: Opportunity;
  tickMs?: number;
  popAfterMs?: number;
}): { ticks: number; idleLine: string; opportunity: Opportunity | null } {
  const [ticks, setTicks] = useState(0);
  const [popped, setPopped] = useState<Opportunity | null>(null);

  useEffect(() => {
    // Autopilot engages once and stays on, so we only ever spin the heartbeat
    // up — never tear state down synchronously here.
    if (!enabled) return;
    const interval = setInterval(() => setTicks((t) => t + 1), tickMs);
    const popTimer = opportunity
      ? setTimeout(() => setPopped(opportunity), popAfterMs)
      : undefined;
    return () => {
      clearInterval(interval);
      if (popTimer) clearTimeout(popTimer);
    };
  }, [enabled, opportunity, tickMs, popAfterMs]);

  return {
    ticks,
    idleLine: IDLE_LINES[ticks % IDLE_LINES.length],
    opportunity: popped,
  };
}

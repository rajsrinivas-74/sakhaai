/**
 * Demo timeline configuration — the auto-play walkthrough ("Walk the golden
 * thread"). Tune ALL durations here, in seconds. Nothing else needs editing to
 * re-pace the demo. Order matches the on-screen flow.
 */
export const DEMO_TIMELINE = {
  /** Centered persona-switch card duration (seconds). */
  switchCardSecs: 3,

  /**
   * Seconds each step shows before auto-advancing (auto-play mode).
   * id → on-screen step (sub-page the tour lands on):
   */
  stepSecs: {
    // ── Priya · Employee · Career GPS ──────────────────────────────
    "priya-dashboard": 11, //  Dashboard (employee overview)
    "priya-performance": 25, //  My Performance (KPP scorecard + manager feedback)
    "priya-growth": 15, //  Growth & Learning (tracks + courses)
    "priya-ask": 21, //  Ask Sakha (auto-asks the career question)
    "priya-gps": 35, //  Career GPS · Roadmap (agents reason live)
    "priya-autopilot": 21, //  Career GPS · Autopilot auto-engages (agents act)
    // ── Vikram · Manager · Manager Copilot ─────────────────────────
    "vikram-dashboard": 13, //  Dashboard (team health + readiness)
    "vikram-team": 27, //  Team & Readiness (Priya spotlight + assign action)
    "vikram-retention": 23, //  Retention (attrition what-if · Rajan)
    "vikram-strategies": 21, //  Scenarios (what-if strategies)
    // ── Anita · Capability Manager · Workforce Intelligence ────────
    "anita-dashboard": 15, //  Dashboard (demand vs supply)
    "anita-buildbuy": 20, //  Build vs Buy (₹13.9 Cr cohort case)
    "anita-retention": 20, //  Talent & Retention (final · auto-finishes)
  },
} as const;

export type DemoStepId = keyof typeof DEMO_TIMELINE.stepSecs;

/** Step duration in milliseconds. */
export function stepMs(id: DemoStepId): number {
  return DEMO_TIMELINE.stepSecs[id] * 1000;
}

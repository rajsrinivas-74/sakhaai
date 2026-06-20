/**
 * Demo timeline configuration — the auto-play walkthrough ("Walk the golden
 * thread"). Tune ALL durations here, in seconds. Nothing else needs editing to
 * re-pace the demo. Order matches the on-screen flow.
 */
export const DEMO_TIMELINE = {
  /** Centered persona-switch card duration (seconds). */
  switchCardSecs: 3,

  /** Seconds each step shows before auto-advancing (auto-play mode). */
  stepSecs: {
    // Priya — Employee · Career GPS
    "priya-dashboard": 11,
    "priya-performance": 25,
    "priya-growth": 15,
    "priya-ask": 21,
    "priya-gps": 35,
    "priya-autopilot": 21,
    // Vikram — Manager · Manager Copilot
    "vikram-dashboard": 13,
    "vikram-team": 27,
    "vikram-retention": 23,
    "vikram-strategies": 21,
    // Anita — Capability Manager · Workforce Intelligence
    "anita-dashboard": 15,
    "anita-buildbuy": 20,
    "anita-retention": 20,
  },
} as const;

export type DemoStepId = keyof typeof DEMO_TIMELINE.stepSecs;

/** Step duration in milliseconds. */
export function stepMs(id: DemoStepId): number {
  return DEMO_TIMELINE.stepSecs[id] * 1000;
}

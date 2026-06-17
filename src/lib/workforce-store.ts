import type { AgentEvent, PersonaId } from "@/types/sakha";
import { personaById } from "@/data/personas";

/**
 * In-memory workforce store — the spine of the "one continuous system" story.
 * When an employee commits to a path (e.g. Priya → AI Engineer), it is recorded
 * here ONCE and read back by the Manager and HR lenses, with a synthesized
 * agent-handoff trail so the propagation is visible, not asserted.
 *
 * Module-level state lives for the life of the server process — ideal for a
 * single-instance demo, and it resets cleanly on restart.
 */

export type Commitment = {
  personaId: PersonaId;
  name: string;
  goal: string;
  matchPercentage: number;
  readinessDays: number;
};

export type Overlay = {
  commitments: Commitment[];
  events: AgentEvent[];
  /** Employees who raised a retention signal (e.g. via the "resigning" chat). */
  retentionFlags: PersonaId[];
};

const commitments = new Map<PersonaId, Commitment>();
const retentionFlags = new Set<PersonaId>();
let events: AgentEvent[] = [];
let seq = 0;

const nextId = () => `live-${++seq}`;

/**
 * Record a commitment and emit the full Employee → Manager → HR propagation
 * chain — one aspiration becoming a cascade of autonomous agent actions. The
 * timeline is timestamped 09:02 → 09:10 so the demo reads as a single,
 * continuous flow across all three lenses.
 */
export function recordCommitment(c: Commitment): Overlay {
  commitments.set(c.personaId, c);
  const first = c.name.split(" ")[0];
  const manager = personaById(c.personaId).manager;

  const e = (
    time: string,
    agent: AgentEvent["agent"],
    action: string,
    extra: Partial<AgentEvent> = {},
  ): AgentEvent => ({
    id: nextId(),
    agent,
    status: "done",
    action,
    about: c.personaId,
    time,
    ...extra,
  });

  const chain: AgentEvent[] = [
    // ── Employee phase — goal becomes action ──
    e("09:02", "career", `Goal created — ${c.goal}`, {
      phase: "employee",
      detail: "career transformation plan",
      handoffTo: "career",
      artifact: `${c.goal} plan`,
    }),
    e("09:03", "career", "Skill-gap analysis complete", {
      phase: "employee",
      detail: "Python · ML foundations · LLM patterns",
      handoffTo: "learning",
    }),
    e("09:03", "learning", "Enrolled in Python for AI", {
      phase: "employee",
      detail: "100% funded · starts Monday",
      artifact: "Python for AI",
    }),
    e("09:04", "learning", "Reserved learning blocks", {
      phase: "employee",
      detail: "calendar updated",
      artifact: "Tue & Thu · 2–4pm",
      handoffTo: "manager",
    }),
    e("09:05", "manager", `Notified ${manager}`, {
      phase: "employee",
      detail: "manager looped in",
      artifact: "message sent",
      handoffTo: "opportunity",
    }),
    e("09:06", "opportunity", "Added to AI Talent Pool", {
      phase: "employee",
      detail: `${c.matchPercentage}% → ready in ${c.readinessDays}d`,
      artifact: "Enterprise AI Studio",
    }),

    // ── Manager phase — propagates to delivery ──
    e("09:06", "manager", `${first}'s learning plan created`, {
      phase: "manager",
      detail: "visible on your board",
    }),
    e("09:07", "manager", "Team readiness recalculated", {
      phase: "manager",
      detail: "AI readiness +3 pts",
    }),
    e("09:08", "manager", "Delivery risk recalculated", {
      phase: "manager",
      detail: "Project Helix · staffing updated",
      handoffTo: "workforce",
    }),

    // ── HR phase — propagates to the workforce ──
    e("09:08", "workforce", "AI talent supply updated", {
      phase: "hr",
      detail: "+1 ready now",
    }),
    e("09:09", "workforce", "Workforce gap recomputed", {
      phase: "hr",
      detail: "demand 92 vs supply 39",
    }),
    e("09:10", "opportunity", `${first} added to reskilling cohort`, {
      phase: "hr",
      detail: "37 similar candidates surfaced",
      status: "acting",
    }),
  ];

  events = [...events, ...chain];
  return getOverlay();
}

/**
 * Record an HR cohort reskilling approval — one decision fanning out into a
 * batch of autonomous actions, the organizational mirror of Priya's commit.
 */
export function recordCohort(count: number): Overlay {
  const hr = (time: string, agent: AgentEvent["agent"], action: string, detail?: string): AgentEvent => ({
    id: nextId(),
    agent,
    status: "done",
    action,
    detail,
    time,
    phase: "hr",
  });

  const batch: AgentEvent[] = [
    hr("now", "workforce", `Approved AI cross-training — ${count} candidates`, "from the GenAI capability budget"),
    hr("now", "learning", `${count} learning plans created`, "personalised per Digital Twin"),
    hr("now", "manager", `${count} managers notified`, "delivery plans updated"),
    hr("now", "learning", `${count} employees enrolled`, "100% funded"),
    {
      id: nextId(),
      agent: "workforce",
      status: "acting",
      action: "AI talent supply rising",
      detail: `supply 38 → ${38 + count} · gap closing by Q3`,
      time: "now",
      phase: "hr",
    },
  ];

  events = [...events, ...batch];
  return getOverlay();
}

/** Record a manager applying a retention intervention — re-forecast made real. */
export function recordIntervention(label: string, riskTo: number): Overlay {
  const batch: AgentEvent[] = [
    {
      id: nextId(),
      agent: "wellbeing",
      status: "done",
      action: "Retention plan applied — Rajan",
      detail: label,
      about: "rajan",
      time: "now",
      phase: "manager",
      handoffTo: "manager",
    },
    {
      id: nextId(),
      agent: "manager",
      status: "acting",
      action: `Rajan flight risk re-forecast to ${riskTo}%`,
      detail: "delivery risk updated",
      about: "rajan",
      time: "now",
      phase: "manager",
    },
  ];
  events = [...events, ...batch];
  return getOverlay();
}

/**
 * Record a retention signal raised by an employee (the "I'm considering
 * resigning" chat). The Wellbeing Agent propagates it to the manager and HR
 * lenses — one sentence rippling across the org, under consent.
 */
export function recordRetentionFlag(persona: PersonaId): Overlay {
  retentionFlags.add(persona);
  const first = personaById(persona).name.split(" ")[0];
  const manager = personaById(persona).manager;
  const batch: AgentEvent[] = [
    {
      id: nextId(),
      agent: "wellbeing",
      status: "acting",
      action: `Retention signal raised — ${first}`,
      detail: "shared with consent",
      about: persona,
      time: "now",
      phase: "manager",
      handoffTo: "manager",
    },
    {
      id: nextId(),
      agent: "manager",
      status: "done",
      action: `Flagged to ${manager} — suggest a growth 1:1`,
      detail: "Risk Center updated",
      about: persona,
      time: "now",
      phase: "manager",
    },
    {
      id: nextId(),
      agent: "workforce",
      status: "done",
      action: `${first} added to retention watch`,
      detail: "internal-mobility option attached",
      about: persona,
      time: "now",
      phase: "hr",
    },
  ];
  events = [...events, ...batch];
  return getOverlay();
}

export function getOverlay(): Overlay {
  return {
    commitments: [...commitments.values()],
    events: [...events],
    retentionFlags: [...retentionFlags],
  };
}

/** Wipe all propagated state — gives the demo a clean "before" on every run. */
export function resetStore(): Overlay {
  commitments.clear();
  retentionFlags.clear();
  events = [];
  seq = 0;
  return getOverlay();
}

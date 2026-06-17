import type { AgentDef, AgentEvent, AgentId } from "@/types/sakha";

/**
 * The Sakha agent fleet. Sakha is not one chatbot — it is a set of cooperating
 * agents, each owning a slice of the employee-success loop. The UI surfaces
 * these by name so the demo *feels* agentic: agents reason, act, and hand off.
 */
export const AGENTS: Record<AgentId, AgentDef> = {
  career: {
    id: "career",
    name: "Career Agent",
    remit: "Forms the goal, reasons over the Twin, plans the path.",
    accent: "purple",
  },
  learning: {
    id: "learning",
    name: "Learning Agent",
    remit: "Enrols courses and reserves calendar time to learn.",
    accent: "cyan",
  },
  opportunity: {
    id: "opportunity",
    name: "Opportunity Agent",
    remit: "Matches people to internal AI roles and talent pools.",
    accent: "orange",
  },
  workforce: {
    id: "workforce",
    name: "Workforce Agent",
    remit: "Recomputes org-wide skill demand vs supply for HR.",
    accent: "blue",
  },
  manager: {
    id: "manager",
    name: "Manager Agent",
    remit: "Recalculates team readiness and delivery risk.",
    accent: "cyan",
  },
  wellbeing: {
    id: "wellbeing",
    name: "Wellbeing Agent",
    remit: "Watches burnout and engagement, nudges with care.",
    accent: "pink",
  },
};

export const agentList: AgentDef[] = Object.values(AGENTS);

export const agentById = (id: AgentId): AgentDef => AGENTS[id];

/**
 * Seed activity for the live stream, so every lens opens already showing the
 * fleet at work. The store layers real, propagated events on top of these.
 */
export const seedAgentEvents: AgentEvent[] = [
  {
    id: "seed-1",
    agent: "learning",
    status: "done",
    action: "Synced Priya's Digital Twin",
    detail: "5 skills · 2 certs · 0.4s",
    about: "priya",
    time: "09:01",
    phase: "employee",
  },
  {
    id: "seed-2",
    agent: "workforce",
    status: "done",
    action: "Recomputed AI demand vs supply",
    detail: "6 skill families · 0.9s",
    time: "09:00",
    phase: "hr",
  },
  {
    id: "seed-3",
    agent: "wellbeing",
    status: "thinking",
    action: "Watching Rajan — 8 late nights, engagement −27%",
    detail: "burnout signal",
    about: "rajan",
    time: "08:58",
    phase: "manager",
  },
  {
    id: "seed-4",
    agent: "manager",
    status: "done",
    action: "Scored Project Helix readiness against demand",
    detail: "8 members · 0.6s",
    time: "08:55",
    phase: "manager",
  },
];

# Sakha AI — Demo Context (PPT Deck Reference)

> **One-liner:** Sakha AI is an agentic *Employee Success Operating System* that turns an employee's career question into a personalized roadmap **and starts the work immediately** — while giving managers and HR a connected, real-time view of the same event.

**Built for:** HCLTech–OpenAI Agentic AI Hackathon · Track 2: Enterprise Operations
**Date:** June 2026 · **Status:** Working prototype, 100% demo-safe (runs with zero API keys)

---

## 1. The 30-Second Pitch

Employees ask *"How do I become an AI Engineer?"* → Sakha responds with a personalized **86-day Career GPS roadmap**: readiness %, skill gaps, a month-by-month learning path, matching internal roles, and a success probability. Then it **acts** — enrolls courses, blocks calendar, alerts the manager, flags HR.

The same event reads three ways at once:
- **Priya (Employee)** sees her career path and mission.
- **Vikram (Manager)** sees a more-ready team and a retention risk to address.
- **Anita (HR)** sees the org's AI readiness move and a reskilling pipeline fill.

**One Digital Twin → six agents → three connected business narratives.** That's the "golden thread."

---

## 2. The Three Personas (Three Doors In)

| Persona | Role | Location | Tenure | Goal | State | Demo Value |
|---------|------|----------|--------|------|-------|-----------|
| **Priya Sharma** | Java Full Stack Dev | Chennai | Day 92 | **AI Engineer** | Ready to grow (89% AI-ready) | ⭐ Golden path |
| **Arjun Mehta** | Graduate Trainee | Noida | Day 8 | Full Stack Dev | Onboarding (VPN blocked) | Day-1 unblock |
| **Rajan Krishnan** | Senior QA Engineer | Bengaluru | Year 4 | Automation Architect | At risk (8 late nights, engagement −27%) | Retention save |

---

## 3. The Three Lenses (Same Twin, Three Views)

### A. Employee Lens — Priya / Arjun / Rajan
- **Sakha Chat** — Sakha speaks first; scripted demo flows + live AI answers; inline actions (raise ticket, enroll).
- **Career GPS** — goal input → multi-agent reasoning stream → result: **42% match, 86 days, 88% success probability**, 4 skill gaps, 3-month learning path, 3 matching internal roles.
- **Mission Control** — reframes the path as a mission; tune hours/week, pick target role, **Engage Autopilot**.
- **Digital Twin** — living profile (skills, certs, projects, leave, wellbeing, Dreyfus level) that visibly updates *"just now · Career GPS."*
- *Privacy:* cannot see other employees or the manager/HR lens.

### B. Manager Lens — Vikram
- **Manager Copilot** — Team health **84% (↓5 pts)**, briefing (risks + wins), readiness grid with RAG status.
- 3 approve-able actions: *Move Priya to AI Studio · Check in with Rajan · Approve Upskilling Cohort.*
- **Manager What-If** — "What if Rajan leaves?" delivery/morale/skills impact forecast.
- *Governance:* agent **drafts** actions; Vikram approves before execution.

### C. HR Lens — Anita
- **HR Command Center** — AI readiness **38%** trend, **demand 92 vs supply 38** (gap −54), 4 workforce segments (Reskilling 38 · Stagnant 116 · Flight-risk 19 · Rising 27), talent discovery, 90-day forecast.
- 3 HR actions: *Approve Priya's cross-training · Align Priya to Enterprise AI Studio · Prioritise Rajan retention.*
- **Workforce Simulator** — "What if we reskill 50 people?" → AI readiness ramp 38 → 54 → 89 → 127 over 90 days.

---

## 4. The Golden Thread (Live Demo Script)

1. **Priya lands** → proactive welcome nudge: *"Map my AI Engineer path?"*
2. **Chat:** "How do I become an AI Engineer?" → routes to Career GPS.
3. **Career GPS:** 42% match · 86 days · 88% probability · gaps (Python, ML, LLM patterns, eval) · 3-month path · 3 open roles.
4. **Mission Control:** pick *Associate AI Engineer*, set 5 hrs/week → **Engage Autopilot.**
5. **Agents act:** Career Agent drafts the plan · Learning Agent enrolls "Python for Java Developers" · Opportunity Agent flags the AI Studio pipeline.
6. **Switch to Vikram:** new action *"Move Priya to AI Studio Pilot (89% ready)"* → approve.
7. **Switch to Anita:** org AI readiness ticks up, Priya tagged to the pipeline, reskilling action drafted.
8. **Unified timeline:** all three lenses watch the same agent events stream in real time.

---

## 5. The Six-Agent Fleet

| Agent | Color | Job |
|-------|-------|-----|
| **Career** | Purple | Forms the goal, reasons over the Twin, plans the path |
| **Learning** | Cyan | Enrolls courses, reserves calendar |
| **Opportunity** | Orange | Matches people to internal roles |
| **Workforce** | Blue | Computes org skill demand vs supply |
| **Manager** | Cyan | Calculates team readiness & delivery risk |
| **Wellbeing** | Pink | Watches burnout, nudges with care |

All six feed one **unified activity timeline** visible across every lens. Each action carries an **Autonomy Badge**: *Autonomous · logged* / *Under your consent* / *Needs your approval* (human-in-the-loop governance).

---

## 6. Architecture at a Glance

```
                         ┌──────────────────────┐
                         │  Employee Digital Twin│  ← single source of truth
                         │   + Workforce Model   │
                         └──────────┬───────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
        6-Agent Fleet (Career · Learning · Opportunity ·
                  Workforce · Manager · Wellbeing)
                                    │
        ┌───────────────┬──────────┴───────────┬───────────────┐
   Employee Lens     Manager Lens           HR Lens      Unified Agent
   (Career GPS,      (Team health,        (Workforce      Timeline
    Chat, Mission)    approvals)           intelligence)  (all lenses)
```

**The agentic loop:** Observe (lifecycle signals) → Reason (against the Twin) → Act (tickets, enrolments, nudges) → Learn (write back, get sharper).

---

## 7. Tech Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript 5**
- **Tailwind CSS 4** · **Framer Motion** (motion) · **Lucide React** (icons) · **Recharts** (charts)
- **Zod** (validation) · **OpenAI SDK** (`gpt-4o`)
- State: in-memory React hooks + lightweight overlay store; **no external DB / auth / real integrations** (all HR, ITSM, LMS, Teams, calendar data is mocked per hackathon scope)

**Run:** `npm run dev` → `npm run lint` → `npm run build`

---

## 8. Why It's Demo-Safe

OpenAI is **optional**. Every AI surface has a **deterministic fallback** that is visually indistinguishable from a live call:

| Surface | Live (key set) | Fallback (no key) |
|---------|----------------|-------------------|
| Career GPS | `gpt-4o` JSON, Zod-validated | Goal-specific / persona-default result |
| Sakha Chat | Scripted intent → else live AI | Scripted intent → graceful message |
| Agent Reasoning | Streamed reasoning steps | Deterministic step trace from Twin |
| HR Insights | Model-generated headline | Static computed headline |

A small badge shows **"Live · OpenAI"** vs **"Local Twin model."** Network failures fall back silently. The full golden demo path runs perfectly offline.

---

## 9. Key Numbers (For Slides)

- **Priya:** 42% → ready in **86 days** · **88%** success probability · 3 matching roles
- **Vikram's team:** **84%** health · 4 at risk · Priya **89%** ready for AI Studio
- **Anita's org:** AI readiness **38%** · demand **92** vs supply **38** · **38** reskilling candidates · ramp to **127** in 90 days
- **6** agents · **3** personas · **3** connected lenses · **1** Digital Twin

---

## 10. Codebase Map (for engineering Q&A)

```
src/
├── app/
│   ├── page.tsx              Landing hero (3 persona cards, features, agentic loop)
│   ├── app/page.tsx          Workspace router (?persona= / ?view=manager|hr|career)
│   └── api/                  9 route handlers, all with deterministic fallback
│       ├── career-gps        Skill-gap analysis (OpenAI or fallback)
│       ├── chat              Scripted intents + live chat
│       ├── agent-reasoning   Streams multi-agent reasoning steps
│       ├── hr-insights       Org-level headline rollup
│       ├── commitment        Records mission → fires agent events
│       ├── intervention      Manager follow-ups
│       ├── retention-flag    Burnout / flight-risk detection
│       ├── cohort            Onboarding cohort data
│       └── reset             Demo reset
├── components/  25 components (SakhaApp, SakhaChat, CareerGps, MissionControl,
│                DigitalTwin, ManagerCopilot, HRCommandCenter, AgentDock,
│                AgentDraftPanel, AutonomyBadge, DreyfusBadge, WorkforceSimulator…)
├── data/        personas · agents · career-gps · manager · workforce ·
│                notifications · scripted · ask  (all mock data)
├── lib/         openai · career-gps · chat · hr-insights · accents ·
│                useHeartbeat · useOverlay (overlay store) · workforce-store
└── types/       sakha.ts  (Twin, Mission, Agent, HR interfaces)
```

---

*This document is a demo/presentation reference. Generated from the live codebase, June 2026.*

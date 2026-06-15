# 🌿 Sakha AI — Technical Architecture
### Data Flow, Storage, Agent Lifecycle & Scale Design

> **Team:** SAKHA AI | Rajesh Srinivasan | Employee ID: 51626927
> **Stack:** React + OpenAI Agents SDK + gpt-4o + PostgreSQL + Redis
> **Deadline:** 30th June 2026, 10:29 PM

---

## 📋 TABLE OF CONTENTS

1. [The Core Principle — Stateless Agents, Persistent Twin](#1-the-core-principle)
2. [How Agents Actually Run at Scale](#2-how-agents-actually-run-at-scale)
3. [The Three Storage Layers](#3-the-three-storage-layers)
4. [Conversation Storage — How It Works](#4-conversation-storage--how-it-works)
5. [Digital Twin Update Flow](#5-digital-twin-update-flow)
6. [Full Interaction — End to End](#6-full-interaction--end-to-end)
7. [Trigger Engine — How Sakha Acts Proactively](#7-trigger-engine--how-sakha-acts-proactively)
8. [Agent Instantiation Code](#8-agent-instantiation-code)
9. [Storage Technology Choices](#9-storage-technology-choices)
10. [Database Schema](#10-database-schema)
11. [Scale Reality Check](#11-scale-reality-check)
12. [Security & Data Boundaries](#12-security--data-boundaries)
13. [MVP Architecture vs Full Architecture](#13-mvp-vs-full-architecture)

> **Reviewer notes (applied to the build):** The MVP in this repo deliberately uses
> server-side **route handlers + `chat.completions` with a deterministic fallback** rather than
> the Assistants/Threads beta (which is on the deprecation path). The Employee Digital Twin is the
> system of record (local mock data in the MVP; PostgreSQL in production). See open governance
> items below: ZDR vs. persisted threads, PII minimisation before sending the Twin to OpenAI,
> manager RBAC scope, and append-only enforcement on the achievement log.

---

## 1. The Core Principle

### NOT This ❌ — One Agent Per Employee (Impossible)

```
Employee A → dedicated agent running 24/7
Employee B → dedicated agent running 24/7
Employee C → dedicated agent running 24/7
× 200,000 employees = 200,000 concurrent processes
```

**Why this fails:** Costs millions per day. No cloud infrastructure sustains 200,000 persistent
LLM processes. This is not how production AI systems work.

---

### THIS ✅ — Stateless Agents + Persistent Digital Twin

```
Employee sends message / event fires
            ↓
Sakha API receives request
            ↓
Load Employee Digital Twin from DB         (< 50ms)
            ↓
Load conversation history                   (< 100ms)
            ↓
Instantiate agent ON DEMAND with Twin + history as context
            ↓
Agent reasons, calls tools, responds        (2–8 seconds)
            ↓
Write updated facts back to Digital Twin
            ↓
Append events to Achievement Log
            ↓
Agent TERMINATES — no process kept alive
```

**The agent only exists for the duration of one interaction.** Between interactions, only the
**Digital Twin data** persists — not the agent.

---

### The Mental Model

```
Conversation log  =  The diary          Full verbatim message history.
Digital Twin      =  The summary card   Structured facts extracted from conversations.
Achievement Log   =  The CV             Immutable record of every significant event.
```

**Sakha reads all three at the start of every interaction. Sakha writes back to all three at the
end of every interaction.**

---

## 2. How Agents Actually Run at Scale

```
┌─────────────────────────────────────────────────────────────────┐
│                    SAKHA PLATFORM                               │
│                                                                 │
│  ┌─────────────┐    ┌──────────────────────────────────────┐   │
│  │   TRIGGER   │    │         AGENT POOL (serverless)      │   │
│  │   ENGINE    │───▶│                                      │   │
│  │             │    │  spin up → load Twin → reason →      │   │
│  │ • Cron jobs │    │  call tools → respond → write back   │   │
│  │ • Events    │    │  → terminate                         │   │
│  │ • Messages  │    │                                      │   │
│  └─────────────┘    └──────────────────────────────────────┘   │
│                                       │                         │
│  ┌────────────────────────────────────▼───────────────────┐    │
│  │               PERSISTENCE LAYER                        │    │
│  │   PostgreSQL          Redis              OpenAI         │    │
│  │   Digital Twins       Signals cache      Responses      │    │
│  │   Achievement Log     Session cache      Vector Store   │    │
│  │   Audit Trail         Wellbeing stream   File Search    │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │               ENTERPRISE SYSTEMS                       │    │
│  │   Workday / SAP    ServiceNow    Degreed    Staffing    │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. The Three Storage Layers

### Layer 1 — Conversation History

- **Who manages it:** Your code (canonical store in PostgreSQL), with OpenAI receiving only the
  context window needed per call.
- **What it stores:** Full verbatim message history — every message, every response.
- **How long it persists:** For the employee's tenure.
- **Key property:** One conversation record per employee, reused across the career.

```
Priya's conversation
─────────────────────────────────────────────────────────────
[2026-03-15] User:   "What should I bring on Day 1?"
[2026-03-15] Sakha:  "Just yourself and one ID proof..."
[2026-04-02] User:   "How do I become an AI Engineer?"
[2026-04-02] Sakha:  "Here's your 86-day path..."
[2026-05-20] User:   "How many leaves do I have?"
[2026-05-20] Sakha:  "8 casual, 4 sick, 3 optional remaining"
...                   (grows over the employee's career)
```

> **Note:** Coupling the canonical conversation to a vendor thread store conflicts with a
> zero-data-retention (ZDR) posture. Keep the system of record in your own DB; send only the
> Twin summary + last N turns to the model.

---

### Layer 2 — Employee Digital Twin (Structured Facts)

- **Who manages it:** Your code — extract and write after each interaction.
- **What it stores:** Structured JSON facts about the employee's current state.
- **How long it persists:** Permanently, updated in place.
- **Key property:** Always-current snapshot — agents load this for instant context.

```json
{
  "employee_id": "EMP-51626927",
  "name": "Priya Sharma",
  "role": "Java Developer",
  "band": 4,
  "lifecycle_stage": "project_onboarding",
  "skills": ["Java", "Spring Boot", "SQL", "React"],
  "career_goal": "AI Engineer",
  "readiness_days": 86,
  "missing_skills": ["Python", "Prompt Engineering", "Vector DBs", "Agent Design"],
  "skill_match_pct": 42,
  "active_courses": [
    { "name": "Python for Java Developers", "enrolled": "2026-04-02", "completion_pct": 34 }
  ],
  "current_project": "Project Helix",
  "leave_balance": { "casual": 8, "sick": 4, "optional": 3, "earned": 12 },
  "wellbeing": { "last_pulse_score": 4, "consecutive_late_logins": 2, "risk_level": "low" },
  "manager_id": "MGR-001",
  "last_interaction": "2026-06-15T10:23:00Z",
  "interaction_count": 23,
  "updated_at": "2026-06-15T10:23:45Z"
}
```

> **PII note:** Minimise before sending to the model — prefer `employee_id` + role + structured
> facts over names/free-text, or accept that PII leaves the boundary under a DPA. Don't claim
> "no PII to OpenAI" while injecting the full named Twin.

---

### Layer 3 — Achievement Log (Immutable Append)

- **Who manages it:** Your code — append only, never update.
- **What it stores:** Every significant event in the employee's career.
- **Key property:** Immutable audit trail that powers self-assessment auto-draft.

```json
[
  { "date": "2026-03-15", "type": "joined",          "desc": "Joined HCLTech",                    "agent": "onboarding" },
  { "date": "2026-04-02", "type": "career_gps_run",  "desc": "AI Engineer path created — 86 days", "agent": "career_gps" },
  { "date": "2026-04-02", "type": "course_enrolled", "desc": "Python for Java Devs",               "agent": "learning" },
  { "date": "2026-05-20", "type": "milestone",       "desc": "Led UAT phase — Project Helix",      "agent": "passive" },
  { "date": "2026-06-01", "type": "kudos",           "desc": "Client appreciation — FinCorp",      "agent": "passive" }
]
```

> **Enforce immutability** by revoking `UPDATE`/`DELETE` on the table role or via a trigger — a
> `CHECK (true)` constraint enforces nothing.

---

## 4. Conversation Storage — How It Works (reference flow)

```
1. Load Digital Twin from DB
2. Load recent conversation turns (last N)
3. Append the new user message
4. Run the agent with Twin + turns as context (Responses API)
5. Capture the response
6. Extract facts → update Digital Twin
7. Append events → Achievement Log
8. Return the response to the originating channel
```

---

## 5. Digital Twin Update Flow

After every interaction, extract structured facts and write them back:

```python
def update_digital_twin(employee_id, agent_response, twin):
    updates, events = {}, []

    if agent_response.career_goal_identified:
        updates["career_goal"]     = agent_response.career_goal
        updates["readiness_days"]  = agent_response.readiness_days
        updates["missing_skills"]  = agent_response.missing_skills
        updates["skill_match_pct"] = agent_response.match_pct
        events.append({"type": "career_gps_run",
                       "desc": f"{agent_response.career_goal} path created",
                       "agent": "career_gps"})

    if agent_response.course_enrolled:
        updates.setdefault("active_courses", []).append(
            {"name": agent_response.course_name, "enrolled": today(), "completion": 0})
        events.append({"type": "course_enrolled",
                       "desc": agent_response.course_name, "agent": "learning"})

    if agent_response.ticket_raised:
        events.append({"type": "ticket_raised",
                       "desc": f"{agent_response.ticket_id} — {agent_response.ticket_title}",
                       "agent": "onboarding"})

    updates["last_interaction"]  = now()
    updates["last_topic"]        = agent_response.topic
    updates["interaction_count"] = twin["interaction_count"] + 1

    if updates:
        db.update("employees", employee_id, updates)
    for event in events:
        db.insert("achievement_log", {"employee_id": employee_id, "timestamp": now(), **event})
```

### Wellbeing signals — passive update (no interaction required)

```python
def update_wellbeing_signals(employee_id):
    late = itsm.get_after_hours_logins(employee_id, days=14)
    pulse = survey_tool.get_latest_pulse(employee_id)
    lms = lms_api.get_recent_activity(employee_id, days=30)

    risk_score = calculate_risk(late, pulse, lms)
    risk_level = "high" if risk_score > 0.7 else "medium" if risk_score > 0.4 else "low"

    db.update("employees", employee_id, {"wellbeing": {
        "consecutive_late_logins": late, "last_pulse_score": pulse,
        "lms_activity_30d": lms, "risk_level": risk_level, "last_passive_update": now()}})

    # Consent-gated — only run if the employee opted into wellbeing monitoring.
    if risk_level in ["high", "medium"] and consent(employee_id, "wellbeing_monitoring"):
        trigger_wellbeing_agent(employee_id, risk_score)
```

---

## 6. Full Interaction — End to End

```
Priya: "How do I become an AI Engineer?"
   ↓ STEP 1  API receives POST /api/sakha/message
   ↓ STEP 2  Load Digital Twin (PostgreSQL, < 50ms)
   ↓ STEP 3  Append message to conversation history (< 100ms)
   ↓ STEP 4  Instantiate Career GPS agent with Twin injected
   ↓ STEP 5  Agent calls tools: get_skill_gap() → enroll_in_course() → block_calendar_slot() (3–8s)
   ↓ STEP 6  Agent responds: "Here's your 86-day path…"
   ↓ STEP 7  Update Digital Twin (career_goal, readiness_days, active_courses, …)
   ↓ STEP 8  Append to Achievement Log (career_gps_run, course_enrolled)
   ↓ STEP 9  Agent terminates — nothing kept alive. Total: 4–10s
```

---

## 7. Trigger Engine — How Sakha Acts Proactively

```python
TRIGGERS = [
    # Time-based (Cron)
    {"name": "monday_manager_copilot", "schedule": "0 9 * * MON",
     "agent": "manager_copilot", "target": "all_managers",
     "action": "send_weekly_team_health_report"},
    {"name": "30_day_checkin", "schedule": "check daily",
     "agent": "onboarding", "target": "employees where days_at_company = 30",
     "action": "send_milestone_checkin"},

    # Signal-based (Event)
    {"name": "burnout_detection", "schedule": "on wellbeing signal update",
     "agent": "wellbeing", "target": "employees where risk_level IN ['medium','high']",
     "action": "send_proactive_checkin"},
    {"name": "project_assigned", "schedule": "on HRMS project assignment event",
     "agent": "onboarding", "target": "employee assigned to new project",
     "action": "generate_project_brief"},
    {"name": "course_completed", "schedule": "on LMS completion webhook",
     "agent": "learning", "target": "employee who completed course",
     "action": "surface_next_learning + check_gig_match"},

    # Threshold-based (Monitoring)
    {"name": "leave_not_taken", "schedule": "check weekly",
     "agent": "hr", "target": "employees where leave_accrued > 30 days",
     "action": "nudge_to_plan_leave"},
    {"name": "bench_too_long", "schedule": "check daily",
     "agent": "career_gps", "target": "employees where bench_days > 14",
     "action": "surface_skill_gap + project_matches"},
]
```

---

## 8. Agent Instantiation (reference)

```python
def instantiate_sakha(employee_id, message):
    twin = db.get_employee_twin(employee_id)
    history = db.get_recent_turns(employee_id, limit=20)

    response = run_agent(
        system=build_system_prompt(twin),   # Twin injected as structured context
        history=history,
        message=message,
        tools=SAKHA_TOOLS,                   # 14 function definitions
        tool_choice="auto",
    )

    post_interaction_update(employee_id, twin, response)  # write Twin + Achievement Log
    return response.text
```

Tool calls are executed against enterprise APIs (ServiceNow, LMS, calendar, HRMS), then the
results are fed back to the model to compose the final reply. Use **streaming** for interactive
turns and **webhooks** for proactive triggers rather than a busy poll loop.

---

## 9. Storage Technology Choices

| Data | Technology | Why |
|---|---|---|
| **Employee Digital Twin** | PostgreSQL (primary) | Relational, queryable, ACID, reliable |
| **Achievement Log** | PostgreSQL (append-only) | Immutable audit trail, SQL-queryable for self-assessment |
| **Conversation history** | PostgreSQL (system of record) | Vendor-neutral; ZDR-compatible |
| **Wellbeing signals** | Redis | High-frequency passive updates, sub-10ms writes |
| **Session cache** | Redis (TTL 15 min) | Avoid reloading Twin on rapid back-to-back messages |
| **HR policy docs** | OpenAI Vector Store | File search over large document sets |
| **Enterprise data** | Read from source APIs | Workday, ServiceNow, Degreed — never duplicate |
| **Audit log** | PostgreSQL (separate schema) | Every autonomous action logged with reason |

---

## 10. Database Schema

```sql
-- ── EMPLOYEE DIGITAL TWIN ─────────────────────────────────────────────────
CREATE TABLE employees (
    id                   VARCHAR(50)  PRIMARY KEY,
    name                 VARCHAR(100) NOT NULL,
    email                VARCHAR(100) UNIQUE NOT NULL,
    role                 VARCHAR(100),
    band                 INTEGER,
    joining_date         DATE,
    lifecycle_stage      VARCHAR(50),
    manager_id           VARCHAR(50),
    current_project      VARCHAR(100),
    skills               JSONB        DEFAULT '[]',
    career_goal          VARCHAR(100),
    readiness_days       INTEGER,
    skill_match_pct      INTEGER,
    missing_skills       JSONB        DEFAULT '[]',
    active_courses       JSONB        DEFAULT '[]',
    certifications       JSONB        DEFAULT '[]',
    leave_balance        JSONB,
    wellbeing            JSONB,
    last_interaction     TIMESTAMP,
    last_topic           VARCHAR(100),
    interaction_count    INTEGER      DEFAULT 0,
    created_at           TIMESTAMP    DEFAULT NOW(),
    updated_at           TIMESTAMP    DEFAULT NOW()
);
CREATE INDEX idx_employees_manager ON employees(manager_id);
CREATE INDEX idx_employees_stage   ON employees(lifecycle_stage);

-- ── ACHIEVEMENT LOG (append-only) ─────────────────────────────────────────
CREATE TABLE achievement_log (
    id           SERIAL      PRIMARY KEY,
    employee_id  VARCHAR(50) NOT NULL REFERENCES employees(id),
    timestamp    TIMESTAMP   DEFAULT NOW(),
    type         VARCHAR(50) NOT NULL,
    description  TEXT        NOT NULL,
    agent        VARCHAR(50),
    metadata     JSONB       DEFAULT '{}'
);
-- Enforce immutability by revoking UPDATE/DELETE on the app role, or a trigger.
REVOKE UPDATE, DELETE ON achievement_log FROM sakha_app;

-- ── AUDIT TRAIL ───────────────────────────────────────────────────────────
CREATE TABLE sakha_audit_log (
    id              SERIAL       PRIMARY KEY,
    employee_id     VARCHAR(50)  NOT NULL,
    timestamp       TIMESTAMP    DEFAULT NOW(),
    agent           VARCHAR(50)  NOT NULL,
    action_type     VARCHAR(100) NOT NULL,
    action_detail   JSONB,
    trigger_reason  TEXT,
    employee_aware  BOOLEAN      DEFAULT TRUE
);

-- ── CONSENT & PREFERENCES ─────────────────────────────────────────────────
CREATE TABLE employee_consent (
    employee_id           VARCHAR(50) PRIMARY KEY REFERENCES employees(id),
    wellbeing_monitoring  BOOLEAN     DEFAULT FALSE,
    pulse_checkins        BOOLEAN     DEFAULT FALSE,
    career_nudges         BOOLEAN     DEFAULT TRUE,
    manager_alerts        BOOLEAN     DEFAULT FALSE,
    updated_at            TIMESTAMP   DEFAULT NOW()
);
```

---

## 11. Scale Reality Check

```
Scale assumptions:
  Total employees:           200,000
  Active daily users:        ~40% = 80,000
  Avg interactions/user/day: 3        →  240,000 interactions/day
  Avg agent runtime:         4 seconds

Peak concurrent agents:
  240,000 × 4s / 86,400s = ~11 at average load, ~50–80 at peak (9–11am)

Database load:
  240,000 Twin reads/day  = 2.8/s   ← trivial for Postgres
  240,000 Twin writes/day = 2.8/s   ← trivial
  720,000 log appends/day = 8.3/s   ← trivial

OpenAI cost (gpt-4o, ~2,000 tokens/interaction, blended):
  ~$2,000–3,000/day before optimisation.
  Optimisations: Redis Twin cache · gpt-4o-mini for simple HR queries ·
  batch proactive triggers · send Twin summary + last N turns, not whole history.
  Estimated real cost: $8,000–15,000/month at full scale.
```

---

## 12. Security & Data Boundaries

```
PRINCIPLE: Minimum data in, maximum intelligence out.

✅ Digital Twin + Achievement Log stored in HCLTech-managed PostgreSQL
✅ OpenAI calls use a zero-data-retention endpoint
✅ Minimise PII in prompts (prefer employee_id + structured facts)
✅ Conversation system-of-record stays in your DB (ZDR-compatible)

Role-based access (enforced at the API layer):
  Employee  → read/write OWN Twin only
  Manager   → manager-relevant team signals, gated by consent (named risk is in scope here)
  HR BP     → escalated cases only
  Admin     → audit log only, no write to Twin

Every autonomous action is logged to sakha_audit_log with a trigger_reason.
Wellbeing monitoring runs only if employee_consent.wellbeing_monitoring = TRUE.
```

---

## 13. MVP vs Full Architecture

### MVP (this repo / hackathon build)

```
Storage:
✅ Digital Twin (local mock data; PostgreSQL-ready schema)
✅ Conversation context per session
✅ In-memory / simple Achievement Log
❌ Redis (not needed at demo scale)

Agents / surfaces:
✅ Career GPS  — live OpenAI call + deterministic fallback
✅ Onboarding  — scripted golden flows + 1 live flow
✅ HR & Benefits — scripted responses + live query
✅ Manager Copilot — static, beautiful, actionable (Sakha drafts)
❌ Wellbeing / Learning agents — mocked signals

Integration:
✅ Mock functions returning realistic data
❌ Real Workday / ServiceNow connections (future)
```

### Full Production

```
Everything in MVP PLUS:
✅ Redis wellbeing stream + session cache
✅ Full audit trail with consent management
✅ Cron + webhook trigger engine
✅ Real HRMS / LMS / ITSM integrations
✅ Manager Copilot live aggregation
✅ Multi-agent handoff
✅ Vector store with full HR policy corpus
✅ Rate limiting + per-employee cost controls
```

---

## Quick Reference — The Mental Model

```
PRIYA SENDS A MESSAGE
   ↓ Load her Digital Twin (50ms) + recent turns (100ms)
   ↓ Spin up the right agent — fresh, stateless — Twin injected
   ↓ Agent reasons, calls tools, responds (4–8s)
   ↓ Conversation, Twin, and Achievement Log all written back
   ↓ Agent terminates — nothing kept alive
Tomorrow: load the same Twin → Priya feels continuity.
Agent is stateless. Memory is in the data. Not the agent.
```

---

*🌿 Sakha AI — From Offer Letter to Alumni Network, One Trusted Companion*
*HCLTech–OpenAI Agentic AI Hackathon | Track 2: Enterprise Operations | June 2026*
*Rajesh Srinivasan | Employee ID: 51626927 | Ecosystem.Marketing@hcltech.com*

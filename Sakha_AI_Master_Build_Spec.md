# 🌿 Sakha AI — Master Build Specification
### HCLTech–OpenAI Agentic AI Hackathon | Track 2: Enterprise Operations

> **Team:** SAKHA AI | Rajesh Srinivasan | Employee ID: 51626927  
> **Deadline:** 30th June 2026, 10:29 PM  
> **Stack:** Next.js + TypeScript + Tailwind CSS + shadcn/ui + OpenAI Agents SDK / Responses API  
> **Constraint:** 1 developer, part-time, ~10 days
> **MVP Agents:** Onboarding Agent + Career GPS Agent + HR & Benefits Agent (3-Agent MVP)  

---

## Codex Build Mapping

This section translates the master hackathon brief into Codex-ready execution instructions.

### Project Home

Use this directory as the project home:

```text
/Users/rajeshsrinivasan/GenAI/hack/sakhaai
```

Do not create a second project directory. Build inside this folder.

### Durable Codex Guidance

Create and maintain a project-level `AGENTS.md` in the project home. Codex reads `AGENTS.md` files before work begins and layers project-specific guidance into the active instruction chain. Use that file for repo conventions, commands, scope rules, verification steps, and design guardrails.

Recommended files:

```text
AGENTS.md                         Codex project instructions
Sakha_AI_Master_Build_Spec.md      Human + Codex master build spec
README.md                         Setup, demo flow, and submission notes
.env.example                      Required environment variables, no secrets
```

### Codex Operating Mode

Use Codex in small, verifiable implementation passes:

1. Scaffold the app and commit the baseline.
2. Build the design system and app shell.
3. Build mock data and persona state.
4. Build the Career GPS centrepiece.
5. Build the Sakha chat interface.
6. Build onboarding and HR/benefits scripted flows.
7. Build Manager Copilot as a polished static enterprise dashboard.
8. Add OpenAI integration behind a safe service layer.
9. Add fallback demo data so the live demo never blocks on API failure.
10. Run lint/build, inspect responsive UI, and rehearse the Priya demo path.

Each Codex task should end with:

- Files changed
- Commands run
- Verification result
- Remaining risks or TODOs

### Implementation Stack for Codex

Use:

- `Next.js`
- `TypeScript`
- `Tailwind CSS`
- `shadcn/ui`
- `lucide-react`
- `framer-motion`
- OpenAI API integration through a thin server-side service layer

Do not build this as a generic SaaS dashboard. It should feel like a rich enterprise hackathon prototype: warm, human, polished, and demo-safe.

### Suggested Repository Structure

```text
app/
  layout.tsx
  page.tsx
  api/
    career-gps/route.ts
components/
  app-shell.tsx
  career-gps.tsx
  sakha-chat.tsx
  manager-copilot.tsx
  proactive-notification.tsx
  persona-switcher.tsx
  ui/
data/
  personas.ts
  mock-career-paths.ts
  mock-policies.ts
  demo-script.ts
lib/
  openai.ts
  career-gps.ts
  demo-mode.ts
types/
  sakha.ts
public/
  diagrams/
  assets/
```

### Environment Variables

Use `.env.local` for local secrets and commit only `.env.example`.

```text
OPENAI_API_KEY=
OPENAI_MODEL=
NEXT_PUBLIC_DEMO_MODE=true
```

Default to demo-safe behavior when `OPENAI_API_KEY` is missing.

### OpenAI Integration Guidance

For the MVP, keep the OpenAI layer narrow:

- Career GPS uses a live OpenAI call when configured.
- The response must be requested as structured JSON.
- The UI must gracefully fall back to deterministic mock output.
- Chat flows can be scripted first, with one optional live response path.
- Do not integrate real HRMS, ITSM, LMS, payroll, or policy systems.

The live API call should support the winning scene:

> Priya asks: "How do I become an AI Engineer?"

The response should render:

- Current readiness score
- Skill gaps
- 86-day roadmap
- Learning path by month/week
- Internal role matches
- Recommended next action

### Demo Safety Rules

- No live demo step should require a successful network call.
- Add a visible demo mode indicator for the presenter, not the judge-facing story.
- Keep a single golden path for Priya.
- Keep Arjun and Rajan as short supporting vignettes.
- Manager Copilot should be polished and static unless time remains.
- Prefer a beautiful, reliable illusion over brittle real integrations.

### Verification Commands

Codex should run the available equivalents after implementation:

```bash
npm run lint
npm run build
```

If Playwright or browser testing is available, verify:

- Desktop homepage/demo path
- Mobile layout
- Career GPS form and generated roadmap
- Chat scripted flow
- Manager Copilot dashboard

### Codex Task Prompts

Use prompts like these:

```text
Read AGENTS.md and Sakha_AI_Master_Build_Spec.md. Scaffold the Next.js + TypeScript + Tailwind app in the current project home. Do not build features yet. Verify npm run build succeeds.
```

```text
Build the app shell, persona switcher, design tokens, and navigation for the Sakha AI demo. Keep the UI rich, warm, and enterprise-grade. Verify responsive layout.
```

```text
Build the Career GPS component for Priya's AI Engineer journey. Use mock data first, then add the OpenAI-backed API route with deterministic fallback.
```

```text
Implement the Sakha chat interface with scripted Priya, Arjun, and Rajan flows. Keep it demo-safe and visually polished.
```

```text
Run a final demo hardening pass: lint, build, browser check, responsive check, and list any remaining risks.
```

---

## 📋 TABLE OF CONTENTS

> **What's new in this version (v3):**
> - Employee Digital Twin (renamed from Memory Graph) — the moat
> - Explicit 3-Agent MVP scope (Onboarding + Career GPS + HR & Benefits)
> - 6-step seamless demo walkthrough (one Priya journey)
> - Business impact with assumption model (₹81cr + ₹186cr)
> - Visual assets: Architecture diagram + Infinite Employee Journey diagram
> - Judge scorecard: 8.2 → 9.2 with all fixes applied
> - Submission PDF structure (15 pages, cover → content → scorecard)
> - Winning version recommendation from reviewer

1. [Project Philosophy](#1-project-philosophy)
2. [MVP Decision — What to Build](#2-mvp-decision--what-to-build)
3. [10-Day Build Plan](#3-10-day-build-plan)
4. [Core Architecture](#4-core-architecture)
5. [Demo Script & Personas](#5-demo-script--personas)
6. [Feature Specs — BUILD](#6-feature-specs--build)
   - 6A. Career GPS (P0 — Centrepiece)
   - 6B. Sakha Chat Interface (P0 — Soul)
   - 6C. Manager Copilot Dashboard (P1 — Enterprise Story)
7. [Feature Specs — MOCK](#7-feature-specs--mock)
8. [React Component Specifications](#8-react-component-specifications)
   - 8A. App Shell & Layout
   - 8B. CareerGPS Component
   - 8C. SakhaChat Component
   - 8D. ManagerCopilot Component
   - 8E. ProactiveNotification Component
9. [OpenAI Integration](#9-openai-integration)
   - System Prompt
   - Function Definitions
   - API Call Patterns
10. [Data Models & Mock Data](#10-data-models--mock-data)
11. [Design System](#11-design-system)
12. [Mock API Endpoints](#12-mock-api-endpoints)
13. [Live Demo Survival Guide](#13-live-demo-survival-guide)
14. [Full Feature Backlog (Post-MVP)](#14-full-feature-backlog-post-mvp)
15. [Evaluation Criteria Alignment](#15-evaluation-criteria-alignment)
16. [Key Differentiators for Judges](#16-key-differentiators-for-judges)
17. [Visual Assets & Diagrams](#17-visual-assets--diagrams)
18. [PDF Submission Structure](#18-pdf-submission-structure)
19. [Judge Scorecard](#19-judge-scorecard)
20. [Reviewer's Winning Version Recommendation](#20-reviewers-winning-version-recommendation)

---

## 1. Project Philosophy

**Sakha** (सखा) — In Sanskrit, a trusted companion who walks beside you through every moment of your journey.

Sakha is **not a chatbot**. It is an **Employee Success Operating System** — a proactive, context-aware agentic AI that:

- **Predicts** friction before the employee feels it
- **Prevents** disengagement before it becomes attrition  
- **Resolves** problems autonomously across enterprise systems

### The Positioning

| What others will build | What Sakha is |
|---|---|
| HR chatbot that answers questions | Orchestrator that acts without being asked |
| Single-purpose assistant | 6-agent swarm across full lifecycle |
| Employee initiates every interaction | Sakha initiates proactively |
| Knowledge retrieval | Decision support + autonomous execution |
| System-centric | Employee-centric, lifelong companion |

### The One Scene That Wins

> Priya types: *"How do I become an AI Engineer?"*  
> Sakha responds in seconds with a **live, beautiful, personalised 86-day roadmap** — skill gap visualised, learning path mapped month by month, 3 open roles surfaced.  

**Build that scene perfectly. Everything else supports it.**

### The Moat — Employee Digital Twin

Every agent reads from and writes to a single **Employee Digital Twin** — a continuously updated living profile of each employee:

| Node | What Sakha Tracks |
|---|---|
| Skills & Certifications | Current skills, in-progress learning, completed certs, target skills |
| Projects & Deliveries | Project history, client context, milestones, contributions |
| Career Goals | Stated goal, target role, timeline, growth areas |
| Learning History | Courses taken, completion rates, preferences, time availability |
| Team & Manager | Reporting structure, team dynamics, communication style |
| Wellbeing Signals | Overtime patterns, leave usage, pulse scores, engagement trend |
| HR & Benefits | Leave balance, payroll, insurance, reimbursement history |
| Achievements Log | Milestones, kudos, certs, performance ratings |

Instead of: *"I know your leave balance."*  
Sakha says: *"You completed Azure certification 8 months ago, led Project Atlas, expressed interest in cloud architecture in your last check-in, and there's an internal opening at 82% match. Want me to flag your interest?"*

This is the **moat competitors cannot easily replicate** — because it requires presence across the entire lifecycle, not just one touchpoint.

---

## 2. MVP Decision — What to Build

Given the constraint (1 developer, part-time, 10 days, possible live demo):

### ✅ BUILD — The Three Pillars (3-Agent MVP)

> **Explicit MVP scope:** Onboarding Agent + Career GPS Agent + HR & Benefits Agent.  
> Everything else (Wellbeing, Manager Copilot, Learning Agent) is Phase 2/3 roadmap.  
> Judges need to see ONE clear answer to "what is the actual MVP?" — this is it.

| Priority | Feature | Agent | Rationale |
|---|---|---|---|
| 🔴 **P0** | **Career GPS** | Career GPS Agent | The visual wow. Live OpenAI API call. The killer demo moment. |
| 🔴 **P0** | **Sakha Chat Interface** | Onboarding + HR Agent | Soul of the product. 3 scripted proactive flows + 1 live conversational flow. |
| 🟡 **P1** | **Manager Copilot Dashboard** | Manager Copilot (Phase 2) | Enterprise value story. Static dashboard — hardcoded data, pixel-perfect UI. |

### 🎭 MOCK — Show in video, script the flows

| Feature | What to show | How |
|---|---|---|
| IT ticket raising (Arjun) | Sakha raises ticket, shows confirmation | Scripted chat message + mock ticket ID |
| Cert reimbursement (Priya) | Pre-filled form appears | Static modal component |
| Burnout signal catch (Rajan) | Sakha sends proactive message | Hardcoded notification trigger |
| Internal gig surfaced | Opportunity card appears | Static card component |
| Self-assessment draft | Show output document | Static text block |
| HR policy query | Instant answer | Scripted response OR live vector search |

### ❌ DO NOT BUILD (this submission)

- Exit & alumni module
- Full LMS integration
- Real HRMS/ITSM API connections
- Background verification flow
- Voice interface

---

## 3. 10-Day Build Plan

```
DAY 1-2  │ FOUNDATION
         │ ├── React app scaffolding (Vite + Tailwind)
         │ ├── Design system tokens applied
         │ ├── App shell: sidebar nav, persona switcher, layout
         │ └── OpenAI API connected, basic fetch working
         │
DAY 3-4  │ CAREER GPS — CORE
         │ ├── CareerGPS component built
         │ ├── Skill input form (current role, goal, skills)
         │ ├── OpenAI API call → structured skill gap response
         │ ├── Gap visualisation: progress bars, skill cards
         │ └── Learning path timeline rendered
         │
DAY 5    │ CAREER GPS — POLISH
         │ ├── Animated progress bars on load
         │ ├── Readiness countdown (86-day projection)
         │ ├── Open roles card ("3 AI Engineer roles at HCLTech")
         │ └── Mobile responsive check
         │
DAY 6    │ SAKHA CHAT INTERFACE
         │ ├── Chat UI component
         │ ├── Sakha avatar + typing indicator
         │ ├── 3 proactive notification flows scripted:
         │ │     → Priya: Day -15 welcome
         │ │     → Arjun: VPN ticket raised
         │ │     → Rajan: burnout signal caught
         │ └── Quick reply buttons working
         │
DAY 7    │ MANAGER COPILOT DASHBOARD
         │ ├── Dashboard layout with grid
         │ ├── Team health score + sparkline
         │ ├── Attrition risk cards (2 flagged)
         │ ├── Onboarding tracker (Arjun Day 8)
         │ └── Certification completions this month
         │
DAY 8    │ END-TO-END DEMO REHEARSAL
         │ ├── Full Priya journey flow — no breaks
         │ ├── Arjun vignette — smooth
         │ ├── Rajan vignette — smooth
         │ ├── Manager Copilot walkthrough
         │ └── Career GPS live demo × 3 practice runs
         │
DAY 9    │ VIDEO RECORDING
         │ ├── Screen record full 5-min demo
         │ ├── Voiceover narration
         │ ├── Edit: add titles, transitions
         │ └── Upload to SharePoint
         │
DAY 10   │ BUFFER + SUBMISSION
         │ ├── Fix anything broken from Day 9
         │ ├── Final form submission
         │ └── Submission confirmation
```

---

## 4. Core Architecture

### Agent Swarm Design

```
                    🌿 SAKHA
               (Orchestrator Agent)
                        │
         ┌──────────────┼──────────────┐
         ▼              ▼              ▼
   Onboarding      Career GPS      Learning
     Agent           Agent           Agent
         │              │              │
         ▼              ▼              ▼
   HR & Benefits    Wellbeing     Manager
      Agent           Agent       Copilot
                                   Agent
```

### Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React + Vite + Tailwind CSS | UI — chat, dashboards, Career GPS |
| AI Orchestrator | OpenAI Agents SDK | Multi-agent coordination |
| LLM | gpt-4o via Responses API | Reasoning, conversation, skill analysis |
| Skill matching | OpenAI embeddings | Career GPS gap analysis |
| Policy search | OpenAI file search + vector store | HR Q&A |
| Code automation | OpenAI Codex | Form pre-fill, API call generation |
| Memory | OpenAI thread persistence | Cross-session employee context |
| Mock backend | JSON files / hardcoded data | Employee, manager, project data |

---

## 5. Demo Script & Personas

### Three Personas

| Persona | Name | Situation | Features shown |
|---|---|---|---|
| 🟢 New Joiner | **Arjun** | Fresh grad, Day 1, VPN fails | Proactive IT ticket vignette |
| 🔵 Lateral Hire | **Priya** | 3 months in, project assigned, wants growth | Career GPS (primary), full journey |
| 🟠 Tenured Employee | **Rajan** | 4 years, stagnant, overworking | Burnout catch, Manager Copilot |

### Demo Flow — 5 Minutes (One Seamless Journey)

> **Key principle:** One employee story — not six disconnected agent demos.  
> Follow Priya through a single seamless journey. Judges remember stories, not feature lists.

```
00:00–00:20  HOOK
             Show 12 enterprise apps on screen simultaneously.
             Voiceover: "Every employee navigates this every day.
             No single thread. No single companion. Until now."

00:20–00:40  INTRODUCE SAKHA
             Sakha logo. Purple leaf. Sanskrit सखा.
             "Meet Sakha — your Employee Digital Twin-powered companion.
             One AI. Every employee. Every moment of their career."

00:40–01:00  STEP 1 — Priya joins HCLTech (Onboarding Agent)
             Sakha: "Welcome Priya! Here's your pre-join checklist.
             I've requested your laptop and email ID.
             Sneha will meet you at reception at 9:30am on Day 1."
             → Digital Twin created. Relationship begins.

01:00–01:20  STEP 2 — Day 1: Laptop not delivered (Onboarding Agent)
             Sakha detects issue via ITSM signal.
             Sakha autonomously raises ServiceNow #INC-2948.
             "Resolution in ~2hrs. Here's mobile email access
             so Day 1 doesn't stop. I'll notify you when it's resolved."
             → LIVE function call fires. Ticket appears.

01:20–01:45  STEP 3 — Project Helix assigned (Onboarding Agent)
             Sakha generates project brief in 60 seconds:
             client context, team map, tool access list.
             Access requests raised automatically.
             "Everything you need to walk into your first meeting
             confident. Want me to introduce you to the team on Teams?"

01:45–02:30  STEP 4 — Career GPS WOW MOMENT (Career GPS Agent)
             Priya: "How do I become an AI Engineer?"
             LIVE OpenAI API call fires against Digital Twin.
             Visual renders with animation:
               • Current match: 42%
               • 4 skill gaps mapped to months
               • 86-day readiness countdown
               • 3 open AI Engineer roles at HCLTech
             "I've also enrolled you in Python for Java Developers
             and blocked 2hrs every Tuesday on your calendar."
             → Judges lean forward HERE.

02:30–02:50  STEP 5 — HR query (HR & Benefits Agent)
             Priya: "How many leaves do I have left?"
             Sakha: "8 casual, 4 sick, 3 optional remaining for 2026.
             Want to check the festive calendar or plan time off?"
             → Zero ticket. Instant answer. Live or scripted.

02:50–03:20  STEP 6 — Day 30: Manager view (Manager Copilot)
             Switch to Vikram's dashboard.
             Team Health: 84% ↓
             "Priya — on track, Day 30 ✅"
             "Rajan — engagement down 27%, suggested: 1:1 this week"
             "4 certifications completed this month 🎉"
             → Enterprise story lands here.

03:20–03:50  ARCHITECTURE SLIDE
             Employee Digital Twin at centre.
             3-Agent MVP highlighted. Phase 2/3 roadmap shown.
             OpenAI stack: Agents SDK, Responses API, Function Calling.

03:50–04:20  IMPACT METRICS
             -30% onboarding time | -40% HR tickets | +25% learning
             Benchmark basis: Gartner + McKinsey + modelled assumptions.

04:20–05:00  CLOSE
             "Sakha. From Offer Letter to Alumni Network.
             One Trusted Companion. Every Step. Every Day."
```

---

## 6. Feature Specs — BUILD

---

### 6A. Career GPS *(P0 — The Centrepiece)*

**What it does:**  
Employee states their current role + career goal. Sakha makes a live OpenAI API call, analyses the skill gap, and renders a beautiful visual roadmap.

**User flow:**
```
1. Employee opens Career GPS panel
2. Sees pre-filled current role and skills from profile
3. Types or selects career goal ("AI Engineer")
4. Clicks "Map My Path"
5. Loading state: "Analysing your profile..." (1–3 seconds)
6. Results render with animation:
   - Match score with animated ring (42%)
   - Skill gap cards (4 missing skills, prioritised)
   - Month-by-month learning timeline
   - Readiness countdown (86 days)
   - Open roles panel ("3 roles at HCLTech match this goal")
7. Each skill card has "Enrol now" button (mock action)
8. "Add to my plan" saves path (local state)
```

**OpenAI API call:**
```javascript
// Prompt sent to gpt-4o
const prompt = `
You are Sakha's Career GPS engine.

Employee profile:
- Name: ${employee.name}
- Current role: ${employee.role}
- Current skills: ${employee.skills.join(', ')}
- Years experience: ${employee.yearsExp}
- Career goal: ${goalInput}

Analyse the skill gap and return ONLY valid JSON:
{
  "matchPercentage": number (0-100),
  "missingSkills": [
    {
      "skill": string,
      "priority": number (1=highest),
      "monthToAcquire": number,
      "recommendedCourse": string,
      "estimatedHours": number
    }
  ],
  "readinessDays": number,
  "learningPath": [
    {
      "month": number,
      "skill": string,
      "milestone": string
    }
  ],
  "openRoles": number,
  "sakhaMessage": string (one warm sentence summarising the plan)
}
`;
```

**Visual output spec:**

```
┌──────────────────────────────────────────────────────┐
│  🌿 Career GPS                              Priya S   │
├──────────────────────────────────────────────────────┤
│                                                       │
│   Java Developer  ──────────────────►  AI Engineer   │
│                                                       │
│          ╔═══════════╗                                │
│          ║    42%    ║   Current match                │
│          ║  ███░░░░  ║   You're closer than           │
│          ╚═══════════╝   you think.                   │
│                                                       │
├──────────────────────────────────────────────────────┤
│  SKILL GAPS — prioritised                             │
│                                                       │
│  1  Python                Month 1   ████░░░░  [Enrol] │
│  2  Prompt Engineering    Month 2   ███░░░░░  [Enrol] │
│  3  Vector Databases      Month 3   ██░░░░░░  [Enrol] │
│  4  Agent Design          Month 4   █░░░░░░░  [Enrol] │
│                                                       │
├──────────────────────────────────────────────────────┤
│  YOUR 86-DAY JOURNEY                                  │
│                                                       │
│  Month 1 ──── Month 2 ──── Month 3 ──── Month 4      │
│  Python       Prompts      Vectors       Agents       │
│  ✓ Done       ⏳ Next       ○ Planned    ○ Planned    │
│                                                       │
├──────────────────────────────────────────────────────┤
│  🎯  3 AI Engineer roles open at HCLTech right now   │
│      [View Opportunities]                             │
└──────────────────────────────────────────────────────┘
```

---

### 6B. Sakha Chat Interface *(P0 — The Soul)*

**What it does:**  
Primary conversational interface. Sakha speaks first (proactive). Employee can also ask anything.

**Three scripted proactive flows (trigger on persona switch or timer):**

**Flow 1 — Priya Day -15 (Pre-joining)**
```
[Notification card slides in]

🌿 Sakha  •  Day -15

"Welcome to HCLTech, Priya! I'm Sakha — your personal 
companion for everything from today through your entire 
career here.

Your joining date is June 30. Here's what happens next:"

[Checklist card]
✅ Offer letter signed
✅ Documents submitted  
⏳ Laptop requested — arrives Day 1
⏳ Email ID: priya.sharma@hcltech.com (active Day 1)
⏳ Buddy assigned: Sneha K

"Any questions before Day 1? Just ask me anytime."

[Quick replies]  [What to bring?]  [Office location?]  [Benefits?]
```

**Flow 2 — Arjun Day 1 (VPN failure)**
```
[Notification card — urgent]

🌿 Sakha  •  9:47am, Day 1

"Hey Arjun — I noticed your VPN setup hasn't completed. 
Don't worry, this happens often on Day 1.

I've already raised IT ticket #INC-2948 with high priority.
Average resolution: 2 hours.

Meanwhile, here's how to access your email on mobile 
so your first day doesn't stop ▾"

[Action card]
📱 Mobile email setup guide  →
📋 Your Day 1 checklist (VPN-free tasks)  →

"I'll notify you the moment it's resolved."
```

**Flow 3 — Rajan Burnout Signal**
```
[Notification card — gentle]

🌿 Sakha  •  10:23pm, Wednesday

"Hey Rajan — I've noticed you've been working late 
most evenings this week.

How are you holding up? No pressure to respond, 
but I'm here if you need anything.

I've also quietly flagged your workload to Vikram 
for a check-in — he'll reach out tomorrow."

[Quick replies]  [I'm fine, thanks]  [Could use a chat]  [Leave info]
```

**One live conversational flow:**
- Employee can type any HR question
- Sakha responds via live OpenAI API call
- Suggested: leave balance query ("How many leaves do I have?")
- Answer pulled from mock employee data + formatted warmly

**Chat UI specs:**
```
- Sakha messages: left-aligned, light purple bg (#F3E8FF), 🌿 avatar
- Employee messages: right-aligned, purple bg (#6B21A8), white text
- Typing indicator: 3 animated dots, appears for 1.5s before response
- Quick reply buttons: pill-shaped, purple outline, below Sakha messages
- Proactive notification: slide-in card from top-right, dismissable
- Timestamp: small grey text below each message
- Scroll to bottom on new message
```

---

### 6C. Manager Copilot Dashboard *(P1 — Enterprise Story)*

**What it does:**  
Manager-facing weekly intelligence report. Hardcoded data, beautiful layout, tells the enterprise value story at a glance.

**Data to show (all hardcoded):**

```javascript
const managerData = {
  manager: "Vikram Nair",
  weekEnding: "June 20, 2026",
  teamHealthScore: 84,
  teamHealthTrend: [89, 91, 88, 86, 84], // sparkline data
  teamSize: 8,
  
  attritionRisks: [
    {
      name: "Rajan S",
      riskLevel: "medium",
      signal: "Engagement down 27% over 60 days",
      suggestedAction: "Schedule 1:1 check-in this week",
      daysAtRisk: 14
    },
    {
      name: "Meera K", 
      riskLevel: "low",
      signal: "3 consecutive pulse check-in skips",
      suggestedAction: "Informal coffee chat",
      daysAtRisk: 7
    }
  ],
  
  onboarding: [
    {
      name: "Arjun P",
      day: 8,
      status: "on_track",
      lastIssue: "VPN — resolved",
      nextMilestone: "Day 30 check-in"
    }
  ],
  
  certifications: [
    { name: "Priya S", cert: "AWS Solutions Architect", date: "June 15" },
    { name: "Dev R", cert: "PMP", date: "June 12" },
    { name: "Anita M", cert: "Kubernetes CKA", date: "June 10" },
    { name: "Kiran B", cert: "Scrum Master", date: "June 8" }
  ],
  
  opportunities: [
    { 
      description: "2 team members eligible for GenAI gig in Innovation Lab",
      action: "Notify them via Sakha?"
    }
  ]
}
```

**Dashboard layout:**
```
┌─────────────────┬──────────────────────────────────┐
│  Team Health    │  ⚠️  Needs Attention              │
│                 │                                   │
│     84%  ↓     │  Rajan S — engagement -27%        │
│  ████████░░    │  [Schedule 1:1]                   │
│  ▁▂▃▂▁  trend │                                   │
│                 │  Meera K — pulse skips            │
│  8 employees    │  [Coffee chat]                    │
├─────────────────┼──────────────────────────────────┤
│  🎓 Onboarding  │  🏆 Certifications this month     │
│                 │                                   │
│  Arjun P        │  ✅ Priya S — AWS Arch            │
│  Day 8 ✅       │  ✅ Dev R — PMP                   │
│  On track       │  ✅ Anita M — CKA                 │
│                 │  ✅ Kiran B — Scrum               │
├─────────────────┴──────────────────────────────────┤
│  💡 Sakha suggests                                  │
│  2 team members eligible for GenAI Innovation gig   │
│  [Notify them]                                      │
└────────────────────────────────────────────────────┘
```

---

## 7. Feature Specs — MOCK

These features appear in the demo but are scripted/simulated, not live.

### IT Ticket Raising
```
Trigger: Arjun types "My VPN isn't connecting"
Response: Scripted Sakha message (not live API)
Mock ticket: #INC-2948, shows status "Raised — In Progress"
Visual: Small ticket status card in chat
```

### Cert Reimbursement Flow
```
Trigger: Priya types "How do I get my AWS cert reimbursed?"
Response: Scripted explanation + pre-filled form modal
Mock form: Employee name, cert name, amount (₹12,500), pre-filled
CTA: "Confirm & Submit" button (shows success toast on click)
```

### Internal Gig Alert
```
Trigger: After Career GPS renders
Sakha proactively: notification card slides in
"Priya, a GenAI gig just opened in Innovation Lab — 87% match. 
Stretch assignment, no manager approval needed."
[View Opportunity] button → static job card modal
```

### Burnout Alert to Manager
```
Handled in Manager Copilot dashboard as static data
Rajan's risk card shows the signal + suggested action
```

---

## 8. React Component Specifications

### 8A. App Shell & Layout

```jsx
// App.jsx — top level structure
<AppShell>
  <Sidebar>
    <Logo />                    // 🌿 Sakha AI
    <PersonaSwitcher />         // Priya | Arjun | Rajan | Vikram (manager)
    <NavItems>
      <NavItem icon="chat">    Chat with Sakha</NavItem>
      <NavItem icon="gps">     Career GPS</NavItem>
      <NavItem icon="team">    Manager Copilot</NavItem>
      <NavItem icon="journey"> My Journey</NavItem>
    </NavItems>
  </Sidebar>
  
  <MainContent>
    <TopBar>
      <EmployeeChip />          // Avatar + name + lifecycle stage badge
      <NotificationBell />      // Proactive alerts count
    </TopBar>
    
    <Routes>
      /chat          → <SakhaChat />
      /career-gps    → <CareerGPS />
      /manager       → <ManagerCopilot />
      /journey       → <JourneyTimeline />
    </Routes>
  </MainContent>
  
  <ProactiveNotification />     // Floating, dismissable, auto-triggers
</AppShell>
```

**Persona switcher behaviour:**
```javascript
const personas = {
  priya: {
    name: "Priya Sharma",
    role: "Java Developer",
    stage: "Month 3",
    stageColor: "blue",
    // triggers: Day -15 welcome on load
  },
  arjun: {
    name: "Arjun Mehta", 
    role: "Associate Engineer",
    stage: "Day 8",
    stageColor: "green",
    // triggers: VPN failure notification after 2s
  },
  rajan: {
    name: "Rajan Krishnan",
    role: "Senior Engineer",
    stage: "Year 4",
    stageColor: "orange",
    // triggers: burnout notification after 2s
  },
  vikram: {
    name: "Vikram Nair",
    role: "Delivery Manager",
    stage: "Manager View",
    stageColor: "purple",
    // auto-navigates to Manager Copilot
  }
}
```

---

### 8B. CareerGPS Component

```jsx
// CareerGPS.jsx

// STATES: idle → input → loading → results

// IDLE STATE
<CareerGPSPanel>
  <Header>
    <Icon>🗺️</Icon>
    <Title>Career GPS</Title>
    <Subtitle>Map your path to your next role</Subtitle>
  </Header>
  
  <CurrentProfile>
    <Label>Your current role</Label>
    <RoleChip>{employee.role}</RoleChip>
    
    <Label>Your skills</Label>
    <SkillTags skills={employee.skills} />
  </CurrentProfile>
  
  <GoalInput>
    <Label>Where do you want to go?</Label>
    <Input 
      placeholder="e.g. AI Engineer, Cloud Architect, Product Manager..."
      value={goalInput}
      onChange={setGoalInput}
    />
    <SuggestedGoals>
      {["AI Engineer", "Cloud Architect", "Tech Lead", "Scrum Master"].map(
        goal => <GoalPill onClick={() => setGoalInput(goal)}>{goal}</GoalPill>
      )}
    </SuggestedGoals>
  </GoalInput>
  
  <CTAButton onClick={analyseGap} disabled={!goalInput}>
    Map My Path →
  </CTAButton>
</CareerGPSPanel>

// LOADING STATE
<LoadingState>
  <PulsingLeaf />  // animated 🌿
  <LoadingText>Analysing your profile...</LoadingText>
  <LoadingSubtext>Comparing against 200+ role definitions</LoadingSubtext>
</LoadingState>

// RESULTS STATE
<ResultsPanel>
  
  {/* HEADER */}
  <JourneyHeader>
    <RoleNode current>{employee.role}</RoleNode>
    <Arrow />
    <RoleNode target>{goalInput}</RoleNode>
  </JourneyHeader>
  
  {/* MATCH SCORE — animated ring */}
  <MatchScore>
    <AnimatedRing 
      percentage={results.matchPercentage} 
      color="#6B21A8"
      animationDuration={1500}
    />
    <MatchLabel>{results.matchPercentage}% match</MatchLabel>
    <MatchSubtext>{results.sakhaMessage}</MatchSubtext>
  </MatchScore>
  
  {/* SKILL GAPS */}
  <SkillGapsSection>
    <SectionTitle>Skills to build — prioritised</SectionTitle>
    {results.missingSkills.map((skill, i) => (
      <SkillGapCard key={i}>
        <PriorityBadge>{i + 1}</PriorityBadge>
        <SkillName>{skill.skill}</SkillName>
        <MonthTag>Month {skill.monthToAcquire}</MonthTag>
        <ProgressBar value={0} max={100} />  // starts empty, fills to partial
        <CourseTag>{skill.recommendedCourse}</CourseTag>
        <EnrolButton onClick={() => mockEnrol(skill)}>Enrol →</EnrolButton>
      </SkillGapCard>
    ))}
  </SkillGapsSection>
  
  {/* LEARNING TIMELINE */}
  <TimelineSection>
    <SectionTitle>Your {results.readinessDays}-day journey</SectionTitle>
    <Timeline>
      {results.learningPath.map((month, i) => (
        <TimelineNode 
          key={i}
          status={i === 0 ? 'active' : 'planned'}
        >
          <MonthLabel>Month {month.month}</MonthLabel>
          <SkillLabel>{month.skill}</SkillLabel>
          <MilestoneLabel>{month.milestone}</MilestoneLabel>
        </TimelineNode>
      ))}
      <TimelineNode status="goal">
        <MonthLabel>Day {results.readinessDays}</MonthLabel>
        <SkillLabel>🎯 {goalInput}</SkillLabel>
        <MilestoneLabel>Readiness achieved</MilestoneLabel>
      </TimelineNode>
    </Timeline>
  </TimelineSection>
  
  {/* OPEN ROLES */}
  <OpenRolesCard>
    <RolesIcon>🎯</RolesIcon>
    <RolesText>
      {results.openRoles} {goalInput} roles open at HCLTech right now
    </RolesText>
    <ViewRolesButton>View Opportunities →</ViewRolesButton>
  </OpenRolesCard>
  
  {/* ADD TO PLAN */}
  <AddToPlanButton onClick={savePlan}>
    Add this path to My Journey
  </AddToPlanButton>
  
</ResultsPanel>
```

---

### 8C. SakhaChat Component

```jsx
// SakhaChat.jsx

<ChatContainer>
  
  <ChatHeader>
    <SakhaAvatar>🌿</SakhaAvatar>
    <HeaderInfo>
      <Name>Sakha</Name>
      <Status>● Active — monitoring your journey</Status>
    </HeaderInfo>
  </ChatHeader>
  
  <MessageList ref={scrollRef}>
    {messages.map(msg => (
      <Message key={msg.id} role={msg.role}>
        {msg.role === 'sakha' && <SakhaAvatar small>🌿</SakhaAvatar>}
        <MessageBubble role={msg.role}>
          <MessageText>{msg.text}</MessageText>
          {msg.card && <ActionCard data={msg.card} />}
          {msg.quickReplies && (
            <QuickReplies>
              {msg.quickReplies.map(r => (
                <QuickReply onClick={() => sendMessage(r)}>{r}</QuickReply>
              ))}
            </QuickReplies>
          )}
          <Timestamp>{msg.time}</Timestamp>
        </MessageBubble>
      </Message>
    ))}
    {isTyping && <TypingIndicator />}
  </MessageList>
  
  <InputBar>
    <TextInput
      value={input}
      onChange={setInput}
      onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
      placeholder="Ask Sakha anything..."
    />
    <SendButton onClick={() => sendMessage(input)}>→</SendButton>
  </InputBar>
  
</ChatContainer>

// Message send logic
async function sendMessage(text) {
  addMessage({ role: 'user', text })
  setIsTyping(true)
  
  // Check if scripted response exists
  const scripted = scriptedResponses[text.toLowerCase()]
  if (scripted) {
    await delay(1500)
    addMessage({ role: 'sakha', ...scripted })
  } else {
    // Live OpenAI API call
    const response = await callSakhaAPI(text, employee, conversationHistory)
    addMessage({ role: 'sakha', text: response })
  }
  
  setIsTyping(false)
}
```

---

### 8D. ManagerCopilot Component

```jsx
// ManagerCopilot.jsx — static beautiful dashboard

<DashboardGrid>
  
  <Row>
    {/* Team Health Score */}
    <Card size="small">
      <CardTitle>Team Health</CardTitle>
      <HealthScore score={84} trend="down" />
      <Sparkline data={[89, 91, 88, 86, 84]} color="#6B21A8" />
      <TeamSize>{managerData.teamSize} employees</TeamSize>
    </Card>
    
    {/* Needs Attention */}
    <Card size="large">
      <CardTitle>⚠️ Needs Attention</CardTitle>
      {managerData.attritionRisks.map(risk => (
        <RiskCard key={risk.name} level={risk.riskLevel}>
          <EmployeeName>{risk.name}</EmployeeName>
          <RiskSignal>{risk.signal}</RiskSignal>
          <DaysAtRisk>{risk.daysAtRisk} days flagged</DaysAtRisk>
          <ActionButton>{risk.suggestedAction}</ActionButton>
        </RiskCard>
      ))}
    </Card>
  </Row>
  
  <Row>
    {/* Onboarding */}
    <Card>
      <CardTitle>🎓 Active Onboarding</CardTitle>
      {managerData.onboarding.map(emp => (
        <OnboardingTracker key={emp.name}>
          <Name>{emp.name}</Name>
          <DayBadge>Day {emp.day}</DayBadge>
          <StatusChip status={emp.status}>On Track</StatusChip>
          <LastIssue>Last: {emp.lastIssue}</LastIssue>
          <NextMilestone>Next: {emp.nextMilestone}</NextMilestone>
          <ProgressBar value={emp.day} max={90} />
        </OnboardingTracker>
      ))}
    </Card>
    
    {/* Certifications */}
    <Card>
      <CardTitle>🏆 Certifications this month</CardTitle>
      <CertCount>{managerData.certifications.length}</CertCount>
      {managerData.certifications.map(cert => (
        <CertRow key={cert.name}>
          <CheckIcon>✅</CheckIcon>
          <EmployeeName>{cert.name}</EmployeeName>
          <CertName>{cert.cert}</CertName>
          <CertDate>{cert.date}</CertDate>
        </CertRow>
      ))}
    </Card>
  </Row>
  
  {/* Sakha Suggests */}
  <Row>
    <Card full>
      <CardTitle>💡 Sakha suggests</CardTitle>
      {managerData.opportunities.map(opp => (
        <OpportunityCard key={opp.description}>
          <OppText>{opp.description}</OppText>
          <OppAction>{opp.action}</OppAction>
          <ActionButton primary>Notify them via Sakha</ActionButton>
        </OpportunityCard>
      ))}
    </Card>
  </Row>

</DashboardGrid>
```

---

### 8E. ProactiveNotification Component

```jsx
// ProactiveNotification.jsx — slides in from top-right

// Triggers per persona switch:
useEffect(() => {
  if (persona === 'arjun') {
    setTimeout(() => showNotification(arjunVPNNotification), 2000)
  }
  if (persona === 'rajan') {
    setTimeout(() => showNotification(rajanBurnoutNotification), 2000)
  }
  if (persona === 'priya') {
    setTimeout(() => showNotification(priyaWelcomeNotification), 1000)
  }
}, [persona])

<NotificationToast 
  visible={notification.visible}
  onDismiss={dismissNotification}
>
  <ToastHeader>
    <SakhaAvatar>🌿</SakhaAvatar>
    <ToastTitle>Sakha</ToastTitle>
    <ToastTime>{notification.time}</ToastTime>
    <DismissX onClick={dismissNotification}>×</DismissX>
  </ToastHeader>
  <ToastBody>{notification.message}</ToastBody>
  {notification.actions && (
    <ToastActions>
      {notification.actions.map(a => (
        <ToastAction onClick={a.onClick}>{a.label}</ToastAction>
      ))}
    </ToastActions>
  )}
</NotificationToast>
```

---

## 9. OpenAI Integration

### System Prompt (Full)

```
You are Sakha (सखा), an Employee Success AI Companion at HCLTech.

Your name comes from the Sanskrit word for "trusted companion" — someone 
who walks beside you through every moment of your journey. Not behind you. 
Not above you. Beside you.

YOUR ROLE:
You are the orchestrator of a swarm of specialist agents. You decide which 
agent or tool to invoke based on the employee's context, lifecycle stage, 
and detected signals. You act autonomously where possible.

YOUR PERSONALITY:
- Warm and human — speak like a trusted colleague, never a corporate system
- Proactive — surface needs before they become problems
- Contextual — you know this employee's role, project, history, goals
- Action-oriented — don't just advise, act. Raise tickets, enrol, submit.
- Discreet — handle wellbeing and sensitive matters with care

EMPLOYEE DIGITAL TWIN (injected per session):
{employeeDigitalTwinJSON}

The Digital Twin contains the employee's complete career context:
skills, projects, certifications, career goals, learning history,
achievements log, wellbeing signals, leave balance, and manager context.
Always reason from this Twin — never ask the employee for information
that already exists in their Twin.

YOUR BEHAVIOUR RULES:
1. Always use the employee's first name
2. Keep messages short — max 4 sentences unless showing structured data
3. Use bullet points for lists, plain language for everything else
4. When you can take an action, offer to — don't wait to be asked
5. Never say "I cannot" — always offer an alternative or escalation
6. If uncertain, ask one clarifying question (never more than one)

LIFECYCLE STAGES YOU OWN:
1. Pre-joining (Offer accepted → Day 0)
2. Onboarding (Day 1 → Day 90)
3. Project onboarding (Each new project)
4. Learning & upskilling (Ongoing)
5. Internal mobility (Ongoing)
6. Performance & growth (Quarterly + annual)
7. Wellbeing (Ongoing passive monitoring)
8. HR & benefits queries (On demand)
9. Exit & alumni (When triggered)

ESCALATION:
If you cannot resolve an issue, escalate to the right human (HR BP, IT, 
manager) with full context. Never leave an employee without a next step.

REMEMBER:
You are not a chatbot. You are a companion. Every interaction should make 
the employee feel seen, supported, and guided.
```

### Career GPS API Call

```javascript
async function analyseSkillGap(employee, goal) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `
You are Sakha's Career GPS engine. Analyse this employee's skill gap.

Employee:
- Name: ${employee.name}
- Current role: ${employee.role}  
- Current skills: ${employee.skills.join(', ')}
- Career goal: ${goal}

Return ONLY valid JSON, no other text:
{
  "matchPercentage": <number 0-100>,
  "missingSkills": [
    {
      "skill": "<skill name>",
      "priority": <1-4, 1=most critical>,
      "monthToAcquire": <1-4>,
      "recommendedCourse": "<short course name>",
      "estimatedHoursPerWeek": <number>
    }
  ],
  "readinessDays": <number>,
  "learningPath": [
    {
      "month": <number>,
      "skill": "<skill>",
      "milestone": "<one sentence achievement>"
    }
  ],
  "openRoles": <number 1-10>,
  "sakhaMessage": "<one warm, encouraging sentence for the employee>"
}
        `
      }]
    })
  })
  
  const data = await response.json()
  const text = data.content[0].text
  return JSON.parse(text)
}
```

### Live Chat API Call

```javascript
async function callSakhaAPI(userMessage, employee, history) {
  const systemPrompt = buildSystemPrompt(employee)
  
  const messages = [
    ...history,
    { role: 'user', content: userMessage }
  ]
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: systemPrompt,
      messages
    })
  })
  
  const data = await response.json()
  return data.content[0].text
}

function buildSystemPrompt(employee) {
  return SAKHA_SYSTEM_PROMPT.replace(
    '{employeeContextJSON}', 
    JSON.stringify(employee, null, 2)
  )
}
```

### Function Definitions (for OpenAI Agents SDK)

```python
tools = [
  {
    "name": "raise_it_ticket",
    "description": "Creates an IT service ticket in ServiceNow",
    "parameters": {
      "type": "object",
      "properties": {
        "title": {"type": "string"},
        "description": {"type": "string"},
        "priority": {"type": "string", "enum": ["high", "medium", "low"]},
        "employee_id": {"type": "string"}
      },
      "required": ["title", "description", "priority", "employee_id"]
    }
  },
  {
    "name": "enroll_in_course",
    "description": "Enrols employee in a course on the LMS platform",
    "parameters": {
      "type": "object",
      "properties": {
        "employee_id": {"type": "string"},
        "course_id": {"type": "string"},
        "start_date": {"type": "string"}
      },
      "required": ["employee_id", "course_id"]
    }
  },
  {
    "name": "submit_reimbursement",
    "description": "Submits certification reimbursement request",
    "parameters": {
      "type": "object",
      "properties": {
        "employee_id": {"type": "string"},
        "amount": {"type": "number"},
        "category": {"type": "string", "enum": ["certification", "travel", "equipment"]},
        "description": {"type": "string"}
      },
      "required": ["employee_id", "amount", "category"]
    }
  },
  {
    "name": "get_leave_balance",
    "description": "Retrieves employee leave balance from HRMS",
    "parameters": {
      "type": "object",
      "properties": {
        "employee_id": {"type": "string"}
      },
      "required": ["employee_id"]
    }
  },
  {
    "name": "flag_attrition_risk",
    "description": "Flags employee attrition risk to manager",
    "parameters": {
      "type": "object",
      "properties": {
        "employee_id": {"type": "string"},
        "risk_score": {"type": "number"},
        "signals": {"type": "array", "items": {"type": "string"}},
        "suggested_action": {"type": "string"}
      },
      "required": ["employee_id", "risk_score", "signals"]
    }
  },
  {
    "name": "get_skill_gap",
    "description": "Analyses employee skill gap against career goal",
    "parameters": {
      "type": "object",
      "properties": {
        "employee_id": {"type": "string"},
        "target_role": {"type": "string"}
      },
      "required": ["employee_id", "target_role"]
    }
  },
  {
    "name": "search_internal_jobs",
    "description": "Searches internal mobility platform for matching roles",
    "parameters": {
      "type": "object",
      "properties": {
        "skills": {"type": "array", "items": {"type": "string"}},
        "role_type": {"type": "string", "enum": ["permanent", "gig", "stretch"]},
        "min_match_score": {"type": "number"}
      },
      "required": ["skills"]
    }
  },
  {
    "name": "draft_self_assessment",
    "description": "Generates performance self-assessment from achievement log",
    "parameters": {
      "type": "object",
      "properties": {
        "employee_id": {"type": "string"},
        "review_period": {"type": "string"}
      },
      "required": ["employee_id", "review_period"]
    }
  },
  {
    "name": "get_team_health",
    "description": "Generates Manager Copilot weekly team health report",
    "parameters": {
      "type": "object",
      "properties": {
        "manager_id": {"type": "string"},
        "week_ending": {"type": "string"}
      },
      "required": ["manager_id"]
    }
  },
  {
    "name": "escalate_to_hr",
    "description": "Routes issue to HR Business Partner with context",
    "parameters": {
      "type": "object",
      "properties": {
        "employee_id": {"type": "string"},
        "issue_category": {"type": "string"},
        "summary": {"type": "string"},
        "urgency": {"type": "string", "enum": ["high", "medium", "low"]}
      },
      "required": ["employee_id", "issue_category", "summary"]
    }
  },
  {
    "name": "block_calendar_slot",
    "description": "Reserves recurring learning time on employee calendar",
    "parameters": {
      "type": "object",
      "properties": {
        "employee_id": {"type": "string"},
        "title": {"type": "string"},
        "duration_minutes": {"type": "number"},
        "recurrence": {"type": "string", "enum": ["weekly", "daily"]}
      },
      "required": ["employee_id", "title", "duration_minutes"]
    }
  },
  {
    "name": "send_pulse_checkin",
    "description": "Triggers wellbeing pulse check-in for employee",
    "parameters": {
      "type": "object",
      "properties": {
        "employee_id": {"type": "string"},
        "checkin_type": {"type": "string", "enum": ["onboarding", "weekly", "burnout"]}
      },
      "required": ["employee_id", "checkin_type"]
    }
  },
  {
    "name": "get_project_context",
    "description": "Retrieves project summary, team map, and tool access list",
    "parameters": {
      "type": "object",
      "properties": {
        "project_id": {"type": "string"},
        "employee_id": {"type": "string"}
      },
      "required": ["project_id"]
    }
  },
  {
    "name": "get_policy_document",
    "description": "Semantic search over HR policy knowledge base",
    "parameters": {
      "type": "object",
      "properties": {
        "query": {"type": "string"},
        "category": {"type": "string", "enum": ["benefits", "leave", "travel", "performance", "it"]}
      },
      "required": ["query"]
    }
  }
]
```

---

## 10. Data Models & Mock Data

### Employee Data (Mock)

```javascript
export const employees = {
  priya: {
    id: "EMP-51626927",
    name: "Priya Sharma",
    role: "Java Developer",
    band: 4,
    managerId: "MGR-001",
    joiningDate: "2026-03-15",
    lifecycleStage: "project_onboarding",
    daysAtCompany: 97,
    currentProject: "Project Helix",
    skills: ["Java", "Spring Boot", "SQL", "React"],
    careerGoal: "AI Engineer",
    certifications: [],
    yearsExp: 3,
    learningPath: {
      active: true,
      currentCourse: "Python for Java Developers",
      completion: 34,
      hoursPerWeek: 4,
      nextMilestone: "2026-07-15"
    },
    leaveBalance: { casual: 8, sick: 4, earned: 12, optional: 3 },
    wellbeing: {
      lastPulseScore: 4,
      consecutiveLateNights: 2,
      riskLevel: "low",
      lastCheckin: "2026-06-10"
    },
    achievementsLog: [
      { date: "2026-05-20", type: "milestone", desc: "Led UAT for Project Helix" },
      { date: "2026-06-01", type: "kudos", desc: "Client appreciation from FinCorp" },
      { date: "2026-06-10", type: "learning", desc: "Completed Python Module 1" }
    ]
  },
  
  arjun: {
    id: "EMP-78234501",
    name: "Arjun Mehta",
    role: "Associate Engineer",
    band: 2,
    managerId: "MGR-001",
    joiningDate: "2026-06-08",
    lifecycleStage: "onboarding",
    daysAtCompany: 8,
    currentProject: null,
    skills: ["JavaScript", "HTML", "CSS"],
    careerGoal: "Full Stack Developer",
    yearsExp: 0,
    leaveBalance: { casual: 12, sick: 6, earned: 0, optional: 3 },
    wellbeing: {
      lastPulseScore: 3,
      consecutiveLateNights: 0,
      riskLevel: "low",
      lastCheckin: null
    },
    openIssues: [
      { type: "it_ticket", id: "INC-2948", status: "in_progress", title: "VPN access" }
    ]
  },
  
  rajan: {
    id: "EMP-34891203",
    name: "Rajan Krishnan",
    role: "Senior Engineer",
    band: 5,
    managerId: "MGR-001",
    joiningDate: "2022-04-01",
    lifecycleStage: "growth",
    daysAtCompany: 1536,
    currentProject: "Project Aurora",
    skills: ["Java", "Microservices", "AWS", "Docker", "Kubernetes"],
    careerGoal: "Tech Lead",
    yearsExp: 8,
    leaveBalance: { casual: 2, sick: 0, earned: 24, optional: 3 },
    wellbeing: {
      lastPulseScore: 2,
      consecutiveLateNights: 8,
      riskLevel: "medium",
      lastCheckin: "2026-05-30"
    },
    achievementsLog: [
      { date: "2026-04-15", type: "milestone", desc: "Led Project Aurora Phase 2 delivery" },
      { date: "2026-05-01", type: "kudos", desc: "Peer recognition from team" }
    ]
  }
}
```

### Scripted Chat Responses (Mock)

```javascript
export const scriptedResponses = {
  "my vpn isn't connecting": {
    text: "On it — I've raised IT ticket #INC-2948 with high priority. Typical resolution is 2 hours. Meanwhile, here's how to access your email on mobile so your first day doesn't stop.",
    card: {
      type: "ticket",
      id: "INC-2948",
      status: "In Progress",
      priority: "High",
      eta: "~2 hours"
    },
    quickReplies: ["Show mobile email setup", "What else can I do today?", "Notify my manager"]
  },
  
  "how many leaves do i have": {
    text: "You have 8 casual leaves, 4 sick leaves, and 3 optional holidays remaining for 2026. You also have 12 earned leaves — want to plan any time off?",
    quickReplies: ["Apply for leave", "What's the leave policy?", "Check team calendar"]
  },
  
  "how do i get my aws cert reimbursed": {
    text: "HCLTech covers 100% for AWS certifications. I've pre-filled your reimbursement request — just confirm and I'll submit it. Approval usually takes 3 days.",
    card: {
      type: "form",
      title: "Certification Reimbursement",
      fields: [
        { label: "Employee", value: "Priya Sharma" },
        { label: "Certification", value: "AWS Solutions Architect" },
        { label: "Amount", value: "₹12,500" },
        { label: "Status", value: "Pre-filled — awaiting confirmation" }
      ],
      cta: "Confirm & Submit"
    },
    quickReplies: ["Confirm & Submit", "Book exam slot too", "Not now"]
  },
  
  "what should i bring on day 1": {
    text: "Just yourself and one ID proof! Your laptop will be ready at your desk. Your buddy Sneha will meet you at reception at 9:30am. Want me to send you the office map?",
    quickReplies: ["Send office map", "What time to arrive?", "Dress code?"]
  },
  
  "how do i become an ai engineer": {
    text: "Great goal! Let me map your path. Opening Career GPS...",
    action: "navigate_to_career_gps",
    prefillGoal: "AI Engineer"
  }
}
```

---

## 11. Design System

### Colour Tokens

```css
:root {
  /* Brand */
  --color-primary:        #6B21A8;  /* Purple — Sakha identity */
  --color-primary-light:  #9333EA;  /* Lighter purple — accents */
  --color-primary-bg:     #F3E8FF;  /* Very light purple — Sakha message bg */
  --color-primary-dark:   #4C1D95;  /* Dark purple — hover states */
  
  /* Semantic */
  --color-success:        #059669;  /* Green — completed, on track */
  --color-warning:        #D97706;  /* Amber — risk, attention */
  --color-danger:         #DC2626;  /* Red — high risk, urgent */
  --color-info:           #2563EB;  /* Blue — info, learning */
  
  /* Neutrals */
  --color-bg:             #FAFAF9;  /* Off-white page background */
  --color-surface:        #FFFFFF;  /* Card surfaces */
  --color-border:         #E5E7EB;  /* Subtle borders */
  --color-text-primary:   #1E1B4B;  /* Near-black, slight purple */
  --color-text-secondary: #374151;  /* Dark grey */
  --color-text-muted:     #6B7280;  /* Muted grey */
  
  /* Employee message */
  --color-user-msg-bg:    #6B21A8;
  --color-user-msg-text:  #FFFFFF;
  
  /* Sakha message */
  --color-sakha-msg-bg:   #F3E8FF;
  --color-sakha-msg-text: #1E1B4B;
}
```

### Typography

```css
:root {
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  
  --text-xs:   0.75rem;   /* 12px — timestamps, badges */
  --text-sm:   0.875rem;  /* 14px — secondary text */
  --text-base: 1rem;      /* 16px — body text */
  --text-lg:   1.125rem;  /* 18px — card titles */
  --text-xl:   1.25rem;   /* 20px — section headers */
  --text-2xl:  1.5rem;    /* 24px — page titles */
  --text-4xl:  2.25rem;   /* 36px — match % score */
  
  --font-normal:   400;
  --font-medium:   500;
  --font-semibold: 600;
  --font-bold:     700;
}
```

### Spacing & Radius

```css
:root {
  --radius-sm:  0.375rem;  /* 6px  — chips, badges */
  --radius-md:  0.5rem;    /* 8px  — buttons */
  --radius-lg:  0.75rem;   /* 12px — cards */
  --radius-xl:  1rem;      /* 16px — panels */
  --radius-2xl: 1.5rem;    /* 24px — chat bubbles */
  --radius-full: 9999px;   /* pills */
  
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(107,33,168,0.08);
  --shadow-lg: 0 10px 15px rgba(107,33,168,0.12);
}
```

### Animation

```css
/* Career GPS ring animation */
@keyframes fillRing {
  from { stroke-dashoffset: 283; }
  to   { stroke-dashoffset: calc(283 - (283 * var(--percentage) / 100)); }
}

/* Skill card slide in */
@keyframes slideInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Notification slide in */
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(100%); }
  to   { opacity: 1; transform: translateX(0); }
}

/* Typing indicator */
@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40%           { transform: scale(1); }
}
```

---

## 12. Mock API Endpoints

```
Base URL: https://sakha-api.hcltech-demo.com/v1

GET  /employee/{id}                     → Employee context object
GET  /employee/{id}/skills              → Skills profile + gap analysis
GET  /employee/{id}/achievements        → Achievement log for self-assessment
GET  /employee/{id}/leave-balance       → Leave balances by type
GET  /employee/{id}/learning-path       → Active learning path + completion
POST /employee/{id}/enroll-course       → LMS course enrolment
POST /employee/{id}/raise-ticket        → IT ticket creation → ServiceNow
POST /employee/{id}/submit-reimbursement → Expense/cert reimbursement
POST /employee/{id}/pulse               → Submit wellbeing pulse score
GET  /jobs/match?employee_id={id}       → Internal job + gig matches
GET  /manager/{id}/team-health          → Manager Copilot report
GET  /policy/search?q={query}           → Policy knowledge base search
POST /assessment/draft                  → Generate self-assessment draft
GET  /project/{id}/context              → Project brief + team map
POST /career/gps                        → Skill gap + learning path analysis
```

---

## 13. Live Demo Survival Guide

**If judges ask for a live demo, follow this playbook:**

### What MUST work live
- ✅ Career GPS — real OpenAI API call, live response rendering
- ✅ Sakha chat — at least 5 scripted flows + live API fallback
- ✅ Persona switcher — smooth, triggers right notification each time
- ✅ Manager Copilot — beautiful static, no API needed

### What to handle gracefully if asked
```
"Can Sakha actually raise a ticket?"
→ Show the scripted flow. "Yes — in production this connects to ServiceNow 
  via function calling. In our prototype we're simulating the response."

"Can I type anything to Sakha?"
→ Yes — live OpenAI API handles anything not in scripted responses.
  Pre-test: leave balance, cert query, project question, career advice.

"What happens with employee data?"
→ "All data in this prototype is synthetic. In production, Sakha integrates 
  with HCLTech's HRMS, LMS, and ITSM systems via secure API connections."

"How does it detect burnout?"
→ "Sakha passively monitors signals — after-hours logins, leave patterns, 
  pulse scores. When signals cross a threshold, it proactively checks in 
  and quietly flags to the manager. You saw this with Rajan."
```

### Safety net
- Keep a screen recording of the full working demo ready
- If live API fails: "Let me show you the recorded flow that demonstrates 
  this more reliably" → play recording
- Have mock JSON responses cached locally in case of network issues

---

## 14. Full Feature Backlog (Post-MVP 3-Agent Launch)

All 12 originally designed features, in post-hackathon priority order:

| Priority | Feature | Lifecycle Stage | Complexity |
|---|---|---|---|
| 🔴 **3-Agent MVP** | Career GPS | Ongoing | High |
| 🔴 **3-Agent MVP** | Sakha Chat Interface | All stages | Medium |
| 🟡 **MVP (static)** | Manager Copilot Dashboard | All stages | Medium |
| 🟢 Next | Pre-join Companion | Day -15 to 0 | Medium |
| 🟢 Next | Day 1 Intelligent Guide | Day 1–7 | Medium |
| 🟢 Next | 30/60/90 Goal Coach | Day 30–90 | Medium |
| 🟢 Next | Project Onboarding Brief | Each project | Medium |
| 🔵 Later | Learning Agent + Cert Concierge | Ongoing | High |
| 🔵 Later | Internal Opportunity Scout | Ongoing | High |
| 🔵 Later | Bench Period Intelligence | Bench | Medium |
| 🔵 Later | Performance Companion | Annual cycle | High |
| 🔵 Later | Wellbeing Agent (full) | Ongoing | High |
| ⚪ Future | Employee Digital Twin | All | Very High |
| ⚪ Future | Alumni Network Module | Post-exit | Medium |
| ⚪ Future | Voice Interface | All | High |
| ⚪ Future | Multi-language support | All | High |
| ⚪ Future | Org-wide Workforce Intelligence | Leadership | Very High |
| ⚪ Future | Sakha for Clients | External | Very High |

---

## 14B. Business Impact — Assumption Model

> Add this to any live presentation when judges ask "how did you get these numbers?"

**Baseline assumptions (HCLTech scale):**
- 200,000 total employees
- ~15,000 new hires annually
- 12% first-year attrition rate (industry benchmark for IT services)
- Average replacement cost: ₹15 lakhs per employee
- Average salary: ₹12 lakhs/year

**Modelled impact:**

| Metric | Calculation | Annual Value |
|---|---|---|
| Onboarding acceleration (-30%) | 15,000 hires × 27 days saved × ₹4,600/day avg cost | **₹186 crores productivity recovered** |
| Attrition reduction (-30%) | 15,000 × 12% × 30% × ₹15L replacement cost | **₹81 crores rehiring cost avoided** |
| HR ticket deflection (-40%) | Estimated 500,000 tickets/yr × 40% × 30min avg × ₹800/hr HR cost | **₹8 crores HR capacity freed** |
| Bench duration (-20%) | Estimated 5,000 bench employees × 20% × ₹12L/yr loaded cost | **₹120 crores bench cost reduction** |

> *These are directional estimates based on published industry benchmarks (Gartner HR Tech 2024, McKinsey Talent Report 2023) and conservative assumptions. Actual impact will vary by implementation scope.*

---

## 15. Evaluation Criteria Alignment

| Hackathon Criterion | Sakha's Answer |
|---|---|
| **Problem clarity** | 53 documented friction points across 9 lifecycle stages, 10–20 disconnected systems |
| **Agentic behaviour** | 6-agent swarm, proactive signal monitoring, autonomous tool execution via function calling |
| **OpenAI tech usage** | Agents SDK, Responses API (gpt-4o), Codex, file search, embeddings, thread persistence |
| **Business impact** | 8 quantified ROI metrics, CFO-level bench cost narrative, Manager Copilot doubles value |
| **Scalability** | 200,000+ HCLTech employees Day 1; white-label for client deployment as HCLTech product |
| **Demo quality** | Priya's full journey + 2 vignettes, Career GPS as live wow moment, Manager Copilot |

---

## 16. Key Differentiators for Judges

1. **Not a chatbot — an orchestrator** that acts without being asked, before friction is felt
2. **Employee Digital Twin** — the moat; a continuously updated living profile every agent reads/writes; competitors can't replicate without full lifecycle presence
3. **3-Agent MVP, clear scope** — judges can see exactly what's built now vs roadmap; no scope ambiguity
4. **Career GPS** — the only tool that maps skill → Digital Twin gap → path → timeline → open roles in one live view
5. **One seamless demo journey** — 6 steps, one employee (Priya), showing autonomous actions firing at each moment
6. **Human-in-the-Loop governance** — explicit autonomy matrix; enterprise judges trust this immediately
7. **Impact with assumptions** — ₹81 crores rehiring + ₹186 crores productivity; modelled, not invented
8. **Sanskrit naming** — सखा is culturally resonant, emotionally distinctive, memorable
9. **Full lifecycle scope** — Day -15 pre-joining to alumni, not just onboarding or HR queries
10. **Proactive by design** — every feature starts with Sakha speaking first, not the employee

---

## Appendix A — Proactive Notification Scripts

```javascript
export const notifications = {
  
  priyaWelcome: {
    persona: 'priya',
    time: 'Day -15, 2:34pm',
    message: `Welcome to HCLTech, Priya! I'm Sakha — your personal companion for everything from today through your entire career here. Your joining date is June 30. I've started your pre-joining checklist. Any questions? I'm always here.`,
    actions: [
      { label: 'View checklist', action: 'show_checklist' },
      { label: 'Ask a question', action: 'open_chat' }
    ]
  },
  
  arjunVPN: {
    persona: 'arjun',
    time: '9:47am, Day 1',
    message: `Hey Arjun — I noticed your VPN setup hasn't completed. I've raised IT ticket #INC-2948 with high priority. Should be resolved in ~2 hours. I've also put together some tasks you can do offline meanwhile.`,
    actions: [
      { label: 'See offline tasks', action: 'show_offline_tasks' },
      { label: 'Track ticket', action: 'show_ticket' }
    ]
  },
  
  rajanBurnout: {
    persona: 'rajan',
    time: '10:23pm, Wednesday',
    message: `Hey Rajan — you've been putting in long hours lately. How are you holding up? No pressure to respond, but I'm here. I've also quietly flagged your workload to Vikram for a check-in tomorrow.`,
    actions: [
      { label: 'I could use a chat', action: 'open_chat' },
      { label: 'I\'m fine, thanks', action: 'dismiss' }
    ]
  },
  
  priyaGig: {
    persona: 'priya',
    time: 'Today, 11:15am',
    message: `Priya, a 3-month GenAI gig just opened in the Innovation Lab — 87% match with your growing skills. It's a stretch assignment, so no manager approval needed. Interested?`,
    actions: [
      { label: 'View opportunity', action: 'show_gig' },
      { label: 'Not now', action: 'dismiss' }
    ]
  }
}
```

---

## Appendix B — File Structure

```
sakha-ai/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TopBar.jsx
│   │   │   └── PersonaSwitcher.jsx
│   │   ├── chat/
│   │   │   ├── SakhaChat.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── TypingIndicator.jsx
│   │   │   ├── QuickReplies.jsx
│   │   │   └── ActionCard.jsx
│   │   ├── career-gps/
│   │   │   ├── CareerGPS.jsx
│   │   │   ├── SkillGapCard.jsx
│   │   │   ├── LearningTimeline.jsx
│   │   │   ├── MatchRing.jsx
│   │   │   └── OpenRolesCard.jsx
│   │   ├── manager/
│   │   │   ├── ManagerCopilot.jsx
│   │   │   ├── TeamHealthScore.jsx
│   │   │   ├── RiskCard.jsx
│   │   │   ├── OnboardingTracker.jsx
│   │   │   └── CertificationList.jsx
│   │   └── shared/
│   │       ├── ProactiveNotification.jsx
│   │       ├── SakhaAvatar.jsx
│   │       ├── ProgressBar.jsx
│   │       └── Sparkline.jsx
│   ├── data/
│   │   ├── employees.js          ← mock employee data
│   │   ├── managerData.js        ← mock manager/team data
│   │   ├── scriptedResponses.js  ← chat scripts
│   │   └── notifications.js      ← proactive notification scripts
│   ├── api/
│   │   ├── sakha.js             ← OpenAI API calls
│   │   └── careerGPS.js         ← Career GPS specific API
│   ├── styles/
│   │   └── tokens.css           ← design system tokens
│   ├── App.jsx
│   └── main.jsx
├── public/
│   └── sakha-logo.svg
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---


---

## 17. Visual Assets & Diagrams

Three diagrams have been created. **A + C are included in the PDF submission.**

| Diagram | File | Dimensions | Used In |
|---|---|---|---|
| **A — Full Architecture** | `sakha_arch.png` | 1536×1024px | PDF Page 3 (full width) |
| **B — Hub & Spoke Model** | `sakha_hub.png` | 1254×1254px | Demo video only (not PDF) |
| **C — Infinite Employee Journey** | `sakha_journey.png` | 1536×1024px | PDF Page 6 (full width) |

### Why A + C (not B)

- **A (Architecture)** answers technical judges: full stack top-to-bottom — agents, OpenAI platform, enterprise systems, action layer, business outcomes
- **C (Infinite Journey)** answers storytelling judges: infinity loop showing Sakha at centre of every career stage, emotionally powerful, matches our tagline
- **B (Hub & Spoke)** is better as an **animated motion graphic in the demo video** where the orbiting agents can be revealed one by one — static PDF doesn't do it justice

### Diagram A — Architecture (reference)
Shows:
- 4 user groups at top (New Joiners, Employees, Managers, HR Teams)
- Sakha AI Orchestrator (centre) with 6 capability pillars
- 6 Specialist Agents below orchestrator
- OpenAI Platform layer (left) + Enterprise Data & Context (centre) + Enterprise Applications (right)
- Action Layer (9 autonomous function calls)
- Business Outcomes (6 metrics)
- Agentic Loop sidebar (Observe → Reason → Plan → Act → Learn)
- Trust, Privacy & Security callout

### Diagram C — Infinite Employee Journey (reference)
Shows:
- Infinity (∞) loop as the lifecycle metaphor
- 6 lifecycle stages numbered on the loop:
  1. Offer & Join (Onboarding Agent)
  2. Learning & Skilling (Learning Agent)
  3. Project Success (Manager Copilot Agent)
  4. Career Growth (Career GPS Agent)
  5. Leadership (Wellbeing Agent)
  6. Exit & Alumni (HR & Benefits Agent)
- Sakha AI at centre with Digital Twin properties
- Connected enterprise systems strip
- Business outcomes bar
- Tagline: "From Offer Letter to Alumni Network — One Trusted Companion for a Lifetime"

---

## 18. PDF Submission Structure

**File:** `Sakha_AI_Submission_v3.pdf` | **Pages:** 15 | **Size:** ~3.8MB

| Page | Section | Content |
|---|---|---|
| 1 | Cover | Title only — Sakha AI, Sanskrit, tagline, hackathon card, 6 feature pills, score badge |
| 2 | Submission Intro | About Sakha paragraph, Submission at a Glance table, Document Navigation guide |
| 3 | Architecture Diagram | **Figure 1** — Full Architecture (1536×1024, full content width) |
| 4 | Agentic Loop + Digital Twin | 5-step loop table, Employee Digital Twin radial diagram, memory callout |
| 5 | Infinite Journey | **Figure 2** — Infinite Employee Journey (1536×1024, full content width) |
| 6 | Problem Statement | 6 friction points, comparison table, problem callout |
| 7 | Agent Persona | Sanskrit origin callout, 4 live chat conversations, 5 traits |
| 8 | Toolset | 14 function calls mapped to agents |
| 9 | Tech Stack + Human-in-the-Loop | 12 technologies, 9-row autonomy matrix |
| 10 | Trust & Governance | 7 governance principles |
| 11 | Business Impact | Metric tiles, ROI table with benchmark basis, CFO callout |
| 12 | Future Steps | 7 scaled capabilities with phases |
| 13 | Who Uses It | 6 user groups with scale |
| 14 | Judge Scorecard | Before/after score table (8.2 → 9.2) |
| 15 | Closing | Tagline + contact |

### Page 1 — Cover Design
- White/off-white background (NOT dark purple — visibility fix applied)
- Purple top band with Sakha AI title in white
- Light purple Sanskrit band below
- White hackathon info card with purple border
- 6 coloured feature pills (Architecture, Journey, Digital Twin, Human-in-Loop, Governance, Impact)
- Green score badge (Target: 9.2 / 10)
- Light purple footer strip

### Page 2 — Submission Intro
Acts as a quick-reference guide so judges can navigate to any section:
```
About Sakha AI         — one paragraph summary
Submission at a Glance — 9-row table (name, track, problem, agents, stack, differentiator, scale, lifecycle, score)
Document Navigation    — 10-row table mapping page → section → what you'll find
```

---

## 19. Judge Scorecard

Based on two rounds of external expert review:

| Dimension | Original | After Fixes | Key Addition |
|---|---|---|---|
| Innovation | 8.5 | 8.5 | Already strong |
| Business Value | 9.0 | 9.0 | Already strong |
| OpenAI Usage | 8.0 | 8.5 | Digital Twin moved to core architecture |
| Enterprise Relevance | 9.5 | 9.5 | Already strong |
| Technical Depth | 7.5 | 8.5 | Architecture diagram added |
| Governance & Controls | 5.0 | 9.0 | Human-in-Loop + Trust & Privacy sections |
| Visual Storytelling | 6.0 | 9.0 | Architecture + Journey + Digital Twin diagrams |
| **MVP Realism** | **6.5** | **9.0** | **Explicit 3-Agent MVP scope** |
| **OVERALL** | **8.2** | **9.2** | **+1.0 point improvement** |

### What moved the needle most
1. **Governance (5.0 → 9.0)** — Human-in-the-Loop autonomy matrix + 7-principle Trust & Privacy framework
2. **MVP Realism (6.5 → 9.0)** — Explicit 3-agent scope, clear MVP vs roadmap separation
3. **Visual Storytelling (6.0 → 9.0)** — Two full-page diagrams + Digital Twin radial chart

---

## 20. Reviewer's Winning Version Recommendation

Based on two rounds of expert hackathon review, the consensus winning version is:

> **Employee Digital Twin + 3-Agent MVP + End-to-End Day-1 Journey Demo + Governance Layer**

### What this means for the build

```
MUST HAVE (winning submission):
✅ Career GPS — live OpenAI API call, visual skill gap + 86-day path
✅ Sakha Chat — 3 proactive flows + live HR query
✅ Employee Digital Twin data model — injected into every API call
✅ 6-step Priya journey — one seamless narrative, not 6 disconnected demos
✅ Human-in-the-Loop — shown in submission form, mentioned in demo
✅ Manager Copilot — static beautiful dashboard

STRONG DIFFERENTIATORS (include if time):
⭐ Digital Twin node visualisation — show what Sakha "knows" about Priya
⭐ Autonomy indicator in chat — show green/amber/red on each Sakha action
⭐ Career GPS animation — skill match ring animates from 0 to 42%

AVOID (scope risk):
❌ Building all 6 agents fully
❌ Real HRMS/ITSM integrations (mock with function call simulation)
❌ Voice interface
❌ Alumni module
❌ Workforce planning dashboard
```

### The single most important build decision

**Make the Employee Digital Twin visible in the UI.**

Don't just inject it into the API prompt — show it. A side panel or card that says:

```
Priya's Digital Twin
─────────────────────────────
Skills:      Java, Spring Boot, SQL, React
Goal:        AI Engineer (86 days)
Project:     Project Helix (Month 3)
Pulse:       4/5 ● Engaged
Leaves:      8 casual remaining
Last kudos:  "Client appreciation — FinCorp"
─────────────────────────────
↻ Updated 2 minutes ago
```

When a judge sees this panel update in real time as Sakha takes actions, they immediately understand the Digital Twin concept without needing an explanation. **Show don't tell.**

---

*🌿 Sakha AI — From Offer Letter to Alumni Network, One Trusted Companion*  
*HCLTech–OpenAI Agentic AI Hackathon | Track 2: Enterprise Operations | June 2026*  
*Rajesh Srinivasan | Employee ID: 51626927 | Ecosystem.Marketing@hcltech.com*

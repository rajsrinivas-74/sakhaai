# 🌿 Sakha AI — Employee Success Operating System

> HCLTech × OpenAI Agentic AI Hackathon · Track 2: Enterprise Operations
> Rajesh Srinivasan · Employee ID 51626927

Sakha (सखा, Sanskrit for *"trusted companion"*) is a Digital-Twin–powered agentic AI that
predicts friction, prevents disengagement, and resolves employee journeys across onboarding,
career growth, HR, and manager insight.

The 3-agent MVP — **Onboarding + Career GPS + HR & Benefits** — runs over a shared **Employee
Digital Twin**, with a polished **Manager Copilot** as the enterprise story.

## Quick start

```bash
npm install
npm run dev
```

Open **http://localhost:3000** — the landing page. Click a persona (or **Launch demo**) to enter
the workspace.

**No API key is required.** With no key configured, Sakha serves deterministic results from local
Digital-Twin data, so the demo never blocks on the network.

## Optional: enable live OpenAI

Copy the example env and add your key:

```bash
cp .env.example .env.local
```

```bash
# .env.local
OPENAI_API_KEY=sk-...      # enables live Career GPS + free-form chat
OPENAI_MODEL=gpt-4o        # optional; defaults to gpt-4o
```

| | No key (default) | With key |
|---|---|---|
| Career GPS | Deterministic Twin result (badge: *Local Twin model*) | Live `gpt-4o` (badge: *Live · OpenAI*) |
| Chat | Scripted golden flows | Scripted flows + live answers for anything else |

If a live call fails for any reason, Sakha silently falls back to the deterministic result —
**for a rehearsed demo or the recorded video, running keyless is the safest choice.**

## Routes

| Route | What |
|---|---|
| `/` | Landing page — hero, personas, features |
| `/app` | Workspace (defaults to Priya) |
| `/app?persona=priya\|arjun\|rajan` | Enter as an employee |
| `/app?view=manager` | Enter the Manager Copilot (Vikram) |
| `/app?persona=priya&view=career` | Jump straight into Career GPS |
| `/api/career-gps` `/api/chat` | Server route handlers (OpenAI + fallback) |

## The golden demo path (Priya)

1. Landing → **Walk Priya's journey** (or persona card → Priya)
2. In chat, ask **"How do I become an AI Engineer?"** → routes into **Career GPS**
3. Career GPS renders readiness, an 86-day roadmap, **success probability**, and the
   **"Sakha has already acted"** panel (with human-in-the-loop autonomy badges)
4. The **Digital Twin** panel updates visibly — *"just now · Career GPS"*
5. Switch user → enter as **Vikram** to show the **Manager Copilot**

> Try the goal **"AI Governance Consultant"** in Career GPS — it has a pixel-perfect keyless
> fallback (72% ready · 88% probability · 3 months).

## Access model

Identity is established at the landing page (mocked SSO). Inside the workspace you only ever see
**your own** Digital Twin — there is no in-session persona switcher. The **manager** lens (Vikram)
sees team-level signals, not individual chats or Twins. To change identity, use **Switch user**.

## Architecture & branding

- [Sakha_AI_Master_Build_Spec.md](./Sakha_AI_Master_Build_Spec.md) — product + build spec
- [Sakha_AI_Technical_Architecture.md](./Sakha_AI_Technical_Architecture.md) — data flow, storage, agent lifecycle
- [Sakha_AI_Connection_Architecture.md](./Sakha_AI_Connection_Architecture.md) — how employees connect (Teams / Web / proactive)
- [AI_Orchestrator_Branding_Guidelines.md](./AI_Orchestrator_Branding_Guidelines.md) — dark, AI-native brand system

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · framer-motion · lucide-react · zod · OpenAI SDK

## Verify

```bash
npm run lint
npm run build
```

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version may include newer APIs, conventions, and file structure. Read the relevant guide in `node_modules/next/dist/docs/` before using unfamiliar Next.js APIs.
<!-- END:nextjs-agent-rules -->

# Sakha AI Codex Instructions

## Project

Sakha AI is a rich enterprise hackathon prototype for the HCLTech-OpenAI Agentic AI Hackathon, Track 2: Enterprise Operations.

The winning demo path is Priya asking: "How do I become an AI Engineer?" Sakha responds with a personalized Career GPS roadmap, skill gaps, an 86-day readiness journey, and role matches.

## Build Priorities

- Build the Career GPS experience first.
- Keep the demo reliable even without network or OpenAI API access.
- Use local mock data for Employee Digital Twin, HR, manager, learning, and role data.
- Add OpenAI only through server-side route handlers with deterministic fallback.
- Do not integrate real HRMS, ITSM, LMS, payroll, Teams, calendar, or policy systems for the MVP.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn-style component primitives
- lucide-react
- framer-motion
- recharts
- zod

## Design Direction

The UI should feel warm, premium, enterprise-grade, and human. It should not look like a generic SaaS dashboard.

Use visual hierarchy, motion, charts, timelines, and cards to make the demo feel rich, but keep the primary flow easy to scan during a five-minute presentation.

## Verification

Run these before considering implementation complete:

```bash
npm run lint
npm run build
```

When a dev server is running, verify the app visually at desktop and mobile widths.

# 🌿 Sakha AI — Connection Architecture
### How Employees Connect to Sakha

> **Team:** SAKHA AI | Rajesh Srinivasan | Employee ID: 51626927
> **Stack:** React + OpenAI Agents SDK + gpt-4o + Azure AD SSO
> **Companion to:** Sakha AI Technical Architecture (data flow, storage, agent lifecycle)

---

## The Core Answer

**Sakha lives where employees already are — not in a new app they have to find.**

The biggest adoption killer for enterprise tools is asking people to download something
new. Sakha's strategy is **zero new app** — embed into existing surfaces employees use
daily.

---

## 4 Connection Points

### 1️⃣ Microsoft Teams (Primary Channel — HCLTech context)

HCLTech runs on Microsoft 365. Every employee is already in Teams daily.

```
Employee opens Teams
        ↓
Finds "Sakha" in the Apps sidebar
(IT deploys it org-wide — no individual install needed)
        ↓
Chats directly like any Teams conversation
        ↓
Sakha responds in the chat thread
```

**What this looks like:**

```
┌─────────────────────────────────────┐
│  Teams                              │
│  ─────────────────────────────────  │
│  💬 General                         │
│  💬 Project Helix                   │
│  🌿 Sakha AI  ← pinned for everyone │
│  ─────────────────────────────────  │
│                                     │
│  Priya: How many leaves do I have?  │
│                                     │
│  🌿 You have 8 casual, 4 sick,      │
│     3 optional remaining.           │
│     Want to plan time off?          │
│                                     │
│  [Quick reply] Apply for leave      │
│  [Quick reply] Check team calendar  │
└─────────────────────────────────────┘
```

**Technical implementation:**

```
Azure Bot Framework → registers Sakha as a Teams Bot
Employee messages @Sakha or opens Sakha app in Teams
Teams sends message payload to Sakha API endpoint
Sakha API loads Digital Twin + Thread → runs agent → returns response
Response rendered as Teams Adaptive Card
```

---

### 2️⃣ Web App (Self-contained for Demo & Power Users)

A dedicated React web app — this is what we build for the hackathon demo.

```
https://sakha.hcltech.com
        ↓
SSO login (HCLTech Azure AD)
        ↓
Priya lands on her Sakha dashboard:
  ├── Chat with Sakha (left panel)
  ├── Career GPS (centre — the wow feature)
  ├── My Digital Twin (right panel — live profile)
  └── Manager Copilot (separate view for managers)
```

**This is the demo surface** — full control over UI, Career GPS animation, Digital Twin
panel, everything.

---

### 3️⃣ Email / Proactive Notifications (Sakha reaches out)

Sakha doesn't wait to be messaged. It finds the employee:

```
Monday 9am:
Sakha emails Priya's manager:
"Team Health Report — week of June 15"

Day 28:
Sakha sends Priya a Teams message:
"Hey Priya — Day 30 check-in coming up.
 How are you settling in? Quick pulse ↓"
 [😊 Great] [😐 Okay] [😔 Struggling]

Sakha detects 8 late nights:
Sends Rajan a Teams DM at 8pm:
"Hey Rajan — long hours lately.
 How are you holding up?"
```

**No employee action needed. Sakha initiates.**

---

### 4️⃣ Embedded in Existing HR Portals (Future)

As a widget/iframe embedded directly in:

```
Workday     → "Ask Sakha" button on leave request page
ServiceNow  → Sakha chat on IT support portal
LMS portal  → "Ask Sakha what to learn next" on homepage
Intranet    → Sakha widget on HCLTech homepage
```

Employee never leaves the system they're already in.

---

## The Full Connection Architecture

```
┌─────────────────────────────────────────────────────────┐
│               EMPLOYEE TOUCHPOINTS                      │
│                                                         │
│  Microsoft Teams    Web App         Email / Push        │
│  (daily driver)     (power users)   (proactive reach)   │
│       │                 │                │              │
│       └─────────────────┴────────────────┘              │
│                         │                               │
│                    SAKHA API                            │
│              (single backend for all)                   │
│                         │                               │
│              ┌──────────┴──────────┐                    │
│         Load Twin              Load Thread              │
│         (PostgreSQL)           (OpenAI)                 │
│                         │                               │
│              Instantiate Agent On Demand                │
│                         │                               │
│              ┌──────────┴──────────┐                    │
│         Update Twin            Append Log               │
│              │                      │                   │
│         Return response to      Update audit trail      │
│         originating channel                             │
└─────────────────────────────────────────────────────────┘
```

**One backend. Multiple front doors. Employee uses whichever surface they're already on.**

---

## Authentication — How Sakha Knows Who Is Who

```
Employee opens Sakha (Teams / Web / any surface)
        ↓
HCLTech Azure AD SSO authenticates them
(they're already logged into Teams/Workday — no extra login)
        ↓
Azure AD passes employee_id + email to Sakha API
        ↓
Sakha loads their Digital Twin from DB using employee_id
        ↓
Conversation begins with full context instantly
```

**No username. No password. No registration. One click.**

---

## For the Hackathon Demo

You don't need to build Teams integration. The demo surface is:

```
Option A (Recommended):
React web app at localhost:3000
SSO mocked with a persona switcher
→ Click "Priya" → loads Priya's Twin → chat begins

Option B:
ChatGPT Enterprise with Sakha as a custom GPT
→ judges can literally type to Sakha live

Option C (Impressive):
Teams bot (if time allows — Azure Bot Framework)
→ most realistic enterprise demo
```

For the **5-minute video**, Option A is perfect — full control over the UI, the Career GPS
animation, the Digital Twin panel. Judges see the full product vision.

> **Build note:** The current prototype implements **Option A**. The persona switcher in the
> left sidebar mocks Azure AD SSO — selecting Priya / Arjun / Rajan loads that employee's
> Digital Twin and seeds Sakha's first proactive message, exactly as an authenticated session
> would.

---

## Summary

| Channel | Who Uses It | How Employee Gets There | Build When |
|---|---|---|---|
| **Microsoft Teams Bot** | All employees daily | IT deploys org-wide, pinned automatically | Phase 2 |
| **Web App** | Power users + demo | SSO link, browser | **Hackathon MVP** |
| **Proactive notifications** | Everyone | Sakha reaches out | MVP (scripted) |
| **HR portal widget** | In-context users | Embedded iframe | Phase 3 |
| **Mobile app** | Field/remote workers | App store | Phase 4 |

---

*🌿 Sakha AI — From Offer Letter to Alumni Network, One Trusted Companion*
*HCLTech–OpenAI Agentic AI Hackathon | Track 2: Enterprise Operations | June 2026*
*Rajesh Srinivasan | Employee ID: 51626927 | Ecosystem.Marketing@hcltech.com*

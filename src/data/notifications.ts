import type { PersonaId, ProactiveNotification } from "@/types/sakha";

export const proactiveNotifications: Record<PersonaId, ProactiveNotification> = {
  priya: {
    persona: "priya",
    time: "Today · 09:01",
    tone: "welcome",
    title: "Good morning, Priya",
    message:
      "Project Helix access is ready and your Azure cert is on record. You mentioned wanting to grow into AI Engineering — want me to map your path?",
    actions: [{ label: "Map my AI Engineer path" }, { label: "Not now" }],
  },
  arjun: {
    persona: "arjun",
    time: "Day 1 · 09:47am",
    tone: "urgent",
    title: "VPN setup needs a nudge",
    message:
      "Hey Arjun — I noticed your VPN setup hasn't completed. I've raised IT ticket #INC-2948 with high priority (~2 hours). Here are tasks you can do offline meanwhile.",
    actions: [{ label: "See offline tasks" }, { label: "Track ticket" }],
  },
  rajan: {
    persona: "rajan",
    time: "Wednesday · 10:23pm",
    tone: "gentle",
    title: "Checking in, Rajan",
    message:
      "You've been working late most evenings this week. How are you holding up? No pressure to reply — I've also quietly flagged your workload to Vikram for a check-in.",
    actions: [{ label: "I could use a chat" }, { label: "I'm fine, thanks" }],
  },
};

import type { ChatCard } from "@/types/sakha";

export type ScriptedResponse = {
  text: string;
  card?: ChatCard;
  quickReplies?: string[];
  action?: "navigate_to_career_gps" | "flag_retention";
};

/**
 * Keyword-matched scripted responses. Keys are lower-cased intent phrases;
 * matching is substring-based so natural phrasings still land on a script.
 */
export const scriptedResponses: { match: string[]; response: ScriptedResponse }[] = [
  {
    match: [
      "become ai delivery manager",
      "ai delivery manager",
      "career path",
      "map my",
      "move into ai delivery",
      "move to ai delivery",
      "same role for 4 years",
      "same role for four years",
      "what should i do next",
      "grow into ai delivery",
      "ai delivery path",
      "show me my ai delivery path",
    ],
    response: {
      text: "I hear you — four years in one role is exactly when a deliberate move matters most. Here's a quick read from your Digital Twin: you're about 38% ready for AI Delivery Manager today, on a ~90-day path with an 84% success probability, and there are already 3 internal roles matching you. Want me to open your full Career GPS so we can map the roadmap, skill gaps and roles together?",
      action: "navigate_to_career_gps",
    },
  },
  {
    match: ["what role should i target", "role should i target", "target next", "which role", "what role"],
    response: {
      text: "Based on your Digital Twin and the AI Delivery Manager mission, here are the strongest internal role matches. Select one and I'll open it in Career GPS.",
      card: {
        type: "matches",
        title: "Role matches",
        kind: "role",
        items: [
          { label: "Associate AI Delivery Manager", sub: "AI Studio Pilot", score: 89 },
          { label: "GenAI Centre of Excellence Delivery Lead", sub: "Enterprise AI Studio", score: 72 },
          { label: "AI Transformation Co-Delivery Manager", sub: "Truist AI Transformation", score: 65 },
        ],
      },
    },
  },
  {
    match: ["projects that match", "any projects", "matching projects", "project match", "projects matching"],
    response: {
      text: "Yes — three live engagements match your skills and your AI delivery direction. The Opportunity Agent ranked them for you.",
      card: {
        type: "matches",
        title: "Project matches",
        kind: "project",
        items: [
          { label: "AI Studio Pilot", sub: "Associate AI Delivery Manager", score: 91 },
          { label: "GenAI Centre of Excellence", sub: "Delivery Lead", score: 84 },
          { label: "AI Transformation account", sub: "Co-delivery manager", score: 73 },
        ],
      },
      quickReplies: ["Express interest in the top match", "What role should I target next?"],
    },
  },
  {
    match: ["considering resigning", "resign", "thinking of leaving", "want to quit", "quit", "leaving the company"],
    response: {
      text: "Thank you for telling me, Priya — that takes trust, and I'm glad you did. Before anything, your growth matters here: you're 89% of the way to an AI Delivery Manager move, with internal roles already matching you. With your consent I've gently flagged this to Vikram so he can support a growth conversation — no pressure, and nothing about why. Want to look at your AI delivery path together?",
      action: "flag_retention",
      quickReplies: ["Show me my AI delivery path", "I'd like to talk to someone"],
    },
  },
  {
    match: ["leave", "leaves", "time off", "holiday"],
    response: {
      text: "You have 8 casual, 4 sick, and 3 optional holidays remaining for 2026, plus 12 earned leaves. Want me to plan time off or check the festive calendar?",
      quickReplies: ["Apply for leave", "What's the leave policy?", "Check team calendar"],
    },
  },
  {
    match: ["vpn", "can't connect", "cannot connect", "not connecting"],
    response: {
      text: "On it — I've raised IT ticket #INC-2948 with high priority. Typical resolution is ~2 hours. Meanwhile, here's mobile email access so your first day doesn't stop.",
      card: {
        type: "ticket",
        id: "INC-2948",
        status: "In Progress",
        priority: "High",
        eta: "~2 hours",
      },
      quickReplies: ["Show mobile email setup", "Day 1 checklist", "Notify my manager"],
    },
  },
  {
    match: ["reimburse", "reimbursement", "cert claim", "certification claim"],
    response: {
      text: "HCLTech covers 100% for Azure certifications. I've pre-filled your reimbursement request — just confirm and I'll submit it. Approval usually takes 3 days.",
      card: {
        type: "form",
        title: "Certification Reimbursement",
        fields: [
          { label: "Employee", value: "Priya Sharma" },
          { label: "Certification", value: "Azure AI Fundamentals (AI-900)" },
          { label: "Amount", value: "₹12,500" },
          { label: "Status", value: "Pre-filled — awaiting confirmation" },
        ],
        cta: "Confirm & Submit",
      },
      quickReplies: ["Confirm & Submit", "Book exam slot too", "Not now"],
    },
  },
  {
    match: ["bring on day 1", "what to bring", "first day", "day 1"],
    response: {
      text: "Just yourself and one ID proof! Your laptop will be ready at your desk, and your buddy Sneha will meet you at reception at 9:30am. Want the office map?",
      quickReplies: ["Send office map", "What time to arrive?", "Dress code?"],
    },
  },
];

export function matchScripted(input: string): ScriptedResponse | null {
  const text = input.toLowerCase().trim();
  for (const entry of scriptedResponses) {
    if (entry.match.some((m) => text.includes(m))) {
      return entry.response;
    }
  }
  return null;
}

import type { ChatCard } from "@/types/sakha";

export type ScriptedResponse = {
  text: string;
  card?: ChatCard;
  quickReplies?: string[];
  action?: "navigate_to_career_gps";
};

/**
 * Keyword-matched scripted responses. Keys are lower-cased intent phrases;
 * matching is substring-based so natural phrasings still land on a script.
 */
export const scriptedResponses: { match: string[]; response: ScriptedResponse }[] = [
  {
    match: ["become an ai engineer", "ai engineer", "career path", "map my"],
    response: {
      text: "Great goal — let me map your path against your Digital Twin. Opening Career GPS…",
      action: "navigate_to_career_gps",
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
      text: "HCLTech covers 100% for AWS certifications. I've pre-filled your reimbursement request — just confirm and I'll submit it. Approval usually takes 3 days.",
      card: {
        type: "form",
        title: "Certification Reimbursement",
        fields: [
          { label: "Employee", value: "Priya Sharma" },
          { label: "Certification", value: "AWS Solutions Architect" },
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

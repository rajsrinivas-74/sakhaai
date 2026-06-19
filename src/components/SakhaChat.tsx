"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Leaf, Send, Target, Ticket } from "lucide-react";
import type { ChatCard, ChatMessage, EmployeeTwin } from "@/types/sakha";
import type { ScriptedResponse } from "@/data/scripted";
import { ACCENT_HEX, accentRgba } from "@/lib/accents";
import { AutonomyBadge, type AutonomyLevel } from "@/components/AutonomyBadge";

let idSeq = 0;
const nextId = () => `msg-${idSeq++}`;

function greeting(twin: EmployeeTwin): ChatMessage {
  const map: Record<string, ChatMessage> = {
    priya: {
      id: nextId(),
      role: "sakha",
      text: "Good morning, Priya. Your delivery portfolio is ready and your AI-900 cert is on record. I noticed your AI Delivery Manager goal from the last check-in — want me to map your path?",
      time: "09:02",
      quickReplies: [
        "I've been in the same role for 4 years. I want to move into AI delivery. What should I do next?",
        "What role should I target next?",
      ],
    },
    arjun: {
      id: nextId(),
      role: "sakha",
      text: "Welcome aboard, Arjun! You're on Day 8 and doing great. I'm tracking your onboarding — anything blocking you today?",
      time: "09:50",
      quickReplies: ["My VPN isn't connecting", "What should I bring on Day 1?"],
    },
    rajan: {
      id: nextId(),
      role: "sakha",
      text: "Hi Rajan. You've put in long hours this week — I'm here whenever you need. I can also help you turn your QA depth into an Automation Architect path.",
      time: "10:24",
      quickReplies: ["Map my Automation Architect path", "How many leaves do I have?"],
    },
  };
  return map[twin.id];
}

export function SakhaChat({
  twin,
  onNavigateCareer,
}: {
  twin: EmployeeTwin;
  onNavigateCareer: (goal: string) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([greeting(twin)]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const persona = useRef(twin.id);

  // Reset thread when the employee changes.
  useEffect(() => {
    if (persona.current !== twin.id) {
      persona.current = twin.id;
      setMessages([greeting(twin)]);
      setTyping(false);
      setInput("");
    }
  }, [twin]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  // Drop the GPS confirm prompt without navigating (employee chose "Not now").
  function dismissGps(id: string) {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, action: undefined } : m)),
    );
    setMessages((prev) => [
      ...prev,
      {
        id: nextId(),
        role: "sakha",
        text: "No problem — whenever you're ready, just say “map my AI delivery path” and I'll open it.",
        time: "now",
      },
    ]);
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setInput("");
    const history = messages
      .slice(-8)
      .map((m) => ({ role: m.role, text: m.text }));
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "employee", text: trimmed, time: "now" },
    ]);
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona: twin.id, message: trimmed, history }),
      });
      const data = (await res.json()) as { response: ScriptedResponse };
      await new Promise((r) => setTimeout(r, 1100));
      const resp = data.response;

      // Role-change query → give an update and ASK before opening GPS.
      // We attach the action to the message so the bubble renders a confirm
      // CTA; navigation only happens when the employee clicks it.
      if (resp.action === "navigate_to_career_gps") {
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: "sakha",
            text: resp.text,
            time: "now",
            action: "navigate_to_career_gps",
            quickReplies: resp.quickReplies,
          },
        ]);
        setTyping(false);
        return;
      }

      // "Considering resigning" — propagate a retention signal to manager + HR.
      if (resp.action === "flag_retention") {
        void fetch("/api/retention-flag", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ persona: twin.id }),
        }).catch(() => {});
      }

      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "sakha",
          text: resp.text,
          time: "now",
          card: resp.card,
          quickReplies: resp.quickReplies,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "sakha",
          text: "I had trouble reaching the service just now — but I'm still here. Try asking about your career path or leave balance.",
          time: "now",
        },
      ]);
    } finally {
      setTyping(false);
    }
  }

  return (
    <div className="surface flex h-full flex-col overflow-hidden">
      <header className="flex items-center gap-3 border-b border-[var(--border)] px-6 py-4">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: accentRgba("blue", 0.16), color: ACCENT_HEX.blue }}
        >
          <Leaf className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Sakha</h2>
          <p className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--ai-cyan)]" />
            Active · monitoring {twin.name}&rsquo;s journey
          </p>
        </div>
      </header>

      <div ref={scrollRef} className="thin-scroll flex-1 space-y-4 overflow-y-auto p-6">
        {messages.map((m) => (
          <Bubble
            key={m.id}
            message={m}
            onQuickReply={send}
            onSelectRole={onNavigateCareer}
            onOpenGps={() => onNavigateCareer(twin.careerGoal)}
            onDismissGps={() => dismissGps(m.id)}
          />
        ))}
        {typing && <Typing />}
      </div>

      <div className="border-t border-[var(--border)] p-4">
        <div className="flex items-center gap-2 rounded-xl attr-card bg-[var(--bg)] px-3 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Ask Sakha anything…"
            className="flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim()}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white disabled:opacity-40"
            style={{ background: ACCENT_HEX.blue }}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Bubble({
  message,
  onQuickReply,
  onSelectRole,
  onOpenGps,
  onDismissGps,
}: {
  message: ChatMessage;
  onQuickReply: (text: string) => void;
  onSelectRole: (goal: string) => void;
  onOpenGps: () => void;
  onDismissGps: () => void;
}) {
  const isSakha = message.role === "sakha";
  const gpsPrompt = message.action === "navigate_to_career_gps";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isSakha ? "justify-start" : "justify-end"}`}
    >
      <div className={`max-w-[86%] ${isSakha ? "" : "items-end"}`}>
        <div
          className="rounded-2xl px-4 py-3 text-sm leading-6"
          style={
            isSakha
              ? { background: "var(--card-hover)", color: "var(--text-primary)" }
              : { background: ACCENT_HEX.blue, color: "#fff" }
          }
        >
          {message.text}
        </div>

        {message.card && <CardView card={message.card} onSelectRole={onSelectRole} />}

        {gpsPrompt && (
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              onClick={onOpenGps}
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-white"
              style={{ background: ACCENT_HEX.purple }}
            >
              <Target className="h-3.5 w-3.5" />
              Open my Career GPS
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onDismissGps}
              className="surface-hover rounded-full border border-[var(--border)] px-3.5 py-1.5 text-xs font-medium text-[var(--text-secondary)]"
            >
              Not now
            </button>
          </div>
        )}

        {message.quickReplies && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.quickReplies.map((q) => (
              <button
                key={q}
                onClick={() => onQuickReply(q)}
                className="surface-hover rounded-full border px-3 py-1 text-xs"
                style={{ borderColor: accentRgba("blue", 0.4), color: ACCENT_HEX.blue }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <p className="mt-1 text-[10px] text-[var(--text-muted)]">{message.time}</p>
      </div>
    </motion.div>
  );
}

function CardView({ card, onSelectRole }: { card: ChatCard; onSelectRole: (goal: string) => void }) {
  if (card.type === "matches") {
    return (
      <div className="mt-2 rounded-xl attr-card bg-[var(--bg)] p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
            <Target className="h-4 w-4 text-[var(--ai-purple)]" />
            {card.title}
          </div>
          <AutonomyBadge level="auto" />
        </div>
        <div className="mt-2 space-y-1.5">
          {card.items.map((m) => {
            const selectable = card.kind === "role";
            return (
              <button
                key={m.label}
                onClick={() => selectable && onSelectRole(m.label)}
                disabled={!selectable}
                className="flex w-full items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-left disabled:cursor-default"
                style={selectable ? { cursor: "pointer" } : undefined}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--text-primary)]">{m.label}</p>
                  <p className="truncate text-[11px] text-[var(--text-secondary)]">{m.sub}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-sm font-bold text-[var(--ai-cyan)]">{m.score}%</span>
                  {selectable && <ArrowUpRight className="h-3.5 w-3.5 text-[var(--ai-purple)]" />}
                </div>
              </button>
            );
          })}
        </div>
        {card.kind === "role" && (
          <p className="mt-2 text-[10px] text-[var(--text-muted)]">Select a role to open it in Career GPS →</p>
        )}
      </div>
    );
  }

  const autonomy: AutonomyLevel = card.type === "ticket" ? "auto" : "approval";
  return (
    <div className="mt-2 rounded-xl attr-card bg-[var(--bg)] p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
          {card.type === "ticket" ? (
            <>
              <Ticket className="h-4 w-4 text-[var(--ai-blue)]" />
              IT Ticket {card.id}
            </>
          ) : (
            card.title
          )}
        </div>
        <AutonomyBadge level={autonomy} />
      </div>

      {card.type === "ticket" ? (
        <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
          <Field label="Status" value={card.status} />
          <Field label="Priority" value={card.priority} />
          <Field label="ETA" value={card.eta} />
        </div>
      ) : (
        <>
          <div className="mt-2 space-y-1.5">
            {card.fields.map((f) => (
              <div key={f.label} className="flex justify-between text-xs">
                <span className="text-[var(--text-muted)]">{f.label}</span>
                <span className="text-[var(--text-primary)]">{f.value}</span>
              </div>
            ))}
          </div>
          <button
            className="mt-3 w-full rounded-lg py-2 text-xs font-semibold text-white"
            style={{ background: ACCENT_HEX.orange }}
          >
            {card.cta}
          </button>
        </>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--border)] p-2">
      <p className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">{label}</p>
      <p className="mt-0.5 text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

function Typing() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1.5 rounded-2xl bg-[var(--card-hover)] px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--text-secondary)]"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>
    </div>
  );
}

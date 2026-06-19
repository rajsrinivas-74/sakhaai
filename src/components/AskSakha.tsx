"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Loader2, Send, Sparkles } from "lucide-react";
import type { AgentId } from "@/types/sakha";
import { ACCENT_HEX, accentRgba } from "@/lib/accents";

export type AskMatch = { label: string; sub?: string; score: number };
export type AskAnswer = { text: string; matches?: AskMatch[]; cta?: string };

/**
 * Natural-language "Ask Sakha" — type a question, an agent reasons and answers
 * with ranked matches and a next action. The responder is deterministic (demo-
 * safe); each persona supplies its own.
 */
export function AskSakha({
  suggestions,
  responder,
  role,
  agent = "workforce",
  placeholder = "Ask Sakha anything…",
  flat = false,
}: {
  suggestions: string[];
  /** Deterministic responder used as a fallback when the live call fails. */
  responder: (q: string) => AskAnswer;
  /** Lens the question is answered for — drives which data the model reasons over. */
  role: "manager" | "hr";
  agent?: AgentId;
  placeholder?: string;
  /** Drop the outer card chrome (for use inside a full panel/view). */
  flat?: boolean;
}) {
  const [q, setQ] = useState("");
  const [thinking, setThinking] = useState(false);
  const [answer, setAnswer] = useState<AskAnswer | null>(null);
  const [source, setSource] = useState<"openai" | "fallback" | null>(null);

  async function ask(question: string) {
    if (!question.trim()) return;
    setQ(question);
    setThinking(true);
    setAnswer(null);
    setSource(null);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, question }),
      });
      const data = (await res.json()) as { answer: AskAnswer; source: "openai" | "fallback" };
      setAnswer(data.answer);
      setSource(data.source);
    } catch {
      // Network/Server failure → deterministic local answer, demo never blocks.
      setAnswer(responder(question));
      setSource("fallback");
    } finally {
      setThinking(false);
    }
  }

  return (
    <div className={flat ? "" : "rounded-xl attr-card bg-[var(--bg)] p-5"}>
      {!flat && (
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
          <Sparkles className="h-4 w-4 text-[var(--ai-cyan)]" />
          Ask Sakha
        </div>
      )}

      <div className={`${flat ? "" : "mt-3"} flex gap-2`}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask(q)}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--ai-cyan)]"
        />
        <button
          onClick={() => ask(q)}
          disabled={!q.trim() || thinking}
          className="inline-flex items-center justify-center rounded-xl px-3.5 py-2.5 text-white disabled:opacity-40"
          style={{ background: ACCENT_HEX.cyan }}
          aria-label="Ask"
        >
          {thinking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => ask(s)}
            className="surface-hover rounded-full border border-[var(--border)] px-3 py-1 text-[11px] text-[var(--text-secondary)]"
          >
            {s}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {answer && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 rounded-xl border p-3"
            style={{ borderColor: accentRgba(agent === "wellbeing" ? "pink" : "cyan", 0.4), background: accentRgba("cyan", 0.06) }}
          >
            {source && (
              <span className="mb-2 inline-block rounded-md border border-[var(--border)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">
                {source === "openai" ? "Live · OpenAI" : "Local model"}
              </span>
            )}
            <p className="text-sm leading-6 text-[var(--text-primary)]">{answer.text}</p>

            {answer.matches && answer.matches.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {answer.matches.map((m) => (
                  <div
                    key={m.label}
                    className="flex items-center justify-between rounded-lg attr-card bg-[var(--bg)] px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[var(--text-primary)]">{m.label}</p>
                      {m.sub && <p className="truncate text-[11px] text-[var(--text-secondary)]">{m.sub}</p>}
                    </div>
                    <span className="shrink-0 text-sm font-bold text-[var(--ai-cyan)]">{m.score}%</span>
                  </div>
                ))}
              </div>
            )}

            {answer.cta && (
              <button
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
                style={{ background: ACCENT_HEX.cyan }}
              >
                {answer.cta}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

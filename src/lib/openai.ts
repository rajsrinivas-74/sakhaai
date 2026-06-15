import OpenAI from "openai";

/**
 * Centralised OpenAI access. The whole app is designed to run beautifully with
 * NO key configured — every caller must provide a deterministic fallback.
 */

export const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o";

export function hasOpenAI(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

let client: OpenAI | null = null;

export function getOpenAI(): OpenAI | null {
  if (!hasOpenAI()) return null;
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

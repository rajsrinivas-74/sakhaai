/**
 * Section → accent mapping, per the AI Orchestrator branding guidelines.
 * Dashboard→Blue, Enterprise→Purple, AI Assets→Cyan, Starter Kit→Pink,
 * Standards→Orange. We map Sakha's sections onto the same restrained palette.
 */
export type Accent = "blue" | "purple" | "cyan" | "pink" | "orange";

export const ACCENT_HEX: Record<Accent, string> = {
  blue: "#3b82a6",
  purple: "#6b5fa7",
  cyan: "#4fa3b8",
  pink: "#c2558f",
  orange: "#d48a3a",
};

/** rgba helper for soft glows / tints (alpha 0-1). */
export function accentRgba(accent: Accent, alpha: number): string {
  const hex = ACCENT_HEX[accent].replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

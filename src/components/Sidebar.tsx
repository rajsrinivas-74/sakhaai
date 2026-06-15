"use client";

import Link from "next/link";
import {
  Compass,
  LayoutDashboard,
  Leaf,
  LogOut,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { EmployeeTwin } from "@/types/sakha";
import { ACCENT_HEX, accentRgba, type Accent } from "@/lib/accents";

export type View = "chat" | "career" | "manager";

type NavItem = { id: View; label: string; icon: typeof MessageCircle; accent: Accent };

const EMPLOYEE_NAV: NavItem[] = [
  { id: "chat", label: "Sakha Chat", icon: MessageCircle, accent: "blue" },
  { id: "career", label: "Career GPS", icon: Compass, accent: "purple" },
];

const MANAGER_NAV: NavItem[] = [
  { id: "manager", label: "Manager Copilot", icon: LayoutDashboard, accent: "cyan" },
];

const STAGE_ACCENT: Record<string, Accent> = {
  blue: "blue",
  green: "cyan",
  orange: "orange",
};

type Identity = { name: string; role: string; stage: string; initial: string; accent: Accent };

function getIdentity(isManager: boolean, twin: EmployeeTwin | null): Identity {
  if (isManager) {
    return { name: "Vikram Nair", role: "Delivery Manager", stage: "Manager view", initial: "V", accent: "blue" };
  }
  if (twin) {
    return {
      name: twin.fullName,
      role: twin.role,
      stage: twin.stage,
      initial: twin.name.slice(0, 1),
      accent: STAGE_ACCENT[twin.stageColor] ?? "blue",
    };
  }
  return { name: "—", role: "", stage: "", initial: "?", accent: "blue" };
}

/* ── Desktop sidebar (lg and up) ───────────────────────────────────────── */
export function Sidebar({
  isManager,
  twin,
  view,
  onView,
}: {
  isManager: boolean;
  twin: EmployeeTwin | null;
  view: View;
  onView: (v: View) => void;
}) {
  const identity = getIdentity(isManager, twin);
  const nav = isManager ? MANAGER_NAV : EMPLOYEE_NAV;

  return (
    <aside className="surface flex h-full flex-col gap-6 p-5" style={{ background: "var(--sidebar)" }}>
      <Link href="/" className="flex items-center gap-3">
        <div className="brand-gradient flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg">
          <Leaf className="h-6 w-6" />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
            HCLTech · OpenAI
          </p>
          <h1 className="text-xl font-semibold tracking-tight brand-text">Sakha AI</h1>
        </div>
      </Link>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Signed in as
        </p>
        <div
          className="flex items-center gap-3 rounded-xl border px-3 py-2.5"
          style={{ borderColor: accentRgba(identity.accent, 0.4), background: accentRgba(identity.accent, 0.1) }}
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold"
            style={{ background: accentRgba(identity.accent, 0.2), color: ACCENT_HEX[identity.accent] }}
          >
            {identity.initial}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-[var(--text-primary)]">
              {identity.name}
            </span>
            <span className="block truncate text-xs text-[var(--text-secondary)]">
              {identity.stage}
            </span>
          </span>
        </div>
        <Link
          href="/"
          className="surface-hover mt-2 flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]"
        >
          <LogOut className="h-3.5 w-3.5" />
          Switch user · via SSO
        </Link>
      </div>

      <nav className="space-y-1">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Workspace
        </p>
        {nav.map((item) => (
          <NavButton key={item.id} item={item} active={view === item.id} onClick={() => onView(item.id)} />
        ))}
      </nav>

      <div className="mt-auto rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="flex items-center gap-2 text-[var(--ai-cyan)]">
          <ShieldCheck className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.16em]">
            {isManager ? "Manager access" : "Private to you"}
          </span>
        </div>
        <p className="mt-2 text-xs leading-5 text-[var(--text-secondary)]">
          {isManager
            ? "Managers see team-level signals — not individual chats or Digital Twins."
            : "You only see your own Digital Twin. Switching identity re-authenticates via SSO."}
        </p>
      </div>
    </aside>
  );
}

/* ── Mobile top bar (below lg) ─────────────────────────────────────────── */
export function MobileBar({
  isManager,
  twin,
  view,
  onView,
  onOpenTwin,
}: {
  isManager: boolean;
  twin: EmployeeTwin | null;
  view: View;
  onView: (v: View) => void;
  onOpenTwin: () => void;
}) {
  const identity = getIdentity(isManager, twin);
  const nav = isManager ? MANAGER_NAV : EMPLOYEE_NAV;

  return (
    <div className="surface flex flex-col gap-2.5 p-2.5" style={{ background: "var(--sidebar)" }}>
      <div className="flex items-center gap-2.5">
        <Link
          href="/"
          className="brand-gradient flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white"
        >
          <Leaf className="h-5 w-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{identity.name}</p>
          <p className="truncate text-[11px] text-[var(--text-secondary)]">{identity.stage}</p>
        </div>
        {!isManager && twin && (
          <button
            onClick={onOpenTwin}
            className="surface-hover inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-2.5 py-2 text-xs font-medium text-[var(--text-secondary)]"
          >
            <Sparkles className="h-3.5 w-3.5 text-[var(--ai-cyan)]" />
            Twin
          </button>
        )}
        <Link
          href="/"
          aria-label="Switch user"
          className="surface-hover flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)]"
        >
          <LogOut className="h-4 w-4" />
        </Link>
      </div>

      {nav.length > 1 && (
        <div className="grid grid-cols-2 gap-1.5">
          {nav.map((item) => {
            const active = view === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onView(item.id)}
                className="flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold"
                style={{
                  color: active ? "var(--text-primary)" : "var(--text-secondary)",
                  background: active ? accentRgba(item.accent, 0.14) : "var(--card)",
                  border: `1px solid ${active ? accentRgba(item.accent, 0.5) : "var(--border)"}`,
                }}
              >
                <Icon className="h-3.5 w-3.5" style={{ color: active ? ACCENT_HEX[item.accent] : "currentColor" }} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function NavButton({ item, active, onClick }: { item: NavItem; active: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className="surface-hover flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium"
      style={{
        color: active ? "var(--text-primary)" : "var(--text-secondary)",
        background: active ? accentRgba(item.accent, 0.12) : "transparent",
        boxShadow: active ? `inset 2px 0 0 ${ACCENT_HEX[item.accent]}` : "none",
      }}
    >
      <Icon className="h-4 w-4" style={{ color: active ? ACCENT_HEX[item.accent] : "currentColor" }} />
      {item.label}
    </button>
  );
}

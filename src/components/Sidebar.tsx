"use client";

import Link from "next/link";
import {
  BadgeCheck,
  Briefcase,
  Compass,
  GraduationCap,
  HeartPulse,
  LayoutDashboard,
  Layers,
  LineChart,
  LogOut,
  MessageCircle,
  MessagesSquare,
  Network,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import type { EmployeeTwin } from "@/types/sakha";
import { ACCENT_HEX, accentRgba, type Accent } from "@/lib/accents";
import { SakhaLogo } from "@/components/SakhaLogo";

export type View =
  // Employee — under "Career GPS"
  | "emp-overview"
  | "chat"
  | "career"
  | "emp-performance"
  | "emp-growth"
  | "emp-opportunities"
  // Manager — under "Manager Copilot"
  | "mgr-overview"
  | "mgr-team"
  | "mgr-performance"
  | "mgr-retention"
  | "mgr-scenarios"
  // Capability Manager — under "Workforce Intelligence"
  | "hr-overview"
  | "hr-demand"
  | "hr-capability"
  | "hr-buildbuy"
  | "hr-talent"
  // shared
  | "ask";

export type Role = "employee" | "manager" | "hr";

type SubItem = { id: View; label: string; icon: typeof MessageCircle };
type NavGroup = { feature: string; icon: typeof Compass; accent: Accent; items: SubItem[] };

export const NAV_FOR: Record<Role, NavGroup> = {
  employee: {
    feature: "Career GPS",
    icon: Compass,
    accent: "purple",
    items: [
      { id: "emp-overview", label: "Overview", icon: LayoutDashboard },
      { id: "chat", label: "Sakha Chat", icon: MessageCircle },
      { id: "career", label: "Roadmap", icon: Route },
      { id: "emp-performance", label: "My Performance", icon: Target },
      { id: "emp-growth", label: "Growth & Learning", icon: GraduationCap },
      { id: "emp-opportunities", label: "Opportunities", icon: Briefcase },
    ],
  },
  manager: {
    feature: "Manager Copilot",
    icon: LayoutDashboard,
    accent: "cyan",
    items: [
      { id: "mgr-overview", label: "Overview", icon: LayoutDashboard },
      { id: "mgr-team", label: "Team & Readiness", icon: Users },
      { id: "mgr-performance", label: "Performance & KPP", icon: LineChart },
      { id: "mgr-retention", label: "Retention", icon: HeartPulse },
      { id: "mgr-scenarios", label: "Scenarios", icon: Sparkles },
      { id: "ask", label: "Ask Sakha", icon: MessagesSquare },
    ],
  },
  hr: {
    feature: "Workforce Intelligence",
    icon: Network,
    accent: "blue",
    items: [
      { id: "hr-overview", label: "Overview", icon: LayoutDashboard },
      { id: "hr-demand", label: "Demand & Programs", icon: Layers },
      { id: "hr-capability", label: "Capability", icon: BadgeCheck },
      { id: "hr-buildbuy", label: "Build vs Buy", icon: LineChart },
      { id: "hr-talent", label: "Talent & Retention", icon: Users },
      { id: "ask", label: "Ask Sakha", icon: MessagesSquare },
    ],
  },
};

/** Default landing section per role. Employee keeps Chat as the golden-path entry. */
export const DEFAULT_VIEW: Record<Role, View> = {
  employee: "emp-overview",
  manager: "mgr-overview",
  hr: "hr-overview",
};

const STAGE_ACCENT: Record<string, Accent> = { blue: "blue", green: "cyan", orange: "orange" };

type Identity = { name: string; role: string; stage: string; initial: string; accent: Accent };

function getIdentity(role: Role, twin: EmployeeTwin | null): Identity {
  if (role === "hr") {
    return { name: "Anita Desai", role: "Capability Manager", stage: "Workforce view", initial: "A", accent: "blue" };
  }
  if (role === "manager") {
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
  role,
  twin,
  view,
  onView,
}: {
  role: Role;
  twin: EmployeeTwin | null;
  view: View;
  onView: (v: View) => void;
}) {
  const identity = getIdentity(role, twin);
  const group = NAV_FOR[role];
  const isEmployee = role === "employee";
  const FeatureIcon = group.icon;

  return (
    <aside className="surface flex h-full flex-col gap-6 p-5" style={{ background: "var(--sidebar)" }}>
      <Link href="/" className="flex flex-col items-start gap-1.5">
        <SakhaLogo className="h-12 w-auto" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
          HCLTech · OpenAI
        </p>
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
            <span className="block truncate text-sm font-medium text-[var(--text-primary)]">{identity.name}</span>
            <span className="block truncate text-xs text-[var(--text-secondary)]">{identity.stage}</span>
          </span>
        </div>
        <Link
          href="/"
          className="mt-2 flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold text-[var(--text-primary)] transition hover:brightness-110"
          style={{ background: accentRgba("blue", 0.16), borderColor: accentRgba("blue", 0.55) }}
        >
          <LogOut className="h-3.5 w-3.5" style={{ color: ACCENT_HEX.blue }} />
          Switch user · via SSO
        </Link>
      </div>

      {/* FLAGSHIP FEATURE + nested sub-menu */}
      <nav className="min-h-0 flex-1 overflow-y-auto">
        <div
          className="mb-2 flex items-center gap-2 rounded-lg px-2 py-1.5"
          style={{ background: accentRgba(group.accent, 0.1) }}
        >
          <FeatureIcon className="h-4 w-4" style={{ color: ACCENT_HEX[group.accent] }} />
          <span className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: ACCENT_HEX[group.accent] }}>
            {group.feature}
          </span>
        </div>
        <div className="space-y-0.5 border-l border-[var(--border)] pl-2">
          {group.items.map((item) => (
            <SubButton key={item.id} item={item} accent={group.accent} active={view === item.id} onClick={() => onView(item.id)} />
          ))}
        </div>
      </nav>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="flex items-center gap-2 text-[var(--ai-cyan)]">
          <ShieldCheck className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.16em]">
            {isEmployee ? "Private to you" : role === "hr" ? "Capability access" : "Manager access"}
          </span>
        </div>
        <p className="mt-2 text-xs leading-5 text-[var(--text-secondary)]">
          {isEmployee
            ? "You only see your own Digital Twin. Switching identity re-authenticates via SSO."
            : role === "hr"
              ? "Capability Managers see aggregated workforce signals — not individual chats or Digital Twins."
              : "Managers see team-level signals — not individual chats or Digital Twins."}
        </p>
      </div>
    </aside>
  );
}

function SubButton({ item, accent, active, onClick }: { item: SubItem; accent: Accent; active: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className="surface-hover flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium"
      style={{
        color: active ? "var(--text-primary)" : "var(--text-secondary)",
        background: active ? accentRgba(accent, 0.12) : "transparent",
        boxShadow: active ? `inset 2px 0 0 ${ACCENT_HEX[accent]}` : "none",
      }}
    >
      <Icon className="h-3.5 w-3.5" style={{ color: active ? ACCENT_HEX[accent] : "currentColor" }} />
      {item.label}
    </button>
  );
}

/* ── Mobile top bar (below lg) ─────────────────────────────────────────── */
export function MobileBar({
  role,
  twin,
  view,
  onView,
  onOpenTwin,
}: {
  role: Role;
  twin: EmployeeTwin | null;
  view: View;
  onView: (v: View) => void;
  onOpenTwin: () => void;
}) {
  const identity = getIdentity(role, twin);
  const group = NAV_FOR[role];
  const isEmployee = role === "employee";

  return (
    <div className="surface flex flex-col gap-2.5 p-2.5" style={{ background: "var(--sidebar)" }}>
      <div className="flex items-center gap-2.5">
        <Link href="/" className="flex shrink-0 items-center">
          <SakhaLogo className="h-8 w-auto" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{identity.name}</p>
          <p className="truncate text-[11px] text-[var(--text-secondary)]">{group.feature}</p>
        </div>
        {isEmployee && twin && (
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

      <div className="thin-scroll flex gap-1.5 overflow-x-auto pb-1">
        {group.items.map((item) => {
          const active = view === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onView(item.id)}
              className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold"
              style={{
                color: active ? "var(--text-primary)" : "var(--text-secondary)",
                background: active ? accentRgba(group.accent, 0.14) : "var(--card)",
                border: `1px solid ${active ? accentRgba(group.accent, 0.5) : "var(--border)"}`,
              }}
            >
              <Icon className="h-3.5 w-3.5" style={{ color: active ? ACCENT_HEX[group.accent] : "currentColor" }} />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

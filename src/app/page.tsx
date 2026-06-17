"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Compass,
  GraduationCap,
  HeartPulse,
  LayoutDashboard,
  MessageCircle,
  Rocket,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ACCENT_HEX, accentRgba, type Accent } from "@/lib/accents";
import { SakhaLogo } from "@/components/SakhaLogo";

const STACK = [
  "OpenAI",
  "Microsoft Teams",
  "Azure AD SSO",
  "ServiceNow",
  "Workday",
  "Degreed",
];

type PersonaCard = {
  initial: string;
  name: string;
  persona: string;
  role: string;
  tag: string;
  scenario: string;
  does: string;
  accent: Accent;
  href: string;
  cta: string;
};

const PERSONAS: PersonaCard[] = [
  {
    initial: "P",
    name: "Priya",
    persona: "Employee",
    role: "Java Developer → AI Engineer",
    tag: "Lateral hire · Month 3",
    scenario: "“How do I become an AI Engineer?”",
    does: "Career GPS maps an 86-day path, enrols her, and surfaces 3 internal roles — with an 88% success probability.",
    accent: "purple",
    href: "/app?persona=priya&view=career",
    cta: "Open Career GPS",
  },
  {
    initial: "V",
    name: "Vikram",
    persona: "Manager",
    role: "Delivery Manager",
    tag: "Manager view",
    scenario: "Team health 84% ↓",
    does: "Manager Copilot surfaces attrition risk, active onboarding, and certifications — with suggested next actions.",
    accent: "blue",
    href: "/app?view=manager",
    cta: "Open Manager Copilot",
  },
  {
    initial: "A",
    name: "Anita",
    persona: "Capability Manager",
    role: "Capability Manager",
    tag: "Workforce view",
    scenario: "AI demand 92 vs supply 38",
    does: "Workforce Intelligence shows the org's skill demand-vs-supply, triages reskilling candidates, and drafts retention moves — Priya included.",
    accent: "blue",
    href: "/app?view=hr",
    cta: "Open Workforce Intelligence",
  },
];

type Feature = {
  icon: typeof Compass;
  title: string;
  desc: string;
  accent: Accent;
};

const FEATURES: Feature[] = [
  {
    icon: Compass,
    title: "Career GPS",
    desc: "Readiness score, prioritised skill gaps, a day-by-day roadmap, success probability, and matching internal roles — generated against the Digital Twin.",
    accent: "purple",
  },
  {
    icon: MessageCircle,
    title: "Sakha Chat",
    desc: "A companion that speaks first. Scripted golden flows plus live OpenAI answers, with ticket and reimbursement actions handled inline.",
    accent: "blue",
  },
  {
    icon: Sparkles,
    title: "Employee Digital Twin",
    desc: "A living profile every agent reads and writes — skills, goals, learning, wellbeing, leave. It updates visibly as Sakha takes action.",
    accent: "cyan",
  },
  {
    icon: LayoutDashboard,
    title: "Manager Copilot",
    desc: "Weekly team intelligence — health trend, attrition risk, onboarding trackers, and certifications, each with a suggested next step.",
    accent: "blue",
  },
  {
    icon: Bell,
    title: "Proactive Notifications",
    desc: "Sakha reaches out first — welcome checklists, Day-1 unblockers, and wellbeing check-ins — before friction is ever felt.",
    accent: "orange",
  },
  {
    icon: ShieldCheck,
    title: "Human-in-the-Loop Governance",
    desc: "Every action carries an autonomy badge — autonomous, consented, or needs approval — and is logged to the audit trail.",
    accent: "pink",
  },
];

const LOOP = [
  { icon: HeartPulse, label: "Observe", desc: "Signals across the lifecycle" },
  { icon: Sparkles, label: "Reason", desc: "Against the Digital Twin" },
  { icon: BriefcaseBusiness, label: "Act", desc: "Tickets, enrolments, nudges" },
  { icon: GraduationCap, label: "Learn", desc: "Write back, get sharper" },
];

export default function Home() {
  return (
    <div className="app-ambient min-h-screen">
      <Nav />

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-5 pt-8 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
            <span className="brand-text font-semibold">सखा</span>
            HCLTech × OpenAI · Agentic AI Hackathon · Track 2
          </span>

          <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight text-[var(--text-primary)] sm:text-6xl">
            Sakha AI
            <span className="mt-1 block brand-text text-3xl sm:text-5xl">
              The Employee Success Operating System
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-[var(--text-secondary)] sm:text-xl">
            From Employee Goals to Workforce Transformation.
          </p>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--text-muted)]">
            Choose a role to enter the live workspace.
          </p>
        </motion.div>

        {/* PERSONA LAUNCH CARDS — the three doors in */}
        <div id="personas" className="mt-7 grid scroll-mt-20 gap-4 sm:grid-cols-3">
          {PERSONAS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.06}>
              <Link
                href={p.href}
                className="surface surface-hover group flex h-full flex-col p-5"
                style={{ borderColor: accentRgba(p.accent, 0.4) }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-semibold"
                    style={{ background: accentRgba(p.accent, 0.18), color: ACCENT_HEX[p.accent] }}
                  >
                    {p.initial}
                  </span>
                  <div className="min-w-0 text-left">
                    <p className="text-base font-semibold text-[var(--text-primary)]">{p.name}</p>
                    <p
                      className="text-[11px] font-semibold uppercase tracking-[0.16em]"
                      style={{ color: ACCENT_HEX[p.accent] }}
                    >
                      {p.persona}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-left text-sm font-medium text-[var(--text-primary)]">{p.scenario}</p>
                <p className="mt-1.5 flex-1 text-left text-xs leading-5 text-[var(--text-secondary)]">{p.does}</p>
                <span
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold transition group-hover:gap-2.5"
                  style={{ color: ACCENT_HEX[p.accent] }}
                >
                  {p.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
          New here?{" "}
          <Link href="/app?persona=priya&view=career" className="font-semibold text-[var(--ai-purple)] hover:underline">
            Start with Priya&rsquo;s journey →
          </Link>{" "}
          · Runs with no API key, fully demo-safe.
        </p>

        <HeroPreview />

        {/* Logo / stack strip */}
        <div className="mt-14">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Built on OpenAI · designed to integrate with the enterprise stack
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            {STACK.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]"
              >
                <Building2 className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <Section
        id="features"
        eyebrow="The product"
        title="Key capabilities"
        subtitle="A three-agent MVP — Onboarding, Career GPS, and HR & Benefits — over a shared Employee Digital Twin."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={i * 0.05}>
                <div className="surface surface-hover h-full p-5">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ background: accentRgba(f.accent, 0.16), color: ACCENT_HEX[f.accent] }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-[var(--text-primary)]">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{f.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* AGENTIC LOOP */}
      <Section
        eyebrow="How it works"
        title="Stateless agents. A persistent Digital Twin."
        subtitle="Agents spin up on demand, reason over the Twin, act, write back, and terminate. The memory lives in the data — not the agent."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LOOP.map((l, i) => {
            const Icon = l.icon;
            return (
              <Reveal key={l.label} delay={i * 0.06}>
                <div className="surface flex h-full items-start gap-3 p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--card-hover)] text-[var(--ai-cyan)]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      {i + 1}. {l.label}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">{l.desc}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* CTA BAND */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <Reveal>
          <div
            className="surface relative overflow-hidden p-8 text-center sm:p-12"
            style={{ borderColor: accentRgba("purple", 0.4) }}
          >
            <div
              className="absolute inset-x-0 top-0 h-1 brand-gradient"
              aria-hidden
            />
            <h2 className="mx-auto max-w-2xl text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
              See Sakha answer the one question every employee asks.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--text-secondary)]">
              “What should I do next in my career?” — answered live, in seconds, with the path
              already in motion.
            </p>
            <Link
              href="/app?persona=priya&view=career"
              className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white glow-purple"
              style={{ background: ACCENT_HEX.purple }}
            >
              Launch the demo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}

function HeroPreview() {
  const roadmap = [
    { icon: BookOpen, label: "Learn EU AI Act" },
    { icon: GraduationCap, label: "Certification" },
    { icon: Rocket, label: "Governance project" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.15 }}
      className="surface mx-auto mt-12 max-w-3xl overflow-hidden glow-purple"
    >
      {/* faux app chrome */}
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          {[ACCENT_HEX.pink, ACCENT_HEX.orange, ACCENT_HEX.cyan].map((c) => (
            <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
          ))}
        </div>
        <span className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
          <Compass className="h-3.5 w-3.5 text-[var(--ai-purple)]" />
          Sakha · Career GPS
        </span>
        <span className="rounded-md border border-[var(--border)] px-2 py-0.5 text-[10px] text-[var(--text-muted)]">
          Live · OpenAI
        </span>
      </div>

      <div className="grid gap-5 p-5 text-left sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="flex items-center gap-4">
          <PreviewRing value={72} />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Your destination
            </p>
            <p className="text-lg font-bold text-[var(--text-primary)]">AI Governance Consultant</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
              Senior QA Engineer
              <ArrowRight className="h-3 w-3 text-[var(--ai-purple)]" />
              Governance
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div
            className="rounded-lg border p-2.5 text-xs leading-5 text-[var(--text-primary)]"
            style={{ borderColor: accentRgba("cyan", 0.4), background: accentRgba("cyan", 0.08) }}
          >
            <Sparkles className="mr-1.5 inline h-3.5 w-3.5 text-[var(--ai-cyan)]" />
            <span className="font-semibold text-[var(--ai-cyan)]">88% probability</span> of reaching
            this role within 3 months.
          </div>

          <div className="flex flex-wrap gap-1.5">
            {roadmap.map((r) => {
              const Icon = r.icon;
              return (
                <span
                  key={r.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1 text-[11px] text-[var(--text-secondary)]"
                >
                  <Icon className="h-3 w-3 text-[var(--ai-purple)]" />
                  {r.label}
                </span>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-[var(--text-secondary)]">
            {["Course enrolled", "Calendar blocked", "Mentor suggested"].map((a) => (
              <span key={a} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--ai-cyan)]" />
                {a}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PreviewRing({ value }: { value: number }) {
  const R = 34;
  const C = 2 * Math.PI * R;
  const arc = (C * value) / 100;
  return (
    <div className="relative h-20 w-20 shrink-0">
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <circle cx="40" cy="40" r={R} fill="none" stroke="var(--border)" strokeWidth="7" />
        <circle
          cx="40"
          cy="40"
          r={R}
          fill="none"
          stroke={ACCENT_HEX.purple}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${arc} ${C - arc}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-[var(--text-primary)]">{value}%</span>
        <span className="text-[9px] text-[var(--text-muted)]">ready</span>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_85%,transparent)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link href="/" className="flex items-center">
          <SakhaLogo className="h-9 w-auto" />
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-[var(--text-secondary)] sm:flex">
          <a href="#personas" className="transition hover:text-[var(--text-primary)]">
            Personas
          </a>
          <a href="#features" className="transition hover:text-[var(--text-primary)]">
            Features
          </a>
          <Link
            href="/app"
            className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold text-white"
            style={{ background: ACCENT_HEX.purple }}
          >
            Launch demo
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </nav>
        <Link
          href="/app"
          className="rounded-lg px-3.5 py-2 text-sm font-semibold text-white sm:hidden"
          style={{ background: ACCENT_HEX.purple }}
        >
          Launch
        </Link>
      </div>
    </header>
  );
}

function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl scroll-mt-20 px-5 py-12">
      <Reveal>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--ai-cyan)]">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
          {title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">{subtitle}</p>
      </Reveal>
      <div className="mt-7">{children}</div>
    </section>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay }}
    >
      {children}
    </motion.div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-center text-xs text-[var(--text-muted)] sm:flex-row sm:text-left">
        <p>
          🌿 Sakha AI — From Offer Letter to Alumni Network, One Trusted Companion · HCLTech ×
          OpenAI Hackathon, Track 2
        </p>
        <p>Rajesh Srinivasan · Employee ID 51626927</p>
      </div>
    </footer>
  );
}

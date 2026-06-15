import { CheckCircle2, ShieldCheck, UserCheck } from "lucide-react";

/**
 * Human-in-the-loop indicator on Sakha actions. Maps to the governance story:
 * - auto: Sakha acted autonomously (logged to audit trail)
 * - consented: action taken under standing employee consent
 * - approval: waiting for explicit human confirmation
 */
export type AutonomyLevel = "auto" | "consented" | "approval";

const CONFIG: Record<
  AutonomyLevel,
  { label: string; color: string; icon: typeof ShieldCheck }
> = {
  auto: { label: "Autonomous · logged", color: "#3b82a6", icon: ShieldCheck },
  consented: { label: "Under your consent", color: "#4fa3b8", icon: CheckCircle2 },
  approval: { label: "Needs your approval", color: "#d48a3a", icon: UserCheck },
};

export function AutonomyBadge({ level }: { level: AutonomyLevel }) {
  const { label, color, icon: Icon } = CONFIG[level];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
      style={{ background: `${color}1f`, color }}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

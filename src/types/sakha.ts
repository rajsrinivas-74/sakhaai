export type PersonaId = "priya" | "arjun" | "rajan";

export type WellbeingTrend = "stable" | "watch" | "risk";

/** Dreyfus model of skill acquisition. */
export type DreyfusLevel =
  | "Novice"
  | "Advanced Beginner"
  | "Competent"
  | "Proficient"
  | "Expert";

export const DREYFUS_ORDER: DreyfusLevel[] = [
  "Novice",
  "Advanced Beginner",
  "Competent",
  "Proficient",
  "Expert",
];

/** A career Mission — a goal with a deadline that Sakha works toward continuously. */
export type Mission = {
  title: string; // "AI Engineer"
  deadline: string; // "Dec 2026"
  successProbability: number; // 0-100
  targetReadiness: number; // 0-100
};

/** A recommended learning track on the employee's path. */
export type Track = {
  name: string; // "AI", "Java Full Stack", "DevOps"
  focus: string;
  progress: number; // 0-100
  primary?: boolean;
};

type HealthBand = "Low" | "Moderate" | "Good" | "Excellent";

/** Executive-readable career fitness, like a fitness tracker. */
export type CareerHealth = {
  score: number; // 0-100
  growthVelocity: HealthBand;
  marketRelevance: HealthBand;
  promotionReadiness: HealthBand;
};

/** A single Key Performance Parameter from the HCLTech appraisal format. */
export type Kpp = {
  /** e.g. "Revenue", "Gross Margin", "Customer Satisfaction (CSAT)". */
  name: string;
  category: "Customer" | "Financial" | "Operations" | "Learning";
  /** Weight in the appraisal, as a percentage. */
  weight: number;
  /** Target, kept as a display string ("80", "2.8M", "30%"). */
  target: string;
  /** Achievement, kept as a display string ("78", "2.4M", "22%"). */
  achievement: string;
  /** Score out of 10. */
  score: number;
  /** How this KPP reads as a Career GPS signal. */
  signal: string;
  /** Direction vs target — drives colour. */
  status: "ahead" | "ontrack" | "behind";
};

/** One axis of promotion readiness, scored against its target. */
export type PromotionDimension = {
  label: string;
  /** Current attainment, as a percentage of target (can exceed 100). */
  current: number;
  status: "exceeds" | "ontrack" | "development" | "critical";
};

/** Promotion-readiness rollup Sakha computes from KPP + Career GPS progress. */
export type PromotionReadiness = {
  /** Overall readiness today, 0-100. */
  overall: number;
  /** Readiness target for the next window. */
  target: number;
  /** Days to reach the target with the active plan. */
  targetWindowDays: number;
  dimensions: PromotionDimension[];
};

/** One section of the self-assessment Sakha auto-drafts from the Twin. */
export type SelfAssessmentSection = {
  heading: string;
  body: string;
};

/** Manager feedback on file — an input Career GPS reasons over. */
export type ManagerFeedback = {
  /** Manager who gave it, e.g. "Vikram Nair". */
  from: string;
  date: string;
  /** Overall read, used to colour and weight the signal. */
  sentiment: "positive" | "constructive" | "watch";
  /** One-line summary of the latest review/check-in. */
  summary: string;
  strengths: string[];
  developmentAreas: string[];
};

export type EmployeeTwin = {
  id: PersonaId;
  name: string;
  fullName: string;
  employeeId: string;
  role: string;
  /** Career level, e.g. "E4". */
  level?: string;
  /** Highest qualification, e.g. "B.Tech — Information Technology". */
  education?: string;
  band: number;
  stage: string;
  stageColor: "blue" | "green" | "orange";
  manager: string;
  location: string;
  yearsExp: number;
  daysAtCompany: number;
  skills: string[];
  certifications: string[];
  projects: string[];
  currentProject: string | null;
  careerGoal: string;
  /** Overall Dreyfus competency for the employee's current discipline. */
  dreyfus?: DreyfusLevel;
  /** The active career Mission Sakha is working toward. */
  mission?: Mission;
  /** Recommended learning tracks on the path to the mission. */
  tracks?: Track[];
  /** Executive career-health snapshot. */
  careerHealth?: CareerHealth;
  /** KPP appraisal record — the performance data Career GPS reasons over. */
  kpps?: Kpp[];
  /** Overall appraisal rating, e.g. "Consistently Meets Expectations". */
  overallRating?: string;
  /** Promotion-readiness rollup, scored against the next-level target. */
  promotion?: PromotionReadiness;
  /** Self-assessment Sakha auto-drafts from the achievement log + KPP data. */
  selfAssessment?: SelfAssessmentSection[];
  /** Latest manager feedback on file — an input Career GPS reasons over. */
  managerFeedback?: ManagerFeedback;
  learning?: {
    currentCourse: string;
    completion: number;
    hoursPerWeek: number;
  };
  leaveBalance: {
    casual: number;
    sick: number;
    earned: number;
    optional: number;
  };
  wellbeing: {
    pulseScore: number;
    consecutiveLateNights: number;
    trend: WellbeingTrend;
    lastCheckin: string | null;
  };
  lastKudos: string;
};

export type SkillGap = {
  skill: string;
  priority: number;
  monthToAcquire: number;
  recommendedCourse: string;
  estimatedHoursPerWeek: number;
};

export type LearningMilestone = {
  month: number;
  skill: string;
  milestone: string;
};

export type RoleMatch = {
  title: string;
  team: string;
  match: number;
};

export type CareerGpsResult = {
  matchPercentage: number;
  readinessDays: number;
  /** Modelled probability of reaching the goal within the readiness window. */
  successProbability?: number;
  sakhaMessage: string;
  missingSkills: SkillGap[];
  learningPath: LearningMilestone[];
  openRoles: RoleMatch[];
  nextAction: string;
};

export type ChatCard =
  | {
      type: "ticket";
      id: string;
      status: string;
      priority: string;
      eta: string;
    }
  | {
      type: "form";
      title: string;
      fields: { label: string; value: string }[];
      cta: string;
    }
  | {
      type: "matches";
      title: string;
      /** "role" items navigate into Career GPS when selected. */
      kind: "role" | "project";
      items: { label: string; sub: string; score: number }[];
    };

export type ChatMessage = {
  id: string;
  role: "sakha" | "employee";
  text: string;
  time: string;
  card?: ChatCard;
  quickReplies?: string[];
  /** Marks a message that should route the demo into Career GPS. */
  action?: "navigate_to_career_gps" | "flag_retention";
};

export type ProactiveNotification = {
  persona: PersonaId;
  time: string;
  tone: "welcome" | "urgent" | "gentle";
  title: string;
  message: string;
  actions: { label: string }[];
};

/* ── Workforce / HR layer ──────────────────────────────────────────────────
 * The shared model that lets one employee event read consistently across the
 * Employee, Manager, and HR lenses. HR (Anita) reads the org-level rollup. */

/** A skill family with org demand (open need) vs supply (ready people). */
export type SkillDemand = {
  family: string;
  /** Open roles / project demand, indexed 0-100. */
  demand: number;
  /** Workforce readiness / supply, indexed 0-100. */
  supply: number;
  /** Direction of demand over the last two quarters. */
  trend: "rising" | "steady" | "cooling";
  /** People actively reskilling into this family right now. */
  inTransition: number;
};

/** A workforce segment Sakha groups employees into (HR triage lens). */
export type WorkforceSegment =
  | "reskilling"
  | "stagnant"
  | "flight-risk"
  | "rising";

export type WorkforceSignal = {
  segment: WorkforceSegment;
  label: string;
  count: number;
  /** Persona ids in this segment, when they map to known employees. */
  members: PersonaId[];
  note: string;
};

/** An HR-level action Sakha recommends, drafted for Anita's approval. */
export type HrAction = {
  id: string;
  title: string;
  rationale: string;
  /** Who this action is about, when it maps to a known employee. */
  about?: PersonaId;
  impact: "retention" | "mobility" | "reskilling" | "cost";
  verb: "Approve" | "Align" | "Prioritise";
  draftTitle: string;
  draft: string;
  accent: "blue" | "purple" | "cyan" | "pink" | "orange";
};

export type HrInsights = {
  hrPartner: string;
  /** HR partner's title, e.g. "Chief People Officer". */
  hrPartnerTitle?: string;
  asOf: string;
  /** Headline org metrics. */
  aiReadiness: number;
  attritionRiskPct: number;
  internalFillRate: number;
  openCriticalRoles: number;
  /** 5-point AI-readiness trend for the sparkline. */
  readinessTrend: number[];
  skillDemand: SkillDemand[];
  signals: WorkforceSignal[];
  actions: HrAction[];
  /** One narrative line Sakha leads with — model-generated when live. */
  headline: string;
};

/* ── Agent fabric ──────────────────────────────────────────────────────────
 * Sakha is a fleet of cooperating agents, not one chatbot. These types drive
 * the visible "agents at work" UI: named agents, live activity, and handoffs. */

export type AgentId =
  | "career"
  | "learning"
  | "opportunity"
  | "workforce"
  | "manager"
  | "wellbeing";

/** Which lens an event belongs to, for the unified cross-persona timeline. */
export type AgentPhase = "employee" | "manager" | "hr";

export type AgentDef = {
  id: AgentId;
  name: string;
  /** One-line remit, shown on hover / in the fleet view. */
  remit: string;
  accent: "blue" | "purple" | "cyan" | "pink" | "orange";
};

export type AgentStatus = "idle" | "watching" | "thinking" | "acting" | "done" | "handoff";

/** One entry in the live agent activity stream / unified timeline. */
export type AgentEvent = {
  id: string;
  agent: AgentId;
  status: AgentStatus;
  /** What the agent is doing, present tense. */
  action: string;
  /** Optional measured detail, e.g. "5 skills · 0.8s" or "→ Workforce Agent". */
  detail?: string;
  /** Persona this event concerns, when applicable. */
  about?: PersonaId;
  /** Wall-clock label for the stream. */
  time: string;
  /** Set when this event hands work to another agent. */
  handoffTo?: AgentId;
  /** Which lens this event surfaces in (drives the cross-persona timeline). */
  phase?: AgentPhase;
  /** A concrete artifact the action produced, e.g. "Python for AI · enrolled". */
  artifact?: string;
};

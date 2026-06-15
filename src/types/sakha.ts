export type PersonaId = "priya" | "arjun" | "rajan";

export type WellbeingTrend = "stable" | "watch" | "risk";

export type EmployeeTwin = {
  id: PersonaId;
  name: string;
  fullName: string;
  employeeId: string;
  role: string;
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
    };

export type ChatMessage = {
  id: string;
  role: "sakha" | "employee";
  text: string;
  time: string;
  card?: ChatCard;
  quickReplies?: string[];
  /** Marks a message that should route the demo into Career GPS. */
  action?: "navigate_to_career_gps";
};

export type ProactiveNotification = {
  persona: PersonaId;
  time: string;
  tone: "welcome" | "urgent" | "gentle";
  title: string;
  message: string;
  actions: { label: string }[];
};

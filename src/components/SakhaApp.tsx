"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar, MobileBar, DEFAULT_VIEW, type View, type Role } from "@/components/Sidebar";
import { SakhaChat } from "@/components/SakhaChat";
import { CareerGps } from "@/components/CareerGps";
import { ManagerCopilot } from "@/components/ManagerCopilot";
import { HRCommandCenter } from "@/components/HRCommandCenter";
import { AskSakhaView } from "@/components/AskSakhaView";
import {
  EmployeeOverview,
  EmployeePerformance,
  EmployeeGrowth,
  EmployeeOpportunities,
} from "@/components/EmployeePages";
import { GuidedTour, StartTourButton } from "@/components/GuidedTour";
import { DigitalTwin } from "@/components/DigitalTwin";
import { AgentDock } from "@/components/AgentDock";
import { LiveRail } from "@/components/LiveRail";
import { personaById } from "@/data/personas";
import { proactiveNotifications } from "@/data/notifications";
import type { CareerGpsResult, PersonaId, ProactiveNotification as Notif } from "@/types/sakha";

/** An authenticated actor is an employee, the manager lens, or the HR lens. */
export type Actor = PersonaId | "vikram" | "anita";

export function SakhaApp({
  actor = "priya",
  initialView,
  tourStep,
  tourAuto = false,
}: {
  actor?: Actor;
  initialView?: View;
  tourStep?: number;
  tourAuto?: boolean;
} = {}) {
  const role: Role = actor === "vikram" ? "manager" : actor === "anita" ? "hr" : "employee";
  const isManager = role === "manager";
  const isEmployee = role === "employee";
  const persona: PersonaId | null = isEmployee ? (actor as PersonaId) : null;
  const twin = persona ? personaById(persona) : null;

  const [view, setView] = useState<View>(initialView ?? DEFAULT_VIEW[role]);
  const [careerPrefill, setCareerPrefill] = useState<string | null>(
    !isManager && initialView === "career" && twin ? twin.careerGoal : null,
  );
  const [gpsResult, setGpsResult] = useState<CareerGpsResult | undefined>(undefined);
  const [twinUpdated, setTwinUpdated] = useState("on load");
  const [twinOpen, setTwinOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notif, setNotif] = useState<Notif | null>(null);
  const notifTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sakha speaks first — but only to employees, in their own session. Held back
  // during a guided tour so the walkthrough caption is the only narrator.
  useEffect(() => {
    if (!persona || tourStep != null) return;
    if (notifTimer.current) clearTimeout(notifTimer.current);
    const delay = persona === "priya" ? 900 : 1800;
    notifTimer.current = setTimeout(() => {
      setNotif(proactiveNotifications[persona]);
    }, delay);
    return () => {
      if (notifTimer.current) clearTimeout(notifTimer.current);
    };
  }, [persona, tourStep]);

  function navView(v: View) {
    setView(v);
    if (v !== "career") setCareerPrefill(null);
  }

  function navigateCareer(goal: string) {
    setCareerPrefill(goal);
    setView("career");
  }

  function handleGpsResult(result: CareerGpsResult) {
    setGpsResult(result);
    setTwinUpdated("just now · Career GPS");
  }

  function handleNotifAction(label: string) {
    setNotif(null);
    if (!twin) return;
    if (/map|path|career/i.test(label)) {
      navigateCareer(twin.careerGoal);
    } else if (/chat|track|task|see|view/i.test(label)) {
      setView("chat");
    }
  }

  return (
    <div className="app-ambient min-h-screen p-3 pb-20 sm:p-4 sm:pb-20 xl:pb-4">
      <div className="mx-auto grid max-w-[1600px] gap-4 lg:h-[calc(100vh-2rem-64px)] lg:grid-cols-[240px_1fr] xl:h-[calc(100vh-2rem)]">
        {/* Mobile: compact top bar with hamburger */}
        <div className="lg:hidden">
          <MobileBar
            role={role}
            twin={twin}
            view={view}
            onOpenMenu={() => setMenuOpen(true)}
            onOpenTwin={() => setTwinOpen(true)}
          />
        </div>

        {/* Desktop: full sidebar */}
        <div className="hidden lg:block">
          <Sidebar role={role} twin={twin} view={view} onView={navView} />
        </div>

        <main className="min-h-0 max-lg:min-h-[72vh]">
          {isManager || role === "hr" ? (
            <div className="grid h-full min-h-0 gap-4 max-lg:min-h-[72vh] xl:grid-cols-[1fr_340px]">
              <div className="min-h-0 max-lg:min-h-[72vh]">
                {view === "ask" ? (
                  <AskSakhaView role={isManager ? "manager" : "hr"} />
                ) : isManager ? (
                  <ManagerCopilot view={view} onView={navView} />
                ) : (
                  <HRCommandCenter view={view} onView={navView} />
                )}
              </div>
              <div className="hidden min-h-0 xl:block">
                <LiveRail />
              </div>
            </div>
          ) : (
            twin && (
              <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[1fr_340px]">
                <div className="min-h-0 max-lg:min-h-[72vh]">
                  {view === "career" ? (
                    <CareerGps
                      twin={twin}
                      prefillGoal={careerPrefill}
                      onResult={handleGpsResult}
                      notif={notif}
                      onNotifAction={handleNotifAction}
                      onNotifDismiss={() => setNotif(null)}
                    />
                  ) : view === "emp-performance" ? (
                    <EmployeePerformance twin={twin} />
                  ) : view === "emp-growth" ? (
                    <EmployeeGrowth twin={twin} />
                  ) : view === "emp-opportunities" ? (
                    <EmployeeOpportunities twin={twin} />
                  ) : view === "emp-overview" ? (
                    <EmployeeOverview twin={twin} onView={navView} />
                  ) : (
                    <SakhaChat
                      twin={twin}
                      onNavigateCareer={navigateCareer}
                      autoAsk={
                        tourStep === 0 && twin.id === "priya"
                          ? "How do I move into AI Delivery Management?"
                          : undefined
                      }
                    />
                  )}
                </div>
                <div className="hidden min-h-0 xl:flex xl:flex-col xl:gap-4">
                  <div className="h-[46%] min-h-0 shrink-0">
                    <DigitalTwin twin={twin} gps={gpsResult} updatedLabel={twinUpdated} />
                  </div>
                  <div className="min-h-0 flex-1">
                    <LiveRail />
                  </div>
                </div>
              </div>
            )
          )}
        </main>
      </div>

      {/* Mobile / tablet (below xl) keep the bottom dock; xl+ uses the right rail */}
      <div className="xl:hidden">
        <AgentDock />
      </div>

      {/* Mobile-only nav drawer — the full Sidebar slides in from the left */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="absolute left-0 top-0 h-full w-[84%] max-w-xs p-3"
            >
              <Sidebar
                role={role}
                twin={twin}
                view={view}
                onView={(v) => {
                  navView(v);
                  setMenuOpen(false);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile-only Digital Twin slide-over */}
      <AnimatePresence>
        {twinOpen && twin && isEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/60" onClick={() => setTwinOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="absolute right-0 top-0 h-full w-[88%] max-w-sm p-3"
            >
              <DigitalTwin
                twin={twin}
                gps={gpsResult}
                updatedLabel={twinUpdated}
                onClose={() => setTwinOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guided cross-persona walkthrough */}
      {tourStep != null ? (
        <GuidedTour step={tourStep} auto={tourAuto} />
      ) : (
        view !== "emp-overview" && <StartTourButton />
      )}
    </div>
  );
}

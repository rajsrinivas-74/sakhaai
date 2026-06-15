"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar, MobileBar, type View } from "@/components/Sidebar";
import { SakhaChat } from "@/components/SakhaChat";
import { CareerGps } from "@/components/CareerGps";
import { ManagerCopilot } from "@/components/ManagerCopilot";
import { DigitalTwin } from "@/components/DigitalTwin";
import { ProactiveNotification } from "@/components/ProactiveNotification";
import { personaById } from "@/data/personas";
import { proactiveNotifications } from "@/data/notifications";
import type { CareerGpsResult, PersonaId, ProactiveNotification as Notif } from "@/types/sakha";

/** An authenticated actor is either an employee or the manager lens. */
export type Actor = PersonaId | "vikram";

export function SakhaApp({
  actor = "priya",
  initialView,
}: {
  actor?: Actor;
  initialView?: View;
} = {}) {
  const isManager = actor === "vikram";
  const persona: PersonaId | null = isManager ? null : actor;
  const twin = persona ? personaById(persona) : null;

  const [view, setView] = useState<View>(
    isManager ? "manager" : initialView === "career" ? "career" : "chat",
  );
  const [careerPrefill, setCareerPrefill] = useState<string | null>(
    !isManager && initialView === "career" && twin ? twin.careerGoal : null,
  );
  const [gpsResult, setGpsResult] = useState<CareerGpsResult | undefined>(undefined);
  const [twinUpdated, setTwinUpdated] = useState("on load");
  const [twinOpen, setTwinOpen] = useState(false);
  const [notif, setNotif] = useState<Notif | null>(null);
  const notifTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sakha speaks first — but only to employees, in their own session.
  useEffect(() => {
    if (!persona) return;
    if (notifTimer.current) clearTimeout(notifTimer.current);
    const delay = persona === "priya" ? 900 : 1800;
    notifTimer.current = setTimeout(() => {
      setNotif(proactiveNotifications[persona]);
    }, delay);
    return () => {
      if (notifTimer.current) clearTimeout(notifTimer.current);
    };
  }, [persona]);

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
    <div className="app-ambient min-h-screen p-3 sm:p-4">
      <div className="mx-auto grid max-w-[1400px] gap-4 lg:h-[calc(100vh-2rem)] lg:grid-cols-[240px_1fr]">
        {/* Mobile: compact top bar */}
        <div className="lg:hidden">
          <MobileBar
            isManager={isManager}
            twin={twin}
            view={view}
            onView={navView}
            onOpenTwin={() => setTwinOpen(true)}
          />
        </div>

        {/* Desktop: full sidebar */}
        <div className="hidden lg:block">
          <Sidebar isManager={isManager} twin={twin} view={view} onView={navView} />
        </div>

        <main className="min-h-0 max-lg:min-h-[72vh]">
          {isManager ? (
            <div className="h-full min-h-0 max-lg:min-h-[72vh]">
              <ManagerCopilot />
            </div>
          ) : (
            twin && (
              <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[1fr_330px]">
                <div className="min-h-0 max-lg:min-h-[72vh]">
                  {view === "career" ? (
                    <CareerGps twin={twin} prefillGoal={careerPrefill} onResult={handleGpsResult} />
                  ) : (
                    <SakhaChat twin={twin} onNavigateCareer={navigateCareer} />
                  )}
                </div>
                <div className="hidden min-h-0 xl:block">
                  <DigitalTwin twin={twin} gps={gpsResult} updatedLabel={twinUpdated} />
                </div>
              </div>
            )
          )}
        </main>
      </div>

      {!isManager && (
        <ProactiveNotification
          notif={notif}
          onAction={handleNotifAction}
          onDismiss={() => setNotif(null)}
        />
      )}

      {/* Mobile-only Digital Twin slide-over */}
      <AnimatePresence>
        {twinOpen && twin && !isManager && (
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
    </div>
  );
}

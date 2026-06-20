import { SakhaApp, type Actor } from "@/components/SakhaApp";
import type { View } from "@/components/Sidebar";
import type { PersonaId } from "@/types/sakha";

const EMPLOYEES: PersonaId[] = ["priya", "arjun", "rajan"];

export default async function AppPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const personaParam = typeof sp.persona === "string" ? sp.persona : undefined;
  const viewParam = typeof sp.view === "string" ? sp.view : undefined;
  const sectionParam = typeof sp.section === "string" ? sp.section : undefined;
  const tourParam = typeof sp.tour === "string" ? Number(sp.tour) : NaN;

  // "vikram"/view=manager → manager lens, "anita"/view=hr → HR lens; otherwise
  // an employee. Unknown params default to Priya — the golden demo path.
  const isManager = viewParam === "manager" || personaParam === "vikram";
  const isHr = viewParam === "hr" || personaParam === "anita";
  const actor: Actor = isManager
    ? "vikram"
    : isHr
      ? "anita"
      : EMPLOYEES.includes(personaParam as PersonaId)
        ? (personaParam as PersonaId)
        : "priya";

  // A `section` deep-links to any sub-page; `view=career` is kept as a shorthand.
  const initialView: View | undefined =
    (sectionParam as View | undefined) ?? (viewParam === "career" ? "career" : undefined);
  const tourStep = Number.isInteger(tourParam) ? tourParam : undefined;
  const tourAuto = sp.auto === "1";

  return <SakhaApp actor={actor} initialView={initialView} tourStep={tourStep} tourAuto={tourAuto} />;
}

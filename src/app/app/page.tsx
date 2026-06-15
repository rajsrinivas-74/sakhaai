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

  // "vikram" / view=manager authenticate as the manager lens; otherwise an
  // employee. Unknown params default to Priya — the golden demo path.
  const isManager = viewParam === "manager" || personaParam === "vikram";
  const actor: Actor = isManager
    ? "vikram"
    : EMPLOYEES.includes(personaParam as PersonaId)
      ? (personaParam as PersonaId)
      : "priya";

  const initialView: View | undefined = viewParam === "career" ? "career" : undefined;

  return <SakhaApp actor={actor} initialView={initialView} />;
}

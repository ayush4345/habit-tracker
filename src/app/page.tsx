import { readDb } from "@/lib/db";
import DashboardTabs from "@/components/DashboardTabs";

export default async function Home() {
  const db = await readDb();

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans text-foreground p-8 sm:p-20">
      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col gap-10">
        <header className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Lupin's Tracker
          </h1>
          <p className="text-muted-foreground text-sm">
            Minimalist habit tracking.
          </p>
        </header>

        <DashboardTabs db={db} />
      </main>
    </div>
  );
}

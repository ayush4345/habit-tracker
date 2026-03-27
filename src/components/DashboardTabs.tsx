"use client";

import { useState } from "react";
import { Database } from "@/lib/db";
import HabitRow from "@/components/HabitRow";
import AddHabit from "@/components/AddHabit";
import SummaryTab from "@/components/SummaryTab";
import ReminderSettings from "@/components/ReminderSettings";
import { cn } from "@/lib/utils";

interface DashboardTabsProps {
  db: Database;
}

export default function DashboardTabs({ db }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "summary">("dashboard");

  const { habits, logs } = db;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-1 border-b border-border pb-0">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors duration-200 border-b-2 -mb-[2px]",
            activeTab === "dashboard"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("summary")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors duration-200 border-b-2 -mb-[2px]",
            activeTab === "summary"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Summary
        </button>
      </div>

      <section className="flex flex-col gap-6">
        {activeTab === "dashboard" ? (
          <>
            <div className="flex flex-col gap-4">
              {habits.length === 0 ? (
                <p className="text-muted-foreground text-sm italic py-4">No habits yet.</p>
              ) : (
                <div className="bg-card border border-border divide-y divide-border overflow-hidden">
                  {habits.map((habit) => (
                    <HabitRow 
                      key={habit.id} 
                      habit={habit} 
                      logs={logs.filter(l => l.habitId === habit.id)} 
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-2">
              <AddHabit />
            </div>

            <ReminderSettings />
          </>
        ) : (
          <SummaryTab db={db} />
        )}
      </section>
    </div>
  );
}

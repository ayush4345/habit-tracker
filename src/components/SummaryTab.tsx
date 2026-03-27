"use client";

import { Database } from "@/lib/db";
import { cn } from "@/lib/utils";

interface SummaryTabProps {
  db: Database;
}

export default function SummaryTab({ db }: SummaryTabProps) {
  const { habits, logs } = db;

  if (habits.length === 0) {
    return (
      <div className="py-12 text-center bg-card border border-border">
        <p className="text-muted-foreground text-sm italic">No data to summarize.</p>
      </div>
    );
  }

  // Get dates for "This Week" (last 7 days including today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDayOffset = (offset: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - offset);
    return d.toISOString().split("T")[0];
  };

  const thisWeekDays = Array.from({ length: 7 }, (_, i) => getDayOffset(i));
  const lastWeekDays = Array.from({ length: 7 }, (_, i) => getDayOffset(i + 7));

  const calculateStats = (habitId?: string) => {
    const filteredLogs = habitId ? logs.filter((l) => l.habitId === habitId) : logs;
    
    const thisWeekTotal = filteredLogs.filter(
      (l) => l.completed && thisWeekDays.includes(l.date)
    ).length;
    
    const lastWeekTotal = filteredLogs.filter(
      (l) => l.completed && lastWeekDays.includes(l.date)
    ).length;

    // CRITICAL: Use the zero-division guard for the delta calculation
    const delta = lastWeekTotal === 0 
      ? (thisWeekTotal > 0 ? 100 : 0) 
      : ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100;

    return { thisWeekTotal, lastWeekTotal, delta };
  };

  const globalStats = calculateStats();

  return (
    <div className="space-y-8">
      {/* Global Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-border divide-x divide-border">
        <div className="p-5 bg-card">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">This Week</p>
          <p className="text-2xl font-bold mt-1 text-card-foreground">{globalStats.thisWeekTotal}</p>
        </div>
        <div className="p-5 bg-card">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Week</p>
          <p className="text-2xl font-bold mt-1 text-card-foreground">{globalStats.lastWeekTotal}</p>
        </div>
        <div className="p-5 bg-card">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Growth</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className={cn(
              "text-2xl font-bold",
              globalStats.delta > 0 ? "text-indigo-600 dark:text-indigo-400" : globalStats.delta < 0 ? "text-muted-foreground" : "text-card-foreground"
            )}>
              {globalStats.delta > 0 ? "+" : ""}{globalStats.delta.toFixed(0)}%
            </p>
          </div>
        </div>
      </div>

      {/* Per-Habit Breakdown */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Breakdown</h3>
        <div className="bg-card border border-border overflow-hidden divide-y divide-border">
          {habits.map((habit) => {
            const stats = calculateStats(habit.id);
            return (
              <div key={habit.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-card-foreground text-sm">{habit.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {stats.thisWeekTotal} vs {stats.lastWeekTotal}
                  </p>
                </div>
                <div className={cn(
                  "text-xs font-bold",
                  stats.delta > 0 
                    ? "text-indigo-600 dark:text-indigo-400" 
                    : stats.delta < 0 
                    ? "text-muted-foreground"
                    : "text-card-foreground"
                )}>
                  {stats.delta > 0 ? "+" : ""}{stats.delta.toFixed(0)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

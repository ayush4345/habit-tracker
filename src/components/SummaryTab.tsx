"use client";

import { Database, Habit, HabitLog } from "@/lib/db";
import { cn } from "@/lib/utils";

interface SummaryTabProps {
  db: Database;
}

export default function SummaryTab({ db }: SummaryTabProps) {
  const { habits, logs } = db;

  if (habits.length === 0) {
    return (
      <div className="py-12 text-center bg-white border border-zinc-200">
        <p className="text-zinc-400 text-sm italic">No data to summarize.</p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-zinc-200 divide-x divide-zinc-200">
        <div className="p-5 bg-white">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">This Week</p>
          <p className="text-2xl font-bold mt-1 text-zinc-900">{globalStats.thisWeekTotal}</p>
        </div>
        <div className="p-5 bg-white">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Last Week</p>
          <p className="text-2xl font-bold mt-1 text-zinc-900">{globalStats.lastWeekTotal}</p>
        </div>
        <div className="p-5 bg-white">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Growth</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className={cn(
              "text-2xl font-bold",
              globalStats.delta > 0 ? "text-indigo-600" : globalStats.delta < 0 ? "text-zinc-500" : "text-zinc-900"
            )}>
              {globalStats.delta > 0 ? "+" : ""}{globalStats.delta.toFixed(0)}%
            </p>
          </div>
        </div>
      </div>

      {/* Per-Habit Breakdown */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">Breakdown</h3>
        <div className="bg-white border border-zinc-200 overflow-hidden divide-y divide-zinc-100">
          {habits.map((habit) => {
            const stats = calculateStats(habit.id);
            return (
              <div key={habit.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-zinc-900 text-sm">{habit.name}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {stats.thisWeekTotal} vs {stats.lastWeekTotal}
                  </p>
                </div>
                <div className={cn(
                  "text-xs font-bold",
                  stats.delta > 0 
                    ? "text-indigo-600" 
                    : stats.delta < 0 
                    ? "text-zinc-400"
                    : "text-zinc-900"
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

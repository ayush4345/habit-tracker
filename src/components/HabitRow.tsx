import { Habit, HabitLog } from '@/lib/db';
import DayBubble from './DayBubble';
import DeleteHabit from './DeleteHabit';

interface HabitRowProps {
  habit: Habit;
  logs: HabitLog[];
}

export default function HabitRow({ habit, logs }: HabitRowProps) {
  // Generate the last 7 dates (including today)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i)); // 6-0, 6-1, ... 6-6
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="flex items-center justify-between p-4 group bg-card">
      <div className="flex-1 min-w-0 pr-4">
        <h3 className="font-medium text-card-foreground truncate text-base">
          {habit.name}
        </h3>
      </div>
      
      <div className="flex items-center gap-2">
        {last7Days.map((date) => {
          const log = logs.find((l) => l.habitId === habit.id && l.date === date);
          return (
            <DayBubble
              key={date}
              habitId={habit.id}
              date={date}
              completed={log ? log.completed : false}
            />
          );
        })}
        
        <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
          <DeleteHabit id={habit.id} />
        </div>
      </div>
    </div>
  );
}

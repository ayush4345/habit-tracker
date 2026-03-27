'use client';

import { useTransition } from 'react';
import { toggleHabit } from '@/app/actions';
import { cn } from '@/lib/utils';

interface DayBubbleProps {
  habitId: string;
  date: string;
  completed: boolean;
}

export default function DayBubble({ habitId, date, completed }: DayBubbleProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleHabit(habitId, date);
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "w-6 h-6 rounded-sm border transition-all flex items-center justify-center",
        completed
          ? "bg-indigo-600 border-indigo-700 dark:bg-indigo-500 dark:border-indigo-600"
          : "bg-muted border-border hover:border-zinc-300 dark:hover:border-zinc-700",
        isPending && "opacity-50"
      )}
      title={date}
    >
      {completed && (
        <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full" />
      )}
    </button>
  );
}

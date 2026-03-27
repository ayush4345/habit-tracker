'use client';

import { deleteHabit } from '@/app/actions';
import { useTransition } from 'react';

export default function DeleteHabit({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => deleteHabit(id))}
      disabled={isPending}
      className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50 text-xs"
    >
      Delete
    </button>
  );
}

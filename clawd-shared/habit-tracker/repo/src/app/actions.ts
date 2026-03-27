'use server';

import { revalidatePath } from 'next/cache';
import { readDb, writeDb, Habit, HabitLog } from '@/lib/db';
import { nanoid } from 'nanoid';

export async function addHabit(formData: FormData) {
  const name = formData.get('name') as string;
  if (!name) return;

  const db = await readDb();
  const newHabit: Habit = {
    id: nanoid(),
    name,
    frequency: 'daily',
    createdAt: new Date().toISOString(),
  };

  db.habits.push(newHabit);
  await writeDb(db);

  revalidatePath('/');
}

export async function deleteHabit(id: string) {
  const db = await readDb();
  db.habits = db.habits.filter((h) => h.id !== id);
  db.logs = db.logs.filter((l) => l.habitId !== id);
  await writeDb(db);

  revalidatePath('/');
}

export async function toggleHabit(habitId: string, date: string) {
  const db = await readDb();
  const existingLogIndex = db.logs.findIndex(
    (log) => log.habitId === habitId && log.date === date
  );

  if (existingLogIndex !== -1) {
    db.logs[existingLogIndex].completed = !db.logs[existingLogIndex].completed;
  } else {
    const newLog: HabitLog = {
      id: nanoid(),
      habitId,
      date,
      completed: true,
    };
    db.logs.push(newLog);
  }

  await writeDb(db);
  revalidatePath('/');
}

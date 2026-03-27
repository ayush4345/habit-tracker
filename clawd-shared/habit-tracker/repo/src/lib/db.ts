import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src/data/habits.json');

export interface Habit {
  id: string;
  name: string;
  frequency: string; // e.g., 'daily'
  createdAt: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // ISO string (YYYY-MM-DD)
  completed: boolean;
}

export interface Database {
  habits: Habit[];
  logs: HabitLog[];
}

/**
 * Reads the database from the JSON file.
 */
export async function readDb(): Promise<Database> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return { habits: [], logs: [] };
    }
    throw error;
  }
}

/**
 * Writes the database to the JSON file using an atomic pattern.
 * It writes to a temporary file first, then renames it to ensure
 * data integrity.
 */
export async function writeDb(data: Database): Promise<void> {
  const dir = path.dirname(DB_PATH);
  
  // Ensure the directory exists
  await fs.mkdir(dir, { recursive: true });

  const tempPath = `${DB_PATH}.tmp`;
  const content = JSON.stringify(data, null, 2);

  try {
    // Write to temporary file
    await fs.writeFile(tempPath, content, 'utf-8');
    // Atomic rename
    await fs.rename(tempPath, DB_PATH);
  } catch (error) {
    // Clean up temp file if something went wrong
    try {
      await fs.unlink(tempPath);
    } catch {
      // Ignore cleanup errors
    }
    throw error;
  }
}

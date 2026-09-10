const STREAK_KEY = 'sunnah-streak';
const STREAK_LAST_KEY = 'sunnah-streak-last';
const TASKS_KEY_PREFIX = 'sunnah-tasks-';

export function localDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function todayKey(): string {
  return localDateKey(new Date());
}

function loadTodayTasks(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(`${TASKS_KEY_PREFIX}${todayKey()}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

let todayTasks: Record<string, boolean> = loadTodayTasks();

const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

export function getTodayTasks(): Record<string, boolean> {
  return todayTasks;
}

export function setTodayTasks(next: Record<string, boolean>): void {
  todayTasks = next;
  localStorage.setItem(`${TASKS_KEY_PREFIX}${todayKey()}`, JSON.stringify(next));
  emit();
}

export function subscribeDailyTasks(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function countCompleted(tasks: Record<string, boolean>): number {
  let count = 0;
  for (const value of Object.values(tasks)) {
    if (value === true) count++;
  }
  return count;
}

export function recordStreakOnCompletion(
  taskIds: string[],
  completed: Record<string, boolean>,
): void {
  for (const id of taskIds) {
    if (!completed[id]) return;
  }
  const today = todayKey();
  const last = localStorage.getItem(STREAK_LAST_KEY);
  if (last === today) return;
  const current = Number(localStorage.getItem(STREAK_KEY) ?? '0');
  const yesterday = localDateKey(addDays(new Date(), -1));
  const next = last === yesterday ? current + 1 : 1;
  localStorage.setItem(STREAK_KEY, String(next));
  localStorage.setItem(STREAK_LAST_KEY, today);
  emit();
}

export function getEffectiveStreak(): number {
  const last = localStorage.getItem(STREAK_LAST_KEY);
  if (!last) return 0;
  const today = todayKey();
  const yesterday = localDateKey(addDays(new Date(), -1));
  if (last === today || last === yesterday) {
    return Number(localStorage.getItem(STREAK_KEY) ?? '0');
  }
  return 0;
}
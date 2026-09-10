import { describe, expect, it, beforeEach, vi } from 'vitest';
import {
  localDateKey,
  getTodayTasks,
  setTodayTasks,
  subscribeDailyTasks,
  countCompleted,
  recordStreakOnCompletion,
  getEffectiveStreak,
} from './dailyTasks';

const STREAK_KEY = 'sunnah-streak';
const STREAK_LAST_KEY = 'sunnah-streak-last';

function yesterdayKey(): string {
  return localDateKey(new Date(Date.now() - 86400000));
}

function staleKey(): string {
  return localDateKey(new Date(Date.now() - 3 * 86400000));
}

let unsubscribed: (() => void)[] = [];

describe('dailyTasks', () => {
  beforeEach(() => {
    localStorage.clear();
    unsubscribed.forEach((fn) => fn());
    unsubscribed = [];
  });

  describe('localDateKey', () => {
    it('formats a date as zero-padded YYYY-MM-DD', () => {
      expect(localDateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
      expect(localDateKey(new Date(2026, 11, 31))).toBe('2026-12-31');
    });
  });

  describe('getTodayTasks / setTodayTasks', () => {
    it('returns the object set via setTodayTasks and persists it', () => {
      const listener = vi.fn();
      unsubscribed.push(subscribeDailyTasks(listener));

      setTodayTasks({ a: true });
      expect(getTodayTasks()).toEqual({ a: true });
      expect(listener).toHaveBeenCalled();

      const todayKey = `sunnah-tasks-${localDateKey(new Date())}`;
      expect(JSON.parse(localStorage.getItem(todayKey) ?? '')).toEqual({ a: true });
    });

    it('returns a stable object reference', () => {
      const before = getTodayTasks();
      setTodayTasks({ x: true });
      expect(getTodayTasks()).toEqual({ x: true });
      expect(getTodayTasks() === getTodayTasks()).toBe(true);
      expect(before).not.toBe(getTodayTasks());
    });
  });

  describe('countCompleted', () => {
    it('counts only true values', () => {
      expect(countCompleted({ a: true, b: false })).toBe(1);
      expect(countCompleted({})).toBe(0);
      expect(countCompleted({ a: true, b: true })).toBe(2);
    });
  });

  describe('recordStreakOnCompletion', () => {
    it('increments the streak when completing yesterday-seeded tasks', () => {
      localStorage.setItem(STREAK_LAST_KEY, yesterdayKey());
      localStorage.setItem(STREAK_KEY, '1');

      recordStreakOnCompletion(['a', 'b'], { a: true, b: true });

      expect(localStorage.getItem(STREAK_KEY)).toBe('2');
      expect(localStorage.getItem(STREAK_LAST_KEY)).toBe(localDateKey(new Date()));
    });

    it('is a no-op when the streak was already recorded today', () => {
      localStorage.setItem(STREAK_LAST_KEY, localDateKey(new Date()));
      localStorage.setItem(STREAK_KEY, '5');

      recordStreakOnCompletion(['a'], { a: true });

      expect(localStorage.getItem(STREAK_KEY)).toBe('5');
      expect(localStorage.getItem(STREAK_LAST_KEY)).toBe(localDateKey(new Date()));
    });

    it('resets the streak to 1 when the last record is stale', () => {
      localStorage.setItem(STREAK_LAST_KEY, staleKey());
      localStorage.setItem(STREAK_KEY, '5');

      recordStreakOnCompletion(['a'], { a: true });

      expect(localStorage.getItem(STREAK_KEY)).toBe('1');
      expect(localStorage.getItem(STREAK_LAST_KEY)).toBe(localDateKey(new Date()));
    });

    it('is a no-op when not every task is complete', () => {
      localStorage.setItem(STREAK_LAST_KEY, yesterdayKey());
      localStorage.setItem(STREAK_KEY, '1');

      recordStreakOnCompletion(['a', 'b'], { a: true, b: false });

      expect(localStorage.getItem(STREAK_KEY)).toBe('1');
      expect(localStorage.getItem(STREAK_LAST_KEY)).toBe(yesterdayKey());
    });
  });

  describe('getEffectiveStreak', () => {
    it('returns the stored value when last is today', () => {
      localStorage.setItem(STREAK_LAST_KEY, localDateKey(new Date()));
      localStorage.setItem(STREAK_KEY, '5');
      expect(getEffectiveStreak()).toBe(5);
    });

    it('returns the stored value when last is yesterday', () => {
      localStorage.setItem(STREAK_LAST_KEY, yesterdayKey());
      localStorage.setItem(STREAK_KEY, '3');
      expect(getEffectiveStreak()).toBe(3);
    });

    it('returns 0 when the last record is stale', () => {
      localStorage.setItem(STREAK_LAST_KEY, staleKey());
      localStorage.setItem(STREAK_KEY, '7');
      expect(getEffectiveStreak()).toBe(0);
    });

    it('returns 0 when there is no streak', () => {
      expect(getEffectiveStreak()).toBe(0);
    });
  });
});
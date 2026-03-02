/**
 * @fileoverview Accountability feature utility library.
 *
 * Provides types, data-access helpers, and date-range utilities for the
 * Accountability Grid. The habit schema is driven by `data/accountability/config.json`,
 * so new habits can be added without touching any UI or API code.
 *
 * Data format for each daily JSON file:
 * ```json
 * { "date": "2026-03-02", "bible": true, "reading": null, "gym": false }
 * ```
 *  - `true`  → habit completed
 *  - `false` → habit missed
 *  - `null`  → no data recorded
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Definition of a single trackable habit, read from `config.json`.
 */
export interface HabitConfig {
    /** Unique key that maps to a field in the daily JSON file (e.g. "bible"). */
    key: string;
    /** Human-readable label displayed in the grid header (e.g. "Bible"). */
    label: string;
    /** Emoji icon displayed alongside the label (e.g. "📖"). */
    emoji: string;
}

/**
 * Top-level shape of `data/accountability/config.json`.
 */
export interface AccountabilityConfig {
    /** Ordered list of habits to track. */
    habits: HabitConfig[];
}

/**
 * Shape of a single day's accountability record.
 * Habit values are indexed dynamically using `HabitConfig.key`.
 */
export interface AccountabilityEntry {
    /** ISO date string in `YYYY-MM-DD` format. */
    date: string;
    /** Dynamic habit fields — `true` = done, `false` = missed, `null` = no data. */
    [habitKey: string]: boolean | null | string;
}

/**
 * Resolved habit value for a single day/habit combination.
 */
export type HabitStatus = true | false | null;

/**
 * Aggregated totals for a set of days.
 * Keys are habit keys; values are completion counts.
 */
export type HabitTotals = Record<string, number>;

/**
 * API response shape returned by `GET /api/accountability`.
 */
export interface AccountabilityApiResponse {
    /** Habit schema from config.json. */
    config: AccountabilityConfig;
    /** Sorted array of daily records. */
    data: AccountabilityEntry[];
}

/** The two supported calendar view modes. */
export type ViewMode = 'week' | 'month';

// ---------------------------------------------------------------------------
// Habit value helpers
// ---------------------------------------------------------------------------

/**
 * Extracts the status of a specific habit from a daily entry.
 *
 * @param entry - The daily accountability record (may be undefined if no file exists).
 * @param habitKey - The habit key to look up (e.g. `"bible"`).
 * @returns `true` if completed, `false` if missed, `null` if no data.
 */
export function getHabitStatus(
    entry: AccountabilityEntry | undefined,
    habitKey: string,
): HabitStatus {
    if (!entry) return null;
    const value = entry[habitKey];
    if (typeof value === 'boolean') return value;
    return null;
}

/**
 * Computes completion totals for each habit across a set of display days.
 *
 * @param days - Array of `Date` objects representing the visible range.
 * @param habits - Ordered list of habit definitions from config.
 * @param entries - All loaded daily records.
 * @returns A map from habit key to number of completed days.
 */
export function computeTotals(
    days: Date[],
    habits: HabitConfig[],
    entries: AccountabilityEntry[],
): HabitTotals {
    const totals: HabitTotals = {};

    for (const habit of habits) {
        totals[habit.key] = 0;
    }

    for (const day of days) {
        const dateStr = formatDateKey(day);
        const entry = entries.find((e) => e.date === dateStr);
        for (const habit of habits) {
            if (getHabitStatus(entry, habit.key) === true) {
                totals[habit.key]++;
            }
        }
    }

    return totals;
}

// ---------------------------------------------------------------------------
// Date utilities
// ---------------------------------------------------------------------------

/**
 * Formats a `Date` as an ISO `YYYY-MM-DD` string using local time.
 * Uses local date parts to avoid UTC offset shifting the displayed day.
 *
 * @param date - The date to format.
 * @returns ISO date string, e.g. `"2026-03-02"`.
 */
export function formatDateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

/**
 * Returns the Monday–Sunday date range for the week containing `date`.
 *
 * @param date - Any date within the target week.
 * @returns `{ start: Date, end: Date }` where start is Monday and end is Sunday.
 */
export function getWeekRange(date: Date): { start: Date; end: Date } {
    const start = new Date(date);
    // JS getDay(): 0=Sun … 6=Sat. Shift so Monday=0.
    const dayOfWeek = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - dayOfWeek);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { start, end };
}

/**
 * Returns the first–last day date range for the calendar month of `date`.
 *
 * @param date - Any date within the target month.
 * @returns `{ start: Date, end: Date }` spanning the full calendar month.
 */
export function getMonthRange(date: Date): { start: Date; end: Date } {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);

    return { start, end };
}

/**
 * Generates an array of consecutive `Date` objects from `start` to `end` (inclusive).
 *
 * @param start - First date in the range.
 * @param end - Last date in the range (inclusive).
 * @returns Array of `Date` objects, one per calendar day.
 */
export function getDaysInRange(start: Date, end: Date): Date[] {
    const days: Date[] = [];
    const current = new Date(start);
    current.setHours(0, 0, 0, 0);

    while (current <= end) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    return days;
}

/**
 * Returns the array of dates that should be displayed for the current view.
 *
 * @param date - The reference date (i.e. "current" navigated date).
 * @param viewMode - `"week"` or `"month"`.
 * @returns Array of `Date` objects for each day in the view.
 */
export function getDisplayDays(date: Date, viewMode: ViewMode): Date[] {
    const { start, end } =
        viewMode === 'week' ? getWeekRange(date) : getMonthRange(date);
    return getDaysInRange(start, end);
}

/**
 * Advances or retreats the reference date by one period.
 *
 * @param date - The current reference date.
 * @param viewMode - `"week"` or `"month"`.
 * @param direction - `1` for forward, `-1` for backward.
 * @returns A new `Date` shifted by one period.
 */
export function navigateDate(date: Date, viewMode: ViewMode, direction: 1 | -1): Date {
    const next = new Date(date);
    if (viewMode === 'week') {
        next.setDate(next.getDate() + direction * 7);
    } else {
        next.setMonth(next.getMonth() + direction);
    }
    return next;
}

/**
 * Builds the human-readable title string for the navigation bar.
 *
 * @param date - The current reference date.
 * @param viewMode - `"week"` or `"month"`.
 * @returns Formatted title string, e.g. `"Mar 2 - 8, 2026"` or `"March 2026"`.
 */
export function getViewTitle(date: Date, viewMode: ViewMode): string {
    if (viewMode === 'month') {
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    }

    const { start, end } = getWeekRange(date);
    const startMonth = start.toLocaleString('default', { month: 'short' });
    const endMonth = end.toLocaleString('default', { month: 'short' });

    if (startMonth === endMonth) {
        return `${startMonth} ${start.getDate()} – ${end.getDate()}, ${start.getFullYear()}`;
    }
    return `${startMonth} ${start.getDate()} – ${endMonth} ${end.getDate()}, ${start.getFullYear()}`;
}
/**
 * @fileoverview AccountabilityGrid component.
 *
 * Renders the full habit-tracking grid table for the visible date range.
 * Columns are driven dynamically by the `habits` prop (from `config.json`),
 * so adding a new habit requires no changes to this component.
 *
 * Mobile-first: the grid scrolls horizontally on small screens if there are
 * many habit columns, while the day label column stays sticky on the left.
 */

"use client";

import {
    type AccountabilityEntry,
    type HabitConfig,
    type HabitTotals,
    formatDateKey,
    getHabitStatus,
} from "@/lib/accountability";
import { HabitCell } from "./HabitCell";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Props accepted by `AccountabilityGrid`. */
interface AccountabilityGridProps {
    /** Ordered list of habit definitions from `config.json`. */
    habits: HabitConfig[];
    /** Dates to display as rows, one per calendar day. */
    displayDays: Date[];
    /** All loaded daily accountability records. */
    entries: AccountabilityEntry[];
    /** Pre-computed completion totals for the displayed range. */
    totals: HabitTotals;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns the CSS grid-column template string based on the number of habits.
 * The first column is wider (day label); habit columns share the remaining space.
 *
 * @param habitCount - Number of habit columns to display.
 * @returns Tailwind-compatible `gridTemplateColumns` style string.
 */
function buildGridTemplate(habitCount: number): string {
    // e.g. "6rem repeat(3, 1fr)"
    return `6rem repeat(${habitCount}, 1fr)`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Renders the accountability data as a scrollable grid with:
 * - A sticky header row showing habit names and emoji icons
 * - One row per day in `displayDays`
 * - A totals row at the bottom
 *
 * @param props - {@link AccountabilityGridProps}
 */
export function AccountabilityGrid({
    habits,
    displayDays,
    entries,
    totals,
}: AccountabilityGridProps) {
    const today = formatDateKey(new Date());
    const gridTemplate = buildGridTemplate(habits.length);

    return (
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
            {/* Horizontally scrollable wrapper for many-column layouts on mobile */}
            <div className="overflow-x-auto">
                <div style={{ minWidth: `${6 + habits.length * 5}rem` }}>
                    {/* ── Header row ─────────────────────────────────────── */}
                    <div
                        className="grid border-b border-[var(--border)] bg-[var(--card)]"
                        style={{ gridTemplateColumns: gridTemplate }}
                        role="row">
                        <div
                            className="p-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wide"
                            role="columnheader">
                            Day
                        </div>
                        {habits.map((habit) => (
                            <div
                                key={habit.key}
                                className="p-3 text-xs font-semibold text-center uppercase tracking-wide"
                                role="columnheader"
                                aria-label={habit.label}>
                                <span className="block text-lg leading-none mb-0.5">
                                    {habit.emoji}
                                </span>
                                <span>{habit.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* ── Day rows ────────────────────────────────────────── */}
                    <div role="rowgroup">
                        {displayDays.map((day) => {
                            const dateStr = formatDateKey(day);
                            const entry = entries.find(
                                (e) => e.date === dateStr,
                            );
                            const isToday = dateStr === today;

                            return (
                                <div
                                    key={dateStr}
                                    className={[
                                        "grid border-b border-[var(--border)] last:border-b-0 transition-colors",
                                        isToday ? "bg-[var(--accent)]/10" : "",
                                    ]
                                        .filter(Boolean)
                                        .join(" ")}
                                    style={{
                                        gridTemplateColumns: gridTemplate,
                                    }}
                                    role="row"
                                    aria-current={isToday ? "date" : undefined}>
                                    {/* Day label */}
                                    <div className="p-3 flex flex-col justify-center min-h-[52px]">
                                        <span className="text-sm font-medium leading-none">
                                            {day.toLocaleString("default", {
                                                weekday: "short",
                                            })}
                                        </span>
                                        <span
                                            className={`text-xs mt-0.5 ${
                                                isToday
                                                    ? "text-[var(--accent)] font-bold"
                                                    : "text-[var(--muted)]"
                                            }`}>
                                            {day.toLocaleString("default", {
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>

                                    {/* Habit cells */}
                                    {habits.map((habit) => (
                                        <HabitCell
                                            key={habit.key}
                                            status={getHabitStatus(
                                                entry,
                                                habit.key,
                                            )}
                                        />
                                    ))}
                                </div>
                            );
                        })}
                    </div>

                    {/* ── Totals row ──────────────────────────────────────── */}
                    <div
                        className="grid bg-[var(--sidebar)] border-t-2 border-[var(--border)]"
                        style={{ gridTemplateColumns: gridTemplate }}
                        role="row">
                        <div className="p-3 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                            Total
                        </div>
                        {habits.map((habit) => (
                            <div
                                key={habit.key}
                                className="p-3 text-center text-sm font-bold text-green-500"
                                role="cell"
                                aria-label={`${habit.label}: ${totals[habit.key] ?? 0} of ${displayDays.length}`}>
                                {totals[habit.key] ?? 0}/{displayDays.length}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

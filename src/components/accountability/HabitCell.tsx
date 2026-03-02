/**
 * @fileoverview HabitCell component for the Accountability Grid.
 *
 * Renders the visual indicator for a single habit on a single day.
 * Supports three states: completed (✅), missed (❌), and no data (–).
 */

import type { HabitStatus } from "@/lib/accountability";

/** Props accepted by `HabitCell`. */
interface HabitCellProps {
    /** The resolved status for this habit on this day. */
    status: HabitStatus;
}

/**
 * Displays a completion indicator for one habit/day cell in the grid.
 *
 * - `true`  → green ✅
 * - `false` → red ❌
 * - `null`  → muted dash (–)
 *
 * @param props - {@link HabitCellProps}
 */
export function HabitCell({ status }: HabitCellProps) {
    return (
        <div className="flex items-center justify-center p-3 min-h-[44px]">
            {status === true && (
                <span
                    className="text-green-500 text-xl leading-none"
                    aria-label="Completed">
                    ✅
                </span>
            )}
            {status === false && (
                <span
                    className="text-red-500 text-xl leading-none"
                    aria-label="Missed">
                    ❌
                </span>
            )}
            {status === null && (
                <span
                    className="text-[var(--muted)] text-sm"
                    aria-label="No data">
                    –
                </span>
            )}
        </div>
    );
}

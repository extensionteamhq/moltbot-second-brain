/**
 * @fileoverview GridNavBar component for the Accountability Grid.
 *
 * Provides week/month view mode toggle and previous/next navigation.
 * Designed mobile-first: the title and controls stack cleanly on small screens
 * and expand to a single row on wider viewports.
 */

"use client";

import { type ViewMode, getViewTitle } from "@/lib/accountability";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Props accepted by `GridNavBar`. */
interface GridNavBarProps {
    /** The currently active view mode. */
    viewMode: ViewMode;
    /** The current reference date used to compute the displayed range. */
    currentDate: Date;
    /** Called when the user toggles between week and month view. */
    onViewModeChange: (mode: ViewMode) => void;
    /** Called when the user navigates forward (+1) or backward (-1). */
    onNavigate: (direction: 1 | -1) => void;
    /** Called when the user taps "Today". */
    onGoToToday: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Navigation bar for the Accountability Grid.
 *
 * Renders:
 * - A "Today" button (top-right on mobile, inline on desktop)
 * - Week / Month toggle
 * - Prev / Next arrows with the current period title
 *
 * All interactive elements meet the 44 × 44 px minimum touch target size.
 *
 * @param props - {@link GridNavBarProps}
 */
export function GridNavBar({
    viewMode,
    currentDate,
    onViewModeChange,
    onNavigate,
    onGoToToday,
}: GridNavBarProps) {
    const title = getViewTitle(currentDate, viewMode);

    return (
        <nav
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6"
            aria-label="Accountability grid navigation">
            {/* ── View mode toggle ──────────────────────────────────────── */}
            <div className="flex items-center gap-2">
                <div
                    className="flex bg-[var(--card)] rounded-lg p-1"
                    role="group"
                    aria-label="View mode">
                    {(["week", "month"] as const).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => onViewModeChange(mode)}
                            className={[
                                "px-4 py-2 text-sm rounded-md transition capitalize min-h-[44px]",
                                viewMode === mode
                                    ? "bg-[var(--accent)] text-white font-semibold"
                                    : "hover:bg-[var(--border)]",
                            ].join(" ")}
                            aria-pressed={viewMode === mode}>
                            {mode}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Period navigation ─────────────────────────────────────── */}
            <div className="flex items-center gap-2 sm:gap-3">
                <button
                    onClick={() => onNavigate(-1)}
                    className="flex items-center justify-center w-11 h-11 rounded-lg hover:bg-[var(--card)] transition"
                    aria-label={`Previous ${viewMode}`}>
                    ←
                </button>

                <span className="text-sm sm:text-base font-semibold text-center flex-1 sm:flex-none sm:min-w-[180px]">
                    {title}
                </span>

                <button
                    onClick={() => onNavigate(1)}
                    className="flex items-center justify-center w-11 h-11 rounded-lg hover:bg-[var(--card)] transition"
                    aria-label={`Next ${viewMode}`}>
                    →
                </button>
            </div>

            {/* ── Today shortcut ────────────────────────────────────────── */}
            <button
                onClick={onGoToToday}
                className="px-4 py-2 text-sm bg-[var(--card)] hover:bg-[var(--border)] rounded-lg transition min-h-[44px] self-start sm:self-auto"
                aria-label="Go to today">
                Today
            </button>
        </nav>
    );
}

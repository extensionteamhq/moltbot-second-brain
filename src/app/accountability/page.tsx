/**
 * @fileoverview Accountability Grid page.
 *
 * Thin orchestrator that:
 * 1. Fetches habit config + daily entries from `GET /api/accountability`
 * 2. Manages navigation state (view mode, current reference date)
 * 3. Computes the set of days to display and the per-habit totals
 * 4. Delegates all rendering to the decomposed sub-components
 *
 * @module app/accountability
 */

"use client";

import { useState, useEffect, useCallback } from "react";

import {
    type AccountabilityEntry,
    type HabitConfig,
    type ViewMode,
    computeTotals,
    getDisplayDays,
    navigateDate,
} from "@/lib/accountability";
import { AccountabilityGrid } from "@/components/accountability/AccountabilityGrid";
import { GridNavBar } from "@/components/accountability/GridNavBar";

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

/**
 * Accountability Grid page component.
 *
 * Renders a navigable calendar grid where each row is a day and each column
 * is a trackable habit. The habit columns are driven by `config.json`, so
 * no UI changes are needed when adding or removing habits.
 */
export default function AccountabilityPage() {
    const [habits, setHabits] = useState<HabitConfig[]>([]);
    const [entries, setEntries] = useState<AccountabilityEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [viewMode, setViewMode] = useState<ViewMode>("week");
    const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

    // ── Data fetching ──────────────────────────────────────────────────────

    useEffect(() => {
        let cancelled = false;

        fetch("/api/accountability")
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((json) => {
                if (cancelled) return;
                setHabits(json.config?.habits ?? []);
                setEntries(json.data ?? []);
                setLoading(false);
            })
            .catch((err: unknown) => {
                if (cancelled) return;
                console.error("[AccountabilityPage] fetch failed:", err);
                setError("Failed to load accountability data.");
                setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    // ── Navigation handlers ────────────────────────────────────────────────

    /** Advance or retreat the current reference date by one period. */
    const handleNavigate = useCallback(
        (direction: 1 | -1) => {
            setCurrentDate((prev) => navigateDate(prev, viewMode, direction));
        },
        [viewMode],
    );

    /** Reset the reference date to today. */
    const handleGoToToday = useCallback(() => {
        setCurrentDate(new Date());
    }, []);

    /** Switch between week and month view. */
    const handleViewModeChange = useCallback((mode: ViewMode) => {
        setViewMode(mode);
    }, []);

    // ── Derived state ──────────────────────────────────────────────────────

    const displayDays = getDisplayDays(currentDate, viewMode);
    const totals = computeTotals(displayDays, habits, entries);

    // ── Render states ──────────────────────────────────────────────────────

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-[var(--muted)] text-sm animate-pulse">
                    Loading…
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-red-500 text-sm">{error}</p>
            </div>
        );
    }

    // ── Main render ────────────────────────────────────────────────────────

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
            {/* Page title */}
            <h1 className="text-2xl font-bold mb-6">Accountability Grid</h1>

            {/* Navigation bar */}
            <GridNavBar
                viewMode={viewMode}
                currentDate={currentDate}
                onViewModeChange={handleViewModeChange}
                onNavigate={handleNavigate}
                onGoToToday={handleGoToToday}
            />

            {/* Habit grid */}
            <AccountabilityGrid
                habits={habits}
                displayDays={displayDays}
                entries={entries}
                totals={totals}
            />

            {/* Legend */}
            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[var(--muted)]">
                <span>✅ Completed</span>
                <span>❌ Missed</span>
                <span>– No data</span>
            </div>
        </div>
    );
}

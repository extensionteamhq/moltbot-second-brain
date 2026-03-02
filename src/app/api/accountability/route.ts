/**
 * @fileoverview API route for the Accountability Grid feature.
 *
 * `GET /api/accountability`
 * Reads all daily JSON files from `data/accountability/` and the habit
 * schema from `data/accountability/config.json`, then returns them together
 * so the UI can render columns dynamically without any hardcoded habit names.
 *
 * @module api/accountability
 */

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

import type {
  AccountabilityConfig,
  AccountabilityEntry,
  AccountabilityApiResponse,
} from '@/lib/accountability';

/** Absolute path to the accountability data directory. */
const DATA_DIR = path.join(process.cwd(), 'data/accountability');

/** Regex that matches valid daily data filenames, e.g. `2026-03-02.json`. */
const DAILY_FILE_PATTERN = /^\d{4}-\d{2}-\d{2}\.json$/;

/**
 * Reads and parses `config.json` from the accountability data directory.
 *
 * @returns The parsed `AccountabilityConfig`, or a default config with an
 *          empty habit list if the file is missing or invalid.
 */
function readConfig(): AccountabilityConfig {
  const configPath = path.join(DATA_DIR, 'config.json');
  try {
    const raw = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(raw) as AccountabilityConfig;
  } catch {
    // Return a safe default so the page still renders without a config file.
    return { habits: [] };
  }
}

/**
 * Reads all daily JSON files from the accountability data directory, parses
 * them, and returns an array sorted chronologically by date.
 *
 * Files that do not match the `YYYY-MM-DD.json` pattern (e.g. `config.json`)
 * are ignored.
 *
 * @returns Sorted array of `AccountabilityEntry` objects.
 */
function readEntries(): AccountabilityEntry[] {
  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => DAILY_FILE_PATTERN.test(f));

  const entries: AccountabilityEntry[] = files.map((file) => {
    const filePath = path.join(DATA_DIR, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    // Ensure the `date` field is always present (fall back to filename stem).
    return {
      date: file.replace('.json', ''),
      ...parsed,
    } as AccountabilityEntry;
  });

  return entries.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Handles `GET /api/accountability`.
 *
 * @returns JSON response containing the habit `config` and daily `data` array.
 *          Returns HTTP 500 with an error message on unexpected failures.
 */
export async function GET(): Promise<NextResponse<AccountabilityApiResponse | { error: string }>> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      const empty: AccountabilityApiResponse = {
        config: { habits: [] },
        data: [],
      };
      return NextResponse.json(empty);
    }

    const config = readConfig();
    const data = readEntries();

    return NextResponse.json({ config, data });
  } catch (error) {
    console.error('[api/accountability] Failed to load data:', error);
    return NextResponse.json(
      { error: 'Failed to load accountability data' },
      { status: 500 },
    );
  }
}
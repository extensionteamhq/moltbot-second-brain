import { NextResponse } from 'next/server';
import { getBriefs } from '@/lib/briefs';

/**
 * Force dynamic rendering to ensure fresh brief data
 */
export const dynamic = 'force-dynamic';

/**
 * GET /api/briefs
 * 
 * Retrieves all daily briefs from the documents/briefs directory.
 * Returns a JSON response with briefs sorted by date (newest first).
 */
export async function GET() {
  const briefs = getBriefs();
  return NextResponse.json({ briefs });
}

import { NextResponse } from 'next/server';
import { getDocuments, getAllTags } from '@/lib/documents';

/**
 * Force dynamic rendering to ensure fresh document data
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
 */
export const dynamic = 'force-dynamic';

/**
 * GET /api/documents
 * 
 * Retrieves all documents and tags from the documents directory.
 * Returns a JSON response with documents sorted by date (newest first)
 * and a list of all unique tags for filtering.
 * 
 * @async
 * @function GET
 * @returns {Promise<NextResponse>} JSON response containing:
 *   - documents: Array of Document objects
 *   - tags: Array of unique tag strings
 * 
 * @example
 * // Response format:
 * {
 *   "documents": [
 *     {
 *       "slug": "my-document",
 *       "title": "My Document",
 *       "content": "# Content here...",
 *       "tags": ["notes", "ideas"],
 *       "date": "2026-02-05",
 *       "excerpt": "Content here..."
 *     }
 *   ],
 *   "tags": ["ideas", "journal", "notes"]
 * }
 */
export async function GET() {
  const documents = getDocuments();
  const tags = getAllTags();
  
  return NextResponse.json({ documents, tags });
}

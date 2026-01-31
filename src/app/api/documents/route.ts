import { NextResponse } from 'next/server';
import { getDocuments, getAllTags } from '@/lib/documents';

export const dynamic = 'force-dynamic';

export async function GET() {
  const documents = getDocuments();
  const tags = getAllTags();
  
  return NextResponse.json({ documents, tags });
}

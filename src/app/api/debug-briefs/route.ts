import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  const briefsDir = path.join(process.cwd(), 'documents', 'briefs');
  
  try {
    const exists = fs.existsSync(briefsDir);
    const files = exists ? fs.readdirSync(briefsDir) : [];
    const cwd = process.cwd();
    
    // Get first 200 chars of each file to verify content
    const fileContents: Record<string, string> = {};
    for (const file of files) {
      if (file.endsWith('.md')) {
        const content = fs.readFileSync(path.join(briefsDir, file), 'utf8');
        fileContents[file] = content.slice(0, 300);
      }
    }
    
    return NextResponse.json({
      cwd,
      briefsDir,
      exists,
      files,
      fileContents,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

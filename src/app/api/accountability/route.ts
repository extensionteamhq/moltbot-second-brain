import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read from bundled data in the app (committed to GitHub)
    const accountabilityDir = path.join(process.cwd(), 'data/accountability');
    
    // Check if directory exists
    if (!fs.existsSync(accountabilityDir)) {
      return NextResponse.json({ data: [] });
    }
    
    // Read all JSON files
    const files = fs.readdirSync(accountabilityDir).filter(f => f.endsWith('.json') && f.match(/^\d{4}-\d{2}-\d{2}\.json$/));
    
    const accountabilityData = files.map(file => {
      const filePath = path.join(accountabilityDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      return {
        date: file.replace('.json', ''),
        ...data
      };
    }).sort((a, b) => a.date.localeCompare(b.date));
    
    return NextResponse.json({ data: accountabilityData });
  } catch (error) {
    console.error('Error reading accountability data:', error);
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}

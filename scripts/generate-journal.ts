#!/usr/bin/env npx ts-node
/**
 * Journal Generator for Second Brain
 * Pulls recent chat history and generates a daily journal entry
 */

import fs from 'fs';
import path from 'path';

const DOCUMENTS_DIR = path.join(__dirname, '..', 'documents');

interface JournalEntry {
  date: string;
  title: string;
  topics: string[];
  decisions: string[];
  actionItems: string[];
  insights: string[];
  rawSummary: string;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function generateFrontmatter(entry: JournalEntry): string {
  const tags = ['journal'];
  
  // Auto-tag based on content
  const content = entry.rawSummary.toLowerCase();
  if (content.includes('newsletter') || content.includes('email')) tags.push('newsletters');
  if (content.includes('script') || content.includes('video')) tags.push('scripts');
  if (content.includes('idea') || content.includes('brainstorm')) tags.push('ideas');
  if (content.includes('strategy') || content.includes('plan')) tags.push('notes');
  
  return `---
title: "${entry.title}"
tags: [${tags.join(', ')}]
date: ${entry.date}
---`;
}

function generateMarkdown(entry: JournalEntry): string {
  let md = generateFrontmatter(entry) + '\n\n';
  
  md += `# ${entry.title}\n\n`;
  
  if (entry.topics.length > 0) {
    md += `## 📌 Topics Discussed\n\n`;
    entry.topics.forEach(topic => {
      md += `- ${topic}\n`;
    });
    md += '\n';
  }
  
  if (entry.decisions.length > 0) {
    md += `## ✅ Decisions Made\n\n`;
    entry.decisions.forEach(decision => {
      md += `- ${decision}\n`;
    });
    md += '\n';
  }
  
  if (entry.actionItems.length > 0) {
    md += `## 🎯 Action Items\n\n`;
    entry.actionItems.forEach(item => {
      md += `- [ ] ${item}\n`;
    });
    md += '\n';
  }
  
  if (entry.insights.length > 0) {
    md += `## 💡 Key Insights\n\n`;
    entry.insights.forEach(insight => {
      md += `> ${insight}\n\n`;
    });
  }
  
  if (entry.rawSummary) {
    md += `## 📝 Summary\n\n${entry.rawSummary}\n`;
  }
  
  return md;
}

function saveJournalEntry(entry: JournalEntry): string {
  if (!fs.existsSync(DOCUMENTS_DIR)) {
    fs.mkdirSync(DOCUMENTS_DIR, { recursive: true });
  }
  
  const filename = `${entry.date}-journal.md`;
  const filepath = path.join(DOCUMENTS_DIR, filename);
  
  const markdown = generateMarkdown(entry);
  fs.writeFileSync(filepath, markdown);
  
  return filepath;
}

// Export for use by Clawdbot
export type { JournalEntry };
export { saveJournalEntry, generateMarkdown, formatDate, DOCUMENTS_DIR };

// CLI mode - receives JSON input from stdin or args
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // Read from stdin
    let input = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => input += chunk);
    process.stdin.on('end', () => {
      try {
        const entry = JSON.parse(input) as JournalEntry;
        const filepath = saveJournalEntry(entry);
        console.log(`✅ Journal saved: ${filepath}`);
      } catch (e) {
        console.error('Error parsing input:', e);
        process.exit(1);
      }
    });
  } else if (args[0] === '--help') {
    console.log(`
Journal Generator for Second Brain

Usage:
  echo '{"date":"2026-01-31","title":"Daily Journal",...}' | npx ts-node generate-journal.ts
  
Or call saveJournalEntry() programmatically from Clawdbot.

JournalEntry schema:
{
  date: string (YYYY-MM-DD),
  title: string,
  topics: string[],
  decisions: string[],
  actionItems: string[],
  insights: string[],
  rawSummary: string
}
`);
  }
}

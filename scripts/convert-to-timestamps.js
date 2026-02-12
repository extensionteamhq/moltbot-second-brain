#!/usr/bin/env node

/**
 * Convert date-only created/updated fields to full ISO timestamps
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const matter = require('gray-matter');

const DOCUMENTS_DIR = path.join(__dirname, '..', 'documents');

function getGitTimestamp(filePath, firstOrLast) {
  try {
    const cmd = firstOrLast === 'first'
      ? `git log --follow --format=%aI --reverse "${filePath}" | head -1`
      : `git log -1 --format=%aI "${filePath}"`;
    
    const timestamp = execSync(cmd, { encoding: 'utf8' }).trim();
    return timestamp || null;
  } catch (error) {
    return null;
  }
}

function convertDocument(filename) {
  const filePath = path.join(DOCUMENTS_DIR, filename);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(fileContent);
  const stats = fs.statSync(filePath);

  let updated = false;

  // Convert created if it's date-only
  if (parsed.data.created && /^\d{4}-\d{2}-\d{2}$/.test(parsed.data.created)) {
    const gitCreated = getGitTimestamp(filePath, 'first');
    parsed.data.created = gitCreated || stats.birthtime.toISOString();
    updated = true;
  }

  // Convert updated if it's date-only
  if (parsed.data.updated && /^\d{4}-\d{2}-\d{2}$/.test(parsed.data.updated)) {
    const gitUpdated = getGitTimestamp(filePath, 'last');
    parsed.data.updated = gitUpdated || stats.mtime.toISOString();
    updated = true;
  }

  if (updated) {
    const newContent = matter.stringify(parsed.content, parsed.data);
    fs.writeFileSync(filePath, newContent);
    console.log(`✓ Converted ${filename}`);
    return true;
  }

  console.log(`  Skipped ${filename} (already has timestamps)`);
  return false;
}

function main() {
  console.log('Converting date-only fields to full timestamps...\n');

  if (!fs.existsSync(DOCUMENTS_DIR)) {
    console.error('Documents directory not found:', DOCUMENTS_DIR);
    process.exit(1);
  }

  const files = fs.readdirSync(DOCUMENTS_DIR).filter(f => f.endsWith('.md'));
  let convertedCount = 0;

  for (const file of files) {
    if (convertDocument(file)) {
      convertedCount++;
    }
  }

  console.log(`\nDone! Converted ${convertedCount} of ${files.length} documents.`);
}

main();

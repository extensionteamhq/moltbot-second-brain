#!/usr/bin/env node

/**
 * Backfill created and updated dates for existing documents
 * Uses git history to determine when files were first added (created) and last modified (updated)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const matter = require('gray-matter');

const DOCUMENTS_DIR = path.join(__dirname, '..', 'documents');

function getGitDates(filePath) {
  try {
    // Get first commit date (created)
    const createdDate = execSync(
      `git log --follow --format=%aI --reverse "${filePath}" | head -1`,
      { encoding: 'utf8' }
    ).trim();

    // Get last commit date (updated)
    const updatedDate = execSync(
      `git log -1 --format=%aI "${filePath}"`,
      { encoding: 'utf8' }
    ).trim();

    return {
      created: createdDate ? createdDate.split('T')[0] : null,
      updated: updatedDate ? updatedDate.split('T')[0] : null,
    };
  } catch (error) {
    // File not in git yet
    return null;
  }
}

function backfillDocument(filename) {
  const filePath = path.join(DOCUMENTS_DIR, filename);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(fileContent);

  // Skip if both created and updated already exist
  if (parsed.data.created && parsed.data.updated) {
    console.log(`✓ Skipping ${filename} (already has created/updated dates)`);
    return false;
  }

  const gitDates = getGitDates(filePath);
  const stats = fs.statSync(filePath);

  // Determine created date
  let created = parsed.data.created;
  if (!created) {
    created = gitDates?.created || parsed.data.date || stats.birthtime.toISOString().split('T')[0];
  }

  // Determine updated date
  let updated = parsed.data.updated;
  if (!updated) {
    updated = gitDates?.updated || stats.mtime.toISOString().split('T')[0];
  }

  // Update frontmatter
  parsed.data.created = created;
  parsed.data.updated = updated;

  // Remove old 'date' field if created exists
  if (parsed.data.created && parsed.data.date) {
    delete parsed.data.date;
  }

  // Write back to file
  const newContent = matter.stringify(parsed.content, parsed.data);
  fs.writeFileSync(filePath, newContent);

  console.log(`✓ Updated ${filename}`);
  console.log(`  Created: ${created}`);
  console.log(`  Updated: ${updated}`);
  return true;
}

function main() {
  console.log('Backfilling created/updated dates for documents...\n');

  if (!fs.existsSync(DOCUMENTS_DIR)) {
    console.error('Documents directory not found:', DOCUMENTS_DIR);
    process.exit(1);
  }

  const files = fs.readdirSync(DOCUMENTS_DIR).filter(f => f.endsWith('.md'));
  let updatedCount = 0;

  for (const file of files) {
    if (backfillDocument(file)) {
      updatedCount++;
    }
  }

  console.log(`\nDone! Updated ${updatedCount} of ${files.length} documents.`);
}

main();

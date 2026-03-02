#!/usr/bin/env python3
"""
Audit and update frontmatter tags for all moved documents.
- Adds required folder tag to files that have frontmatter but are missing the tag
- Prepends full frontmatter to files that have no frontmatter at all
"""
import os
import re
from datetime import datetime

FOLDER_TAGS = {
    'documents/dirt-roamers': 'dirt-roamers',
    'documents/anchor-staff': 'anchor-staff',
    'documents/partner-with-mateo': 'partner-with-mateo',
    'documents/rank-n-soar': 'rank-n-soar',
    'documents/mr-mateo-moore': 'mr-mateo-moore',
    'documents/marketing': 'marketing',
    'documents/system': 'system',
    'journals': 'journal',
    'briefs': 'brief',
}

# Fallback type tags per folder (added alongside folder tag for no-FM files)
FOLDER_TYPE_TAGS = {
    'documents/dirt-roamers': 'research',
    'documents/anchor-staff': 'notes',
    'documents/partner-with-mateo': 'notes',
    'documents/rank-n-soar': 'notes',
    'documents/mr-mateo-moore': 'notes',
    'documents/marketing': 'research',
    'documents/system': 'notes',
    'journals': 'journal',
    'briefs': 'brief',
}

TODAY = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S+00:00')

updated = []
added_fm = []
skipped = []
already_ok = []


def slug_to_title(slug: str) -> str:
    """Convert a filename slug to a human-readable title."""
    # Remove leading numbering like '03-'
    slug = re.sub(r'^\d+-', '', slug)
    # Replace hyphens with spaces and title-case
    return slug.replace('-', ' ').title()


def extract_title_from_content(content: str, fallback: str) -> str:
    """Extract the first H1 heading from content, falling back to slug-derived title."""
    match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    if match:
        return match.group(1).strip()
    # Try first non-empty line that isn't a markdown element
    for line in content.splitlines():
        line = line.strip()
        if line and not line.startswith('#') and not line.startswith('*') and not line.startswith('-'):
            # Trim trailing punctuation like ' — Research'
            title = re.sub(r'\s*[—–-].*$', '', line).strip()
            if title:
                return title
    return fallback


for dir_path, required_tag in FOLDER_TAGS.items():
    if not os.path.isdir(dir_path):
        skipped.append(f"MISSING_DIR: {dir_path}")
        continue
    for fname in sorted(os.listdir(dir_path)):
        if not fname.endswith('.md'):
            continue
        fpath = os.path.join(dir_path, fname)
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()

        # ── Case A: No frontmatter at all ──────────────────────────────────
        if not content.startswith('---'):
            slug = fname.replace('.md', '')
            title = extract_title_from_content(content, slug_to_title(slug))
            type_tag = FOLDER_TYPE_TAGS.get(dir_path, 'notes')
            tags = [required_tag, type_tag] if type_tag != required_tag else [required_tag]
            tags_yaml = ', '.join(tags)
            fm = (
                f'---\n'
                f'title: "{title}"\n'
                f'tags: [{tags_yaml}]\n'
                f'created: "{TODAY}"\n'
                f'updated: "{TODAY}"\n'
                f'---\n\n'
            )
            new_content = fm + content
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            added_fm.append(f"{fpath}  title='{title}'  tags=[{tags_yaml}]")
            continue

        # ── Case B: Has frontmatter — check for required tag ───────────────
        fm_end = content.find('\n---', 3)
        if fm_end == -1:
            skipped.append(f"NO_FM_END: {fpath}")
            continue

        frontmatter = content[3:fm_end]
        rest = content[fm_end:]

        # Check if required tag is already present
        if re.search(r'\b' + re.escape(required_tag) + r'\b', frontmatter):
            already_ok.append(fpath)
            continue

        # Pattern 1: inline array  tags: [tag1, tag2]
        inline_match = re.search(r'(tags:\s*\[)([^\]]*?)(\])', frontmatter)
        if inline_match:
            existing = inline_match.group(2).strip()
            separator = ', ' if existing else ''
            new_tags_str = existing + separator + required_tag
            new_frontmatter = (
                frontmatter[:inline_match.start()]
                + inline_match.group(1)
                + new_tags_str
                + inline_match.group(3)
                + frontmatter[inline_match.end():]
            )
            new_content = '---' + new_frontmatter + rest
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            updated.append(f"{fpath}  [inline] +{required_tag}")
            continue

        # Pattern 2: block sequence  tags:\n  - tag1\n  - tag2
        block_match = re.search(r'(tags:\n(?:[ \t]+-[^\n]+\n)*)', frontmatter)
        if block_match:
            insert_at = block_match.end()
            new_frontmatter = (
                frontmatter[:insert_at]
                + f'  - {required_tag}\n'
                + frontmatter[insert_at:]
            )
            new_content = '---' + new_frontmatter + rest
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            updated.append(f"{fpath}  [block] +{required_tag}")
            continue

        skipped.append(f"NO_TAGS_FIELD: {fpath}")


print(f"Already correct: {len(already_ok)}")
print(f"Tag added:       {len(updated)}")
for u in updated:
    print(f"  ~ {u}")
print(f"Frontmatter added: {len(added_fm)}")
for a in added_fm:
    print(f"  + {a}")
if skipped:
    print(f"\nSkipped/Issues:  {len(skipped)}")
    for s in skipped:
        print(f"  ? {s}")
print("\nTag audit complete.")
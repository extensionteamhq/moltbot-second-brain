#!/bin/bash
# Daily Journal Generator
# Called by cron to generate journal entries from Clawdbot chat history

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DOCUMENTS_DIR="$PROJECT_DIR/documents"

DATE=$(date +%Y-%m-%d)
FILENAME="$DATE-journal.md"
FILEPATH="$DOCUMENTS_DIR/$FILENAME"

# Check if journal already exists for today
if [ -f "$FILEPATH" ]; then
    echo "Journal for $DATE already exists at $FILEPATH"
    exit 0
fi

echo "Triggering Clawdbot to generate journal for $DATE..."

# Wake Clawdbot with the journal generation task
clawdbot gateway wake \
    --text "Generate today's Second Brain journal entry. Review our recent conversations (last 24h), extract key topics, decisions, action items, and insights. Save to $FILEPATH using the journal markdown format with frontmatter (title, tags: [journal, ...], date). Be concise but comprehensive." \
    --mode now

echo "Journal generation triggered for $DATE"

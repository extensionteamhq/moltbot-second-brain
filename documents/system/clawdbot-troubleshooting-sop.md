---
title: "Clawdbot Troubleshooting & Recovery SOP"
tags: [clawdbot, sop, troubleshooting, ssh, recovery, system, requested]
created: 2026-02-13T15:45:00+00:00
updated: 2026-02-15T19:42:00+00:00
---

# Clawdbot Troubleshooting & Recovery SOP

When Molly is unreachable via Telegram, use this guide to diagnose and fix issues via SSH.

---

## Quick Reference

| Action | Command |
|--------|---------|
| Check status | `clawdbot status` |
| Restart gateway | `clawdbot gateway restart` |
| View logs | `clawdbot gateway logs` |
| Start new session | Send `/new` via Telegram after restart |
| Kill stuck process | `clawdbot gateway stop && clawdbot gateway start` |

---

## Step 1: SSH Into the Server

```bash
ssh ubuntu@<server-ip>
```

Or if you have an alias configured:
```bash
ssh clawd-server
```

**Working directory:** `/home/ubuntu/clawd`

---

## Step 2: Check Clawdbot Status

```bash
clawdbot status
```

This shows:
- Gateway running status
- Current model
- Connected channels
- Active sessions

**Healthy output looks like:**
```
Gateway: running (pid 12345)
Model: anthropic/claude-opus-4-5
Channels: telegram (connected)
Sessions: 2 active
```

---

## Step 3: Check Logs for Errors

```bash
# Recent logs
clawdbot gateway logs

# Follow logs in real-time
clawdbot gateway logs -f

# More verbose
clawdbot gateway logs --level debug
```

**Common errors to look for:**
- `No tool call found for function call output` → Session corruption
- `ECONNREFUSED` → API connection issue
- `401 Unauthorized` → API key issue
- `rate limit` → Too many requests

---

## Step 4: Common Issues & Fixes

### Issue: "No tool call found for function call output"

**Cause:** Session state corrupted — orphaned tool result without matching tool call.

**Fix:**
```bash
# Restart the gateway
clawdbot gateway restart

# Then send /new via Telegram to start fresh session
```

If Telegram still doesn't work after restart:
```bash
# Check session files
ls -la ~/.clawdbot/sessions/

# Nuclear option: Clear the corrupted session
# (You'll lose conversation history but not memory files)
rm ~/.clawdbot/sessions/telegram-947996954-*
clawdbot gateway restart
```

---

### Issue: Gateway Won't Start

**Check if something is blocking:**
```bash
# See what's using the port
lsof -i :3000

# Kill zombie process if needed
pkill -f clawdbot
clawdbot gateway start
```

---

### Issue: Telegram Not Receiving Messages

```bash
# Check Telegram channel status
clawdbot status

# Verify bot token is set
cat ~/.clawdbot/clawdbot.json | grep telegram

# Test webhook (if using webhook mode)
curl -s "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"
```

**Fix:** Restart gateway usually resolves connection drops:
```bash
clawdbot gateway restart
```

---

### Issue: API Key Problems

```bash
# Check which keys are configured
cat ~/.clawdbot/agents/main/agent/auth-profiles.json

# Check env fallbacks
cat ~/.clawdbot/.env

# Verify model access
clawdbot models list --all | grep "yes"
```

---

### Issue: Config File Corrupted (clawdbot.json or auth-profiles.json)

If Molly made bad changes to config files and the gateway won't start or behaves incorrectly:

**Check if backups exist:**
```bash
# List available backups
ls -la ~/.clawdbot/*.backup
ls -la ~/.clawdbot/agents/main/agent/*.backup
```

**Revert clawdbot.json from backup:**
```bash
# Stop gateway first
clawdbot gateway stop

# Restore from backup
cp ~/.clawdbot/clawdbot.json.backup ~/.clawdbot/clawdbot.json

# Restart
clawdbot gateway start
```

**Revert auth-profiles.json from backup:**
```bash
# Stop gateway first
clawdbot gateway stop

# Restore from backup
cp ~/.clawdbot/agents/main/agent/auth-profiles.json.backup ~/.clawdbot/agents/main/agent/auth-profiles.json

# Restart
clawdbot gateway start
```

**Revert .env from backup:**
```bash
cp ~/.clawdbot/.env.backup ~/.clawdbot/.env
clawdbot gateway restart
```

**Revert ALL config files at once:**
```bash
clawdbot gateway stop
cp ~/.clawdbot/clawdbot.json.backup ~/.clawdbot/clawdbot.json
cp ~/.clawdbot/agents/main/agent/auth-profiles.json.backup ~/.clawdbot/agents/main/agent/auth-profiles.json
cp ~/.clawdbot/.env.backup ~/.clawdbot/.env
clawdbot gateway start
```

**Validate JSON before restarting:**
```bash
cat ~/.clawdbot/clawdbot.json | jq . > /dev/null && echo "✅ Valid" || echo "❌ Invalid"
```

**Note:** Molly should ALWAYS create backups before modifying these files. If no `.backup` exists, you may need to manually fix the JSON or recreate the config.

---

### Issue: High Memory/CPU Usage

```bash
# Check resource usage
htop
# or
ps aux | grep clawdbot

# Restart to clear memory
clawdbot gateway restart
```

---

## Step 5: Full Reset (Nuclear Option)

If nothing else works:

```bash
# Stop everything
clawdbot gateway stop

# Clear all sessions (loses conversation history, NOT memory files)
rm -rf ~/.clawdbot/sessions/*

# Restart fresh
clawdbot gateway start
```

**Your memory files are safe:**
- `~/clawd/MEMORY.md`
- `~/clawd/HEARTBEAT.md`
- `~/clawd/memory/*.md`
- `~/clawd/USER.md`, `SOUL.md`, etc.

These persist regardless of session state.

---

## Step 6: Verify Recovery

After any fix:

1. Check status: `clawdbot status`
2. Send a test message via Telegram
3. If still broken, check logs: `clawdbot gateway logs`

---

## File Locations Reference

| File/Directory | Purpose |
|----------------|---------|
| `~/.clawdbot/clawdbot.json` | Main config |
| `~/.clawdbot/.env` | API keys (fallback) |
| `~/.clawdbot/agents/main/agent/auth-profiles.json` | API keys (primary) |
| `~/.clawdbot/sessions/` | Session state files |
| `~/clawd/` | Workspace (memory, docs, projects) |
| `~/clawd/MEMORY.md` | Long-term memory |
| `~/clawd/HEARTBEAT.md` | Heartbeat config & quick reference |

---

## Session Backups

**Automatic backups run daily at 3 AM ET** (8 AM UTC).

Backups stored in: `~/clawd/backups/`

### Manual Backup

```bash
~/clawd/scripts/backup-sessions.sh
```

### List Available Backups

```bash
ls -lht ~/clawd/backups/sessions_*.tar.gz
```

### Restore from Backup

```bash
~/clawd/scripts/restore-sessions.sh ~/clawd/backups/sessions_2026-02-13_1500.tar.gz
```

**What restore does:**
1. Stops the gateway
2. Creates a safety backup of current (corrupted) sessions
3. Restores from your selected backup
4. Restarts the gateway

After restore, send `/new` via Telegram to start fresh.

### Backup Retention

- Keeps last **7 days** of backups
- Older backups are automatically deleted
- Check backup log: `cat ~/clawd/backups/backup.log`

---

## Emergency Contacts

- **Clawdbot Discord:** https://discord.com/invite/clawd
- **GitHub Issues:** https://github.com/clawdbot/clawdbot/issues
- **Docs:** https://docs.clawd.bot

---

## Prevention Tips

1. **Don't interrupt tool calls** — If Molly is "typing" or processing, let it complete
2. **Use `/new` occasionally** — Keeps sessions lean, reduces corruption risk
3. **Monitor logs periodically** — Catch issues before they cascade
4. **Keep Clawdbot updated** — `clawdbot update` (when explicitly requested)

---

*Last updated: 2026-02-13 by Molly*

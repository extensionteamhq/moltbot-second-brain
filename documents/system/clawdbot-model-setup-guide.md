---
title: 'Clawdbot: Model Provider Setup Guide'
tags:
  - system
  - clawdbot
  - ai-models
  - documentation
created: '2026-02-11T20:54:34+00:00'
updated: '2026-02-12T18:15:00+00:00'
---

# Model Provider Setup Guide

This document describes the standard process for adding new AI model providers to Clawdbot.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Auth Precedence (Highest → Lowest)          │
├─────────────────────────────────────────────────────────────────┤
│  1. auth-profiles.json  →  Primary auth store (recommended)     │
│  2. .env                →  Fallback environment variables       │
│  3. clawdbot.json env   →  Config-embedded env vars (avoid)     │
│  4. models.json apiKey  →  Auto-generated cache (don't edit)    │
└─────────────────────────────────────────────────────────────────┘
```

## File Locations

| File | Purpose | Edit Directly? |
|------|---------|----------------|
| `~/.clawdbot/.env` | Environment variable fallbacks | ✅ Yes |
| `~/.clawdbot/clawdbot.json` | Main config (provider definitions) | ✅ Yes |
| `~/.clawdbot/agents/main/agent/auth-profiles.json` | Primary API key storage | ✅ Yes |
| `~/.clawdbot/agents/main/agent/models.json` | Auto-generated cache | ❌ No (regenerated on restart) |

## Adding a New Provider

### Step 1: Get API Key

Obtain the API key from the provider's dashboard.

### Step 2: Add to auth-profiles.json

Edit `~/.clawdbot/agents/main/agent/auth-profiles.json`:

```json
{
  "version": 1,
  "profiles": {
    "existing:default": { ... },
    "newprovider:default": {
      "type": "api_key",
      "provider": "newprovider",
      "key": "your-api-key-here"
    }
  },
  "lastGood": {
    "existing": "existing:default",
    "newprovider": "newprovider:default"
  },
  "usageStats": {
    "existing:default": { "lastUsed": 1234567890, "errorCount": 0 },
    "newprovider:default": { "lastUsed": 0, "errorCount": 0 }
  }
}
```

### Step 3: Add Fallback to .env (Optional but Recommended)

Edit `~/.clawdbot/.env`:

```bash
NEWPROVIDER_API_KEY=your-api-key-here
```

### Step 4: Configure Provider in clawdbot.json (For Custom Providers)

For built-in providers (anthropic, openai, xai, groq, etc.), skip this step.

For custom/OpenAI-compatible providers, add to `clawdbot.json`:

```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "newprovider": {
        "baseUrl": "https://api.newprovider.com/v1",
        "apiKey": "${NEWPROVIDER_API_KEY}",
        "api": "openai-completions",
        "models": [
          {
            "id": "model-id",
            "name": "Model Display Name",
            "reasoning": false,
            "input": ["text"],
            "cost": { "input": 1.0, "output": 2.0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 128000,
            "maxTokens": 8192
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "models": {
        "newprovider/model-id": { "alias": "Friendly Name" }
      }
    }
  }
}
```

### Step 5: Restart Gateway

```bash
clawdbot gateway restart
```

Or via tool:
```
gateway action=restart reason="Added new provider"
```

### Step 6: Verify

```bash
clawdbot models status
```

Check that the new provider shows `effective=profiles:auth-profiles.json`.

## Built-in vs Custom Providers

### Built-in Providers (No models.providers config needed)
- `anthropic` - ANTHROPIC_API_KEY
- `openai` - OPENAI_API_KEY
- `xai` - XAI_API_KEY
- `groq` - GROQ_API_KEY
- `mistral` - MISTRAL_API_KEY
- `google` - GEMINI_API_KEY

### Custom Providers (Require models.providers config)
- `moonshot` - Kimi models (OpenAI-compatible)
- `kimi-code` - Kimi Code (separate endpoint)
- Any OpenAI-compatible API

## Important: models.json Auto-Generation

⚠️ **The gateway auto-generates `models.json` on every restart!**

- It reads `clawdbot.json` → `models.providers` section
- Resolves env var references (`${VAR}`) to actual values
- Writes the resolved config to `models.json`

**This means:**
- Don't manually edit `models.json` - changes will be overwritten
- The actual API key will appear in `models.json` (unavoidable)
- File permissions are 600 (secure)
- This is expected behavior, not a bug

## Security Checklist

After adding a provider:

- [ ] API key in `auth-profiles.json` (primary)
- [ ] API key in `.env` (fallback)
- [ ] `clawdbot.json` uses `${VAR}` references (not hardcoded keys)
- [ ] No API keys in backup files
- [ ] File permissions are 600 on sensitive files

## Removing a Provider

1. Remove from `auth-profiles.json` (profiles, lastGood, usageStats)
2. Remove from `.env`
3. Remove from `clawdbot.json` (models.providers, agents.defaults.models)
4. Restart gateway
5. `models.json` will be regenerated without the provider

## Troubleshooting

### "Unknown model" error
- Check model ID matches exactly (use `clawdbot models list --all`)
- Ensure provider is configured in `clawdbot.json`

### Auth failures
- Run `clawdbot models status` to see which auth source is being used
- Verify API key is valid
- Check `auth-profiles.json` has correct structure

### models.json keeps reverting
- This is expected - gateway regenerates it on restart
- Edit `clawdbot.json` instead (source of truth)

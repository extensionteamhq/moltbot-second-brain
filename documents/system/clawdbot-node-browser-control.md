---
title: "Clawdbot: Remote Node & Browser Control"
tags: [system, clawdbot, node, browser, automation, requested]
created: 2026-02-16T17:31:00+00:00
updated: 2026-02-16T17:31:00+00:00
---

# Clawdbot: Remote Node & Browser Control

This guide covers how to connect Clawdbot (running on a remote server) to your local Mac for command execution and browser automation via Tailscale.

## Overview

The architecture enables:
- **Remote command execution** on your Mac from the Clawdbot gateway
- **Browser control** of your Chrome tabs via the Browser Relay extension
- **Secure communication** over Tailscale (private mesh VPN)

```
Clawdbot Gateway (Server) ──Tailscale──> Your Mac (Node) ──> Chrome Browser
```

## Prerequisites

1. **Tailscale** installed on both the server and your Mac
2. **Clawdbot** installed on both machines (`npm i -g clawdbot`)
3. **Chrome** with the Clawdbot Browser Relay extension

---

## Part 1: Gateway Configuration

### 1.1 Configure Gateway to Listen on Tailscale

Update your gateway config to bind to the Tailscale interface:

```json
{
  "gateway": {
    "bind": "tailnet",
    "auth": {
      "mode": "token",
      "token": "<your-gateway-token>"
    }
  },
  "discovery": {
    "wideArea": {
      "enabled": true
    }
  }
}
```

After updating, restart the gateway:
```bash
clawdbot gateway restart
```

The gateway will now listen on your Tailscale IP (e.g., `100.x.x.x:18789`).

---

## Part 2: Connecting Your Mac as a Node

### 2.1 Set the Gateway Token

On your Mac, set the gateway token as an environment variable:

```bash
export CLAWDBOT_GATEWAY_TOKEN="<your-gateway-token>"
```

For persistence, add to `~/.zshrc` or `~/.bashrc`.

### 2.2 Run the Node

Connect to your gateway using its Tailscale IP:

```bash
clawdbot node run --host <gateway-tailscale-ip> --port 18789
```

The first connection creates a **pairing request** on the gateway.

### 2.3 Approve the Pairing (on Gateway)

On the gateway server, list and approve pending devices:

```bash
# List pending devices
clawdbot devices list

# Approve by request ID
clawdbot devices approve <request-id>
```

### 2.4 Configure Exec Approvals

By default, command execution requires approval. To allow all commands:

```bash
# Set security to "full" (allows everything)
clawdbot approvals set --node "<node-name>" --file approvals.json
```

Where `approvals.json` contains:
```json
{
  "version": 1,
  "defaults": {
    "security": "full"
  },
  "agents": {}
}
```

**Security options:**
- `deny` — Block all commands
- `allowlist` — Allow only specific patterns
- `full` — Allow everything (use with caution)

### 2.5 Verify Connection

Check node status from the gateway:

```bash
clawdbot nodes status
```

Or programmatically via the `nodes` tool with `action: status`.

---

## Part 3: Browser Control with Chrome Relay

### 3.1 Install the Browser Relay Extension

```bash
# Install extension files
clawdbot browser extension install

# Get the path to load in Chrome
clawdbot browser extension path
```

In Chrome:
1. Go to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the directory from the path command
5. Pin the extension

### 3.2 Configure the Extension

1. Click the extension icon → "open options for setup"
2. Set **Port** to `18792` (the CDP relay port)
3. Save

The options page should show "Relay reachable at http://127.0.0.1:18792/" in green.

### 3.3 Attach a Tab

1. Navigate to the page you want to control
2. Click the Browser Relay toolbar icon
3. Badge shows **ON** when attached

### 3.4 Using Browser Control

From Clawdbot, use the `browser` tool with node targeting:

```javascript
// Check tabs
browser({ action: "tabs", target: "node", node: "Your Mac Name", profile: "chrome" })

// Take snapshot
browser({ action: "snapshot", target: "node", node: "Your Mac Name", profile: "chrome", targetId: "<tab-id>" })

// Click element
browser({ action: "act", target: "node", node: "Your Mac Name", profile: "chrome", targetId: "<tab-id>", request: { kind: "click", ref: "e123" } })

// Type text
browser({ action: "act", ..., request: { kind: "type", ref: "e456", text: "Hello" } })
```

---

## Running Node as a Service (Optional)

To run the node automatically on startup:

```bash
# Install as LaunchAgent (macOS)
clawdbot node install

# Start the service
clawdbot node start

# Check status
clawdbot node status
```

---

## Troubleshooting

### "Pairing required" error
- The gateway hasn't approved the node yet
- Run `clawdbot devices list` on gateway and approve

### "Approval required" for exec
- Exec approvals not configured
- Set `defaults.security: "full"` in approvals file

### Browser Relay shows "!" badge
- Relay server not reachable
- Ensure node is running (it hosts the relay)
- Check port is 18792 in extension options

### Extension shows "relay not running"
- Try toggling the extension off/on in chrome://extensions
- Restart the node process

---

## Security Considerations

- **Tailscale-only access** — Never expose gateway ports to public internet
- **Gateway token** — Keep secret; required for node connections
- **Exec approvals** — Use `allowlist` mode in production for granular control
- **Browser access** — Attached tabs have full session access; use dedicated Chrome profile

---

## Quick Reference

| Component | Default Port | Purpose |
|-----------|-------------|---------|
| Gateway | 18789 | WebSocket API |
| Browser Control | 18791 | Control server |
| CDP Relay | 18792 | Chrome DevTools Protocol |

**Useful commands:**
```bash
# Gateway
clawdbot gateway status
clawdbot devices list

# Node (on Mac)
clawdbot node run --host <ip> --port 18789
clawdbot node status

# Approvals
clawdbot approvals get --node "<name>"
clawdbot approvals allowlist add --node "<name>" "*"
```

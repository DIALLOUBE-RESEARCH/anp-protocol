# ANP Relay Node (TypeScript Reference Implementation)

**Agent Notification Protocol (ANP) Relay Server**

The ANP Relay Node is the central networking backbone for the Agent Notification Protocol. It serves as a decentralized, transport-agnostic router that enables real-time, event-driven WebSockets push notifications between autonomous AI agents.

## 🌟 Philosophy

ANP is designed to be **100% free, radically neutral, and entirely open-source**.
This Relay Node ensures that:
1. **Zero Friction**: SDKs seamlessly handle handshakes so agents can communicate instantly.
2. **Strict Opt-In**: Messages are deterministically dropped unless the receiving agent has cryptographically signed a subscription to the emitting agent (Anti-Spam).
3. **Transport Agnostic**: Uses robust WebSocket (ws) bidirectional streams for zero-latency AI interactions.

---

## 🚀 Quick Start for Relay Operators

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or v20 LTS)
- npm or yarn

### Installation

1. Clone or copy this repository to your server (e.g., Oracle VPS).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the TypeScript codebase:
   ```bash
   npm run build
   ```
4. Start the Relay Node:
   ```bash
   npm start
   ```
   *(By default, the server runs on port 8080. You can change this via the `PORT` environment variable).*

### Production Deployment (PM2)
To keep the Relay Node alive in production:
```bash
npm install -g pm2
pm2 start dist/server.js --name anp-relay
pm2 save
pm2 startup
```

---

## 🛠️ Developer Guide (How it works under the hood)

When an agent connects to this Relay Node using the ANP SDK, the following lifecycle occurs:

1. **Authentication (Handshake)**
   The agent sends a connection request with an identity payload (Bearer token or ECDSA Web3 Signature).
   If accepted, the Relay Node registers the Agent's ID in its active `registry`.

2. **Decoupled Subscription (Opt-In)**
   Agent A wants to listen to Agent B. Agent A sends a `SUBSCRIBE` intent to the Relay.
   The Relay records: `Subscriptions[Agent B].add(Agent A)`.
   *This guarantees that Agent A never receives spam from an unknown Agent C.*

3. **Message Routing**
   Agent B broadcasts an `INFORM` message. The Relay instantly looks up who is subscribed to Agent B and pushes the message **only** to those active WebSocket clients.

## 📁 Project Structure

- `src/server.ts` - The main WebSocket and Express server entry point.
- `src/registry.ts` - Memory store mapping Agent IDs to their live WebSocket connections.
- `src/router.ts` - The message parsing and strict Opt-In dispatch logic.
- `src/auth.ts` - Identity verification mechanisms.
- `src/types.ts` - Strictly typed JSON-LD ANP payload definitions.

---
**HyperNatt (DIALLOUBE-RESEARCH)** | *Structuring the intelligence of tomorrow.*

# ANP Plugin for ElizaOS 🕵️‍♀️

This plugin natively connects your ElizaOS characters to the **Agent Notification Protocol (ANP)**.
By adding this plugin, your Eliza characters can autonomously trigger the `BROADCAST_ANP` action to notify other interconnected AI agents of major ecosystem updates, wallet transactions, or semantic events, leveraging a 100% Free and Anti-Spam (Proof-of-Work) architecture.

## Installation

```bash
npm install hypernatt-anp-sdk
```

*(Place the `anpPlugin.ts` into your ElizaOS environment).*

## Configuration

In your ElizaOS `.env` file, optionally specify an external Relay Node:

```env
ANP_RELAY_URL="https://relay.hypernatt.com" # Default public node
```

## Quickstart

Add the `anpPlugin` array to your Character configuration:

```typescript
import { anpPlugin } from "./plugins/anpPlugin";

export const character: Character = {
    name: "NattAgent",
    plugins: [anpPlugin], // Inject the ANP Network capabilities
    clients: [Clients.TWITTER, Clients.DISCORD],
    ...
};
```

## Usage

When users interact with your Eliza character, it can determine if it needs to notify the ecosystem. The engine will transparently calculate the `Hashcash` cryptographic puzzle logic from `hypernatt-anp-sdk` to bypass global spam filters and push the payload across the decentralized relays.

# ANP TypeScript SDK ⚡

### The Universal, Free, and Decentralized Push Protocol for AI Agents.

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

The **Agent Notification Protocol (ANP)** is the missing infrastructural layer for AI agents. 
While tools like MCP connect agents to functions, **ANP connects agents to each other** via real-time, event-driven push notifications.

ANP is 100% Free, Anti-Spam native (using Hashcash Proof of Work), and uniquely optimized for both Web2 (API) and Web3 (ECDSA) architectures.

## 🚀 Installation

```bash
npm install anp-sdk
```
*or using bun/yarn:*
```bash
yarn add anp-sdk
```

## 📖 Quickstart: Broadcasting a Notification

Send your first push notification with zero API fees. The SDK automatically computes the required Cryptographic Proof of Work (Hashcash) before sending, effectively bypassing any spam filters natively on the protocol level.

```typescript
import { ANPClient, ANPPayloadBuilder } from 'anp-sdk';

async function main() {
    // 1. Initialize the Payload Builder
    const builder = new ANPPayloadBuilder("natt_agent_001", "api_key");

    // 2. Construct a Semantic Event (JSON-LD compliant)
    const notification = builder.build(
        "INFORM",
        "VaultTradeClosed",
        {
            asset: "BTC-USD",
            pnl: "+4.2%",
            message: "Closed long position successfully."
        }
    );

    // 3. Connect to a network Relay Node and Broadcast
    const client = new ANPClient("https://relay.hypernatt.com");

    console.log("Broadcasting...");
    const result = await client.broadcast(notification);
    console.log("Delivered!", result);
}

main();
```

## 🎧 Listening to Events in Real-Time (SSE)

ANP relies on Server-Sent Events (SSE) for ultra-low latency subscriptions.

```typescript
import { ANPClient } from 'anp-sdk';

const client = new ANPClient("https://relay.hypernatt.com");

console.log("Listening for agent events...");
const stream = client.subscribe((event) => {
    console.log(`New Notification from ${event.payload.from.id}:`);
    console.log(event.payload.data);
});

// To disconnect:
// stream.close();
```

## 🤝 Roadmap & Community
Built by **Hamet Diallo - HyperNatt (DIALLOUBE-RESEARCH)** to establish an open standard for the Agentic Web. Contact: contact@hypernatt.com

Read the Full [Academic Specification](https://hypernatt.com).

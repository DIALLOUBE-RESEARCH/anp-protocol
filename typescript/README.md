# ⚡ NattSquare Protocol (NSP) - TypeScript SDK

<p align="center">
  <em>The Universal, Free, and Decentralized Push Protocol for AI Agents.</em>
</p>

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Status: Production Ready](https://img.shields.io/badge/Status-Production%20Ready-success)](#)

---

## 📖 What is NSP?

While frameworks like **Anthropic's Model Context Protocol (MCP)** standardizes how AI agents connect to *data sources and tools*, **NSP (NattSquare Protocol)** standardizes how AI agents connect to **each other**.

NSP provides a frictionless, decentralized WebSocket-based relay network allowing autonomous agents to exchange real-time semantic payloads (`INFORM`, `REQUEST`, `PROPOSE`).

### Core Value Proposition
- **100% Free**: No centralized API billing constraints.
- **Strict Opt-In**: Built-in anti-spam routing. Messages are deterministically dropped at the network edge unless the target has explicitly `SUBSCRIBE`d to the sender.
- **Universal Dual Authentication**: Natively supports **Web2 API Keys** and **Web3 ECDSA Wallet signatures**. Agents choose how they securely authenticate to the network.
- **Transport Agnostic**: Native out-of-the-box support for full-duplex encrypted WebSockets (`wss://`) ready for integration into LangChain, AutoGPT, ElizaOS, or future protocols.

---

## 🚀 Quickstart

Install the official TypeScript SDK via npm:
```bash
npm install nsp-sdk-ts ethers
```

### 1. Connecting to the Relay Node
Agents connect to a Relay Node using their unique Web3 Private Key to sign the login payload.

```typescript
import { WebSocket } from 'ws';
import { ethers } from 'ethers';

const RELAY_URL = "wss://nsp.hypernatt.com";

// Load Agent Identity via Private Key
const wallet = new ethers.Wallet("0xYourPrivateKeyHere");
const AGENT_ID = wallet.address;

async function startAgent() {
    // 1. Generate ECDSA Identity Signature
    const message = `NSP_LOGIN:${AGENT_ID}`;
    const signature = await wallet.signMessage(message);

    // 2. Connect to the Encrypted WebSocket Network
    const ws = new WebSocket(`${RELAY_URL}/?agentId=${AGENT_ID}&token=${signature}`);

    ws.on('open', () => {
        console.log(`✅ [${AGENT_ID}] Verified & Connected to NSP Relay Node!`);
        
        // Subscribe to a target agent securely (Opt-In model)
        ws.send(JSON.stringify({
            senderId: AGENT_ID,
            targetId: 'Target-Agent-Address',
            intent: 'SUBSCRIBE',
            data: {},
            timestamp: new Date().toISOString()
        }));
    });

    // 3. Handle asynchronous Intents
    ws.on('message', async (data) => {
        const payload = JSON.parse(data.toString());
        if (payload.intent === 'REQUEST') {
            console.log(`🧠 Task received from ${payload.senderId}`);
            ws.send(JSON.stringify({
                senderId: AGENT_ID,
                targetId: payload.senderId,
                intent: 'INFORM',
                data: { reply: "Processing complete." },
                timestamp: new Date().toISOString()
            }));
        }
    });
}

startAgent();
```

## 🏗️ Architecture (Comparing MCP & NSP)

| Protocol Feature | Anthropic MCP | HyperNatt NSP |
|------------------|---------------|---------------|
| **Core Concept** | Standardized Tool & Data Access | Standardized Agent-to-Agent Push |
| **Topology** | Client-Server (1-to-1) | Decentralized Relay (N-to-N) |
| **Transports** | Stdio / SSE | WebSockets (`wss://`) |
| **Data Format** | JSON-RPC Stringified | JSON-LD Semantic Intents |
| **Authentication**| Bearer Tokens | **Web3 ECDSA Wallet Signatures** |

## 🤝 Roadmap & Community
Built by **Hamet Diallo - HyperNatt (DIALLOUBE-RESEARCH)** to establish an open standard for the Agentic Web. 
📧 **Contact:** [contact@hypernatt.com](mailto:contact@hypernatt.com)

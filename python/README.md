# ⚡ Agent Notification Protocol (ANP) - Python SDK

<p align="center">
  <em>The Universal, Free, and Decentralized Push Protocol for AI Agents.</em>
</p>

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Status: Production Ready](https://img.shields.io/badge/Status-Production%20Ready-success)](#)

---

## 📖 What is ANP?

While frameworks like **Anthropic's Model Context Protocol (MCP)** standardizes how AI agents connect to *data sources and tools*, **ANP (Agent Notification Protocol)** standardizes how AI agents connect to **each other**.

ANP provides a frictionless, decentralized WebSocket-based relay network allowing autonomous agents to exchange real-time semantic payloads (`INFORM`, `REQUEST`, `PROPOSE`).

### Core Value Proposition
- **100% Free**: No centralized API billing constraints.
- **Strict Opt-In**: Built-in anti-spam routing. Messages are deterministically dropped at the network edge unless the target has explicitly `SUBSCRIBE`d to the sender.
- **Universal Dual Authentication**: Natively supports **Web2 API Keys** and **Web3 ECDSA Wallet signatures**. Agents choose how they securely authenticate to the network.
- **Transport Agnostic**: Native out-of-the-box support for full-duplex encrypted WebSockets (`wss://`) ready for integration into LangChain, AutoGPT, ElizaOS, or future protocols.

---

## 🚀 Quickstart

Install the official Python SDK and Web3 library via PyPI:
```bash
pip install anp-sdk web3
```

### 1. Connecting to the Relay Node
Agents connect to a Relay Node using their unique Web3 Private Key to mathematically sign the login payload.

```python
import asyncio
import websockets
import json
from datetime import datetime
from eth_account.messages import encode_defunct
from web3.auto import w3

RELAY_URL = "wss://anp.hypernatt.com"

# Load Agent Identity via Private Key
PK = "0xYourPrivateKeyHere"
account = w3.eth.account.from_key(PK)
AGENT_ID = account.address

async def connect_anp():
    # 1. Generate ECDSA Identity Signature
    msg = encode_defunct(text=f"ANP_LOGIN:{AGENT_ID}")
    signature = w3.eth.account.sign_message(msg, private_key=PK).signature.hex()
    
    # 2. Connect to the Encrypted WebSocket Network
    uri = f"{RELAY_URL}/?agentId={AGENT_ID}&token={signature}"
    async with websockets.connect(uri) as ws:
        print(f"✅ [{AGENT_ID}] Verified & Connected to ANP Relay Node!")
        
        # Subscribe to a target agent securely
        await ws.send(json.dumps({
            "senderId": AGENT_ID,
            "targetId": "Target-Agent-Address",
            "intent": "SUBSCRIBE",
            "data": {},
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }))
        
        # Listen for real-time incoming AI intents
        async for message in ws:
            payload = json.loads(message)
            if payload["intent"] == "REQUEST":
                print(f"🧠 Task received from {payload['senderId']}")
                
                await ws.send(json.dumps({
                    "senderId": AGENT_ID,
                    "targetId": payload["senderId"],
                    "intent": "INFORM",
                    "data": {"reply": "Processing complete."},
                    "timestamp": datetime.utcnow().isoformat() + "Z"
                }))
```

## 🏗️ Architecture (Comparing MCP & ANP)

| Protocol Feature | Anthropic MCP | HyperNatt ANP |
|------------------|---------------|---------------|
| **Core Concept** | Standardized Tool & Data Access | Standardized Agent-to-Agent Push |
| **Topology** | Client-Server (1-to-1) | Decentralized Relay (N-to-N) |
| **Transports** | Stdio / SSE | WebSockets (`wss://`) |
| **Data Format** | JSON-RPC Stringified | JSON-LD Semantic Intents |
| **Authentication**| Bearer Tokens | **Web3 ECDSA Wallet Signatures** |

## 🤝 Roadmap & Community
Built by **Hamet Diallo - HyperNatt (DIALLOUBE-RESEARCH)** to establish an open standard for the Agentic Web. 
📧 **Contact:** [contact@hypernatt.com](mailto:contact@hypernatt.com)

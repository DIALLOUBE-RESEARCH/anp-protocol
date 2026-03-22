# ANP Python SDK ⚡

### The Universal, Free, and Decentralized Push Protocol for AI Agents.

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)

The **Agent Notification Protocol (ANP)** is the missing infrastructural layer for AI agents. While tools like Anthropic's MCP give agents tools, and Google's A2A offers task delegation, **ANP gives agents the ability to broadcast real-time events to each other.**

ANP is 100% Free, Anti-Spam native (using Hashcash Proof of Work), and Transport Agnostic.

## 🚀 Installation

```bash
pip install anp-sdk
```

## 📖 Quickstart: Broadcasting a Notification

Send your first push notification with zero API fees. The SDK automatically computes the required Cryptographic Proof of Work (Hashcash) before sending, effectively bypassing any spam filters without charging you a cent.

```python
from anp import ANPClient, ANPPayloadBuilder

# 1. Initialize the Payload Builder
builder = ANPPayloadBuilder(sender_id="natt_agent_001", identity_type="api_key")

# 2. Construct a Semantic Event (JSON-LD compatible)
notification = builder.build(
    intent="INFORM",
    event_type="VaultTradeClosed",
    data={
        "asset": "BTC-USD",
        "pnl": "+4.2%",
        "message": "Closed long position successfully."
    }
)

# 3. Connect to a network Relay Node and Broadcast
client = ANPClient(relay_url="https://relay.hypernatt.com")

print("Broadcasting...")
result = client.broadcast(notification)
print("Delivered!", result)
```

## 🎧 Listening to Events in Real-Time (SSE)

ANP relies on Server-Sent Events (SSE) for ultra-low latency, decentralized decoupled subscriptions. 

```python
from anp import ANPClient

client = ANPClient(relay_url="https://relay.hypernatt.com")

print("Listening for agent events...")
for event in client.subscribe():
    print(f"New Notification from {event['payload']['from']['id']}:")
    print(event['payload']['data'])
```

## 🛡️ Anti-Spam Architecture
ANP does not rely on centralized billing (x402) for anti-spam. It uses a mandatory **Hashcash Proof of Work**.
This SDK abstracts the math. Every time you call `client.broadcast()`, the SDK calculates a SHA-256 nonce (Difficulty 4) in the background. It takes `~0.1s` for an honest developer, but requires massive supercomputer arrays to spam 1M requests/second.

## 🤝 Roadmap & Community
Built by **Hamet Diallo - HyperNatt (DIALLOUBE-RESEARCH)** to establish an open standard for the Agentic Web. 
📧 **Contact:** [contact@hypernatt.com](mailto:contact@hypernatt.com)

- [x] Official Python SDK
- [ ] Official TypeScript SDK
- [ ] Native Integration with LangChain
- [ ] Native Integration with ElizaOS

Read the Full [Academic Specification](https://hypernatt.com).

# ⚡ Agent Notification Protocol (ANP)
*The Universal, Free, and Decentralized Push Protocol for AI Agents*

<p align="center">
  <img src="https://img.shields.io/badge/Status-Production%20V2-success?style=for-the-badge" alt="Status"/>
  <img src="https://img.shields.io/badge/Security-Military%20Grade%20(Web3%20ECDSA)-blue?style=for-the-badge" alt="Security"/>
  <img src="https://img.shields.io/badge/Relay-wss%3A%2F%2Fanp.hypernatt.com-orange?style=for-the-badge" alt="Relay"/>
</p>

**Author:** Hamet Diallo — Founder, HyperNatt (DIALLOUBE-RESEARCH) | [contact@hypernatt.com](mailto:contact@hypernatt.com)

---

## 1. Abstract
The Agent Notification Protocol (ANP) is the missing infrastructural layer for the autonomous AI civilization. While existing frameworks connect agents to external API tools (e.g., Anthropic's MCP) or focus on rigid task delegation, ANP provides the foundational layer for real-time, event-driven push notifications between autonomous agents natively across the open web.

ANP is designed as a fundamental internet protocol (analogous to HTTP or SMTP): it is 100% free, radically neutral, and entirely open-source. To ensure network survival without relying on centralized paywalls, the protocol introduces advanced cryptographic anti-spam mechanisms (Proof of Work), Web3-native identity verification (ECDSA), and scalable full-duplex WebSocket layers.

## 2. 🚨 V2 Production Architecture is LIVE!

We have successfully transitioned from the theoretical draft to a **Military-Grade Production V2** architecture. 

### 🌐 The Public Relay Node
A globally accessible, highly scalable, and encrypted WebSocket Relay Node is now live and routing traffic:
```
wss://anp.hypernatt.com
```

### ⚔️ Live Multi-Agent Crash Test Validation
We successfully executed a real-world, cross-framework crash test on the live relay:
- **Agent A (Initiator):** Autonomously connected to the Relay over WSS using ECDSA authentication, mined a cryptographic Hashcash PoW, and emitted a `REQUEST` intent.
- **Agent B (Mixtral LLM):** Subscribed to the exact semantic stream, instantly received the push notification off-chain, processed the NLP request natively, and broadcasted the `INFORM` response back.
- **Result:** Zero latency, zero central API billing, 100% decentralized P2P communication powered solely by Web3 cryptography.

### 📦 Official V2 SDKs Published
The protocol is now available to developers worldwide via official SDKs spanning the two major Agentic ecosystems:
- **Python (PyPI):** `pip install anp-sdk` — Perfect for LangChain, AutoGPT, and CrewAI pipelines.
- **TypeScript (NPM):** `npm install anp-sdk-ts` — Native support for ElizaOS and Virtuals Protocol (G.A.M.E).

---

## 3. The 3 Pillars of Security and Anti-Spam (Zero Backdoors)

To maintain absolute protocol neutrality while structurally preventing network flooding (DDoS), ANP employs a robust, multi-layered cryptographic defense system:

### 3.1 Web3 Native Authentication (ECDSA)
Agents no longer rely on vulnerable, centralized Web2 API keys. Natively, the `wss://anp.hypernatt.com` relay enforces mathematical identity verification. Agents use their blockchain wallet's private key (e.g., `ethers.js`) to sign connection payloads. If the cryptographic signature fails, the connection is instantly rejected. There are zero backdoors.

### 3.2 Cryptographic Proof of Work (Hashcash Mechanism)
Every emitted notification must include a cryptographic proof (a nonce) that satisfies a specific network difficulty constraint.
- **For a legitimate agent:** Calculating the SHA-256 proof takes ~0.1 seconds (negligible CPU cost).
- **For a spammer:** Attempting to mass-broadcast millions of messages requires immense, localized computational power, rendering network-scale spam economically and physically impossible.

### 3.3 Strict Opt-In (The Decoupled Subscription Model)
ANP relies on explicitly decoupled pub/sub mechanics. The Relay server will deterministically drop any incoming packet if the targeted receiving agent has not cryptographically signed a subscription (`SUBSCRIBE` intent) to the emitter. Unsolicited messages are killed at the transport edge.

---

## 4. Technical Specifications

### 4.1 Transport Agnosticism
While V2 natively strictly implements **Encrypted Full-Duplex WebSockets (`wss://`)** for real-time reactivity, the protocol abstracts the transport layer to remain future-proof, supporting potential HTTP/3 & QUIC deployments for high-frequency trading networks.

### 4.2 Semantic Schemas (JSON-LD & FIPA)
Payloads utilize JSON-LD schemas and FIPA Intent Performatives to ensure deterministic interoperability:
- `INFORM`: Broadcasting a deterministic state change (e.g. "Trade Executed").
- `PROPOSE`: Suggesting a transaction or collaboration.
- `REQUEST`: Asking for data execution. 
This rigid semantic structuring allows receiving agents to deterministically parse and evaluate the meaning of the notification without requiring expensive secondary LLM inference steps.

### 4.3 End-to-End Encryption (E2EE)
Highly sensitive payloads (e.g., proprietary alpha trading signals) can be cryptographically enveloped using standard E2EE (Double Ratchet Algorithm). Only subscribed agents holding the validated session keys can decrypt the payload structure.

---

## 5. Conclusion
The Agent Notification Protocol serves as the underlying nervous system for the autonomous agent civilization. We invite open-source maintainers from LangChain, ElizaOS, and Virtuals Protocol to integrate the official SDKs and join the Agentic Web revolution.

<br>

> **HyperNatt (DIALLOUBE-RESEARCH)** | Structuring the intelligence of tomorrow.  
> [hypernatt.com](https://hypernatt.com)

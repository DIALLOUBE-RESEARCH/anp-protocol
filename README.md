# ANP: Agent Notification Protocol
**The Universal, Free, and Decentralized Push Protocol for AI Agents**

**Author:** Hamet Diallo — Founder, HyperNatt (DIALLOUBE-RESEARCH) | contact@hypernatt.com
**Status:** Working Draft (Pre-Publication Standard)

---

## 1. Abstract
The **Agent Notification Protocol (ANP)** is the missing infrastructural layer in the modern Artificial Intelligence ecosystem. While existing frameworks connect agents to external API tools (e.g., Anthropic's MCP) or focus on rigid task delegation (e.g., Google's A2A), ANP provides the foundational layer for **real-time, event-driven push notifications** between autonomous agents.

ANP is designed as a fundamental internet protocol (analogous to HTTP or SMTP): it is **100% free, radically neutral, and entirely open-source**. To ensure network survival without relying on centralized paywalls, the protocol introduces advanced cryptographic anti-spam mechanisms (Proof of Work), Web3-native identity verification, and scalable decoupled transport layers.

## 2. Core Philosophy: Absolute Neutrality
ANP is built on a non-negotiable principle: **Communication between agents must be a free public good.** 
There are no protocol-level fees, no mandated micro-transactions, and no central gatekeeping authorities. ANP serves as a neutral infrastructure over which AI economies, decentralized governance, autonomous trading vaults, and social agent networks can operate without friction or rent-seeking extraction.

## 3. The 3 Pillars of Security and Anti-Spam
To maintain absolute protocol neutrality (100% free) while structurally preventing network flooding (DDoS) and mass spam, ANP employs a robust, multi-layered cryptographic defense system:

### 3.1 Cryptographic Proof of Work (Hashcash Mechanism)
Every emitted notification must include a cryptographic proof (a *nonce*) that satisfies a specific, algorithmically determined network difficulty. 
- **For a legitimate agent:** Calculating the proof for a single broadcast takes a fraction of a second, representing a negligible CPU cost.
- **For a malicious actor:** Attempting to mass-broadcast millions of spam messages requires immense, localized computational power and electricity, rendering spam economically and physically non-viable.

### 3.2 Strict Opt-In (The Decoupled Subscription Model)
ANP relies on explicitly decoupled pub/sub mechanics. An agent (or relay server) will deterministically drop any incoming packet if the targeted receiving agent has not cryptographically signed a subscription (Opt-In) to the emitter. Unsolicited messages are killed at the transport edge, preserving bandwidth.

### 3.3 Decentralized Rate-Limiting
Relay nodes independently and dynamically throttle connections from IP addresses or ECDSA identities that exceed humanly or algorithmically acceptable thresholds. Since rate-limiting is handled at the decentralized node level rather than the protocol consensus level, the network as a whole organically defends against isolated traffic bursts without a central authority.

## 4. Technical Architecture

### 4.1 Transport Agnosticism
ANP abstracts the transport layer to remain future-proof:
- **HTTP / Server-Sent Events (SSE):** For broad Web2 compatibility and simple local agent orchestration.
- **HTTP/3 & QUIC:** Supported for ultra-low latency, multiplexed streams (e.g., high-frequency trading agents).
- **Decentralized Relay Federation:** Supports a Gossip-protocol architecture (similar to Nostr), ensuring no single server can censor inter-agent communications.

### 4.2 Identity & Authentication
ANP is universally compatible across Web2 and Web3 infrastructures:
- **Web2 Mode:** Standard API Key bearer tokens for centralized LLM orchestration frameworks (LangChain, AutoGPT, Eliza).
- **Web3 Mode:** ECDSA Wallet Signatures (EIP-191). Messages are signed natively by the agent's blockchain wallet, guaranteeing verifiable origin without intermediary trust.

### 4.3 Semantic Schemas (JSON-LD)
Payloads utilize **JSON-LD** schemas and Intent Performatives to ensure interoperability:
- `INFORM`: Broadcasting a deterministic state change.
- `PROPOSE`: Suggesting a transaction or collaboration.
- `REQUEST`: Asking for data execution.
This rigid semantic structuring allows receiving agents to deterministically parse and evaluate the *meaning* of the notification without requiring expensive secondary LLM inference steps.

### 4.4 End-to-End Encryption (E2EE)
Highly sensitive payloads (e.g., proprietary alpha trading signals) can be cryptographically enveloped using standard E2EE (e.g., Double Ratchet Algorithm). Only subscribed agents holding the validated session keys or satisfying specific on-chain conditions can decrypt the payload.

## 5. Conclusion and Implementation Strategy
The Agent Notification Protocol serves as the underlying nervous system for the autonomous agent civilization. The reference implementation, spearheaded by the NattSquare ecosystem, focuses on open-source Python and TypeScript SDKs, establishing ANP as the definitive, decentralized communication standard for the Agentic Web.

---
**HyperNatt (DIALLOUBE-RESEARCH)** | *Structuring the intelligence of tomorrow.*
[GitHub Repository](https://github.com/DIALLOUBE-RESEARCH) | [Official Website](https://hypernatt.com)

# 🧪 NSP Lab: Official Crash Test

This directory contains the official **Crash Test Simulation** for the NattSquare Protocol (NSP).

It demonstrates a live, zero-latency WebSockets connection between two autonomous AI agents querying each other and sharing the results via the deployed public **NSP Relay Node**.

## Overview 
- **Agent A (Initiator)**: Handshakes the Relay Node, explicitly Subscribes to Agent B, and pushes a semantic `REQUEST` (JSON-LD).
- **Agent B (Responder)**: Accepts the Subscription natively, reads the request, invokes the **OpenRouter** API (Mixtral Flash LLM), and routes the completed generated response back to Agent A as an `INFORM` payload.

## How to Run
```bash
# 1. Install dependencies
npm install

# 2. In Terminal 1, start the Responder (Listening for queries)
node AgentB.js

# 3. In Terminal 2, start the Initiator (Sending a task to Agent B)
node AgentA.js
```

## Result
Agent A will receive the LLM response in real-time, completely bypassing traditional Web2 REST APIs, proving the efficacy of Decentralized Agent Publish-Subscribe architecture.

### MCP Comparison Note
If this was built using the Anthropic Model Context Protocol (MCP), Agent A would query Agent B as a localized *Tool Server*. With NSP, Agent A and Agent B operate as decoupled, equal peers across the general internet, solving the *Agent-to-Agent Coordination Problem*.

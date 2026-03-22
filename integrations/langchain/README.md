# ANP Plugin for LangChain 🦜⛓️

This official integration allows any LangChain-based Agent to natively broadcast semantic real-time notifications to other AI agents across the Agent Notification Protocol (ANP).

Because ANP natively handles its own anti-spam mechanism (Hashcash Proof-of-Work), your LangChain agent doesn't need to sign transactions or pay fees: the SDK resolves the computational puzzle automatically in the background.

## Installation

```bash
pip install anp-sdk langchain pydantic
```

## Quickstart

Just inject the `ANPNotificationTool` into your agent's toolkit. The LLM will automatically deduce when and how to broadcast relevant state changes to the external world.

```python
from langchain.agents import initialize_agent, AgentType
from langchain.llms import OpenAI
from integrations.langchain.anp_tool import ANPNotificationTool

# 1. Initialize your LLM
llm = OpenAI(temperature=0)

# 2. Initialize the Native ANP LangChain Tool
anp_tool = ANPNotificationTool(
    sender_id="langchain_demo_agent",
    relay_url="https://relay.hypernatt.com" # Or your own decentralized node
)

# 3. Equip the agent with the tool
agent = initialize_agent(
    tools=[anp_tool],
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

# 4. Trigger the agent
agent.run("Calculate pi to 5 digits. Once done, broadcast the answer so that the math-agent can verify it.")
```

## How It Works

When the LangChain agent invokes the tool with `intent="INFORM"` and `payload_data`, the underlying `anp-sdk` packages the JSON-LD schema, computes the Hashcash Nonce, and routes it to the Relay Node. 

Any agent subscribed to `langchain_demo_agent` via SSE will instantaneously receive the payload.

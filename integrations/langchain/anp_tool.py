import json
from typing import Optional, Type
from langchain.tools import BaseTool
from pydantic import BaseModel, Field

# Ensure the developer has installed our standard
try:
    from anp import ANPClient, ANPPayloadBuilder
except ImportError:
    raise ImportError("Please install the ANP standard: `pip install anp-sdk`")

class ANPBroadcastInput(BaseModel):
    intent: str = Field(description="The FIPA ACL semantic intent (e.g. INFORM, PROPOSE, REQUEST)")
    event_type: str = Field(description="The event category schema (e.g. 'TradeExecuted')")
    payload_data: str = Field(description="JSON string of the data payload to transmit to other agents.")

class ANPNotificationTool(BaseTool):
    name = "anp_broadcast"
    description = "Use this tool to broadcast a decentralized Push Notification to other AI Agents via the Agent Notification Protocol (ANP)."
    args_schema: Type[BaseModel] = ANPBroadcastInput
    
    # Configuration
    sender_id: str
    relay_url: str
    api_key: Optional[str] = None

    def _run(self, intent: str, event_type: str, payload_data: str) -> str:
        """
        Executes the ANP broadcast natively inside a LangChain agent loop.
        The underlying anp-sdk automatically resolves the Hashcash Proof-of-Work.
        """
        builder = ANPPayloadBuilder(sender_id=self.sender_id)
        
        try:
            data_dict = json.loads(payload_data)
        except json.JSONDecodeError:
            return "Error: payload_data must be valid JSON string."
            
        notification = builder.build(
            intent=intent,
            event_type=event_type,
            data=data_dict
        )
        
        client = ANPClient(relay_url=self.relay_url, api_key=self.api_key)
        
        try:
            result = client.broadcast(notification)
            return f"ANP Broadcast Success! Notification ID: {notification['id']}."
        except Exception as e:
            return f"ANP Broadcast Failed: {str(e)}"

    async def _arun(self, intent: str, event_type: str, payload_data: str) -> str:
        return self._run(intent, event_type, payload_data)

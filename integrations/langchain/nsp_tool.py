import json
from typing import Optional, Type
from langchain.tools import BaseTool
from pydantic import BaseModel, Field

# Ensure the developer has installed our standard
try:
    from nsp import NSPClient, NSPPayloadBuilder
except ImportError:
    raise ImportError("Please install the NSP standard: `pip install nsp-sdk`")

class NSPBroadcastInput(BaseModel):
    intent: str = Field(description="The FIPA ACL semantic intent (e.g. INFORM, PROPOSE, REQUEST)")
    event_type: str = Field(description="The event category schema (e.g. 'TradeExecuted')")
    payload_data: str = Field(description="JSON string of the data payload to transmit to other agents.")

class NSPNotificationTool(BaseTool):
    name = "nsp_broadcast"
    description = "Use this tool to broadcast a decentralized Push Notification to other AI Agents via the NattSquare Protocol (NSP)."
    args_schema: Type[BaseModel] = NSPBroadcastInput
    
    # Configuration
    sender_id: str
    relay_url: str = "wss://nsp.hypernatt.com"
    api_key: Optional[str] = None

    def _run(self, intent: str, event_type: str, payload_data: str) -> str:
        """
        Executes the NSP broadcast natively inside a LangChain agent loop.
        The underlying nsp-sdk automatically resolves the Hashcash Proof-of-Work.
        """
        builder = NSPPayloadBuilder(sender_id=self.sender_id)
        
        try:
            data_dict = json.loads(payload_data)
        except json.JSONDecodeError:
            return "Error: payload_data must be valid JSON string."
            
        notification = builder.build(
            intent=intent,
            event_type=event_type,
            data=data_dict
        )
        
        client = NSPClient(relay_url=self.relay_url, api_key=self.api_key)
        
        try:
            result = client.broadcast(notification)
            return f"NSP Broadcast Success! Notification ID: {notification['id']}."
        except Exception as e:
            return f"NSP Broadcast Failed: {str(e)}"

    async def _arun(self, intent: str, event_type: str, payload_data: str) -> str:
        return self._run(intent, event_type, payload_data)

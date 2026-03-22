import json
import uuid
from datetime import datetime
from typing import Dict, Any, List

class ANPPayloadBuilder:
    """
    Constructs ANP compliant standard JSON-LD payloads.
    Ensures that every notification has the proper semantic structure 
    and incorporates Intent Performatives (e.g., INFORM, PROPOSE).
    """

    def __init__(self, sender_id: str, identity_type: str = "api_key"):
        if identity_type not in ["api_key", "ecdsa_wallet"]:
            raise ValueError("identity_type must be either 'api_key' or 'ecdsa_wallet'")
        self.sender_id = sender_id
        self.identity_type = identity_type

    def build(self, 
              intent: str, 
              event_type: str, 
              data: Dict[str, Any], 
              extensions: List[str] = None) -> Dict[str, Any]:
        """
        Builds the final ANP message structure ready for PoW and signing.
        
        :param intent: FIPA ACL inspired intent (INFORM, REQUEST, PROPOSE)
        :param event_type: A custom string defining the semantic event (e.g. 'TradeSignal')
        :param data: The actual payload dictionary
        :param extensions: Optional protocol extensions
        """
        message_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat() + "Z"
        
        payload = {
            "@context": "https://hypernatt.com/anp/v2/context.jsonld",
            "anp_version": "2.0-draft", # Future proofing the spec
            "id": message_id,
            "type": "Notification",
            "intent": intent.upper(),
            "from": {
                "id": self.sender_id,
                "identity_type": self.identity_type
            },
            "timestamp": timestamp,
            "event_type": event_type,
            "data": data,
            "extensions": extensions or []
        }
        
        return payload

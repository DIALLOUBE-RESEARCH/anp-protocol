import json
import requests
import hashlib
from typing import Iterator, Dict, Any, Optional
from .crypto import NSPCrypto

class NSPClient:
    """
    The official Python Client to broadcast and subscribe to NSP messages
    over a Relay Node infrastructure.
    """

    def __init__(self, relay_url: str, api_key: Optional[str] = None):
        """
        :param relay_url: The URL of the NSP Relay Node (e.g. wss://nsp.hypernatt.com)
        :param api_key: Web2 authentication token if the node requires it.
        """
        self.relay_url = relay_url.rstrip("/")
        self.api_key = api_key
        self.session = requests.Session()
        if self.api_key:
            self.session.headers.update({"Authorization": f"Bearer {self.api_key}"})

    def broadcast(self, payload: Dict[str, Any], web3_private_key: Optional[str] = None) -> Dict[str, Any]:
        """
        Automatically computes the required Proof of Work (Hashcash),
        injects it into the notification envelope, and broadcasts to the relay network.
        """
        payload_str = json.dumps(payload, sort_keys=True)
        payload_hash = hashlib.sha256(payload_str.encode('utf-8')).hexdigest()
        
        # Calculate Anti-Spam Free Proof of Work (Difficulty 4)
        print(f"NSP SDK: Calculating Hashcash PoW for payload...")
        proof = NSPCrypto.generate_proof_of_work(payload_hash, difficulty=4)
        print(f"NSP SDK: PoW computed! Nonce: {proof['nonce']}")
        
        envelope = {
            "payload": payload,
            "proof_of_work": proof
        }
        
        if web3_private_key:
            # Here we would use eth_account to add an ECDSA signature
            # envelope["signature"] = NSPCrypto.sign_payload_ecdsa(web3_private_key, payload_str)
            pass

        # Send to the Relay
        url = f"{self.relay_url}/api/v1/broadcast"
        response = self.session.post(url, json=envelope)
        response.raise_for_status()
        return response.json()

    def subscribe(self) -> Iterator[Dict[str, Any]]:
        """
        Connects to the Relay via Server-Sent Events (SSE) to receive
        real-time notifications from subscribed agents.
        Requires sseclient-py to parse the stream perfectly.
        """
        import sseclient
        
        url = f"{self.relay_url}/api/v1/stream"
        response = self.session.get(url, stream=True)
        response.raise_for_status()
        
        client = sseclient.SSEClient(response)
        
        for event in client.events():
            if event.data:
                parsed = json.loads(event.data)
                yield parsed

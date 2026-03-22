import hashlib
import time
import json
from typing import Optional, Dict

class ANPCrypto:
    """
    Handles cryptographic requirements for the Agent Notification Protocol (ANP).
    Focuses on the Hashcash (Proof of Work) anti-spam mechanism and Web3 ECDSA signing.
    """
    
    @staticmethod
    def generate_proof_of_work(payload_hash: str, difficulty: int = 4) -> dict:
        """
        Generates a Hashcash-style Proof of Work (PoW) nonce for a given payload.
        The difficulty is the number of leading zero hex characters required in the resulting hash.
        A difficulty of 4 takes a fraction of a second for a valid agent, but stops mass spammers.
        """
        nonce = 0
        target_prefix = '0' * difficulty
        timestamp = int(time.time())
        
        while True:
            # The data we are hashing: the payload, the timestamp, and our guessing nonce
            data_to_hash = f"{payload_hash}:{timestamp}:{nonce}".encode('utf-8')
            hash_result = hashlib.sha256(data_to_hash).hexdigest()
            
            if hash_result.startswith(target_prefix):
                return {
                    "nonce": nonce,
                    "timestamp": timestamp,
                    "difficulty": difficulty,
                    "hash": hash_result
                }
            nonce += 1

    @staticmethod
    def verify_proof_of_work(payload_hash: str, proof: dict) -> bool:
        """
        Verifies that the provided Proof of Work is valid linearly and instantly.
        Relay servers run this check to block spam.
        """
        nonce = proof.get("nonce")
        timestamp = proof.get("timestamp")
        difficulty = proof.get("difficulty", 4)
        
        target_prefix = '0' * difficulty
        data_to_hash = f"{payload_hash}:{timestamp}:{nonce}".encode('utf-8')
        hash_result = hashlib.sha256(data_to_hash).hexdigest()
        
        return hash_result.startswith(target_prefix)

    @staticmethod
    def sign_payload_ecdsa(private_key: str, payload_str: str) -> str:
        """
        (Placeholder) Web3 Mode: Signs the notification payload using the Agent's Ethereum Private Key.
        Requires eth_account library.
        """
        pass

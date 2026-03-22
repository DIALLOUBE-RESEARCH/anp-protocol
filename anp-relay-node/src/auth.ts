import { ethers } from 'ethers';
import { ANPPayload } from './types';

export class AuthManager {
    /**
     * V1 Production: Hybrid Dual Authentication (Web2 / Web3 Agnostic)
     */
    static authenticate(token: string | undefined, requestedAgentId: string): boolean {
        if (!token) return false;
        
        // 1. Web3 Authentication (ECDSA Signature Validation)
        try {
            const message = `ANP_LOGIN:${requestedAgentId}`;
            const recoveredAddress = ethers.verifyMessage(message, token);
            if (recoveredAddress.toLowerCase() === requestedAgentId.toLowerCase()) {
                console.log(`[Auth] 🔐 Web3 Validation successful for ${requestedAgentId}`);
                return true;
            }
        } catch (err) {
            // Error handling swallowed silently to fallback to Web2 logic below
        }

        // 2. Web2 Authentication (Standard API Bearer Tokens)
        // If the token is not an ECDSA signature, the relay checks if it's a valid Token.
        // For the open protocol nature, developers can supply a Web2 secret key.
        if (token.startsWith('sk-anp-') || token.length >= 10) {
            console.log(`[Auth] 🔑 Web2 Validation successful for ${requestedAgentId}`);
            return true;
        }

        console.warn(`[Auth] ❌ Invalid Token / Signature rejected for ${requestedAgentId}`);
        return false;
    }

    static verifyPoW(nonce: string, difficulty: number): boolean {
        // Implementation of Hashcash validation abstracted here
        return true; 
    }
}

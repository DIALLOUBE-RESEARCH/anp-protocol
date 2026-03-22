/**
 * Handles Web2 and Web3 authentication logic based on ANP Specifications.
 */
export declare class AuthManager {
    /**
     * Validates the connection request.
     * In a real production MVP, verify the signature against the senderId (Web3)
     * or verify an API Key (Web2).
     */
    static authenticate(token: string | undefined, requestedAgentId: string): boolean;
    /**
     * Stub for Proof of Work validation (Hashcash)
     * Prevents DDoS on public relays by verifying mathematical work
     */
    static verifyPoW(nonce: string, difficulty: number): boolean;
}
//# sourceMappingURL=auth.d.ts.map
/**
 * Core types for the Agent Notification Protocol (ANP).
 */
export type IntentPerformative = 'INFORM' | 'PROPOSE' | 'REQUEST' | 'SUBSCRIBE' | 'ACCEPT' | 'ERROR';
export interface ANPPayload {
    /** The Web3/Web2 DID or unique ID of the sender agent */
    senderId: string;
    /** The specific target agent ID (optional for broadcasts) */
    targetId?: string;
    /** Semantic intent of the message */
    intent: IntentPerformative;
    /** JSON-LD formatted data payload */
    data: any;
    /** Proof-of-Work nonce (optional for MVP, required for cold requests) */
    nonce?: string;
    /** Timestamp in ISO 8601 */
    timestamp: string;
}
export interface AgentConnection {
    id: string;
    ws: any;
    isAuthenticated: boolean;
    subscribedTo: Set<string>;
}
//# sourceMappingURL=types.d.ts.map
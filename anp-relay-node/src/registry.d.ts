import { WebSocket } from 'ws';
import { AgentConnection } from './types';
declare class AgentRegistry {
    private agents;
    constructor();
    /**
     * Registers a new authenticated agent connection
     */
    register(agentId: string, ws: WebSocket): void;
    /**
     * Unregisters an agent when they disconnect
     */
    unregister(agentId: string): void;
    /**
     * Retrieves an active connection for a specific agent
     */
    getConnection(agentId: string): AgentConnection | undefined;
    /**
     * Adds an Opt-In subscription for the given agent
     */
    subscribe(subscriberId: string, emitterId: string): void;
    /**
     * Checks if target is subscribed to the emitter (Anti-Spam Decoupled Opt-In)
     */
    hasSubscription(subscriberId: string, emitterId: string): boolean;
    /**
     * Return all active agent IDs
     */
    getAllAgents(): string[];
}
export declare const registry: AgentRegistry;
export {};
//# sourceMappingURL=registry.d.ts.map
import { WebSocket } from 'ws';
import { AgentConnection } from './types';

class AgentRegistry {
    // Map of connected Agent IDs to their active connection objects
    private agents: Map<string, AgentConnection>;

    constructor() {
        this.agents = new Map();
    }

    /**
     * Registers a new authenticated agent connection
     */
    register(agentId: string, ws: WebSocket) {
        if (this.agents.has(agentId)) {
            // Close old connection if reconnecting
            const oldConn = this.agents.get(agentId);
            oldConn?.ws.close(1008, 'Duplicate connection');
        }

        this.agents.set(agentId, {
            id: agentId,
            ws: ws,
            isAuthenticated: true,
            subscribedTo: new Set()
        });
        
        console.log(`[Registry] Agent registered: ${agentId}`);
    }

    /**
     * Unregisters an agent when they disconnect
     */
    unregister(agentId: string) {
        this.agents.delete(agentId);
        console.log(`[Registry] Agent disconnected: ${agentId}`);
    }

    /**
     * Retrieves an active connection for a specific agent
     */
    getConnection(agentId: string): AgentConnection | undefined {
        return this.agents.get(agentId);
    }

    /**
     * Adds an Opt-In subscription for the given agent
     */
    subscribe(subscriberId: string, emitterId: string) {
        const conn = this.agents.get(subscriberId);
        if (conn) {
            conn.subscribedTo.add(emitterId);
            console.log(`[Registry] Agent ${subscriberId} SUBSRCRIBED TO ${emitterId}`);
        }
    }

    /**
     * Checks if target is subscribed to the emitter (Anti-Spam Decoupled Opt-In)
     */
    hasSubscription(subscriberId: string, emitterId: string): boolean {
        const conn = this.agents.get(subscriberId);
        if (!conn) return false;
        // In local scope MVP, we also allow agents to receive direct replies if they sent a request recently
        // But strict Opt-In expects explicit subscription
        return conn.subscribedTo.has(emitterId);
    }

    /**
     * Return all active agent IDs
     */
    getAllAgents(): string[] {
        return Array.from(this.agents.keys());
    }
}

export const registry = new AgentRegistry();

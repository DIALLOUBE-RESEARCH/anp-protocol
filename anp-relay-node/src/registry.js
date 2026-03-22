"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registry = void 0;
const ws_1 = require("ws");
const types_1 = require("./types");
class AgentRegistry {
    // Map of connected Agent IDs to their active connection objects
    agents;
    constructor() {
        this.agents = new Map();
    }
    /**
     * Registers a new authenticated agent connection
     */
    register(agentId, ws) {
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
    unregister(agentId) {
        this.agents.delete(agentId);
        console.log(`[Registry] Agent disconnected: ${agentId}`);
    }
    /**
     * Retrieves an active connection for a specific agent
     */
    getConnection(agentId) {
        return this.agents.get(agentId);
    }
    /**
     * Adds an Opt-In subscription for the given agent
     */
    subscribe(subscriberId, emitterId) {
        const conn = this.agents.get(subscriberId);
        if (conn) {
            conn.subscribedTo.add(emitterId);
            console.log(`[Registry] Agent ${subscriberId} SUBSRCRIBED TO ${emitterId}`);
        }
    }
    /**
     * Checks if target is subscribed to the emitter (Anti-Spam Decoupled Opt-In)
     */
    hasSubscription(subscriberId, emitterId) {
        const conn = this.agents.get(subscriberId);
        if (!conn)
            return false;
        // In local scope MVP, we also allow agents to receive direct replies if they sent a request recently
        // But strict Opt-In expects explicit subscription
        return conn.subscribedTo.has(emitterId);
    }
    /**
     * Return all active agent IDs
     */
    getAllAgents() {
        return Array.from(this.agents.keys());
    }
}
exports.registry = new AgentRegistry();
//# sourceMappingURL=registry.js.map
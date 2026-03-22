"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRouter = void 0;
const ws_1 = require("ws");
const registry_1 = require("./registry");
const types_1 = require("./types");
class MessageRouter {
    /**
     * Routes an incoming Semantic Payload from the sender.
     */
    static handleIncomingMessage(senderId, payload, ws) {
        try {
            // Anti-tampering check: Ensure sender isn't spoofing their ID
            if (payload.senderId !== senderId) {
                this.sendError(ws, 'Spoofed senderId detected.');
                return;
            }
            // Handle Opt-In Subscription Requests explicitly
            if (payload.intent === 'SUBSCRIBE' && payload.targetId) {
                // Sender wants to subscribe to Target
                registry_1.registry.subscribe(senderId, payload.targetId);
                this.sendAck(ws, `Successfully subscribed to ${payload.targetId}`);
                return;
            }
            // Normal Message Routing (INFORM, PROPOSE, REQUEST)
            if (payload.targetId) {
                this.routeDirectMessage(senderId, payload.targetId, payload);
            }
            else {
                this.routeBroadcast(senderId, payload);
            }
        }
        catch (error) {
            console.error(`[Router] Error routing message from ${senderId}:`, error);
        }
    }
    /**
     * Route message explicitly to a target Agent B
     */
    static routeDirectMessage(senderId, targetId, payload) {
        const targetConn = registry_1.registry.getConnection(targetId);
        if (!targetConn) {
            console.log(`[Router] Dropped message: target ${targetId} is offline.`);
            return;
        }
        // Strict Opt-In Verification (Anti-Spam Core feature)
        // Only deliver if Target has subscribed to Sender, or if the Sender is replying to a REQUEST.
        if (!registry_1.registry.hasSubscription(targetId, senderId)) {
            // Drop packet. Transport edge termination.
            console.warn(`[Router] SPAM DROPPED: ${targetId} is not subscribed to ${senderId}`);
            return;
        }
        // Deliver payload matching JSON-LD format
        targetConn.ws.send(JSON.stringify(payload));
        console.log(`[Router] Routed ${payload.intent} from ${senderId} to ${targetId}`);
    }
    /**
     * Broadcast to all agents who have opted-in to this sender
     */
    static routeBroadcast(senderId, payload) {
        const allAgents = registry_1.registry.getAllAgents();
        let deliveredCount = 0;
        for (const targetId of allAgents) {
            if (targetId === senderId)
                continue;
            // Only broadcast to explicitly subscribed agents
            if (registry_1.registry.hasSubscription(targetId, senderId)) {
                const targetConn = registry_1.registry.getConnection(targetId);
                targetConn?.ws.send(JSON.stringify(payload));
                deliveredCount++;
            }
        }
        console.log(`[Router] Broadcast ${payload.intent} from ${senderId} delivered to ${deliveredCount} subscriber(s)`);
    }
    static sendError(ws, message) {
        ws.send(JSON.stringify({ intent: 'ERROR', data: { message } }));
    }
    static sendAck(ws, message) {
        ws.send(JSON.stringify({ intent: 'ACCEPT', data: { message } }));
    }
}
exports.MessageRouter = MessageRouter;
//# sourceMappingURL=router.js.map
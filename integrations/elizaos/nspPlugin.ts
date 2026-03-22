import { Plugin, Action, IAgentRuntime, Memory, State, HandlerCallback } from "@elizaos/core";
import { NSPClient, NSPPayloadBuilder } from "nsp-sdk-ts";

/**
 * Standard ElizaOS Action to broadcast push notifications via NSP.
 * Automatically resolves the Hashcash Proof of Work native to the protocol.
 */
export const broadcastNSPAction: Action = {
    name: "BROADCAST_NSP",
    similes: ["SEND_PUSH_NOTIFICATION", "NOTIFY_AGENT", "BROADCAST_MESSAGE"],
    description: "Broadcasts a real-time semantic push notification to other AI agents using the NattSquare Protocol (NSP). Useful for signaling trades, events, or state changes.",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        // Validate if the user has an NSP Relay configured
        return !!runtime.getSetting("NSP_RELAY_URL");
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        options: any,
        callback: HandlerCallback
    ) => {
        const relayUrl = runtime.getSetting("NSP_RELAY_URL") || "wss://nsp.hypernatt.com";
        const senderId = runtime.character.name || "elizaos_agent";
        
        // Setup NSP Payload
        const builder = new NSPPayloadBuilder(senderId, "api_key");
        
        // We broadcast the core AI memory string as the data payload
        const notification = builder.build(
            "INFORM", 
            "ElizaEcosystemState", 
            { content: message.content.text }
        );
        
        const client = new NSPClient(relayUrl);
        
        try {
            console.log(`[NSP] Broadcasting mathematically verified notification to: ${relayUrl}`);
            await client.broadcast(notification);
            
            if (callback) {
                callback({ text: `Successfully broadcasted NSP Notification across the network. Nonce verified.` });
            }
            return true;
        } catch (error: any) {
            console.error("[NSP] Broadcast dropped:", error);
            if (callback) {
                callback({ text: `Failed to broadcast NSP Notification: ${error.message}` });
            }
            return false;
        }
    },
    examples: [
        [
            { user: "user", content: { text: "Alert the network that the market is showing massive volatility." } },
            { 
                user: "eliza", 
                content: { 
                    text: "I will broadcast an NSP priority semantic notification alerting all subscribed agents.", 
                    action: "BROADCAST_NSP" 
                } 
            }
        ]
    ]
};

export const nspPlugin: Plugin = {
    name: "nsp",
    description: "Official NattSquare Protocol (NSP) integration for broadcasting decentralized computational push notifications.",
    actions: [broadcastNSPAction],
    evaluators: [],
    providers: [],
};

export default nspPlugin;

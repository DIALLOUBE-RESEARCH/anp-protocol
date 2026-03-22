import { Plugin, Action, IAgentRuntime, Memory, State, HandlerCallback } from "@elizaos/core";
import { ANPClient, ANPPayloadBuilder } from "hypernatt-anp-sdk";

/**
 * Standard ElizaOS Action to broadcast push notifications via ANP.
 * Automatically resolves the Hashcash Proof of Work native to the protocol.
 */
export const broadcastANPAction: Action = {
    name: "BROADCAST_ANP",
    similes: ["SEND_PUSH_NOTIFICATION", "NOTIFY_AGENT", "BROADCAST_MESSAGE"],
    description: "Broadcasts a real-time semantic push notification to other AI agents using the Agent Notification Protocol (ANP). Useful for signaling trades, events, or state changes.",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        // Validate if the user has an ANP Relay configured
        return !!runtime.getSetting("ANP_RELAY_URL");
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        options: any,
        callback: HandlerCallback
    ) => {
        const relayUrl = runtime.getSetting("ANP_RELAY_URL") || "https://relay.hypernatt.com";
        const senderId = runtime.character.name || "elizaos_agent";
        
        // Setup ANP Payload
        const builder = new ANPPayloadBuilder(senderId, "api_key");
        
        // We broadcast the core AI memory string as the data payload
        const notification = builder.build(
            "INFORM", 
            "ElizaEcosystemState", 
            { content: message.content.text }
        );
        
        const client = new ANPClient(relayUrl);
        
        try {
            console.log(`[ANP] Broadcasting mathematically verified notification to: ${relayUrl}`);
            await client.broadcast(notification);
            
            if (callback) {
                callback({ text: `Successfully broadcasted ANP Notification across the network. Nonce verified.` });
            }
            return true;
        } catch (error: any) {
            console.error("[ANP] Broadcast dropped:", error);
            if (callback) {
                callback({ text: `Failed to broadcast ANP Notification: ${error.message}` });
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
                    text: "I will broadcast an ANP priority semantic notification alerting all subscribed agents.", 
                    action: "BROADCAST_ANP" 
                } 
            }
        ]
    ]
};

export const anpPlugin: Plugin = {
    name: "anp",
    description: "Official Agent Notification Protocol (ANP) integration for broadcasting decentralized computational push notifications.",
    actions: [broadcastANPAction],
    evaluators: [],
    providers: [],
};

export default anpPlugin;

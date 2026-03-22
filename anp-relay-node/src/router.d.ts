import { WebSocket } from 'ws';
import { ANPPayload } from './types';
export declare class MessageRouter {
    /**
     * Routes an incoming Semantic Payload from the sender.
     */
    static handleIncomingMessage(senderId: string, payload: ANPPayload, ws: WebSocket): void;
    /**
     * Route message explicitly to a target Agent B
     */
    private static routeDirectMessage;
    /**
     * Broadcast to all agents who have opted-in to this sender
     */
    private static routeBroadcast;
    private static sendError;
    private static sendAck;
}
//# sourceMappingURL=router.d.ts.map
import { v4 as uuidv4 } from 'uuid';

export type IdentityType = 'api_key' | 'ecdsa_wallet';

export interface NSPNotification {
    "@context": string;
    nsp_version: string;
    id: string;
    type: string;
    intent: string;
    from: {
        id: string;
        identity_type: IdentityType;
    };
    timestamp: string;
    event_type: string;
    data: Record<string, any>;
    extensions?: string[];
}

export class NSPPayloadBuilder {
    private senderId: string;
    private identityType: IdentityType;

    /**
     * Constructs NSP compliant standard JSON-LD payloads.
     */
    constructor(senderId: string, identityType: IdentityType = 'api_key') {
        this.senderId = senderId;
        this.identityType = identityType;
    }

    /**
     * Builds the final NSP message structure ready for PoW and signing.
     */
    build(
        intent: string,
        eventType: string,
        data: Record<string, any>,
        extensions?: string[]
    ): NSPNotification {
        return {
            "@context": "https://hypernatt.com/nsp/v2/context.jsonld",
            "nsp_version": "2.0-draft",
            "id": uuidv4(),
            "type": "Notification",
            "intent": intent.toUpperCase(),
            "from": {
                "id": this.senderId,
                "identity_type": this.identityType
            },
            "timestamp": new Date().toISOString(),
            "event_type": eventType,
            "data": data,
            "extensions": extensions || []
        };
    }
}

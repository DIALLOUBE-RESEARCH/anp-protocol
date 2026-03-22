import { v4 as uuidv4 } from 'uuid';

export type IdentityType = 'api_key' | 'ecdsa_wallet';

export interface ANPNotification {
    "@context": string;
    anp_version: string;
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

export class ANPPayloadBuilder {
    private senderId: string;
    private identityType: IdentityType;

    /**
     * Constructs ANP compliant standard JSON-LD payloads.
     */
    constructor(senderId: string, identityType: IdentityType = 'api_key') {
        this.senderId = senderId;
        this.identityType = identityType;
    }

    /**
     * Builds the final ANP message structure ready for PoW and signing.
     */
    build(
        intent: string,
        eventType: string,
        data: Record<string, any>,
        extensions?: string[]
    ): ANPNotification {
        return {
            "@context": "https://hypernatt.com/anp/v2/context.jsonld",
            "anp_version": "2.0-draft",
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

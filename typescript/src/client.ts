import axios from 'axios';
import EventSource from 'eventsource';
import * as crypto from 'crypto';
import { NSPCrypto, ProofOfWork } from './crypto';

interface NSPEnvelope {
    payload: Record<string, any>;
    proof_of_work: ProofOfWork;
    signature?: string;
}

export class NSPClient {
    private relayUrl: string;
    private apiKey?: string;

    constructor(relayUrl: string, apiKey?: string) {
        this.relayUrl = relayUrl.replace(/\/$/, "");
        this.apiKey = apiKey;
    }

    private getHeaders() {
        return this.apiKey ? { "Authorization": `Bearer ${this.apiKey}` } : {};
    }

    /**
     * Submits a notification envelope to the relay network.
     * Automatically computes the Hashcash PoW (Difficulty 4) required to bypass spam filters natively.
     */
    async broadcast(payload: Record<string, any>, web3PrivateKey?: string): Promise<any> {
        const payloadStr = JSON.stringify(payload);
        const payloadHash = crypto.createHash('sha256').update(payloadStr).digest('hex');
        
        console.log("NSP SDK: Calculating Anti-Spam Proof of Work (Hashcash)...");
        const proof = NSPCrypto.generateProofOfWork(payloadHash, 4);
        console.log(`NSP SDK: PoW resolved! Nonce: ${proof.nonce}`);

        const envelope: NSPEnvelope = {
            payload,
            proof_of_work: proof
        };

        if (web3PrivateKey) {
            // Placeholder for Ethers.js ECDSA signing 
            // const wallet = new ethers.Wallet(web3PrivateKey);
            // envelope.signature = await wallet.signMessage(payloadStr);
        }

        const url = `${this.relayUrl}/api/v1/broadcast`;
        const response = await axios.post(url, envelope, { headers: this.getHeaders() });
        return response.data;
    }

    /**
     * Opens an SSE connection to the Relay Node to stream subscribed agent events.
     * Yields parsed JSON objects as they arrive.
     */
    subscribe(onMessage: (event: any) => void, onError?: (err: any) => void): EventSource {
        const url = `${this.relayUrl}/api/v1/stream`;
        const es = new EventSource(url, { headers: this.getHeaders() });

        es.onmessage = (event) => {
            try {
                const parsed = JSON.parse(event.data);
                onMessage(parsed);
            } catch (err) {
                console.error("Failed to parse SSE message", err);
            }
        };

        es.onerror = (err) => {
            if (onError) onError(err);
        };

        return es;
    }
}

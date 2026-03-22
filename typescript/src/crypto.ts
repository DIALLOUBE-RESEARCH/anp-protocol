import * as crypto from 'crypto';

export interface ProofOfWork {
    nonce: number;
    timestamp: number;
    difficulty: number;
    hash: string;
}

export class NSPCrypto {
    /**
     * Generates a Hashcash-style Proof of Work (PoW) nonce for a given payload.
     * Stops spammers natively at the protocol level without arbitrary fees.
     */
    static generateProofOfWork(payloadHash: string, difficulty: number = 4): ProofOfWork {
        let nonce = 0;
        const targetPrefix = '0'.repeat(difficulty);
        const timestamp = Math.floor(Date.now() / 1000);

        while (true) {
            const dataToHash = `${payloadHash}:${timestamp}:${nonce}`;
            const hashResult = crypto.createHash('sha256').update(dataToHash).digest('hex');

            if (hashResult.startsWith(targetPrefix)) {
                return {
                    nonce,
                    timestamp,
                    difficulty,
                    hash: hashResult
                };
            }
            nonce++;
        }
    }

    /**
     * Verifies that the provided Proof of Work is valid.
     * Servers and relay nodes execute this verification.
     */
    static verifyProofOfWork(payloadHash: string, proof: ProofOfWork): boolean {
        const { nonce, timestamp, difficulty } = proof;
        const targetPrefix = '0'.repeat(difficulty);
        const dataToHash = `${payloadHash}:${timestamp}:${nonce}`;
        const hashResult = crypto.createHash('sha256').update(dataToHash).digest('hex');

        return hashResult.startsWith(targetPrefix);
    }
}

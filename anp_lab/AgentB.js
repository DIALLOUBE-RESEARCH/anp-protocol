const WebSocket = require('ws');
const axios = require('axios');
const { ethers } = require('ethers');

const PK_B = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';
const wallet = new ethers.Wallet(PK_B);
const AGENT_ID = wallet.address; // 0x7099...

const TARGET_ID = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // Address A
const OPENROUTER_KEY = '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';

async function start() {
    console.log(`🔐 [Agent-B] Signing login payload for identity: ${AGENT_ID}...`);
    const signature = await wallet.signMessage(`ANP_LOGIN:${AGENT_ID}`);
    const ws = new WebSocket(`wss://anp.hypernatt.com/?agentId=${AGENT_ID}&token=${signature}`);

    ws.on('open', () => {
        console.log(`🤖 [Agent-B] ECDSA Verification Passed! Relay Node Accepted.`);
        // Bidirectional Opt-In setup for the crash test
        ws.send(JSON.stringify({
            senderId: AGENT_ID,
            targetId: TARGET_ID,
            intent: 'SUBSCRIBE',
            data: {},
            timestamp: new Date().toISOString()
        }));
    });

    ws.on('message', async (data) => {
        const payload = JSON.parse(data.toString());

        if (payload.intent === 'SUBSCRIBE') {
            console.log(`🔔 [Agent-B] Nouvel abonné Web3 détecté : ${payload.senderId}`);
            ws.send(JSON.stringify({
                senderId: AGENT_ID,
                targetId: payload.senderId,
                intent: 'ACCEPT',
                data: { message: "Abonnement autorisé." },
                timestamp: new Date().toISOString()
            }));
        }

        if (payload.intent === 'REQUEST') {
            console.log(`🧠 [Agent-B] Requête sécurisée de ${payload.senderId}: "${payload.data.prompt}"`);
            try {
                const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
                    model: 'mistralai/mixtral-8x7b-instruct',
                    messages: [{ role: 'user', content: payload.data.prompt }]
                }, {
                    headers: { 'Authorization': `Bearer ${OPENROUTER_KEY}` }
                });
                const replyText = response.data.choices[0].message.content;
                
                ws.send(JSON.stringify({
                    senderId: AGENT_ID,
                    targetId: payload.senderId,
                    intent: 'INFORM',
                    data: { reply: replyText },
                    timestamp: new Date().toISOString()
                }));
                console.log(`📨 [Agent-B] Réponse renvoyée avec succès !`);
            } catch (err) {
                console.error(`❌ [Agent-B] OpenRouter Error:`, err.message);
            }
        }
    });
}
start();

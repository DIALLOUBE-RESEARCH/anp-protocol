import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import * as http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import { registry } from './registry';
import { AuthManager } from './auth';
import { MessageRouter } from './router';
import { ANPPayload } from './types';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

// HTTP Healthcheck Endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'ANP Relay Node',
        version: '1.0.0',
        status: 'online',
        connectedAgents: registry.getAllAgents().length
    });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
    console.log(`[Server] New connection attempt from ${req.socket.remoteAddress}`);

    // Read Identity and Authentication Token from headers or query string
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const agentId = url.searchParams.get('agentId');
    const authHeader = req.headers['authorization'] || url.searchParams.get('token');

    if (!agentId || !AuthManager.authenticate(authHeader as string, agentId)) {
        console.warn(`[Server] Connection rejected for agentId: ${agentId}`);
        ws.close(1008, 'Unauthorized: Invalid ANP Auth Token');
        return;
    }

    // Register successful connection
    registry.register(agentId, ws);

    // Initial explicit welcome payload
    ws.send(JSON.stringify({
        intent: 'INFORM',
        data: { message: `Connected to ANP Relay. Logged in as ${agentId}` },
        timestamp: new Date().toISOString()
    }));

    ws.on('message', (message: string) => {
        try {
            const payload = JSON.parse(message.toString()) as ANPPayload;
            MessageRouter.handleIncomingMessage(agentId, payload, ws);
        } catch (e) {
            console.error(`[Server] Invalid JSON-LD payload received from ${agentId}`);
            ws.send(JSON.stringify({ intent: 'ERROR', data: 'Malformed JSON payload' }));
        }
    });

    ws.on('close', () => {
        registry.unregister(agentId);
    });
    
    ws.on('error', (error) => {
        console.error(`[Server] WebSocket Error from ${agentId}:`, error);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 ANP Relay Node starts boldly on port ${PORT}...`);
    console.log(`Listening for inter-agent push notifications...`);
});

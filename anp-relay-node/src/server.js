"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const http = __importStar(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const registry_1 = require("./registry");
const auth_1 = require("./auth");
const router_1 = require("./router");
const types_1 = require("./types");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT || 8080;
// HTTP Healthcheck Endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'ANP Relay Node',
        version: '1.0.0',
        status: 'online',
        connectedAgents: registry_1.registry.getAllAgents().length
    });
});
const server = http.createServer(app);
const wss = new ws_1.WebSocketServer({ server });
wss.on('connection', (ws, req) => {
    console.log(`[Server] New connection attempt from ${req.socket.remoteAddress}`);
    // Read Identity and Authentication Token from headers or query string
    const url = new URL(req.url, `http://${req.headers.host}`);
    const agentId = url.searchParams.get('agentId');
    const authHeader = req.headers['authorization'] || url.searchParams.get('token');
    if (!agentId || !auth_1.AuthManager.authenticate(authHeader, agentId)) {
        console.warn(`[Server] Connection rejected for agentId: ${agentId}`);
        ws.close(1008, 'Unauthorized: Invalid ANP Auth Token');
        return;
    }
    // Register successful connection
    registry_1.registry.register(agentId, ws);
    // Initial explicit welcome payload
    ws.send(JSON.stringify({
        intent: 'INFORM',
        data: { message: `Connected to ANP Relay. Logged in as ${agentId}` },
        timestamp: new Date().toISOString()
    }));
    ws.on('message', (message) => {
        try {
            const payload = JSON.parse(message.toString());
            router_1.MessageRouter.handleIncomingMessage(agentId, payload, ws);
        }
        catch (e) {
            console.error(`[Server] Invalid JSON-LD payload received from ${agentId}`);
            ws.send(JSON.stringify({ intent: 'ERROR', data: 'Malformed JSON payload' }));
        }
    });
    ws.on('close', () => {
        registry_1.registry.unregister(agentId);
    });
    ws.on('error', (error) => {
        console.error(`[Server] WebSocket Error from ${agentId}:`, error);
    });
});
server.listen(PORT, () => {
    console.log(`🚀 ANP Relay Node starts boldly on port ${PORT}...`);
    console.log(`Listening for inter-agent push notifications...`);
});
//# sourceMappingURL=server.js.map
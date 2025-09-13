// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Statische Dateien bereitstellen
app.use(express.static(path.join(__dirname, 'public')));

// WebSocket-Verbindungen verwalten
const clients = new Set();

wss.on('connection', (ws, req) => {
    console.log('Neue WebSocket-Verbindung hergestellt');
    clients.add(ws);
    
    // Willkommensnachricht senden
    ws.send(JSON.stringify({
        type: 'welcome',
        message: 'Verbindung zum Server hergestellt!',
        timestamp: new Date().toISOString(),
        clientsCount: clients.size
    }));
    
    // Alle anderen Clients über neue Verbindung informieren
    broadcast({
        type: 'user-joined',
        message: 'Ein neuer Benutzer ist beigetreten',
        clientsCount: clients.size
    }, ws);
    
    // Nachrichten von Client empfangen
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            console.log('Nachricht erhalten:', message);
            
            // Echo-Nachricht zurücksenden
            if (message.type === 'echo') {
                ws.send(JSON.stringify({
                    type: 'echo-response',
                    originalMessage: message.message,
                    response: `Echo: ${message.message}`,
                    timestamp: new Date().toISOString()
                }));
            }
            
            // Broadcast-Nachricht an alle Clients
            if (message.type === 'broadcast') {
                broadcast({
                    type: 'broadcast-message',
                    message: message.message,
                    sender: message.sender || 'Anonym',
                    timestamp: new Date().toISOString()
                });
            }
            
            // Chat-Nachricht
            if (message.type === 'chat') {
                broadcast({
                    type: 'chat-message',
                    message: message.message,
                    sender: message.sender || 'Anonym',
                    timestamp: new Date().toISOString()
                });
            }
            
        } catch (error) {
            console.error('Fehler beim Verarbeiten der Nachricht:', error);
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Fehler beim Verarbeiten der Nachricht'
            }));
        }
    });
    
    // Verbindung geschlossen
    ws.on('close', () => {
        console.log('WebSocket-Verbindung geschlossen');
        clients.delete(ws);
        
        // Alle anderen Clients informieren
        broadcast({
            type: 'user-left',
            message: 'Ein Benutzer hat die Verbindung getrennt',
            clientsCount: clients.size
        });
    });
    
    // Fehler behandeln
    ws.on('error', (error) => {
        console.error('WebSocket-Fehler:', error);
        clients.delete(ws);
    });
});

// Funktion zum Senden von Nachrichten an alle Clients
function broadcast(message, exclude = null) {
    const messageStr = JSON.stringify(message);
    clients.forEach(client => {
        if (client !== exclude && client.readyState === WebSocket.OPEN) {
            client.send(messageStr);
        }
    });
}

// Regelmäßige Ping-Nachrichten senden (Keep-Alive)
setInterval(() => {
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.ping();
        }
    });
}, 30000);

// Server starten
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
    console.log(`WebSocket-Server bereit für Verbindungen`);
});

// Graceful Shutdown
process.on('SIGINT', () => {
    console.log('Server wird heruntergefahren...');
    clients.forEach(client => {
        client.close();
    });
    server.close(() => {
        console.log('Server heruntergefahren');
        process.exit(0);
    });
});
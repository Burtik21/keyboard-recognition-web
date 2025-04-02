const app = require('./app');
const http = require('http');
const WebSocket = require('ws');
const webrtcController = require('./controllers/webrtcController');
require('dotenv').config();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (socket) => {
    webrtcController.handleSocket(socket); // deleguj logiku do controlleru
});

const PORT = process.env.PORT || 5500;
server.listen(PORT, () => {
    console.log(`✅ Server běží na http://localhost:${PORT}`);
});

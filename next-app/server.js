const { createServer } = require('http');
const next = require('next');
const WebSocket = require('ws');
const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => handle(req, res));

  // WebSocket server for chat (mounted at /api/ws)
  const wss = new WebSocket.Server({ server, path: '/api/ws' });

  wss.on('connection', (ws) => {
    console.log('WS client connected');
    ws.on('message', (msg) => {
      // Broadcast to all clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(msg);
        }
      });
    });

    ws.on('close', () => console.log('WS client disconnected'));
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

import { ChatDB } from './db.js';
import { defaultRouter, httpsRedirectRouter } from './routes/common.js';
import { handleConnection, handleConnectionUpgrade } from './handlers.js';
import { settings } from './settings.js';
import { WebSocketServer } from 'ws';
import apiRouter from './routes/api.js';
import express from 'express';
import fs from 'fs';
import https from 'https';
import pagesRouter from './routes/pages.js';

const ssl = {
  key: fs.readFileSync(settings.ssl.key),
  cert: fs.readFileSync(settings.ssl.cert),
};

// Init DB.
ChatDB.init();

// App setup.
const app = express();

app.use(express.json());
app.use(express.static(settings.clientPath));

app.use('/', httpsRedirectRouter);
app.use('/api', apiRouter);
app.use('/', pagesRouter);
app.use('/', defaultRouter);

// Setup https.
const httpsServer = https.createServer(ssl, app);
httpsServer.on('upgrade', handleConnectionUpgrade);

// Setup WebSocket.
const wsServer = new WebSocketServer({ server: httpsServer });
wsServer.on('connection', handleConnection(wsServer, ChatDB));

httpsServer.listen(settings.port, () => {
  console.log(`HTTPS Server : Started | Port: ${settings.port}`);
});

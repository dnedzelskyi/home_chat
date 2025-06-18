/** @typedef {import("./db.js").DB} DB */
/** @typedef {import("ws").WebSocketServer} WebSocketServer */
/** @typedef {import("ws").WebSocket} WebSocket */
/** @typedef {import("ws").RawData} RawData */
/** @typedef {import("http").IncomingMessage} IncomingMessage */

/**
 * Creates handler for new WebSocket connections.
 *
 * @param {WebSocketServer} server - The WebSocket server instance.
 * @param {DB} db - The database instance.
 * @returns {(ws: WebSocket, req: IncomingMessage) => void}
 */
export function handleConnection(server, db) {
  return (ws, req) => {
    let message = [
      `One user joined the chat.`,
      `There are ${server.clients.size} user(s) in the room.`,
    ].join('\n');
    console.log(message);

    // server.clients.forEach((c) => {
    //   c.send(message);
    // });

    ws.on('message', (data) => handleMessage(data, server, db));
    ws.on('close', () => handleClose(server, db));
  };
}

/**
 * Handles restore connection to WebSocket.
 *
 * @param {IncomingMessage} req
 */
export function handleConnectionUpgrade(req) {
  console.log(`Upgrade connection for the user: ${req.socket.remoteAddress}.`);
}

/**
 * Handles an incoming message.
 *
 * @param {RawData} data - The incoming message data as a Buffer.
 * @param {WebSocketServer} server - The WebSocket server instance.
 * @param {DB} db - The database object
 */
function handleMessage(data, server, db) {
  let json = data.toString('utf8');
  console.log(`Incoming message: ${json}`);

  db.saveMessages(JSON.parse(json));

  server.clients.forEach((c) => {
    c.send(json);
  });
}

/**
 * Handles WebSocket connection close.
 *
 * @param {WebSocketServer} server - The WebSocket server instance.
 * @param {DB} db - The database instance.
 */
function handleClose(server, db) {
  let message = [
    `One user left the chat.`,
    `There are ${server.clients.size} user(s) in the room.`,
  ].join('\n');
  console.log(message);

  // server.clients.forEach((c) => {
  //   c.send(message);
  // });
}

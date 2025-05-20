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

export function handleConnectionUpgrade(req) {
  console.log(`Upgrade connection for the user: ${req.socket.remoteAddress}.`);
}

function handleMessage(data, server, db) {
  let json = data.toString('utf8');
  console.log(`Incoming message: ${json}`);

  db.saveMessages(JSON.parse(json));

  server.clients.forEach((c) => {
    c.send(json);
  });
}

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

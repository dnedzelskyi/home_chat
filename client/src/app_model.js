import API from './api.js';

const CONSTANTS = {
  DEFAULT_WS_PORT: 3000,
  UPGRADE_CONNECTION_RETRY_COUNT: 3,
  UPGRADE_ERROR_MSG: `Unable to establish a connection to the chat server.`,
};

export class AppModel extends EventTarget {
  static Events = {
    OnReceiveData: 'on-receive-data',
  };

  socket = null;
  lastMessageDateTime = null;

  constructor({ wsPort = CONSTANTS.DEFAULT_WS_PORT, api = API }) {
    super();
    this.port = wsPort;
    this.api = api;
    this.connect();
  }

  connect() {
    this.socket = new WebSocket(`wss://${location.hostname}:${this.port}`);

    this.socket.onopen = async () => {
      console.info('WebSocket connection established');

      let data = await this.load();
      const e = new CustomEvent(AppModel.Events.OnReceiveData, {
        detail: { data },
      });
      this.dispatchEvent(e);
    };

    this.socket.onclose = () => {
      console.info('WebSocket connection closed.');
    };

    this.socket.onmessage = async (event) => {
      console.info('Message received from server.');

      let data =
        typeof event?.data === 'string'
          ? event?.data
          : await event?.data?.text();

      if (!data) return;

      data = JSON.parse(data);
      const e = new CustomEvent(AppModel.Events.OnReceiveData, {
        detail: { data },
      });
      this.dispatchEvent(e);
      this.lastMessageDateTime = new Date();
    };
  }

  upgrade() {
    let retry = CONSTANTS.UPGRADE_CONNECTION_RETRY_COUNT;
    while (retry > 0 && this.socket.readyState > WebSocket.OPEN) {
      this.connect();
      retry--;
    }
    if (retry === 0) {
      throw new Error(CONSTANTS.UPGRADE_ERROR_MSG);
    }
  }

  disconnect() {
    this.socket?.close();
  }

  send(data) {
    if (!data && this.socket.readyState !== WebSocket.OPEN) return;

    this.socket.send(JSON.stringify(data));
    this.lastMessageDateTime = new Date();
  }

  async load() {
    let messages = await this.api.getMessages(
      !this.lastMessageDateTime ? 10 : null,
      this.lastMessageDateTime,
      null
    );

    this.lastMessageDateTime =
      messages.length > 0
        ? new Date(messages[messages.length - 1].created_at)
        : new Date();

    return messages;
  }
}

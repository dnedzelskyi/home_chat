export class AppView extends EventTarget {
  static Events = {
    OnSendData: 'on-send-data',
    OnVisible: 'on-visible',
  };

  get _messageTextarea() {
    return document.querySelector(`#message-box`);
  }
  get _chatContainer() {
    return document.querySelector(`#chat-container`);
  }
  get _sendButton() {
    return document.querySelector(`#send-button`);
  }

  constructor() {
    super();

    document.querySelector(`#clear-button`)?.addEventListener('click', () => {
      this._messageTextarea.value = '';
      this._messageTextarea.focus();
    });
    this._messageTextarea?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && event.metaKey) {
        event.preventDefault();
        this._sendButton.click();
      }
    });

    document.addEventListener('visibilitychange', () => {
      this.dispatchEvent(new CustomEvent(AppView.Events.OnVisible));
    });
    this._sendButton.addEventListener('click', () => {
      const data = [{ content: this._messageTextarea?.value }];
      const e = new CustomEvent(AppView.Events.OnSendData, {
        detail: { data },
      });
      this.dispatchEvent(e);
      this._messageTextarea.value = '';
      this._messageTextarea.focus();
    });
  }

  renderChat(messages = []) {
    const fragment = document.createDocumentFragment();

    for (let { content } of messages) {
      const msgArticle = document
        .querySelector('#message-template')
        ?.content.cloneNode(true);

      msgArticle.querySelector(`#message-text`).textContent = content;
      msgArticle.querySelector(`#message-date`).textContent =
        new Date().toLocaleString();

      fragment.appendChild(msgArticle);
    }

    this._chatContainer.appendChild(fragment);
    this._chatContainer.scrollTo({
      top: this._chatContainer.scrollHeight,
      behavior: 'smooth',
    });
  }
}

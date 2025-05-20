import { AppModel } from './app_model.js';
import { AppView } from './app_view.js';

export class AppController {
  constructor(view, model) {
    model.addEventListener(
      AppModel.Events.OnReceiveData,
      ({ detail: { data } }) => view.renderChat(data)
    );
    view.addEventListener(AppView.Events.OnSendData, ({ detail: { data } }) =>
      model.send(data)
    );
    view.addEventListener(AppView.Events.OnVisible, () => model.upgrade());
  }
}

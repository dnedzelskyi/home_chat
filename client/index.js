import { AppModel } from './src/app_model.js';
import { AppView } from './src/app_view.js';
import { AppController } from './src/app_controller.js';
import API from './src/api.js';

document.addEventListener('DOMContentLoaded', async () => {
  const config = await API.getSettings();
  new AppController(new AppView(), new AppModel(config));
});

import path from 'path';

const env = process.env.NODE_ENV || 'dev';

let { default: settings } = await import(`../configs/${env}.json`, {
  with: { type: 'json' },
});

settings = Object.freeze({
  ...settings,
  port: settings.port || 3000,
  clientPath: path.resolve(path.dirname('./'), 'client'),
});

export { settings };

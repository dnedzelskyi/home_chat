import express from 'express';
import { settings } from '../settings.js';

// Redirect http to https.
export const httpsRedirectRouter = express.Router();
httpsRedirectRouter.use((req, res, next) => {
  if (!req.secure) {
    const host = req.headers['host'].replace(/:\d+$/, '');
    res.redirect(301, `https://${host}:${settings.port}${req.url}`);
  } else {
    next();
  }
});

// Redirect home by default.
export const defaultRouter = express.Router();
defaultRouter.get('*', (_req, res) => {
  res.redirect('/');
});

import express from 'express';
import path from 'path';
import { settings } from '../settings.js';

const router = express.Router();

// Redirect http to https.
router.use((req, res, next) => {
  if (req.secure) {
    return next();
  }

  const host = req.headers['host'].replace(/:\d+$/, '');
  res.redirect(301, `https://${host}:${settings.port}${req.url}`);
});

// Serve chat page.
router.get('/', (_req, res) => {
  res.sendFile(path.resolve(settings.clientPath, 'index.html'));
});

export default router;

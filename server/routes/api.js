import express from 'express';
import { ChatDB } from '../db.js';
import { settings } from '../settings.js';

const router = express.Router();

router.get('/settings', (req, res) => {
  res.send({
    wsPort: settings.port,
  });
});

router.get('/messages', (req, res) => {
  const { limit, after, before } = req.query;
  const messages = ChatDB.getMessages(
    parseInt(limit || -1),
    after ? new Date(after) : null,
    before ? new Date(before) : null
  );
  res.send(messages);
});

export default router;

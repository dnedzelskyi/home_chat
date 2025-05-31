import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';

const CONSTANTS = {
  DB_FOLDER: path.resolve(path.dirname('./'), 'db'),
  DB_FILE_NAME: 'chat.db',
  DB_INITIAL_ERR_MSG: 'Error occurred when trying to init chat db.',
  DB_SAVE_ERR_MSG: 'Unable to save data.',
  DB_GET_ERR_MSG: 'Unable to get data.',

  /** @type {(ver: string) => string} */
  getSchemaFileName: (ver) => `schema-${ver}.sql`,
};

export class DB {
  constructor() {
    const dbPath = path.resolve(CONSTANTS.DB_FOLDER, CONSTANTS.DB_FILE_NAME);
    this._db = new DatabaseSync(dbPath, { open: true });
  }

  init() {
    try {
      // Get current schema version.
      let verQuery = this._db.prepare('PRAGMA user_version');
      // @ts-ignore
      let ver = parseInt(verQuery.get()?.user_version ?? 0) + 1;

      // Apply new schema changes if any.
      let schemaPath = path.resolve(
        CONSTANTS.DB_FOLDER,
        CONSTANTS.getSchemaFileName(ver.toString())
      );
      this._db.exec('BEGIN;');
      while (fs.existsSync(schemaPath)) {
        const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
        this._db.exec(schemaSQL);

        schemaPath = path.resolve(
          CONSTANTS.DB_FOLDER,
          CONSTANTS.getSchemaFileName(ver.toString())
        );
        ver++;
      }
      this._db.exec('COMMIT;');
    } catch (err) {
      // Rollback and log error.
      this._db.exec('ROLLBACK;');
      console.log(CONSTANTS.DB_INITIAL_ERR_MSG);
      throw new Error(`${CONSTANTS.DB_INITIAL_ERR_MSG}. ${err}`);
    }
  }

  /**
   * Saves messages to db.
   *
   * @param {Array<{content: string}>} messages - Message objects.
   */
  saveMessages(messages) {
    try {
      const query = 'INSERT INTO message (user_id, content) VALUES (1, ?)';
      for (let { content } of messages) {
        this._db.prepare(query).run(content);
      }
    } catch (err) {
      console.log(CONSTANTS.DB_SAVE_ERR_MSG);
      throw new Error(`${CONSTANTS.DB_SAVE_ERR_MSG}. ${err}`);
    }
  }

  /**
   * Retrieves messages db.
   *
   * @param {number} [limit=-1] - The maximum number of messages to retrieve. Defaults to -1 (no limit).
   * @param {Date|null} [after=null] - Only messages created after this date. If null, includes all earlier messages.
   * @param {Date|null} [before=null] - Only messages created before this date. If null, includes all later messages.
   */
  getMessages(limit = -1, after = null, before = null) {
    try {
      return this._db
        .prepare(
          `WITH T AS (
            SELECT
              *
            FROM
              message
            WHERE
              COALESCE(datetime(:after), datetime('0000-01-01 00:00:00')) < created_at
              AND created_at < COALESCE(datetime(:before), datetime('now'))
            ORDER BY created_at DESC
            LIMIT :limit
          ) SELECT T.* FROM T ORDER BY T.created_at ASC`
        )
        .all({
          limit: limit,
          after: after?.toISOString() ?? null,
          before: before?.toISOString() ?? null,
        });
    } catch (err) {
      console.log(CONSTANTS.DB_GET_ERR_MSG);
      throw new Error(`${CONSTANTS.DB_GET_ERR_MSG}. ${err}`);
    }
  }
}

export const ChatDB = new DB();

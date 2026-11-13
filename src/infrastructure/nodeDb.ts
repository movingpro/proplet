import { DatabaseSync, type SQLInputValue } from "node:sqlite";

import type { Db } from "./db";

// SQLite file, for the Node server and the tests. node:sqlite enforces foreign keys by default, as D1 does.
export const nodeDb = (filename: string): Db => {
  const database = new DatabaseSync(filename);
  const run = (sql: string, params: unknown[]) =>
    database.prepare(sql).all(...(params as SQLInputValue[]));

  return {
    query: async <T>(sql: string, ...params: unknown[]) => run(sql, params) as T[],
    // The calls are synchronous, so no other query runs inside the transaction.
    batch: async (statements) => {
      database.exec("BEGIN");
      try {
        for (const [sql, ...params] of statements) {
          run(sql, params);
        }
        database.exec("COMMIT");
      } catch (error) {
        database.exec("ROLLBACK");
        throw error;
      }
    },
  };
};

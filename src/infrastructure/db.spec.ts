import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import { test } from "node:test";

import { d1Db, type D1Database, type D1Statement, type Db } from "#infrastructure/db";
import { nodeDb } from "#infrastructure/nodeDb";

const migration = await readFile("migrations/0001_init.sql", "utf8");
const tenantId = "01976ed4-b771-700a-b1e8-a1e898e5451d";

// A minimal D1 on node:sqlite. Each statement runs at once, so the batch uses a transaction.
const fakeD1 = (): D1Database => {
  const database = new DatabaseSync(":memory:");
  const prepare = (sql: string, params: unknown[] = []): D1Statement => ({
    bind: (...next) => prepare(sql, next),
    all: async <T>() => ({
      results: database.prepare(sql).all(...(params as SQLInputValue[])) as T[],
    }),
  });

  return {
    prepare,
    batch: async (statements) => {
      database.exec("BEGIN");
      try {
        for (const statement of statements) {
          await statement.all();
        }
        database.exec("COMMIT");
      } catch (error) {
        database.exec("ROLLBACK");
        throw error;
      }
    },
  };
};

const drivers: [string, () => Db][] = [
  ["nodeDb", () => nodeDb(":memory:")],
  ["d1Db", () => d1Db(fakeD1())],
];

for (const [name, create] of drivers) {
  await test(`${name} runs the migration, queries with parameters and rolls back a failed batch`, async () => {
    const db = create();
    await db.batch(
      migration
        .split(";")
        .filter((sql) => sql.trim())
        .map((sql) => [sql]),
    );

    const insert = `INSERT INTO "Condition" ("id", "publicId", "name", "tenantId") VALUES (?, ?, ?, ?)`;
    await db.batch([
      [insert, null, 1, "new", tenantId],
      [insert, null, 2, "used", tenantId],
    ]);
    const select = `SELECT "name" FROM "Condition" WHERE "tenantId" = ? ORDER BY "publicId"`;
    assert.deepEqual(
      (await db.query<{ name: string }>(select, tenantId)).map((row) => row.name),
      ["new", "used"],
    );

    // The second statement breaks the foreign key, so the DELETE must not stay.
    await assert.rejects(
      db.batch([
        [`DELETE FROM "Condition" WHERE "tenantId" = ?`, tenantId],
        [insert, null, 3, "bad", "no-such-tenant"],
      ]),
    );
    assert.equal((await db.query(select, tenantId)).length, 2);
  });
}

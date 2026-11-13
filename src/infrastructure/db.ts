export type Statement = [sql: string, ...params: unknown[]];

// SQLite SQL with `?` parameters. The same SQL runs on both drivers.
export interface Db {
  query<T>(sql: string, ...params: unknown[]): Promise<T[]>;
  // Runs all statements in one transaction.
  batch(statements: Statement[]): Promise<void>;
}

// shortcut: only the D1 methods in use, install @cloudflare/workers-types when more are necessary
export type D1Statement = {
  bind(...params: unknown[]): D1Statement;
  all<T>(): Promise<{ results: T[] }>;
};
export type D1Database = {
  prepare(sql: string): D1Statement;
  batch(statements: D1Statement[]): Promise<unknown>;
};

// Cloudflare D1, for the Worker.
export const d1Db = (d1: D1Database): Db => ({
  query: async <T>(sql: string, ...params: unknown[]) =>
    (
      await d1
        .prepare(sql)
        .bind(...params)
        .all<T>()
    ).results,
  batch: async (statements) => {
    await d1.batch(statements.map(([sql, ...params]) => d1.prepare(sql).bind(...params)));
  },
});

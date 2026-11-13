import { Hono } from "hono";
import { contextStorage } from "hono/context-storage";
import { logger } from "hono/logger";
import { trimTrailingSlash } from "hono/trailing-slash";

import { d1Db, type D1Database, type Db } from "#infrastructure/db";
import conditionsApi from "#rest-api/conditions/index";
import locationsApi from "#rest-api/locations/index";

type Env = {
  // The Worker has the D1 binding. The Node server passes its own driver.
  Bindings: {
    DB?: D1Database;
    db?: Db;
  };
  Variables: {
    tenantId: string;
    db: Db;
  };
};

const app = new Hono<Env>({
  strict: true,
});

app.use(logger());
app.use(trimTrailingSlash());
app.use(contextStorage());

// Set tenant context
app.use(async (c, next) => {
  c.set("tenantId", "01976ed4-b771-700a-b1e8-a1e898e5451d");
  await next();
});

app.use(async (c, next) => {
  const db = c.env.db ?? (c.env.DB && d1Db(c.env.DB));
  if (!db) {
    throw new Error("No database: set the DB binding or pass a driver");
  }
  c.set("db", db);
  await next();
});

app.route("/conditions", conditionsApi);
app.route("/locations", locationsApi);

export default app;

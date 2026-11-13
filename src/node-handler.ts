import { serve } from "@hono/node-server";

import { env } from "#infrastructure/env";
import { nodeDb } from "#infrastructure/nodeDb";
import app from "#main";

const db = nodeDb(env.DATABASE_PATH);

const server = serve({ fetch: (request) => app.fetch(request, { db }), port: env.PORT }, (info) => {
  console.log(`Listening on http://localhost:${info.port}`);
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    console.log(`Received ${signal} signal`);
    server.close((err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      process.exit(0);
    });
  });
}

import conditionsApi from "#application/conditions/index";
import locationsApi from "#application/locations/index";
import { Hono } from "hono";
import { contextStorage } from "hono/context-storage";
import { logger } from "hono/logger";
import { trimTrailingSlash } from "hono/trailing-slash";

type Env = {
  Variables: {
    tenantId: string;
  };
};

const app = new Hono<Env>({
  strict: true,
});

app.use(logger());

app.use(trimTrailingSlash());

app.use(contextStorage());

app.use(async (c, next) => {
  c.set("tenantId", "01976ed4-b771-700a-b1e8-a1e898e5451d");
  await next();
});

app.route("/conditions", conditionsApi);
app.route("/locations", locationsApi);

export default app;

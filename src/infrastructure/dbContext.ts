import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "./env";
import { relations } from "./schema/index";

const queryClient = postgres(env.DATABASE_URL);

const dbContext = drizzle({
  client: queryClient,
  relations,
});

export default dbContext;

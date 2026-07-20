import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { relations } from "./schema/index";

const queryClient = postgres(process.env.DATABASE_URL);

const dbContext = drizzle({
  client: queryClient,
  relations,
});

export default dbContext;

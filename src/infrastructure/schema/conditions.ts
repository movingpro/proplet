import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

import { tenants } from "./tenants";

export const conditions = pgTable("Condition", {
  id: uuid(),
  publicId: integer(),
  name: varchar({
    length: 255,
  }).notNull(),
  tenantId: uuid().references(() => tenants.id),
});

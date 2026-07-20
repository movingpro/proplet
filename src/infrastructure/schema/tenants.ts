import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const tenants = pgTable("Tenant", {
  id: uuid(),
  name: varchar({
    length: 255,
  }).notNull(),
});

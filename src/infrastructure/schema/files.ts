import { pgTable, text, timestamp, integer, uuid } from "drizzle-orm/pg-core";

import { tenants } from "./tenants";

export const files = pgTable("files", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  mimeType: text().notNull(),
  size: integer().notNull(),
  path: text().notNull(), // relative storage path
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
  tenantId: uuid()
    .notNull()
    .references(() => tenants.id),
});

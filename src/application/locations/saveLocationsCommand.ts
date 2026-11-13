import * as z from "zod";

import { currentDb } from "#infrastructure/sessionContext";

const schema = z.array(
  z.object({
    id: z.uuid().nullish(),
    publicId: z.int().nullish(),
    name: z.string().max(255),
  }),
);

export const saveLocationsCommand = async (tenantId: string, data: unknown) => {
  // The rows get the tenant of the session, not a tenant from the request.
  await currentDb().batch([
    [`DELETE FROM "Location" WHERE "tenantId" = ?`, tenantId],
    ...schema
      .parse(data)
      .map(
        (row) =>
          [
            `INSERT INTO "Location" ("id", "publicId", "name", "tenantId") VALUES (?, ?, ?, ?)`,
            row.id ?? null,
            row.publicId ?? null,
            row.name,
            tenantId,
          ] satisfies [string, ...unknown[]],
      ),
  ]);
};

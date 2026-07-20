import { eq } from "drizzle-orm";

import dbContext from "#infrastructure/dbContext";
import { locations } from "#infrastructure/schema/locations";

export const saveLocationsCommand = async (
  tenantId: string,
  conditionsData: (typeof locations.$inferInsert)[],
) => {
  return await dbContext.transaction(async (tx) => {
    await tx.delete(locations).where(eq(locations.tenantId, tenantId));
    await tx.insert(locations).values(conditionsData);
  });
};

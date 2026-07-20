import { eq } from "drizzle-orm";

import dbContext from "#infrastructure/dbContext";
import { conditions } from "#infrastructure/schema/conditions";

export const saveConditionsCommand = async (
  tenantId: string,
  conditionsData: (typeof conditions.$inferInsert)[],
) => {
  return await dbContext.transaction(async (tx) => {
    await tx.delete(conditions).where(eq(conditions.tenantId, tenantId));
    await tx.insert(conditions).values(conditionsData);
  });
};

import type { Context } from "hono";

import dbContext from "#infrastructure/dbContext";
import { currentTenantId } from "#infrastructure/sessionContext";

export const getConditionsQuery = async (c: Context) => {
  const result = await dbContext.query.conditions.findMany({
    where: ({ tenantId }, { eq }) => eq(tenantId, currentTenantId()),
  });

  return c.json(result);
};

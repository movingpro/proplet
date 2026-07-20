import dbContext from "#infrastructure/dbContext";

export const getConditionsQuery = async (tenantId: string) => {
  return await dbContext.query.conditions.findMany({
    where: {
      tenantId,
    },
  });
};

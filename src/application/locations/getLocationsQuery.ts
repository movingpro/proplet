import dbContext from "#infrastructure/dbContext";

export const getLocationsQuery = async (tenantId: string) => {
  return await dbContext.query.locations.findMany({
    where: {
      tenantId,
    },
  });
};

import { currentDb } from "#infrastructure/sessionContext";

export type Location = {
  id: string | null;
  publicId: number | null;
  name: string;
  tenantId: string | null;
};

export const getLocationsQuery = async (tenantId: string) => {
  return await currentDb().query<Location>(
    `SELECT * FROM "Location" WHERE "tenantId" = ?`,
    tenantId,
  );
};

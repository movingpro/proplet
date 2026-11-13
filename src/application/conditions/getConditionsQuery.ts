import { currentDb } from "#infrastructure/sessionContext";

export type Condition = {
  id: string | null;
  publicId: number | null;
  name: string;
  tenantId: string | null;
};

export const getConditionsQuery = async (tenantId: string) => {
  return await currentDb().query<Condition>(
    `SELECT * FROM "Condition" WHERE "tenantId" = ?`,
    tenantId,
  );
};

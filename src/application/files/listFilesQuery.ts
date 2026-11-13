import { currentDb } from "#infrastructure/sessionContext";

import type { FileRecord } from "./fileRecord";

interface ListFilesOptions {
  tenantId: string;
  search?: string; // Search in filename
  limit?: number;
  offset?: number;
}

/**
 * List files for a tenant with optional filtering and pagination
 */
export const listFilesQuery = async (options: ListFilesOptions) => {
  const { tenantId, search, limit = 50, offset = 0 } = options;

  const db = currentDb();
  // An empty search matches all names.
  const where = `WHERE "tenantId" = ? AND "name" LIKE ?`;
  const pattern = `%${search ?? ""}%`;

  const data = await db.query<FileRecord>(
    `SELECT * FROM "files" ${where} ORDER BY "createdAt" DESC LIMIT ? OFFSET ?`,
    tenantId,
    pattern,
    limit,
    offset,
  );

  // Get total count for pagination
  const [count] = await db.query<{ total: number }>(
    `SELECT count(*) AS "total" FROM "files" ${where}`,
    tenantId,
    pattern,
  );

  return {
    files: data,
    total: count?.total ?? 0,
    limit,
    offset,
  };
};

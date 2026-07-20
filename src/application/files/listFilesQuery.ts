import { eq } from "drizzle-orm/pg-core/expressions";

import dbContext from "#infrastructure/dbContext";
import { files } from "#infrastructure/schema/files";

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

  const data = await dbContext.query.files.findMany({
    where: {
      tenantId,
      ...(search ? { name: `%${search}%` } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
    limit,
    offset,
  });

  // Get total count for pagination
  const countData = await dbContext.$count(files, eq(files.tenantId, tenantId));

  return {
    files: data,
    total: countData,
    limit,
    offset,
  };
};

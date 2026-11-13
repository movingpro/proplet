import { fileStorage } from "#infrastructure/fileStorage/index";
import { currentDb } from "#infrastructure/sessionContext";

import type { FileRecord } from "./fileRecord";

/**
 * Retrieve file metadata and optionally the file content
 */
export const getFileQuery = async (
  fileId: string,
  tenantId: string,
  includeContent: boolean = false,
) => {
  // Get metadata from database
  const [fileRecord] = await currentDb().query<FileRecord>(
    `SELECT * FROM "files" WHERE "tenantId" = ? AND "id" = ?`,
    tenantId,
    fileId,
  );

  if (!fileRecord) {
    throw new Error("File not found");
  }

  let content: Buffer | undefined;

  if (includeContent) {
    try {
      content = await fileStorage.readFile(fileRecord.path);
    } catch (error) {
      throw new Error(`Failed to read file: ${error}`);
    }
  }

  return {
    ...fileRecord,
    content,
  };
};

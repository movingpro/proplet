import { fileStorage } from "#infrastructure/fileStorage/index";
import { currentDb } from "#infrastructure/sessionContext";

import type { FileRecord } from "./fileRecord";

/**
 * Delete a file and its associated storage
 */
export const deleteFileCommand = async (fileId: string, tenantId: string) => {
  // Get file metadata
  const [fileRecord] = await currentDb().query<FileRecord>(
    `SELECT * FROM "files" WHERE "tenantId" = ? AND "id" = ?`,
    tenantId,
    fileId,
  );

  if (!fileRecord) {
    throw new Error("File not found");
  }

  try {
    // Delete from storage
    await fileStorage.deleteFile(fileRecord.path);
  } catch (error) {
    console.error(`Warning: failed to delete file from storage: ${error}`);
    // Continue with DB deletion even if storage deletion fails
  }

  // Delete from database
  await currentDb().query(
    `DELETE FROM "files" WHERE "id" = ? AND "tenantId" = ?`,
    fileId,
    tenantId,
  );

  return { success: true };
};

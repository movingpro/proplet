import { eq, and } from "drizzle-orm";

import dbContext from "#infrastructure/dbContext";
import { fileStorage } from "#infrastructure/fileStorage/diskStorage";
import { files } from "#infrastructure/schema/files";

/**
 * Delete a file and its associated storage
 */
export const deleteFileCommand = async (fileId: string, tenantId: string) => {
  // Get file metadata
  const fileRecord = await dbContext.query.files.findFirst({
    where: {
      tenantId,
      id: fileId,
    },
  });

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
  await dbContext.delete(files).where(and(eq(files.id, fileId), eq(files.tenantId, tenantId)));

  return { success: true };
};

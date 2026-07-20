import dbContext from "#infrastructure/dbContext";
import { fileStorage } from "#infrastructure/fileStorage/diskStorage";

/**
 * Retrieve file metadata and optionally the file content
 */
export const getFileQuery = async (
  fileId: string,
  tenantId: string,
  includeContent: boolean = false,
) => {
  // Get metadata from database
  const fileRecord = await dbContext.query.files.findFirst({
    where: {
      tenantId,
      id: fileId,
    },
  });

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

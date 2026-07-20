import { randomUUID } from "crypto";

import dbContext from "#infrastructure/dbContext";
import { fileStorage } from "#infrastructure/fileStorage/diskStorage";
import { files } from "#infrastructure/schema/files";

interface UploadFileInput {
  tenantId: string;
  fileName: string;
  mimeType: string;
  buffer: Buffer;
}

export const uploadFileCommand = async (input: UploadFileInput) => {
  const fileId = randomUUID();
  const storagePath = `${input.tenantId}/${fileId}/${input.fileName}`;

  try {
    // Save file to storage
    await fileStorage.saveFile(storagePath, input.buffer);

    // Record in database
    const result = await dbContext
      .insert(files)
      .values({
        id: fileId,
        name: input.fileName,
        mimeType: input.mimeType,
        size: input.buffer.length,
        path: storagePath,
        tenantId: input.tenantId,
      })
      .returning();

    return result[0];
  } catch (error) {
    // Clean up storage on DB failure
    await fileStorage.deleteFile(storagePath).catch(() => {});
    throw error;
  }
};

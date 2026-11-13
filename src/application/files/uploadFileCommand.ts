import { randomUUID } from "crypto";

import { fileStorage } from "#infrastructure/fileStorage/index";
import { currentDb } from "#infrastructure/sessionContext";

import type { FileRecord } from "./fileRecord";
import { safeFileName } from "./safeFileName";

interface UploadFileInput {
  tenantId: string;
  fileName: string;
  mimeType: string;
  buffer: Buffer;
}

export const uploadFileCommand = async (input: UploadFileInput) => {
  const fileId = randomUUID();
  const fileName = safeFileName(input.fileName);
  const storagePath = `${input.tenantId}/${fileId}/${fileName}`;

  try {
    // Save file to storage
    await fileStorage.saveFile(storagePath, input.buffer);

    // Record in database
    const result = await currentDb().query<FileRecord>(
      `INSERT INTO "files" ("id", "name", "mimeType", "size", "path", "tenantId") VALUES (?, ?, ?, ?, ?, ?) RETURNING *`,
      fileId,
      fileName,
      input.mimeType,
      input.buffer.length,
      storagePath,
      input.tenantId,
    );

    return result[0];
  } catch (error) {
    // Clean up storage on DB failure
    await fileStorage.deleteFile(storagePath).catch(() => {});
    throw error;
  }
};

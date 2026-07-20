import { Hono } from "hono";

import { deleteFileCommand } from "#application/files/deleteFileCommand";
import { getFileQuery } from "#application/files/getFileQuery";
import { listFilesQuery } from "#application/files/listFilesQuery";
import { uploadFileCommand } from "#application/files/uploadFileCommand";
import { currentTenantId } from "#infrastructure/sessionContext";

const filesApi = new Hono();

/**
 * GET / - List files
 * Query params: search, limit, offset
 */
filesApi.get("/", async (c) => {
  const tenantId = currentTenantId();
  const searchQuery = c.req.query("search");
  const limit = parseInt(c.req.query("limit") || "50");
  const offset = parseInt(c.req.query("offset") || "0");

  const result = await listFilesQuery({
    tenantId,
    ...(searchQuery ? { search: searchQuery } : {}),
    limit,
    offset,
  });

  return c.json(result);
});

/**
 * POST / - Upload a file
 * Body: multipart/form-data with 'file' field
 */
filesApi.post("/", async (c) => {
  const tenantId = currentTenantId();
  const formData = await c.req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return c.json({ error: "No file provided" }, 400);
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const result = await uploadFileCommand({
      tenantId,
      fileName: file.name,
      mimeType: file.type,
      buffer,
    });

    return c.json(result, 201);
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

/**
 * GET /:fileId - Download/retrieve a file
 * Query param: download (true to stream as download)
 */
filesApi.get("/:fileId", async (c) => {
  const tenantId = currentTenantId();
  const fileId = c.req.param("fileId");
  const download = c.req.query("download") === "true";

  try {
    const result = await getFileQuery(fileId, tenantId, true);

    if (!result.content) {
      return c.json({ error: "File content not found" }, 404);
    }

    const headers: Record<string, string> = {
      "Content-Type": result.mimeType,
      "Content-Length": result.size.toString(),
    };

    if (download) {
      headers["Content-Disposition"] = `attachment; filename="${result.name}"}`;
    }

    return c.newResponse(new Uint8Array(result.content), { headers });
  } catch (error) {
    return c.json({ error: String(error) }, 404);
  }
});

/**
 * GET /:fileId/metadata - Get file metadata without content
 */
filesApi.get("/:fileId/metadata", async (c) => {
  const tenantId = currentTenantId();
  const fileId = c.req.param("fileId");

  try {
    const result = await getFileQuery(fileId, tenantId, false);
    return c.json(result);
  } catch (error) {
    return c.json({ error: String(error) }, 404);
  }
});

/**
 * DELETE /:fileId - Delete a file
 */
filesApi.delete("/:fileId", async (c) => {
  const tenantId = currentTenantId();
  const fileId = c.req.param("fileId");

  try {
    const result = await deleteFileCommand(fileId, tenantId);
    return c.json(result);
  } catch (error) {
    return c.json({ error: String(error) }, 404);
  }
});

export default filesApi;

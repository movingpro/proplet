import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { DiskStorage } from "#infrastructure/fileStorage/diskStorage";

await test("DiskStorage saves, reads and deletes a file, and rejects paths outside the base path", async () => {
  const basePath = await mkdtemp(join(tmpdir(), "proplet-"));
  const storage = new DiskStorage(basePath);

  try {
    await storage.saveFile("tenant/id/a.txt", Buffer.from("hello"));
    assert.equal((await storage.readFile("tenant/id/a.txt")).toString(), "hello");

    await storage.deleteFile("tenant/id/a.txt");
    await assert.rejects(storage.readFile("tenant/id/a.txt"));

    await assert.rejects(storage.saveFile("../a.txt", Buffer.from("x")), /directory traversal/);
    await assert.rejects(
      storage.readFile(`../${basePath.split("/").pop()}-other/a.txt`),
      /directory traversal/,
    );

    await new DiskStorage("/").readFile(`${basePath}/missing`).catch((error: Error) => {
      assert.doesNotMatch(error.message, /directory traversal/);
    });
  } finally {
    await rm(basePath, { recursive: true });
  }
});

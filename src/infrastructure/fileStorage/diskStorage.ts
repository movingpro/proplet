import { promises as fs } from "node:fs";
import { dirname, resolve, sep } from "node:path";

import type { IFileStorage } from "./storage";

export class DiskStorage implements IFileStorage {
  private basePath: string;
  private prefix: string;

  constructor(basePath: string) {
    this.basePath = resolve(basePath);
    // A filesystem root already ends with the separator.
    this.prefix = this.basePath.endsWith(sep) ? this.basePath : this.basePath + sep;
  }

  // shortcut: the check does not follow symlinks, use fs.realpath if the base path can contain links.
  private getFullPath(relativePath: string): string {
    const fullPath = resolve(this.basePath, relativePath);

    if (!fullPath.startsWith(this.prefix)) {
      throw new Error("Invalid file path: directory traversal detected");
    }

    return fullPath;
  }

  async saveFile(path: string, buffer: Buffer): Promise<void> {
    const fullPath = this.getFullPath(path);

    await fs.mkdir(dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, buffer);
  }

  async readFile(path: string): Promise<Buffer> {
    return await fs.readFile(this.getFullPath(path));
  }

  async deleteFile(path: string): Promise<void> {
    await fs.unlink(this.getFullPath(path));
  }
}

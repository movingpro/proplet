import { promises as fs } from "node:fs";
import { join } from "node:path";

import { type IFileStorage } from "./storage";

/**
 * Disk-based file storage implementation
 * Uses Node.js fs module for local file operations
 */
export class DiskStorage implements IFileStorage {
  private basePath: string;

  constructor(basePath: string = "./uploads") {
    this.basePath = basePath;
  }

  private getFullPath(relativePath: string): string {
    // Security: prevent directory traversal attacks
    const normalized = join(this.basePath, relativePath).replace(/\\/g, "/");
    const base = join(this.basePath).replace(/\\/g, "/");

    if (!normalized.startsWith(base)) {
      throw new Error("Invalid file path: directory traversal detected");
    }

    return normalized;
  }

  async saveFile(path: string, buffer: Buffer): Promise<void> {
    const fullPath = this.getFullPath(path);
    const directory = fullPath.substring(0, fullPath.lastIndexOf("/"));

    // Create directory if it doesn't exist
    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(fullPath, buffer);
  }

  async readFile(path: string): Promise<Buffer> {
    const fullPath = this.getFullPath(path);
    return await fs.readFile(fullPath);
  }

  async deleteFile(path: string): Promise<void> {
    const fullPath = this.getFullPath(path);
    await fs.unlink(fullPath);
  }

  async fileExists(path: string): Promise<boolean> {
    const fullPath = this.getFullPath(path);
    try {
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  async getFileMetadata(path: string): Promise<{ size: number; mtime: Date }> {
    const fullPath = this.getFullPath(path);
    const stats = await fs.stat(fullPath);
    return {
      size: stats.size,
      mtime: stats.mtime,
    };
  }

  async listFiles(directory: string, pattern?: string): Promise<string[]> {
    const fullPath = this.getFullPath(directory);
    const files = await fs.readdir(fullPath, { recursive: true });

    let filtered = files.filter((f) => typeof f === "string");

    if (pattern) {
      const regex = new RegExp(pattern);
      filtered = filtered.filter((f) => regex.test(f));
    }

    return filtered;
  }

  async moveFile(sourcePath: string, destinationPath: string): Promise<void> {
    const fullSource = this.getFullPath(sourcePath);
    const fullDest = this.getFullPath(destinationPath);
    const destDir = fullDest.substring(0, fullDest.lastIndexOf("/"));

    await fs.mkdir(destDir, { recursive: true });
    await fs.rename(fullSource, fullDest);
  }

  async copyFile(sourcePath: string, destinationPath: string): Promise<void> {
    const fullSource = this.getFullPath(sourcePath);
    const fullDest = this.getFullPath(destinationPath);
    const destDir = fullDest.substring(0, fullDest.lastIndexOf("/"));

    await fs.mkdir(destDir, { recursive: true });
    await fs.copyFile(fullSource, fullDest);
  }
}

export const fileStorage = new DiskStorage();

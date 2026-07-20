/**
 * Abstract interface for file storage operations
 * Allows swapping implementations (disk, S3, etc.)
 *
 * Implementations: DiskStorage, S3Storage
 */

export interface IFileStorage {
  /**
   * Save a file to storage
   */
  saveFile(path: string, buffer: Buffer): Promise<void>;

  /**
   * Read a file from storage
   */
  readFile(path: string): Promise<Buffer>;

  /**
   * Delete a file from storage
   */
  deleteFile(path: string): Promise<void>;

  /**
   * Check if a file exists
   */
  fileExists(path: string): Promise<boolean>;

  /**
   * Get file metadata (size, created time, etc.)
   */
  getFileMetadata(path: string): Promise<{ size: number; mtime: Date }>;

  /**
   * List files matching a pattern in a directory
   */
  listFiles(directory: string, pattern?: string): Promise<string[]>;

  /**
   * Move/rename a file
   */
  moveFile(sourcePath: string, destinationPath: string): Promise<void>;

  /**
   * Copy a file
   */
  copyFile(sourcePath: string, destinationPath: string): Promise<void>;
}

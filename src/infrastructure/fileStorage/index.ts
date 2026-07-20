import { DiskStorage } from "./diskStorage";
import { S3Storage } from "./s3Storage";
import { type IFileStorage } from "./storage";

export type StorageType = "disk" | "s3";

/**
 * Environment variables for file storage configuration
 */
interface StorageEnv {
  /** Storage type: "disk" or "s3" (default: "disk") */
  STORAGE_TYPE?: StorageType;
  /** Base path for disk storage (default: "./uploads") */
  STORAGE_BASE_PATH?: string;
  /** AWS region for S3 (default: "us-east-1") */
  AWS_REGION?: string;
  /** S3 bucket name (required if STORAGE_TYPE=s3) */
  S3_BUCKET?: string;
  /** AWS access key ID (use IAM role in production) */
  AWS_ACCESS_KEY_ID?: string;
  /** AWS secret access key (use IAM role in production) */
  AWS_SECRET_ACCESS_KEY?: string;
}

/**
 * Type-safe environment variable access
 */
function getEnv(): StorageEnv {
  return process.env as unknown as StorageEnv;
}

/**
 * Create file storage based on environment configuration
 * Environment variables:
 *   - STORAGE_TYPE: "disk" or "s3" (default: "disk")
 *   - STORAGE_BASE_PATH: For disk storage (default: "./uploads")
 *   - AWS_REGION: For S3 storage (default: "us-east-1")
 *   - S3_BUCKET: For S3 storage (required if STORAGE_TYPE=s3)
 */
export function createFileStorage(): IFileStorage {
  const env = getEnv();
  const storageType: StorageType = env.STORAGE_TYPE || "disk";

  switch (storageType) {
    case "s3": {
      const bucket = env.S3_BUCKET;
      if (!bucket) {
        throw new Error("S3_BUCKET environment variable is required when STORAGE_TYPE=s3");
      }

      const region = env.AWS_REGION || "us-east-1";

      console.log(`Initializing S3 storage: bucket=${bucket}, region=${region}`);
      return new S3Storage(bucket, region);
    }

    case "disk":
    default: {
      const basePath = env.STORAGE_BASE_PATH || "./uploads";

      console.log(`Initializing Disk storage: basePath=${basePath}`);
      return new DiskStorage(basePath);
    }
  }
}

/**
 * Singleton instance of the configured storage
 */
export const fileStorage = createFileStorage();

// Export classes for manual instantiation if needed
export { DiskStorage } from "./diskStorage";
export { S3Storage } from "./s3Storage";
export { type IFileStorage };

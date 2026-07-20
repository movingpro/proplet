/**
 * Global type definitions for environment variables
 */

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * Storage type: "disk" or "s3"
     * @default "disk"
     */
    STORAGE_TYPE?: "disk" | "s3";

    /**
     * Base path for disk storage
     * @default "./uploads"
     */
    STORAGE_BASE_PATH?: string;

    /**
     * AWS region for S3 storage
     * @default "us-east-1"
     */
    AWS_REGION?: string;

    /**
     * S3 bucket name
     * Required if STORAGE_TYPE=s3
     */
    S3_BUCKET?: string;

    /**
     * AWS access key ID
     * Note: Use IAM roles in production instead of hardcoding credentials
     */
    AWS_ACCESS_KEY_ID?: string;

    /**
     * AWS secret access key
     * Note: Use IAM roles in production instead of hardcoding credentials
     */
    AWS_SECRET_ACCESS_KEY?: string;

    /**
     * Database URL for PostgreSQL connection
     * Format: postgres://user:password@host:port/database
     */
    DATABASE_URL: string;

    /**
     * Node environment
     * @default "development"
     */
    NODE_ENV?: "development" | "staging" | "production";

    /**
     * Server port
     * @default 3000
     */
    PORT?: string;
  }
}

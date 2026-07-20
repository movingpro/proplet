import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  CopyObjectCommand,
} from "@aws-sdk/client-s3";

import { type IFileStorage } from "./storage";

/**
 * AWS S3 storage implementation
 * Requires: @aws-sdk/client-s3 package
 * Environment variables:
 *   - AWS_REGION: AWS region (default: us-east-1)
 *   - AWS_ACCESS_KEY_ID: AWS access key
 *   - AWS_SECRET_ACCESS_KEY: AWS secret key
 *   - S3_BUCKET: S3 bucket name
 */
export class S3Storage implements IFileStorage {
  private client: S3Client;
  private bucket: string;

  constructor(bucket: string, region: string = "us-east-1") {
    this.bucket = bucket;
    this.client = new S3Client({ region });
  }

  async saveFile(path: string, buffer: Buffer): Promise<void> {
    const key = this.getKey(path);

    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: buffer,
          ContentLength: buffer.length,
        }),
      );
    } catch (error) {
      throw new Error(`Failed to save file to S3: ${error}`);
    }
  }

  async readFile(path: string): Promise<Buffer> {
    const key = this.getKey(path);

    try {
      const response = await this.client.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );

      if (!response.Body) {
        throw new Error("Empty response body from S3");
      }

      // Convert stream to buffer
      const chunks: Uint8Array[] = [];
      const reader = response.Body as any;

      if (typeof reader.read === "function") {
        // Node.js stream
        for await (const chunk of reader) {
          chunks.push(chunk);
        }
      } else if (reader instanceof Uint8Array) {
        chunks.push(reader);
      }

      return Buffer.concat(chunks.map((c) => Buffer.from(c)));
    } catch (error) {
      throw new Error(`Failed to read file from S3: ${error}`);
    }
  }

  async deleteFile(path: string): Promise<void> {
    const key = this.getKey(path);

    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
    } catch (error) {
      throw new Error(`Failed to delete file from S3: ${error}`);
    }
  }

  async fileExists(path: string): Promise<boolean> {
    const key = this.getKey(path);

    try {
      await this.client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
      return true;
    } catch (error: any) {
      if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
        return false;
      }
      throw new Error(`Failed to check file existence in S3: ${error}`);
    }
  }

  async getFileMetadata(path: string): Promise<{ size: number; mtime: Date }> {
    const key = this.getKey(path);

    try {
      const response = await this.client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );

      return {
        size: response.ContentLength || 0,
        mtime: response.LastModified || new Date(),
      };
    } catch (error) {
      throw new Error(`Failed to get file metadata from S3: ${error}`);
    }
  }

  async listFiles(directory: string, pattern?: string): Promise<string[]> {
    const prefix = this.getKey(directory);
    const files: string[] = [];

    try {
      let continuationToken: string | undefined;

      do {
        const response = await this.client.send(
          new ListObjectsV2Command({
            Bucket: this.bucket,
            Prefix: prefix,
            ContinuationToken: continuationToken,
          }),
        );

        if (response.Contents) {
          for (const item of response.Contents) {
            if (!item.Key) continue;

            // Extract relative path from the full key
            const relativePath = item.Key.substring(prefix.length);

            // Filter by pattern if provided
            if (pattern) {
              const regex = new RegExp(pattern);
              if (!regex.test(relativePath)) continue;
            }

            files.push(relativePath);
          }
        }

        continuationToken = response.NextContinuationToken;
      } while (continuationToken);

      return files;
    } catch (error) {
      throw new Error(`Failed to list files from S3: ${error}`);
    }
  }

  async moveFile(sourcePath: string, destinationPath: string): Promise<void> {
    const sourceKey = this.getKey(sourcePath);
    const destKey = this.getKey(destinationPath);

    try {
      // Copy to new location
      await this.client.send(
        new CopyObjectCommand({
          Bucket: this.bucket,
          CopySource: `${this.bucket}/${sourceKey}`,
          Key: destKey,
        }),
      );

      // Delete from old location
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: sourceKey,
        }),
      );
    } catch (error) {
      throw new Error(`Failed to move file in S3: ${error}`);
    }
  }

  async copyFile(sourcePath: string, destinationPath: string): Promise<void> {
    const sourceKey = this.getKey(sourcePath);
    const destKey = this.getKey(destinationPath);

    try {
      await this.client.send(
        new CopyObjectCommand({
          Bucket: this.bucket,
          CopySource: `${this.bucket}/${sourceKey}`,
          Key: destKey,
        }),
      );
    } catch (error) {
      throw new Error(`Failed to copy file in S3: ${error}`);
    }
  }

  /**
   * Get S3 object key, ensuring it doesn't start with /
   */
  private getKey(path: string): string {
    return path.startsWith("/") ? path.substring(1) : path;
  }

  /**
   * Get S3 client for advanced operations
   */
  getClient(): S3Client {
    return this.client;
  }

  /**
   * Get bucket name
   */
  getBucket(): string {
    return this.bucket;
  }
}

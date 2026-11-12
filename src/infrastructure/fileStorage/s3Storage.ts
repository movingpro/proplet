import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import type { IFileStorage } from "./storage";

export class S3Storage implements IFileStorage {
  private client: S3Client;
  private bucket: string;

  constructor(bucket: string, region: string) {
    this.bucket = bucket;
    this.client = new S3Client({ region });
  }

  async saveFile(path: string, buffer: Buffer): Promise<void> {
    await this.client.send(new PutObjectCommand({ Bucket: this.bucket, Key: path, Body: buffer }));
  }

  async readFile(path: string): Promise<Buffer> {
    const response = await this.client.send(
      new GetObjectCommand({ Bucket: this.bucket, Key: path }),
    );

    if (!response.Body) {
      throw new Error("Empty response body from S3");
    }

    return Buffer.from(await response.Body.transformToByteArray());
  }

  async deleteFile(path: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: path }));
  }
}

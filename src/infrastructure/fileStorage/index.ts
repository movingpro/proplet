import { env } from "../env";
import { DiskStorage } from "./diskStorage";
import { S3Storage } from "./s3Storage";
import type { IFileStorage } from "./storage";

export const fileStorage: IFileStorage =
  env.S3_BUCKET && env.STORAGE_TYPE === "s3"
    ? new S3Storage(env.S3_BUCKET, env.AWS_REGION)
    : new DiskStorage(env.STORAGE_BASE_PATH);

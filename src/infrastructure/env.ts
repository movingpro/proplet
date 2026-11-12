import * as z from "zod";

// The AWS SDK reads AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY itself.
export const env = z
  .object({
    DATABASE_URL: z.url(),
    PORT: z.coerce.number().int().positive().default(3000),
    STORAGE_TYPE: z.enum(["disk", "s3"]).default("disk"),
    STORAGE_BASE_PATH: z.string().default("./uploads"),
    AWS_REGION: z.string().default("us-east-1"),
    S3_BUCKET: z.string().optional(),
  })
  .refine((env) => env.STORAGE_TYPE !== "s3" || env.S3_BUCKET, {
    message: "S3_BUCKET is required when STORAGE_TYPE=s3",
    path: ["S3_BUCKET"],
  })
  .parse(process.env);

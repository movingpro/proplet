import * as z from "zod";

// The AWS SDK reads AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY itself.
const result = z
  .object({
    DATABASE_URL: z.url(),
    // An empty PORT uses the default.
    PORT: z.preprocess(
      (value) => value || undefined,
      z.coerce.number().int().positive().default(3000),
    ),
  })
  .and(
    z.discriminatedUnion("STORAGE_TYPE", [
      z.object({
        STORAGE_TYPE: z.literal("disk").default("disk"),
        STORAGE_BASE_PATH: z.string().default("./uploads"),
      }),
      z.object({
        STORAGE_TYPE: z.literal("s3"),
        S3_BUCKET: z.string().min(1),
        AWS_REGION: z.string().default("us-east-1"),
      }),
    ]),
  )
  .safeParse(process.env);

if (!result.success) {
  throw new Error(`Invalid environment:\n${z.prettifyError(result.error)}`);
}

export const env = result.data;

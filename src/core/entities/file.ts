import * as z from "zod";

export const file = z.object({
  id: z.uuid(),
  name: z.string().min(1).max(255),
  mimeType: z.string(),
  size: z.number().int().min(0),
  path: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  tenantId: z.uuid(),
});

export type File = z.infer<typeof file>;

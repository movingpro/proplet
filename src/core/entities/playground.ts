import * as z from "zod";

const condition = z.object({
  publicId: z.number().int(),
  name: z.string().min(1).max(255),
});

const location = z.object({
  publicId: z.number().int(),
  secret: z.string().min(1).max(255),
});

const damageLocation = z.object({
  publicId: z.number().int(),
  secret: z.string().min(1).max(255),
});

export enum NeedleType {
  condition,
  location,
  damageLocation,
}

const schemaMap = {
  [NeedleType.condition]: condition,
  [NeedleType.location]: location,
  [NeedleType.damageLocation]: damageLocation,
} as const;

export type SchemaMap = typeof schemaMap;

export type InferSchemaType<T extends NeedleType> = z.infer<SchemaMap[T]>;

export const transformData = <T extends NeedleType>(
  type: T,
  payload: unknown,
): InferSchemaType<T> => schemaMap[type].parse(payload) as InferSchemaType<T>;

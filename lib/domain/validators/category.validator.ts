import { z } from "zod";

/**
 * Category Validation Schemas
 */
export const categoryCreateSchema = z.object({
  name: z.string().min(1, "Category name is required").max(255, "Category name is too long"),
  parentId: z.string().nullable().optional(),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;


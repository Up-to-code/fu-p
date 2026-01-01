import { z } from "zod";

/**
 * Product Validation Schemas
 * 
 * Using Zod for runtime validation of product data.
 * Coercion is used for numeric fields (price, stock) to handle string inputs from web forms.
 */

export const productCreateSchema = z.object({
  name: z.string()
    .min(1, "Product name is required")
    .max(255, "Product name is too long"),

  categoryId: z.string()
    .uuid("Invalid category ID format")
    .optional()
    .nullable(),

  price: z.coerce.number()
    .nonnegative("Price cannot be negative")
    .default(0),

  stock: z.coerce.number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
    .default(0),

  brand: z.string()
    .max(255, "Brand name is too long")
    .optional()
    .default(""),

  status: z.union([
    z.literal('draft'),
    z.literal('active')
  ]).default('draft'),
});

/**
 * Product Update Schema
 * All fields are optional, allowing for partial updates.
 */
export const productUpdateSchema = productCreateSchema.partial();

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;


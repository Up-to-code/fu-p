import { z } from "zod";

/**
 * Organization Validation Schemas
 */
export const organizationCreateSchema = z.object({
  name: z.string().min(1, "Organization name is required").max(255, "Name is too long"),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/, "Invalid slug format").optional(),
});

export const organizationUpdateSchema = z.object({
  name: z.string().min(1, "Organization name is required").max(255, "Name is too long"),
  description: z.string().max(1000, "Description is too long").optional(),
  logo: z.string().url("Invalid logo URL").optional(),
});

export type OrganizationCreateInput = z.infer<typeof organizationCreateSchema>;
export type OrganizationUpdateInput = z.infer<typeof organizationUpdateSchema>;


import { z } from "zod";

/**
 * Employee Validation Schemas
 */
export const employeeCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  email: z.string().email("Invalid email address"),
  role: z.enum(['owner', 'admin', 'manager', 'viewer']),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const employeeUpdateRoleSchema = z.object({
  role: z.enum(['owner', 'admin', 'manager', 'viewer']),
});

export type EmployeeCreateInput = z.infer<typeof employeeCreateSchema>;
export type EmployeeUpdateRoleInput = z.infer<typeof employeeUpdateRoleSchema>;

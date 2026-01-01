import { z } from "zod";

/**
 * Member Validation Schemas
 */
export const memberRoleSchema = z.enum(['viewer', 'manager', 'admin', 'owner']);

export type MemberRole = z.infer<typeof memberRoleSchema>;

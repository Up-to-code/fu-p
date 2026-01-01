"use server";

import { registry } from "@/lib/registry";
import { authenticatedAction, handleActionError } from "@/lib/action-context";

/**
 * Repair Owner Role Action
 * 
 * Thin wrapper that calls RoleRepairService and handles standardized context/errors.
 * Repairs the current user's role to "owner" if they are the organization owner.
 */
export async function repairOwnerRoleAction() {
  try {
    return await authenticatedAction(async (userId) => {
      return await registry.roleRepair.repairUserRole(userId);
    });
  } catch (error) {
    return handleActionError(error);
  }
}

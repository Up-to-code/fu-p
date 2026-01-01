"use server";

import { registry } from "@/lib/registry";
import { withPermission, handleActionError } from "@/lib/action-context";
import { revalidatePath } from "next/cache";

/**
 * Organization Update Action
 * 
 * Thin wrapper that calls OrganizationManagementService and handle standardized context/errors.
 */
export async function updateOrganizationAction(data: {
  name: string;
  description?: string;
  logo?: string;
}) {
  try {
    return await withPermission("org.update", async ({ orgId, userId }) => {
      const result = await registry.orgManagement.updateOrganization(orgId, userId, data);
      revalidatePath("/dashboard/organization");
      return result;
    });
  } catch (error) {
    return handleActionError(error);
  }
}

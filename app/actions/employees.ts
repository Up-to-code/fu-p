"use server";

import { registry } from "@/lib/registry";
import { withOrg, withPermission, handleActionError } from "@/lib/action-context";
import { revalidatePath } from "next/cache";

/**
 * Employee Actions
 * 
 * Thin wrappers that call EmployeeService and handle standardized context/errors.
 */

export async function getEmployeesAction() {
  try {
    return await withPermission("users.view", async ({ orgId }) => {
      return await registry.employeeService.getEmployees(orgId);
    });
  } catch (error) {
    return [];
  }
}

export async function updateMemberRoleAction(memberId: string, newRole: string) {
  try {
    return await withPermission('users.edit', async ({ orgId, userId }) => {
      // We need the current user's role to check permissions
      // This is a bit tricky - we might want to get the session inside the service 
      // but for now, we'll fetch the user from registry
      const currentUser = await registry.users.findById(userId);
      if (!currentUser) throw new Error("Current user not found");

      await registry.employeeService.updateEmployeeRole(
        orgId,
        userId,
        currentUser.role || 'viewer',
        memberId,
        newRole
      );

      revalidatePath("/dashboard/employees");
      return { success: true };
    });
  } catch (error) {
    return handleActionError(error);
  }
}

export async function removeEmployeeAction(memberId: string) {
  try {
    return await withPermission('users.delete', async ({ orgId }) => {
      await registry.employeeService.removeEmployee(orgId, memberId);
      revalidatePath("/dashboard/employees");
      return { success: true };
    });
  } catch (error) {
    return handleActionError(error);
  }
}
export async function addEmployeeAction(data: any) {
  try {
    return await withPermission('users.edit', async ({ orgId }) => {
      await registry.employeeService.inviteEmployee(orgId, data);
      revalidatePath("/dashboard/employees");
      return { success: true };
    });
  } catch (error) {
    return handleActionError(error);
  }
}

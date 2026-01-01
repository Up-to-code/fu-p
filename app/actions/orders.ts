"use server";

import { registry } from "@/lib/registry";
import { withOrg, withPermission, handleActionError } from "@/lib/action-context";
import { revalidatePath } from "next/cache";

/**
 * Order Actions
 * 
 * Thin wrappers that call OrderService and handle standardized context/errors.
 */

export async function getOrdersAction() {
  try {
    return await withPermission("orders.view", async ({ orgId }) => {
      return await registry.orderService.getOrders(orgId);
    });
  } catch (error) {
    return [];
  }
}

export async function updateOrderStatusAction(id: string, status: string) {
  try {
    return await withPermission('orders.manage', async ({ orgId }) => {
      await registry.orderService.updateOrderStatus(orgId, id, status);
      revalidatePath("/dashboard/orders");
      return { success: true };
    });
  } catch (error) {
    return handleActionError(error);
  }
}

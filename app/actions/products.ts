"use server";

import { registry } from "@/lib/registry";
import { revalidatePath } from "next/cache";
import { withOrg, withPermission, handleActionError } from "@/lib/action-context";

/**
 * Product Actions
 * 
 * Thin wrappers that call ProductService and handle standardized context/errors.
 */

export async function getProductsAction() {
  try {
    return await withPermission("products.view", async ({ orgId }) => {
      return await registry.productService.getProducts(orgId);
    });
  } catch (error) {
    return []; // Return empty list on error for the UI
  }
}

export async function createProductAction(data: {
  name: string;
  categoryId: string;
  price: number;
  stock: number;
  brand: string;
  status: 'draft' | 'active';
}) {
  try {
    return await withPermission('products.create', async ({ orgId }) => {
      await registry.productService.createProduct(orgId, data);
      revalidatePath("/dashboard/inventory");
      return { success: true };
    });
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteProductAction(id: string) {
  try {
    return await withPermission('products.delete', async ({ orgId }) => {
      await registry.productService.deleteProduct(orgId, id);
      revalidatePath("/dashboard/inventory");
      return { success: true };
    });
  } catch (error) {
    return handleActionError(error);
  }
}

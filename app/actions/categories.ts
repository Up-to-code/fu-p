"use server";

import { registry } from "@/lib/registry";
import { revalidatePath } from "next/cache";
import { withOrg, handleActionError, withPermission } from "@/lib/action-context";

/**
 * Category Actions
 * 
 * Thin wrappers that call CategoryService and handle standardized context/errors.
 */
export async function getCategoriesAction() {
  try {
    return await withPermission("products.view", async ({ orgId }) => {
      return await registry.categoryService.getCategories(orgId);
    });
  } catch (error) {
    return [];
  }
}

export async function createCategoryAction(name: string, parentId?: string | null) {
  try {
    return await withPermission("products.create", async ({ orgId }) => {
      const category = await registry.categoryService.createCategory(orgId, name, parentId);
      revalidatePath("/dashboard/inventory");
      return { success: true, data: category };
    });
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    return await withPermission("products.delete", async ({ orgId }) => {
      await registry.categoryService.deleteCategory(orgId, id);
      revalidatePath("/dashboard/inventory");
      return { success: true };
    });
  } catch (error) {
    return handleActionError(error);
  }
}

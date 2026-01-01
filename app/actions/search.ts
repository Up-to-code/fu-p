"use server";

import { registry } from "@/lib/registry";
import { withPermission, handleActionError } from "@/lib/action-context";

/**
 * Global Search Action
 * 
 * Thin wrapper that calls SearchService and handles standardized context/errors.
 */
export async function globalSearchAction(query: string) {
  try {
    return await withPermission("products.view", async ({ orgId }) => {
      return await registry.search.globalSearch(orgId, query);
    });
  } catch (error) {
    return { products: [], orders: [], employees: [] };
  }
}

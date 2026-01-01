"use server";

import { registry } from "@/lib/registry";
import { withPermission, handleActionError } from "@/lib/action-context";

/**
 * Analytics Actions
 * 
 * Thin wrappers that call AnalyticsService and handle standardized context/errors.
 */
export async function getAnalyticsAction() {
  try {
    return await withPermission("analytics.view", async ({ orgId }) => {
      return await registry.analytics.getAnalytics(orgId);
    });
  } catch (error) {
    return handleActionError(error);
  }
}

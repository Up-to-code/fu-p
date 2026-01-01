"use server";

import { registry } from "@/lib/registry";
import { withPermission, handleActionError } from "@/lib/action-context";

/**
 * Dashboard Stats Action
 * 
 * Thin wrapper that calls DashboardStatsService and handles standardized context/errors.
 */
export async function getDashboardStatsAction() {
  try {
    return await withPermission("analytics.view", async ({ orgId }) => {
      return await registry.stats.getDashboardStats(orgId);
    });
  } catch (error) {
    return null;
  }
}

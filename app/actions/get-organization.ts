"use server";

import { registry } from "@/lib/registry";
import { withOrg, handleActionError } from "@/lib/action-context";

/**
 * Get Organization Action
 * 
 * Thin wrapper that calls OrganizationManagementService and handles standardized context/errors.
 */
export async function getOrganizationAction() {
  try {
    return await withOrg(async ({ userId, orgId }) => {
      return await registry.orgManagement.getOrganization(userId, orgId);
    });
  } catch (error) {
    return null;
  }
}

/**
 * Get Organization Stats Action
 * 
 */
export async function getOrgStatsAction() {
  try {
    return await withOrg(async ({ orgId }) => {
      return await registry.orgManagement.getOrgStats(orgId);
    });
  } catch (error) {
    return null;
  }
}

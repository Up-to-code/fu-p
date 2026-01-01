"use server";

import { registry } from "@/lib/registry";
import { authenticatedAction, handleActionError } from "@/lib/action-context";

/**
 * Organization Creation Actions
 * 
 * Thin wrappers that call OrganizationCreationService and handle standardized context/errors.
 */
export async function createOrganizationAction(name: string, slug?: string) {
  try {
    return await authenticatedAction(async () => {
      // Fix: Ensure slug is string or undefined, but service might expect string
      return await registry.orgCreation.createOrganization(name, slug || "");
    });
  } catch (error) {
    return handleActionError(error);
  }
}

export async function checkSlugAvailability(slug: string) {
  try {
    return await registry.orgCreation.checkSlugAvailability(slug);
  } catch (error) {
    return { success: false, error: "Failed to check slug availability" };
  }
}

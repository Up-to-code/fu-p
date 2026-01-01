"use server";

import { registry } from "@/lib/registry";
import { authenticatedAction, handleActionError } from "@/lib/action-context";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Join Organization Action
 * 
 * Thin wrapper that calls OrganizationMembershipService and handles standardized context/errors.
 */
export async function joinOrganizationAction(organizationId: string, role?: string) {
  try {
    await authenticatedAction(async (userId) => {
      await registry.membership.joinOrganization(userId, organizationId, role);
      revalidatePath("/dashboard");
    });
  } catch (error) {
    // Note: redirect() throws a special error that Next.js catches. 
    // authenticatedAction won't catch it if it's called outside.
    // But joinOrganization doesn't redirect.
    return handleActionError(error);
  }

  // Redirect outside try-catch to properly handle NEXT_REDIRECT error
  redirect("/dashboard");
}

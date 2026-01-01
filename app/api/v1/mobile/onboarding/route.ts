import { validateSessionRequest, apiError, apiSuccess } from "@/lib/api-auth";
import { registry } from "@/lib/registry";
import { NextRequest } from "next/server";

/**
 * Onboarding API for Mobile
 * 
 * Handles flows for users who don't have an organization yet.
 */

export async function POST(req: NextRequest) {
    const result = await validateSessionRequest();

    if ("error" in result) {
        return apiError(result.error as string, result.status as number);
    }

    const { session } = result;
    const data = await req.json();

    try {
        // Check if user already has an organization to prevent duplicates
        const existingOrgId = await registry.organization.getCurrentOrganizationId();
        if (existingOrgId) {
            return apiError("User already belongs to an organization", 400);
        }

        // Determine action: create or join
        if (data.action === 'create') {
            const newOrg = await registry.orgCreation.createOrganization(
                session.user.id,
                data.name,
                data.slug || data.name.toLowerCase().replace(/\s+/g, '-')
            );
            return apiSuccess({ success: true, organization: newOrg });
        }

        if (data.action === 'join') {
            if (!data.inviteCode) {
                return apiError("Invite code is required to join an organization", 400);
            }
            // Assuming registry has a membership/join service
            await registry.membership.joinOrganization(session.user.id, data.inviteCode);
            return apiSuccess({ success: true });
        }

        return apiError("Invalid action. Use 'create' or 'join'", 400);
    } catch (error: any) {
        return apiError(error.message || "Failed to complete onboarding", 500);
    }
}

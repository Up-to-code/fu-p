import { registry } from "@/lib/registry";
import { UnauthorizedError } from "@/lib/domain/errors/business.error";
import { auth } from "@/lib/auth/config";
import { headers } from "next/headers";
import { Permission, hasPermission } from "./permissions";

/**
 * Action Context
 * 
 * Contains information about the current authenticated user and organization.
 */
export interface ActionContext {
    userId: string;
    orgId: string;
}

/**
 * Higher-order function to ensure a Server Action is authenticated 
 * and associated with an organization.
 * 
 * Handles the repetitive task of fetching the session and orgId.
 */
export async function withOrg<T>(
    action: (context: ActionContext) => Promise<T>
): Promise<T> {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
        throw new UnauthorizedError("You must be logged in to perform this action");
    }

    const orgId = await registry.organization.getCurrentOrganizationId();

    if (!orgId) {
        throw new UnauthorizedError("No organization associated with this account");
    }

    return await action({
        userId: session.user.id,
        orgId: orgId
    });
}

/**
 * Higher-order function to ensure a Server Action is authenticated, 
 * associated with an organization, AND has a specific permission.
 */
export async function withPermission<T>(
    permission: Permission,
    action: (context: ActionContext) => Promise<T>
): Promise<T> {
    return await withOrg(async (context) => {
        const user = await registry.users.findById(context.userId);

        if (!user || !hasPermission(user.role || 'viewer', permission)) {
            throw new UnauthorizedError(`Missing required permission: ${permission}`);
        }

        return await action(context);
    });
}

/**
 * Higher-order function to ensure a Server Action is authenticated.
 * Does not require an organization association.
 */
export async function authenticatedAction<T>(
    action: (userId: string) => Promise<T>
): Promise<T> {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
        throw new UnauthorizedError("You must be logged in to perform this action");
    }

    return await action(session.user.id);
}

/**
 * Standard error handler for Server Actions.
 * Converts internal business errors to a consistent response format for the UI.
 */
export function handleActionError(error: unknown) {
    if (error instanceof Error) {
        // Only return the message if it's a known error type, 
        // or log it if it's an unexpected system error.
        const isPublicError =
            error.name === "ValidationError" ||
            error.name === "BusinessError" ||
            error.name === "NotFoundError" ||
            error.name === "UnauthorizedError";

        if (!isPublicError) {
            console.error("Internal Server Error in Action:", error);
            return { success: false, error: "An unexpected error occurred" };
        }

        return { success: false, error: error.message };
    }

    console.error("Unknown error in Action:", error);
    return { success: false, error: "An unexpected error occurred" };
}

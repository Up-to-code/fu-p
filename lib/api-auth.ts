import { auth } from "@/lib/auth/config";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { hasPermission, Permission } from "./permissions";
import { registry } from "./registry";

export async function getApiSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return null;
  }

  return session;
}

export async function validateApiRequest(permission?: Permission) {
  const session = await getApiSession();

  if (!session) {
    return { error: "Unauthorized", status: 401 };
  }

  if (permission && !hasPermission(session.user.role, permission)) {
    return { error: "Forbidden", status: 403 };
  }

  // Get organization ID using organization service
  const org = await registry.organization.getCurrentOrganization();
  if (!org) {
    return { error: "Organization not found", status: 404 };
  }
  const orgId = org.id;

  return { session, orgId };
}

/**
 * Validates only the authenticated session.
 * Used for onboarding/initial setup where an organization might not exist yet.
 */
export async function validateSessionRequest() {
  const session = await getApiSession();

  if (!session) {
    return { error: "Unauthorized", status: 401 };
  }

  return { session };
}

/**
 * Validates requests from the Master Backend using a shared secret.
 */
export async function validateInternalRequest() {
  const headerList = await headers();
  const secret = headerList.get("x-internal-secret");
  const masterSecret = process.env.INTERNAL_API_SECRET || "fallback_development_secret";

  if (!secret || secret !== masterSecret) {
    return { error: "Forbidden: Invalid internal secret", status: 403 };
  }

  return { isInternal: true };
}

export function apiError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export function apiSuccess(data: any) {
  return NextResponse.json(data);
}

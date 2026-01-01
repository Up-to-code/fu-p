import { validateSessionRequest, apiError, apiSuccess } from "@/lib/api-auth";
import { registry } from "@/lib/registry";

export async function GET() {
  const result = await validateSessionRequest();

  if ("error" in result) {
    return apiError(result.error as string, result.status as number);
  }

  const { session } = result;

  // Try to get orgId if it exists, otherwise return null
  const orgId = await registry.organization.getCurrentOrganizationId();

  return apiSuccess({
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
    },
    organizationId: orgId || null,
  });
}

import { validateApiRequest, apiError, apiSuccess } from "@/lib/api-auth";
import { registry } from "@/lib/registry";
import { NextRequest } from "next/server";

export async function GET() {
  const result = await validateApiRequest();

  if ("error" in result) {
    return apiError(result.error as string, result.status as number);
  }

  try {
    const org = await registry.organization.getCurrentOrganization();
    if (!org) {
      return apiError("Organization not found", 404);
    }
    return apiSuccess(org);
  } catch (error) {
    return apiError("Internal server error", 500);
  }
}

export async function PATCH(req: NextRequest) {
  const result = await validateApiRequest("org.update");

  if ("error" in result) {
    return apiError(result.error as string, result.status as number);
  }

  const { orgId } = result;

  try {
    const data = await req.json();
    await registry.orgManagement.updateOrganization(orgId, result.session.user.id, data);
    return apiSuccess({ success: true });
  } catch (error: any) {
    return apiError(error.message || "Failed to update organization", 400);
  }
}

import { validateApiRequest, apiError, apiSuccess } from "@/lib/api-auth";
import { registry } from "@/lib/registry";

export async function GET() {
  const result = await validateApiRequest();

  if ("error" in result) {
    return apiError(result.error as string, result.status as number);
  }

  const { orgId } = result;

  try {
    const analytics = await registry.analytics.getAnalytics(orgId);
    return apiSuccess(analytics);
  } catch (error) {
    return apiError("Could not retrieve analytics", 500);
  }
}

import { validateApiRequest, apiError, apiSuccess } from "@/lib/api-auth";
import { registry } from "@/lib/registry";

export async function GET() {
  const result = await validateApiRequest();

  if ("error" in result) {
    return apiError(result.error as string, result.status as number);
  }

  const { orgId } = result;

  try {
    const stats = await registry.stats.getDashboardStats(orgId);
    return apiSuccess(stats);
  } catch (error) {
    return apiError("Could not retrieve stats", 500);
  }
}

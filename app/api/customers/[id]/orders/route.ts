import { NextRequest } from "next/server";
import { registry } from "@/lib/registry";
import { apiError, apiSuccess, validateInternalRequest } from "@/lib/api-auth";

/**
 * Get Customer Order History (across all orgs)
 * GET /api/customers/{customerId}/orders
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: customerId } = await params;

        // Internal request as it spans multiple organizations
        const auth = await validateInternalRequest();
        if ('error' in auth) return apiError(auth.error as string, auth.status as number);

        const orders = await registry.orderService.findByCustomerId(customerId);

        return apiSuccess(orders);
    } catch (error: any) {
        return apiError(error.message, 500);
    }
}

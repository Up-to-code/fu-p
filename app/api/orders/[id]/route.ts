import { NextRequest } from "next/server";
import { registry } from "@/lib/registry";
import { apiError, apiSuccess, validateApiRequest } from "@/lib/api-auth";

/**
 * Get Single Order Details
 * GET /api/orders/{partnerOrderId}
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const auth = await validateApiRequest();
        if ('error' in auth) return apiError(auth.error as string, auth.status as number);

        const { orgId } = auth;
        if (!id || !orgId) return apiError("Invalid request", 400);

        const order = await registry.orders.findById(id as string, orgId as string);
        if (!order) return apiError("Order not found", 404);

        return apiSuccess(order);
    } catch (error: any) {
        return apiError(error.message, 500);
    }
}

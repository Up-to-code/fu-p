import { NextRequest } from "next/server";
import { registry } from "@/lib/registry";
import { apiError, apiSuccess, validateInternalRequest } from "@/lib/api-auth";

/**
 * Get Main Order Aggregation
 * GET /api/orders/main/{mainOrderId}
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ mainOrderId: string }> }
) {
    try {
        const { mainOrderId } = await params;

        // Internal request as it spans multiple organizations
        const auth = await validateInternalRequest();
        if ('error' in auth) return apiError(auth.error as string, auth.status as number);

        const partnerOrders = await registry.orderService.findByMainOrderId(mainOrderId);

        if (partnerOrders.length === 0) {
            return apiError("Main order not found", 404);
        }

        // Aggregate overall status
        const statuses = partnerOrders.map(o => o.status);
        let overallStatus = "received";

        if (statuses.every(s => s === "delivered" || s === "completed")) {
            overallStatus = "completed";
        } else if (statuses.some(s => s === "delivered" || s === "completed")) {
            overallStatus = "partially_completed";
        } else {
            overallStatus = statuses[0] || "received";
        }

        return apiSuccess({
            mainOrderId,
            customerId: partnerOrders[0]?.customerId,
            status: overallStatus,
            partnerOrders: partnerOrders.map(o => ({
                partnerOrderId: o.id,
                organizationId: o.organizationId,
                status: o.status,
                completedAt: o.completedAt
            }))
        });
    } catch (error: any) {
        return apiError(error.message, 500);
    }
}

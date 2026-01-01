import { NextRequest } from "next/server";
import { registry } from "@/lib/registry";
import { apiError, apiSuccess, validateApiRequest } from "@/lib/api-auth";

/**
 * Cancel Order
 * POST /api/orders/{partnerOrderId}/cancel
 */
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { reason } = await req.json();

        const auth = await validateApiRequest();
        if ('error' in auth) return apiError(auth.error as string, auth.status as number);

        const oldOrder = await registry.orders.findById(id, auth.orgId as string);
        if (!oldOrder) return apiError("Order not found", 404);

        if (oldOrder.status === "completed" || oldOrder.status === "delivered") {
            return apiError("Cannot cancel a completed or delivered order", 400);
        }

        const updatedOrder = await registry.orders.updateStatus(
            id,
            auth.orgId as string,
            "cancelled",
            reason || "Cancelled by user/partner",
            auth.session?.user?.id
        );

        if (!updatedOrder) return apiError("Failed to cancel order", 500);

        // Notify Main Backend
        await registry.webhooks.notifyOrderStatusUpdate(
            updatedOrder,
            "cancelled",
            oldOrder.status,
            reason
        );

        return apiSuccess({
            success: true,
            order: updatedOrder
        });
    } catch (error: any) {
        return apiError(error.message, 500);
    }
}

import { NextRequest } from "next/server";
import { registry } from "@/lib/registry";
import { apiError, apiSuccess, validateApiRequest } from "@/lib/api-auth";
import { OrderStatus } from "@/lib/infrastructure/repositories/interfaces/order.repository.interface";

/**
 * Update Order Status
 * PUT /api/orders/{partnerOrderId}/status
 */
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { status, notes } = await req.json();

        const auth = await validateApiRequest();
        if ('error' in auth) return apiError(auth.error as string, auth.status as number);

        const oldOrder = await registry.orders.findById(id, auth.orgId as string);
        if (!oldOrder) return apiError("Order not found", 404);

        const updatedOrder = await registry.orders.updateStatus(
            id,
            auth.orgId as string,
            status as OrderStatus,
            notes,
            auth.session?.user?.id
        );

        if (!updatedOrder) return apiError("Failed to update status", 500);

        // Notify Main Backend
        await registry.webhooks.notifyOrderStatusUpdate(
            updatedOrder,
            status,
            oldOrder.status,
            notes
        );

        return apiSuccess({
            success: true,
            order: updatedOrder
        });
    } catch (error: any) {
        return apiError(error.message, 500);
    }
}

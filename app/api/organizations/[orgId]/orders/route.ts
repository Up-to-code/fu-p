import { NextRequest } from "next/server";
import { registry } from "@/lib/registry";
import { apiError, apiSuccess, validateApiRequest } from "@/lib/api-auth";
import { OrderStatus } from "@/lib/infrastructure/repositories/interfaces/order.repository.interface";

/**
 * Get Orders for Organization
 * GET /api/organizations/{orgId}/orders
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ orgId: string }> }
) {
    try {
        const { orgId } = await params;
        const searchParams = req.nextUrl.searchParams;
        const status = searchParams.get("status") as OrderStatus | null;

        const auth = await validateApiRequest();
        if ('error' in auth) return apiError(auth.error as string, auth.status as number);
        if (auth.orgId !== orgId) return apiError("Access denied for this organization", 403);

        const orders = await registry.orders.findByOrganizationId(orgId);

        let filteredOrders = orders;
        if (status) {
            filteredOrders = orders.filter(o => o.status === status);
        }

        return apiSuccess(filteredOrders);
    } catch (error: any) {
        return apiError(error.message, 500);
    }
}

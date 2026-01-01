import { NextRequest, NextResponse } from "next/server";
import { registry } from "@/lib/registry";
import { apiError, apiSuccess } from "@/lib/api-auth";
import crypto from "crypto";
import { randomUUID } from "crypto";

/**
 * Incoming Webhook from Main Backend
 * 
 * Endpoint: POST /api/webhooks/orders/incoming
 */
export async function POST(req: NextRequest) {
    try {
        const payload = await req.json();
        const signature = req.headers.get("x-webhook-signature");
        const secret = process.env.WEBHOOK_SECRET || "fallback_webhook_secret";

        // 1. Verify Signature
        if (signature) {
            const hmac = crypto.createHmac("sha256", secret);
            const expectedSignature = hmac.update(JSON.stringify(payload)).digest("hex");
            if (signature !== expectedSignature) {
                return apiError("Invalid signature", 401);
            }
        }

        const {
            orderId: mainOrderId,
            customerId,
            items,
            customerInfo,
            totalAmount,
            currency = "SAR",
        } = payload;

        if (!mainOrderId || !items || !Array.isArray(items)) {
            return apiError("Invalid payload: mainOrderId and items are required", 400);
        }

        // 2. Group items by organizationId
        const ordersByOrg: Record<string, any[]> = {};
        items.forEach((item: any) => {
            if (!ordersByOrg[item.organizationId]) {
                ordersByOrg[item.organizationId] = [];
            }
            ordersByOrg[item.organizationId].push(item);
        });

        // 3. Create separate orders for each organization
        const partnerOrders = [];

        for (const [orgId, orgItems] of Object.entries(ordersByOrg)) {
            const subtotal = orgItems.reduce(
                (sum, item) => sum + Number(item.price) * item.quantity,
                0
            );

            const partnerOrderId = `PO-${randomUUID().substring(0, 8).toUpperCase()}`;

            const partnerOrder = await registry.orders.create({
                id: partnerOrderId,
                mainOrderId: mainOrderId,
                organizationId: orgId,
                customerId: customerId,
                customerName: customerInfo?.name || "Unknown",
                customerEmail: customerInfo?.email,
                customerPhone: customerInfo?.phone,
                address: customerInfo?.address ? JSON.stringify(customerInfo.address) : null,
                totalAmount: subtotal.toString(),
                currency: currency,
                status: "received",
                items: orgItems.map((item) => ({
                    id: randomUUID(),
                    productId: item.productId,
                    productName: item.productName,
                    quantity: item.quantity,
                    price: item.price.toString(),
                    status: "confirmed",
                })),
            });

            partnerOrders.push({
                partnerOrderId: partnerOrder.id,
                organizationId: orgId,
                itemCount: orgItems.length,
                subtotal: subtotal,
            });

            // 4. Notify Main Backend that order was received by this partner
            // We don't await this to keep the response fast, or we could await if reliability is key
            registry.webhooks.notifyOrderStatusUpdate(
                partnerOrder,
                "received",
                null,
                "Order received by partner system"
            );
        }

        return apiSuccess({
            success: true,
            mainOrderId,
            partnerOrders,
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        console.error("Incoming Webhook Error:", error);
        return apiError(error.message || "Internal server error", 500);
    }
}

import { db } from "@/lib/db/drizzle";
import { webhookLogs } from "@/lib/db/schema";
import { IWebhookService } from "./webhook.service.interface";
import crypto from 'crypto';
import { randomUUID } from "crypto";

/**
 * Webhook Service
 * 
 * Handles outbound notifications to the Main Backend.
 * Features: Signature generation, Retry logic (simulated), Database logging.
 */
export class WebhookService implements IWebhookService {
    private readonly baseUrl: string;
    private readonly secret: string;
    private readonly maxRetries = 3;

    constructor() {
        this.baseUrl = process.env.MAIN_BACKEND_WEBHOOK_URL || "https://main-backend.com/api/webhooks/partner/status";
        this.secret = process.env.WEBHOOK_SECRET || "fallback_webhook_secret";
    }

    /**
     * Generate HMAC signature for payload
     */
    private generateSignature(payload: any): string {
        const hmac = crypto.createHmac('sha256', this.secret);
        const signature = hmac.update(JSON.stringify(payload)).digest('hex');
        return signature;
    }

    /**
     * General notification method with logging and retry
     */
    async notify(event: string, orderId: string, data: any, retryCount = 0): Promise<boolean> {
        const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

        const payload = {
            event,
            eventId,
            timestamp: new Date().toISOString(),
            data,
        };

        const signature = this.generateSignature(payload);

        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Webhook-Signature': signature,
                    'X-Event-ID': eventId,
                },
                body: JSON.stringify(payload),
            });

            const responseText = await response.text();

            // Log to database
            await db.insert(webhookLogs).values({
                id: eventId,
                eventType: event,
                orderId: orderId,
                payload: JSON.stringify(payload),
                sentAt: new Date(),
                responseStatus: response.status,
                responseBody: responseText,
                retryCount: retryCount,
                success: response.ok,
            });

            if (!response.ok && retryCount < this.maxRetries) {
                return this.retry(event, orderId, data, retryCount);
            }

            return response.ok;
        } catch (error: any) {
            console.error(`Webhook Dispatch Error (${event}):`, error.message);

            // Log failure
            await db.insert(webhookLogs).values({
                id: eventId,
                eventType: event,
                orderId: orderId,
                payload: JSON.stringify(payload),
                sentAt: new Date(),
                responseStatus: 500,
                responseBody: error.message,
                retryCount: retryCount,
                success: false,
            });

            if (retryCount < this.maxRetries) {
                return this.retry(event, orderId, data, retryCount);
            }

            return false;
        }
    }

    private async retry(event: string, orderId: string, data: any, retryCount: number): Promise<boolean> {
        const delay = Math.pow(2, retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.notify(event, orderId, data, retryCount + 1);
    }

    /**
     * Specialized notification for Order Status Updates
     */
    async notifyOrderStatusUpdate(order: any, newStatus: string, oldStatus: string | null, notes?: string | null) {
        // Porting the user's logic: partner.order.[status]
        const eventType = `partner.order.${newStatus.replace('_', '.')}`;

        const orderData = {
            mainOrderId: order.mainOrderId,
            partnerOrderId: order.id,
            organizationId: order.organizationId,
            customerId: order.customerId,
            status: newStatus,
            previousStatus: oldStatus,
            estimatedReadyTime: order.estimatedReadyTime,
            items: order.items || [],
            notes: notes,
            metadata: {
                updatedAt: new Date().toISOString()
            }
        };

        return this.notify(eventType, order.id, orderData);
    }
}

// Export singleton
export const webhookService = new WebhookService();

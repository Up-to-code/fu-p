export interface IWebhookService {
    /**
     * General notification method
     */
    notify(event: string, orderId: string, payload: any): Promise<boolean>;

    /**
     * Specialized notification for Order Status Updates
     */
    notifyOrderStatusUpdate(order: any, newStatus: string, oldStatus: string | null, notes?: string | null): Promise<boolean>;
}

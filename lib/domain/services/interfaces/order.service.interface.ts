export interface IOrderService {
    getOrders(orgId: string): Promise<any[]>;
    getOrder(orgId: string, orderId: string): Promise<any>;
    createOrder(orgId: string, data: any): Promise<any>;
    updateOrderStatus(orgId: string, orderId: string, status: string, notes?: string, changedBy?: string): Promise<any>;
    findByMainOrderId(mainOrderId: string): Promise<any[]>;
    findByCustomerId(customerId: string): Promise<any[]>;
}

import { IOrderRepository, OrderStatus } from "@/lib/infrastructure/repositories/interfaces/order.repository.interface";
import { IOrderService } from "./interfaces/order.service.interface";
import { orderStatusSchema } from "@/lib/domain/validators/order.validator";
import { NotFoundError, BusinessError } from "@/lib/domain/errors/business.error";
import { BaseService } from "./base.service";
import { randomUUID } from "crypto";
import { IWebhookService } from "@/lib/infrastructure/webhooks/webhook.service.interface";

/**
 * Order Service Implementation
 * 
 * Contains all business logic for orders.
 */
export class OrderService extends BaseService implements IOrderService {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly webhooks: IWebhookService
  ) {
    super();
  }

  /**
   * Get all orders for an organization
   */
  async getOrders(orgId: string) {
    const orders = await this.orderRepository.findByOrganizationId(orgId);

    return orders.map((o) => ({
      id: o.id,
      mainOrderId: o.mainOrderId,
      customerName: o.customerName,
      totalAmount: Number(o.totalAmount),
      status: o.status,
      createdAt: o.createdAt.toISOString(),
      itemCount: o.itemCount,
    }));
  }

  /**
   * Get a single order
   */
  async getOrder(orgId: string, orderId: string) {
    const order = await this.orderRepository.findById(orderId, orgId);
    if (!order) {
      throw new NotFoundError("Order");
    }
    return order;
  }

  /**
   * Find orders by Main Order ID (global lookup)
   */
  async findByMainOrderId(mainOrderId: string) {
    return await this.orderRepository.findByMainOrderId(mainOrderId);
  }

  /**
   * Find orders by Customer ID (global lookup)
   */
  async findByCustomerId(customerId: string) {
    return await this.orderRepository.findByCustomerId(customerId);
  }

  /**
   * Create a new order
   */
  async createOrder(orgId: string, data: any) {
    try {
      const orderData = {
        id: data.id || `PO-${randomUUID().substring(0, 8).toUpperCase()}`,
        mainOrderId: data.mainOrderId,
        organizationId: orgId,
        customerId: data.customerId,
        customerName: data.customerName || "Customer",
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        address: typeof data.address === 'object' ? JSON.stringify(data.address) : data.address,
        totalAmount: data.totalAmount?.toString() || "0",
        currency: data.currency || "SAR",
        status: (data.status || 'received') as OrderStatus,
        items: data.items || [],
      };

      const order = await this.orderRepository.create(orderData);

      // Notify Main Backend
      await this.webhooks.notifyOrderStatusUpdate(order, order.status, null, "Order created");

      return order;
    } catch (error: any) {
      console.error("Order Creation Error:", error);
      throw new BusinessError(error.message || "Failed to create order");
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orgId: string, orderId: string, status: string, notes?: string, changedBy?: string) {
    // 1. Validate status
    const validatedStatus = this.validate(orderStatusSchema, status) as OrderStatus;

    // 2. Get current order to know old status
    const oldOrder = await this.orderRepository.findById(orderId, orgId);
    if (!oldOrder) {
      throw new NotFoundError("Order");
    }

    // 3. Update order status
    const updated = await this.orderRepository.updateStatus(orderId, orgId, validatedStatus, notes, changedBy);
    if (!updated) {
      throw new NotFoundError("Order");
    }

    // 4. Notify Main Backend
    await this.webhooks.notifyOrderStatusUpdate(updated, validatedStatus, oldOrder.status, notes);

    return updated;
  }
}

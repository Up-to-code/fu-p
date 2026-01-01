import { orders, orderItems, orderStatusHistory, webhookLogs } from "@/lib/db/schema";
import { and, desc, or, ilike, count, sum, eq } from "drizzle-orm";
import { BaseRepository } from "./base.repository";
import { randomUUID } from "crypto";
import type {
  IOrderRepository,
  Order,
  OrderWithItems,
  CreateOrderData,
  OrderStatus,
} from "./interfaces/order.repository.interface";

/**
 * Order Repository Implementation
 */
export class OrderRepository extends BaseRepository implements IOrderRepository {
  /**
   * Helper to map raw database order to Domain Order interface
   */
  private mapToOrder(o: any): Order {
    return {
      id: o.id,
      mainOrderId: o.mainOrderId,
      organizationId: o.organizationId,
      customerId: o.customerId,
      customerName: o.customerName,
      customerEmail: o.customerEmail,
      customerPhone: o.customerPhone,
      address: o.address,
      totalAmount: o.totalAmount,
      currency: o.currency || 'SAR',
      status: (o.status || 'received') as OrderStatus,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
      estimatedReadyTime: o.estimatedReadyTime,
      completedAt: o.completedAt,
    };
  }

  /**
   * Helper to map raw database order with items to combined interface
   */
  private mapToOrderWithItems(o: any): OrderWithItems {
    return {
      ...this.mapToOrder(o),
      itemCount: o.items?.length || 0,
      items: o.items?.map((item: any) => ({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        status: item.status,
      })),
      history: o.history?.map((h: any) => ({
        ...h,
        status: h.status as OrderStatus,
        previousStatus: h.previousStatus as OrderStatus | null,
      })),
      webhooks: o.webhooks?.map((w: any) => ({
        ...w,
      })),
    };
  }

  async findByOrganizationId(organizationId: string): Promise<OrderWithItems[]> {
    const ordersList = await this.db.query.orders.findMany({
      where: this.tenantFilter(orders.organizationId, organizationId),
      orderBy: [desc(orders.createdAt)],
      with: {
        items: true,
      },
    });

    return ordersList.map((o) => this.mapToOrderWithItems(o));
  }

  async findCompletedWithItems(organizationId: string): Promise<OrderWithItems[]> {
    const ordersList = await this.db.query.orders.findMany({
      where: this.tenantFilter(orders.organizationId, organizationId, eq(orders.status, 'completed')),
      with: {
        items: true,
      },
      orderBy: [desc(orders.createdAt)],
    });

    return ordersList.map((o) => this.mapToOrderWithItems(o));
  }

  async findById(id: string, organizationId: string): Promise<OrderWithItems | null> {
    const order = await this.db.query.orders.findFirst({
      where: this.tenantFilter(orders.organizationId, organizationId, eq(orders.id, id)),
      with: {
        items: true,
        history: {
          orderBy: [desc(orderStatusHistory.createdAt)],
        },
        webhooks: {
          orderBy: [desc(webhookLogs.sentAt)],
        },
      },
    });

    if (!order) return null;
    return this.mapToOrderWithItems(order);
  }

  async findByMainOrderId(mainOrderId: string): Promise<Order[]> {
    const ordersList = await this.db.query.orders.findMany({
      where: eq(orders.mainOrderId, mainOrderId),
    });

    return ordersList.map((o) => this.mapToOrder(o));
  }

  async findByCustomerId(customerId: string): Promise<Order[]> {
    const ordersList = await this.db.query.orders.findMany({
      where: eq(orders.customerId, customerId),
    });

    return ordersList.map((o) => this.mapToOrder(o));
  }

  async create(data: CreateOrderData): Promise<Order> {
    const { items, ...orderData } = data;

    return await this.db.transaction(async (tx) => {
      const { id: orderId, ...rest } = orderData;
      const [insertedOrder] = await tx.insert(orders).values({
        id: orderId,
        ...rest,
        updatedAt: new Date(),
      }).returning();

      if (items && items.length > 0) {
        await tx.insert(orderItems).values(
          items.map(item => {
            const { id, ...itemData } = item;
            return {
              id: id || randomUUID(),
              orderId: insertedOrder.id,
              ...itemData
            };
          })
        );
      }

      // Log initial status
      await tx.insert(orderStatusHistory).values({
        id: randomUUID(),
        orderId: insertedOrder.id,
        status: insertedOrder.status as OrderStatus,
        notes: "Order created via partner system",
        createdAt: new Date(),
      });

      return this.mapToOrder(insertedOrder);
    });
  }

  async updateStatus(
    id: string,
    organizationId: string,
    status: OrderStatus,
    notes?: string,
    changedBy?: string
  ): Promise<Order | null> {
    return await this.db.transaction(async (tx) => {
      const currentOrder = await tx.query.orders.findFirst({
        where: this.tenantFilter(orders.organizationId, organizationId, eq(orders.id, id)),
      });

      if (!currentOrder) return null;

      const [updated] = await tx
        .update(orders)
        .set({
          status,
          updatedAt: new Date(),
          completedAt: status === 'completed' ? new Date() : currentOrder.completedAt
        })
        .where(eq(orders.id, id))
        .returning();

      // Log status change
      await tx.insert(orderStatusHistory).values({
        id: randomUUID(),
        orderId: id,
        status,
        previousStatus: currentOrder.status as OrderStatus,
        notes: notes || `Status updated to ${status}`,
        changedBy: changedBy || 'system',
        createdAt: new Date(),
      });

      return this.mapToOrder(updated);
    });
  }

  async delete(id: string, organizationId: string): Promise<boolean> {
    const result = await this.db
      .delete(orders)
      .where(this.tenantFilter(orders.organizationId, organizationId, eq(orders.id, id)));

    return (result.rowCount ?? 0) > 0;
  }

  async count(organizationId: string, status?: OrderStatus): Promise<number> {
    const filter = status
      ? this.tenantFilter(orders.organizationId, organizationId, eq(orders.status, status))
      : this.tenantFilter(orders.organizationId, organizationId);

    const result = await this.db
      .select({ count: count() })
      .from(orders)
      .where(filter);

    return result[0]?.count || 0;
  }

  async getTotalRevenue(organizationId: string): Promise<string> {
    const result = await this.db
      .select({ total: sum(orders.totalAmount) })
      .from(orders)
      .where(this.tenantFilter(orders.organizationId, organizationId, eq(orders.status, 'completed')));

    return result[0]?.total || "0";
  }

  async search(organizationId: string, query: string, limit: number = 5): Promise<Order[]> {
    const ordersList = await this.db.query.orders.findMany({
      where: this.tenantFilter(
        orders.organizationId,
        organizationId,
        or(ilike(orders.customerName, `%${query}%`), ilike(orders.id, `%${query}%`))
      ),
      limit,
    });

    return ordersList.map((o) => this.mapToOrder(o));
  }

  async findAllGlobal(): Promise<Order[]> {
    const ordersList = await this.db.query.orders.findMany();
    return ordersList.map((o) => this.mapToOrder(o));
  }
}

// Export singleton instance
export const orderRepository = new OrderRepository();

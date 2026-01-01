/**
 * Order Repository Interface
 */
export type OrderStatus =
  | 'received'
  | 'confirmed'
  | 'rejected'
  | 'preparing'
  | 'ready'
  | 'picked_up'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'delayed'
  | 'failed'
  | 'return_requested'
  | 'refunded';

export interface Order {
  id: string;
  mainOrderId: string;
  organizationId: string;
  customerId: string;
  customerName: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  address?: string | null;
  totalAmount: string;
  currency: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  estimatedReadyTime?: Date | null;
  completedAt?: Date | null;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: OrderStatus;
  previousStatus?: OrderStatus | null;
  changedBy?: string | null;
  notes?: string | null;
  metadata?: string | null;
  createdAt: Date;
}

export interface WebhookLog {
  id: string;
  eventType: string;
  orderId: string;
  payload: string;
  sentAt: Date;
  responseStatus?: number | null;
  responseBody?: string | null;
  retryCount: number;
  success: boolean;
}

export interface OrderWithItems extends Order {
  itemCount: number;
  items?: OrderItem[];
  history?: OrderStatusHistory[];
  webhooks?: WebhookLog[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string | null;
  productName?: string | null;
  quantity: number;
  price: string;
  status?: string | null;
}

export interface CreateOrderData extends Omit<Order, 'createdAt' | 'updatedAt'> {
  items: Omit<OrderItem, 'orderId'>[];
}

export interface IOrderRepository {
  findByOrganizationId(organizationId: string): Promise<OrderWithItems[]>;
  findCompletedWithItems(organizationId: string): Promise<OrderWithItems[]>;
  findById(id: string, organizationId: string): Promise<OrderWithItems | null>;
  create(data: CreateOrderData): Promise<Order>;
  updateStatus(id: string, organizationId: string, status: OrderStatus, notes?: string, changedBy?: string): Promise<Order | null>;
  delete(id: string, organizationId: string): Promise<boolean>;
  count(organizationId: string, status?: OrderStatus): Promise<number>;
  getTotalRevenue(organizationId: string): Promise<string>;
  search(organizationId: string, query: string, limit?: number): Promise<Order[]>;
  findAllGlobal(): Promise<Order[]>;
  findByMainOrderId(mainOrderId: string): Promise<Order[]>;
  findByCustomerId(customerId: string): Promise<Order[]>;
}

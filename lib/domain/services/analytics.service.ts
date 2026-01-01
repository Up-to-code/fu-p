import { IOrderRepository } from "@/lib/infrastructure/repositories/interfaces/order.repository.interface";
import { IProductRepository } from "@/lib/infrastructure/repositories/interfaces/product.repository.interface";
import { IAnalyticsService, AnalyticsData } from "./interfaces/analytics.service.interface";

/**
 * Analytics Service Implementation
 * 
 * Contains business logic for analytics and reporting.
 * Uses constructor injection for dependencies.
 */
export class AnalyticsService implements IAnalyticsService {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly productRepository: IProductRepository
  ) { }

  /**
   * Get analytics data for a specific organization
   */
  async getAnalytics(orgId: string): Promise<AnalyticsData> {
    // 1. Get all orders for this organization
    const allOrders = await this.orderRepository.findByOrganizationId(orgId);
    const completedOrders = allOrders.filter((o) => o.status === 'completed');
    const returnedOrders = allOrders.filter((o) => o.status === 'refunded');

    // Calculate total revenue and returns count
    const totalRevenue = completedOrders.reduce((acc, order) => acc + Number(order.totalAmount), 0);
    const returnsCount = returnedOrders.length;

    // 2. Get completed orders with items for best sellers calculation
    const completedOrdersWithItems = await this.orderRepository.findCompletedWithItems(orgId);

    // Business Logic: Best selling products calculation
    const productSales: { [key: string]: number } = {};
    const productRevenue: { [key: string]: number } = {};

    completedOrdersWithItems.forEach((o) => {
      o.items?.forEach((item) => {
        if (item.productId) {
          productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity;
          productRevenue[item.productId] =
            (productRevenue[item.productId] || 0) + Number(item.price) * item.quantity;
        }
      });
    });

    const topProductIds = Object.keys(productSales)
      .sort((a, b) => productSales[b] - productSales[a])
      .slice(0, 5);

    let topProductsRaw: any[] = [];
    if (topProductIds.length > 0) {
      topProductsRaw = await this.productRepository.findByIds(topProductIds);
    }

    const bestSellers = topProductIds
      .map((id) => {
        const p = topProductsRaw.find((p) => p.id === id);
        return {
          name: p?.name || 'Unknown Product',
          sales: productSales[id],
          revenue: productRevenue[id] || 0,
        };
      })
      .filter((p) => p.sales > 0);

    // 3. Real monthly sales data (last 6 months)
    const now = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const salesData: { name: string; total: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = monthNames[date.getMonth()];

      // Filter orders for this month
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

      const monthTotal = completedOrders
        .filter((o) => {
          const orderDate = new Date(o.createdAt);
          return orderDate >= monthStart && orderDate <= monthEnd;
        })
        .reduce((acc, o) => acc + Number(o.totalAmount), 0);

      salesData.push({ name: monthName, total: monthTotal });
    }

    const cumulativeRevenue = salesData.reduce((acc, curr) => acc + curr.total, 0);
    const averageMonthlyRevenueValue = salesData.length ? cumulativeRevenue / salesData.length : 0;

    const enrichedSalesData = salesData.map(d => ({
      ...d,
      isAboveAverage: d.total >= averageMonthlyRevenueValue
    }));

    return {
      totalRevenue,
      returnsCount,
      bestSellers,
      salesData: enrichedSalesData,
      totalOrders: completedOrders.length,
      avgOrderValue: completedOrders.length > 0 ? Math.round(totalRevenue / completedOrders.length) : 0,
      cumulativeRevenue,
      averageMonthlyRevenue: averageMonthlyRevenueValue,
    };
  }
}


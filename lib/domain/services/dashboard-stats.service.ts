import { IOrderRepository } from "@/lib/infrastructure/repositories/interfaces/order.repository.interface";
import { IProductRepository } from "@/lib/infrastructure/repositories/interfaces/product.repository.interface";
import { IDashboardStatsService, DashboardStats } from "./interfaces/dashboard-stats.service.interface";

/**
 * Dashboard Stats Service Implementation
 * 
 * Contains business logic for dashboard statistics.
 */
export class DashboardStatsService implements IDashboardStatsService {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly productRepository: IProductRepository
  ) { }

  /**
   * Get dashboard statistics for a specific organization
   */
  async getDashboardStats(orgId: string): Promise<DashboardStats> {
    // Total sales from completed orders via repository
    const totalRevenue = await this.orderRepository.getTotalRevenue(orgId);

    // Total orders via repository
    const totalOrders = await this.orderRepository.count(orgId);

    // Pending orders (received status)
    const pendingOrders = await this.orderRepository.count(orgId, 'received');

    // Total products via repository
    const totalProducts = await this.productRepository.count(orgId);

    return {
      totalSales: Number(totalRevenue) || 0,
      totalOrders,
      pendingOrders,
      totalProducts,
    };
  }
}

export interface DashboardStats {
    totalSales: number;
    totalOrders: number;
    pendingOrders: number;
    totalProducts: number;
}

export interface IDashboardStatsService {
    getDashboardStats(orgId: string): Promise<DashboardStats>;
}

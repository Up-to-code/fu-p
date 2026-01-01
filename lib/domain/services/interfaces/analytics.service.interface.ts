export interface AnalyticsData {
    totalRevenue: number;
    returnsCount: number;
    bestSellers: {
        name: string;
        sales: number;
        revenue: number;
    }[];
    salesData: {
        name: string;
        total: number;
        isAboveAverage: boolean;
    }[];
    totalOrders: number;
    avgOrderValue: number;
    cumulativeRevenue: number;
    averageMonthlyRevenue: number;
}

export interface IAnalyticsService {
    getAnalytics(orgId: string): Promise<AnalyticsData>;
}

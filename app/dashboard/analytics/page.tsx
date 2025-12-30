import { getAnalyticsAction } from "@/app/actions/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, DollarSign, RotateCw, TrendingUp } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";

export default async function AnalyticsPage() {
  const data = await getAnalyticsAction();

  if (!data || (data.totalRevenue === 0 && data.salesData.length === 0)) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Analytics</h1>
        <EmptyState
          title="No analytics data yet"
          description="Once you start receiving orders, you'll see your revenue trends and best sellers here."
          actionLabel="View Products"
          actionHref="/dashboard/products"
          icon={BarChart3}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Returns</CardTitle>
            <RotateCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.returnsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Stable</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Simple Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end space-x-2 h-64 pt-4">
              {data.salesData.map((item) => (
                <div key={item.name} className="flex-1 flex flex-col items-center gap-2 group">
                  <div
                    className="w-full bg-primary/20 rounded-t hover:bg-primary/40 transition-all relative"
                    style={{ height: `${item.total > 0 ? (item.total / (data.totalRevenue || 1)) * 100 : 5}%` }}
                  >
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      ${item.total}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Best Sellers */}
        <Card>
          <CardHeader>
            <CardTitle>Best Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.bestSellers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No sales yet.</p>
              ) : (
                data.bestSellers.map((product, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="font-medium text-sm">{product.name}</span>
                    <span className="text-sm text-muted-foreground">{product.sales} sold</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

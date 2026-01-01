import { getAnalyticsAction } from "@/app/actions/analytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, DollarSign, ShoppingCart, TrendingUp, AlertCircle, Package } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Separator } from "@/components/ui/separator";
import { CurrencyDisplay } from "@/components/currency-display";

export default async function AnalyticsPage() {
  const result = await getAnalyticsAction();

  if (!result || "error" in result) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Analytics Reports</h1>
        <p className="text-red-500 mb-8">{result && "error" in result ? result.error : "Failed to load analytics."}</p>
      </div>
    );
  }

  const data = result;

  // Derived metrics are now provided by the service
  const averageMonthlyRevenue = data.averageMonthlyRevenue;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Reports</h1>
        <p className="text-muted-foreground">Comprehensive performance overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"><CurrencyDisplay amount={data.totalRevenue} /></div>
            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tx Volume</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Total orders processed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"><CurrencyDisplay amount={data.avgOrderValue} /></div>
            <p className="text-xs text-muted-foreground">Revenue per order</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Returns</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.returnsCount}</div>
            <p className="text-xs text-muted-foreground">Total returned orders</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Monthly revenue performance over the last 6 months.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-end justify-between gap-4 pt-4 px-2">
                {data.salesData.map((item) => (
                  <div key={item.name} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div
                      className="w-full bg-primary/90 rounded-t-md hover:bg-primary transition-all relative min-h-[4px]"
                      style={{ height: `${data.totalRevenue > 0 ? (item.total / (Math.max(...data.salesData.map(d => d.total)) || 1)) * 100 : 0}%` }}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-sm font-bold px-3 py-1.5 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 border pointer-events-none whitespace-nowrap">
                        <CurrencyDisplay amount={item.total} className="text-popover-foreground" />
                      </div>
                    </div>
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Monthly Report</CardTitle>
              <CardDescription>Breakdown of revenue by month.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...data.salesData].reverse().map((item) => (
                    <TableRow key={item.name}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right"><CurrencyDisplay amount={item.total} /></TableCell>
                      <TableCell className="text-right text-muted-foreground text-xs">
                        {item.isAboveAverage ? (
                          <span className="text-green-600 font-medium">Above Avg</span>
                        ) : (
                          <span className="text-yellow-600">Below Avg</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Top Performance</CardTitle>
              <CardDescription>Best selling products by revenue.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Product</TableHead>
                    <TableHead className="text-right text-xs">Sales</TableHead>
                    <TableHead className="text-right text-xs">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {((data as any).bestSellers || []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                        No sales yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    ((data as any).bestSellers as any[]).map((product, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="font-medium truncate max-w-[150px]" title={product.name}>
                            {product.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{product.sales}</TableCell>
                        <TableCell className="text-right font-medium">
                          <CurrencyDisplay amount={(product as any).revenue || 0} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

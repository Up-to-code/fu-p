import { getDashboardStatsAction } from "@/app/actions/get-dashboard-stats";
import { getAnalyticsAction } from "@/app/actions/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, ShoppingCart, DollarSign, Activity, Plus, Users, BarChart3 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Protect } from "@/components/dashboard/protect";
import { CurrencyDisplay } from "@/components/currency-display";

export default async function DashboardPage() {
  const stats = await getDashboardStatsAction();
  const analytics = await getAnalyticsAction();

  if (!stats || "error" in stats) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Welcome to Your Dashboard</h2>
        <p className="text-muted-foreground">{stats && "error" in stats ? (stats.error as string) : "Stats will appear here once you have activity."}</p>
      </div>
    );
  }

  const data = stats as any; // Cast to bypass complex union narrowing in template
  const report = (analytics && !("error" in analytics)) ? (analytics as any) : null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <div className="flex items-center gap-2">
          <Protect permission="products.create">
            <Link href="/dashboard/products">
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </Protect>
          <Protect permission="users.invite">
            <Link href="/dashboard/employees">
              <Button size="sm" variant="outline" className="gap-2">
                <Users className="h-4 w-4" />
                Invite Team
              </Button>
            </Link>
          </Protect>
          <Link href="/dashboard/analytics">
            <Button size="sm" variant="ghost" className="gap-2 text-muted-foreground hover:text-primary">
              <BarChart3 className="h-4 w-4" />
              Full Analytics
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"><CurrencyDisplay amount={data.totalSales} /></div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalOrders}</div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Orders requiring attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Products listed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] w-full flex items-end justify-between gap-2 px-2 pb-2">
              {report?.salesData?.map((data: any) => (
                <div key={data.name} className="flex flex-col items-center gap-2 group flex-1 h-full justify-end">
                  <div
                    className="w-full bg-primary/20 rounded-t hover:bg-primary/40 transition-all relative min-h-[4px]"
                    style={{ height: `${(report && report.totalRevenue > 0) ? (data.total / report.totalRevenue) * 100 : 0}%` }}
                  >
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
                      <CurrencyDisplay amount={data.total} className="text-popover-foreground" />
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{data.name}</span>
                </div>
              )) || (
                  <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                    No data available
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {report?.bestSellers?.slice(0, 3).map((product: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                      {i + 1}
                    </div>
                    <span className="font-medium text-sm">{product.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{product.sales} sold</span>
                </div>
              )) || <p className="text-center text-sm text-muted-foreground py-8">No recent activity</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

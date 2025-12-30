"use server";

import { auth } from "@/lib/auth/config";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Organization from "@/models/Organization";
import connectDB from "@/lib/db/mongoose";
import { headers } from "next/headers";

async function getOrgId() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;
  await connectDB();
  const org = await Organization.findOne({ ownerId: session.user.id });
  return org?._id;
}

export async function getAnalyticsAction() {
  const orgId = await getOrgId();
  if (!orgId) return null;

  // Mock data aggregation or simple real implementation
  // Sales over time (Last 7 days mock or aggregation)
  // For MVP real aggregation might return empty if no data.
  // I'll implement count aggregation.

  const completedOrders = await Order.find({ organizationId: orgId, status: 'completed' });
  const returnedOrders = await Order.find({ organizationId: orgId, status: 'returned' });
  
  const totalRevenue = completedOrders.reduce((acc, order) => acc + order.totalAmount, 0);
  const returnsCount = returnedOrders.length;
  
  // Best selling products calculation
  const productSales: {[key: string]: number} = {};
  completedOrders.forEach(o => {
      o.items.forEach((item: any) => {
          const pid = item.productId.toString();
          productSales[pid] = (productSales[pid] || 0) + item.quantity;
      });
  });

  // Fetch product names for best sellers
  const topProductIds = Object.keys(productSales).sort((a,b) => productSales[b] - productSales[a]).slice(0, 5);
  const topProductsRaw = await Product.find({ _id: { $in: topProductIds } });
  
  const bestSellers = topProductIds.map(id => {
      const p = topProductsRaw.find(p => p._id.toString() === id);
      return {
          name: p?.name || "Unknown Product",
          sales: productSales[id]
      };
  }).filter(p => p.sales > 0);

  return {
    totalRevenue,
    returnsCount,
    bestSellers,
    // Mock monthly data for chart if empty
    salesData: [
        { name: "Jan", total: 0 },
        { name: "Feb", total: 0 },
        { name: "Mar", total: 0 },
        { name: "Apr", total: 0 },
        { name: "May", total: totalRevenue }, // Put all revenue in May for MVP demo
    ]
  };
}

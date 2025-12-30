"use server";

import { auth } from "@/lib/auth/config";
import Organization from "@/models/Organization";
import Order from "@/models/Order";
import Product from "@/models/Product";
import connectDB from "@/lib/db/mongoose";
import { headers } from "next/headers";

export async function getDashboardStatsAction() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) return null;

    await connectDB();
    const org = await Organization.findOne({ ownerId: session.user.id });
    if (!org) return null;

    const orgId = org._id;

    const totalSales = await Order.aggregate([
      { $match: { organizationId: orgId, status: "completed" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    const totalOrders = await Order.countDocuments({ organizationId: orgId });
    const pendingOrders = await Order.countDocuments({ organizationId: orgId, status: "pending" });
    const totalProducts = await Product.countDocuments({ organizationId: orgId });
    
    return {
      totalSales: totalSales[0]?.total || 0,
      totalOrders,
      pendingOrders,
      totalProducts
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}

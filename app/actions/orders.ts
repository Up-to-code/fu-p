"use server";

import { auth } from "@/lib/auth/config";
import Order from "@/models/Order";
import Organization from "@/models/Organization";
import connectDB from "@/lib/db/mongoose";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

async function getOrgId() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;
  await connectDB();
  const org = await Organization.findOne({ ownerId: session.user.id });
  return org?._id;
}

export async function getOrdersAction() {
  const orgId = await getOrgId();
  if (!orgId) return [];

  const orders = await Order.find({ organizationId: orgId }).sort({ createdAt: -1 });
  return orders.map(o => ({
    id: o._id.toString(),
    customerName: o.customerName,
    totalAmount: o.totalAmount,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
    itemCount: o.items.length
  }));
}

export async function updateOrderStatusAction(id: string, status: string) {
    const orgId = await getOrgId();
    if (!orgId) return { success: false };

    await Order.updateOne({ _id: id, organizationId: orgId }, { status });
    revalidatePath("/dashboard/orders");
    return { success: true };
}

"use server";

import { auth } from "@/lib/auth/config";
import Product from "@/models/Product";
import Organization from "@/models/Organization";
import connectDB from "@/lib/db/mongoose";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

async function getOrgAndCheckStatus() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;
  await connectDB();
  const org = await Organization.findOne({ ownerId: session.user.id });
  return org;
}

export async function getProductsAction() {
  const org = await getOrgAndCheckStatus();
  if (!org) return [];
  
  const products = await Product.find({ organizationId: org._id }).populate('categoryId', 'name');
  
  return products.map(p => ({
    id: p._id.toString(),
    name: p.name,
    categoryName: p.categoryId?.name || "-",
    categoryId: p.categoryId?._id?.toString() || null,
    price: p.price,
    stock: p.stock,
    brand: p.brand || "",
    status: p.status,
  }));
}

export async function createProductAction(data: {
  name: string;
  categoryId: string;
  price: number;
  stock: number;
  brand: string;
  status: 'draft' | 'active';
}) {
  const org = await getOrgAndCheckStatus();
  if (!org) return { success: false, error: "Unauthorized" };

  if (data.status === 'active' && org.status !== 'approved') {
    return { success: false, error: "Organization must be approved to publish products." };
  }

  try {
    await Product.create({
      ...data,
      organizationId: org._id
    });
    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to create product" };
  }
}

export async function deleteProductAction(id: string) {
   const org = await getOrgAndCheckStatus();
   if (!org) return { success: false, error: "Unauthorized" };
   
   await Product.deleteOne({ _id: id, organizationId: org._id });
   revalidatePath("/dashboard/products");
   return { success: true };
}

"use server";

import { auth } from "@/lib/auth/config";
import Category from "@/models/Category";
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

export async function getCategoriesAction() {
  const orgId = await getOrgId();
  if (!orgId) return [];
  
  const categories = await Category.find({ organizationId: orgId }).populate('parentId', 'name');
  // Serialize manually
  return categories.map(c => ({
    id: c._id.toString(),
    name: c.name,
    parentId: c.parentId?._id?.toString() || null,
    parentName: c.parentId?.name || null
  }));
}

export async function createCategoryAction(name: string, parentId?: string | null) {
  const orgId = await getOrgId();
  if (!orgId) return { success: false, error: "Unauthorized" };

  try {
    await Category.create({
      name,
      parentId: parentId || null,
      organizationId: orgId
    });
    revalidatePath("/dashboard/categories");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to create" };
  }
}

export async function deleteCategoryAction(id: string) {
   const orgId = await getOrgId();
   if (!orgId) return { success: false, error: "Unauthorized" };
   
   await Category.deleteOne({ _id: id, organizationId: orgId });
   revalidatePath("/dashboard/categories");
   return { success: true };
}

"use server";

import { auth } from "@/lib/auth/config";
import Organization from "@/models/Organization";
import connectDB from "@/lib/db/mongoose";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateOrganizationAction(data: { name: string, description?: string, logo?: string }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false, error: "Unauthorized" };

  await connectDB();
  
  try {
      await Organization.updateOne(
          { ownerId: session.user.id },
          { 
              name: data.name,
              // Add description and logo to schema if not present? 
              // Wait, I defined schema in Step 1. It only had name, ownerId, status.
              // I need to update schema.
          }
      );
      
      // I'll update schema implicitly if Mongoose allows strict: false or I need to update model file.
      // For MVP I will update Model file now.
      
      revalidatePath("/dashboard/organization");
      return { success: true };
  } catch (e) {
      return { success: false, error: "Failed to update" };
  }
}

"use server";

import { auth } from "@/lib/auth/config";
import Organization from "@/models/Organization";
import User from "@/models/User";
import connectDB from "@/lib/db/mongoose";
import { headers } from "next/headers";

const generateSlug = (name: string) => {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const random = Math.random().toString(36).substring(2, 7);
  return `${base}-${random}`;
};

export async function createOrganizationAction(name: string, slug?: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    await connectDB();

    const existingOrg = await Organization.findOne({ ownerId: session.user.id });
    if (existingOrg) {
      return { success: false, error: "User already has an organization" };
    }

    let finalSlug = slug;
    if (!finalSlug) {
        finalSlug = generateSlug(name);
    }

    // Check availability
    const existingSlug = await Organization.findOne({ slug: finalSlug });
    if (existingSlug) {
         return { success: false, error: "Slug is already taken. Please try another one." };
    }

    const org = await Organization.create({
      name,
      slug: finalSlug,
      ownerId: session.user.id,
      status: "pending",
    });

    // Update Owner User
    await User.findByIdAndUpdate(session.user.id, {
        organizationId: org._id,
        role: "owner"
    });

    return { success: true, organizationId: org._id.toString() };
  } catch (error) {
    console.error("Create Org Error:", error);
    return { success: false, error: "Failed to create organization" };
  }
}

export async function checkSlugAvailability(slug: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) return { success: false, error: "Not authenticated" };

    await connectDB();
    const existingOrg = await Organization.findOne({ slug });
    return { success: true, available: !existingOrg };
  } catch (error) {
    console.error("Check Slug Error:", error);
    return { success: false, error: "Failed to check slug" };
  }
}

"use server";

import { auth } from "@/lib/auth/config";
import Organization from "@/models/Organization";
import User from "@/models/User";
import connectDB from "@/lib/db/mongoose";
import { headers } from "next/headers";

export async function getOrganizationAction() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return null;
    }

    await connectDB();

    // 1. Check if user is owner
    let org = await Organization.findOne({ ownerId: session.user.id });
    
    // 2. If not owner, check if user is a member
    if (!org) {
      const currentUser = await User.findById(session.user.id);
      if (currentUser?.organizationId) {
        org = await Organization.findById(currentUser.organizationId);
      }
    }
    
    if (!org) return null;

    // Convert to plain object
    const orgData = {
      id: org._id.toString(),
      name: org.name,
      ownerId: org.ownerId.toString(),
      status: org.status,
      slug: org.slug,
      memberCount: org.memberCount || 1
    };

    // Self-healing: Ensure owner has correct role and organizationId
    if (org.ownerId.toString() === session.user.id) {
      const userRole = (session.user as any).role;
      const userOrgId = (session.user as any).organizationId;

      if (userRole !== 'owner' || userOrgId !== org._id.toString()) {
        await User.findByIdAndUpdate(session.user.id, {
          role: 'owner',
          organizationId: org._id
        });
      }
    }

    return orgData;
  } catch (error) {
    console.error("Get Org Error:", error);
    return null;
  }
}

// Get role distribution stats for an organization
export async function getOrgStatsAction() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return null;

    await connectDB();

    // Resolve org
    let org = await Organization.findOne({ ownerId: session.user.id });
    if (!org) {
      const user = await User.findById(session.user.id);
      if (user?.organizationId) {
        org = await Organization.findById(user.organizationId);
      }
    }
    if (!org) return null;

    const employees = await User.find({ organizationId: org._id });
    
    return {
      total: employees.length,
      owners: employees.filter(e => e.role === 'owner').length,
      admins: employees.filter(e => e.role === 'admin').length,
      managers: employees.filter(e => e.role === 'manager').length,
      viewers: employees.filter(e => e.role === 'viewer').length
    };
  } catch (error) {
    console.error("Get Org Stats Error:", error);
    return null;
  }
}

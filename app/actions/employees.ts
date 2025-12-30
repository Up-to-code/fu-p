"use server";
import { auth } from "@/lib/auth/config";
import Organization from "@/models/Organization";
import User from "@/models/User";
import connectDB from "@/lib/db/mongoose";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { hasPermission } from "@/lib/permissions";

export async function addEmployeeAction(data: { name: string, email: string, role: string, password: string }) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return { success: false, error: "Unauthorized" };

    if (!hasPermission((session.user as any).role, 'users.create')) {
        return { success: false, error: "Insufficient permissions" };
    }

    await connectDB();
    
    // Resolve Org ID
    // 1. Check if user is owner
    let org = await Organization.findOne({ ownerId: session.user.id });
    let orgId = org?._id;
    
    // 2. If not owner, check if user has orgId (is an employee)
    if (!orgId) {
         const currentUser = await User.findById(session.user.id);
         orgId = currentUser?.organizationId;
    }

    if (!orgId) return { success: false, error: "No organization found" };

    try {
        // Create user using better-auth
        const newUser = await auth.api.signUpEmail({
            body: {
                email: data.email,
                password: data.password,
                name: data.name,
            }
        });
        
        if (!newUser?.user) return { success: false, error: "Failed to create user" };

        // Update user with orgId and role
        await User.findByIdAndUpdate(newUser.user.id, {
            organizationId: orgId,
            role: data.role
        });

        // Increment member count
        await Organization.findByIdAndUpdate(orgId, {
            $inc: { memberCount: 1 }
        });

        revalidatePath("/dashboard/employees");
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message || "Failed" };
    }
}

export async function getEmployeesAction() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return [];
    
    await connectDB();
    
    // Resolve Org ID
    let org = await Organization.findOne({ ownerId: session.user.id });
    let orgId = org?._id;
    
    if (!orgId) {
         const currentUser = await User.findById(session.user.id);
         orgId = currentUser?.organizationId;
    }
    
    if (!orgId) return [];

    const employees = await User.find({ organizationId: orgId });
    return employees.map(u => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        role: u.role || 'viewer',
        image: u.image
    }));
}

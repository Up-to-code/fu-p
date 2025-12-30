"use server";

import { auth } from "@/lib/auth/config";
import User from "@/models/User";
import connectDB from "@/lib/db/mongoose";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function joinOrganizationAction(organizationId: string) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return; // Should be handled by page, but safety check

    await connectDB();
    
    // Update user
    await User.findByIdAndUpdate(session.user.id, {
        organizationId: organizationId,
        role: "member" // Default role
    });

    revalidatePath("/dashboard");
    redirect("/dashboard");
}

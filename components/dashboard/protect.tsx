"use client";

import { useAuth } from "@/hooks/use-auth";
import { hasPermission, Permission } from "@/lib/permissions";
import { ReactNode } from "react";

interface ProtectProps {
    children: ReactNode;
    permission: Permission;
    fallback?: ReactNode;
}

export function Protect({ children, permission, fallback = null }: ProtectProps) {
    const { user, isLoading } = useAuth();

    if (isLoading) return null; // Or a skeleton

    if (!user || !hasPermission((user as any).role, permission)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}

"use client";

import { useOrgStore } from "@/store/org-store";
import { AlertCircle, Clock, XCircle } from "lucide-react";
import Link from "next/link";

export function ApprovalStatusBanner() {
    const { organization, isLoading } = useOrgStore();

    if (isLoading || !organization) return null;

    const { status } = organization;

    if (status === "approved") return null;

    const config = {
        pending: {
            color: "bg-yellow-50 text-yellow-800 border-yellow-200",
            icon: Clock,
            title: "Approval Pending",
            message: "Your organization is currently under review. Some features may be limited.",
        },
        action_required: {
            color: "bg-orange-50 text-orange-800 border-orange-200",
            icon: AlertCircle,
            title: "Action Required",
            message: "We need more information to approve your account.",
            action: { label: "Update Profile", href: "/dashboard/organization" },
        },
        rejected: {
            color: "bg-red-50 text-red-800 border-red-200",
            icon: XCircle,
            title: "Account Rejected",
            message: "Your organization application was rejected. Please contact support.",
        },
    };

    const current = config[status as keyof typeof config] as any;
    if (!current) return null;

    const Icon = current.icon;

    return (
        <div className={`p-4 border-b ${current.color} flex items-center justify-between`}>
            <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <div>
                    <p className="font-semibold">{current.title}</p>
                    <p className="text-sm opacity-90">{current.message}</p>
                </div>
            </div>
            {current.action && (
                <Link
                    href={current.action.href}
                    className="px-4 py-2 bg-white/50 hover:bg-white/80 rounded text-sm font-medium transition-colors"
                >
                    {current.action.label}
                </Link>
            )}
        </div>
    );
}

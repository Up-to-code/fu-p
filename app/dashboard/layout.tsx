"use client";

import { AuthWrapper } from "@/components/auth/auth-wrapper";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { useAuth } from "@/hooks/use-auth";
import { OrgInitializer } from "@/components/dashboard/org-initializer";
import { ApprovalStatusBanner } from "@/components/approval-banner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useAuth();

  return (
    <AuthWrapper>
      <OrgInitializer />
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <ApprovalStatusBanner />
          {isLoading ? (
            <DashboardSkeleton />
          ) : (
            <main className="flex-1 overflow-y-auto">{children}</main>
          )}
        </div>
      </div>
    </AuthWrapper>
  );
}


import { getEmployeesAction } from "@/app/actions/employees";
import { Button } from "@/components/ui/button";
import { getOrganizationAction } from "@/app/actions/get-organization";
import { Users } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { EmployeeList } from "@/components/dashboard/employee-list";
import { InviteButton } from "@/components/dashboard/invite-button";
import { Protect } from "@/components/dashboard/protect";

export default async function EmployeesPage() {
    const employees = await getEmployeesAction();
    const org = await getOrganizationAction();

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Team</h1>
                    <p className="text-muted-foreground mt-1">Manage your organization members</p>
                </div>
            </div>
            <EmployeeList
                initialEmployees={employees || []}
                orgSlug={org?.slug}
                orgName={org?.name}
            />
        </div>
    );
}

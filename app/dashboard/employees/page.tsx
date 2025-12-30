import { getEmployeesAction } from "@/app/actions/employees";
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
                <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
                {org?.slug && (
                    <Protect permission="users.invite">
                        <InviteButton slug={org.slug} orgName={org.name} />
                    </Protect>
                )}
            </div>
            <EmployeeList
                initialEmployees={employees || []}
                orgSlug={org?.slug}
                orgName={org?.name}
            />
        </div>
    );
}

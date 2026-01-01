import { OrgProfile } from "@/components/dashboard/org-profile";
import { CreateOrgButton } from "@/components/dashboard/create-org-button";
import { Building2 } from "lucide-react";
import { registry } from "@/lib/registry";

async function getFullOrg() {
    const org = await registry.organization.getCurrentOrganization();
    if (!org) return null;

    return {
        name: org.name,
        description: org.description,
        logo: org.logo,
        status: org.status
    };
}

export default async function OrgPage() {
    const org = await getFullOrg();

    if (!org) {
        return (
            <div className="p-6 space-y-6">
                <h1 className="text-3xl font-bold tracking-tight">My Organization</h1>
                <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-2xl bg-slate-50/50 min-h-[400px]">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Building2 className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Organization Found</h3>
                    <p className="text-slate-500 max-w-sm mb-6 leading-relaxed">
                        You don't have an organization yet. Create one to start selling.
                    </p>
                    <CreateOrgButton />
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">My Organization</h1>
            <OrgProfile initialData={org} />
        </div>
    );
}

"use client";

import { useOrgStore } from "@/store/org-store";
import { updateOrganizationAction } from "@/app/actions/update-organization";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePermissions } from "@/hooks/use-permissions";

export function OrgProfile({ initialData }: { initialData: any }) {
    const { isOwner } = usePermissions();
    const [name, setName] = useState(initialData?.name || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [logo, setLogo] = useState(initialData?.logo || "");
    const [isLoading, setIsLoading] = useState(false);

    // Also update store locally if needed, but page refresh handles it usually
    const { setOrganization, organization } = useOrgStore();
    const status = initialData?.status || organization?.status || "pending";

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const res = await updateOrganizationAction({ name, description, logo });
        if (res.success) {
            alert("Updated successfully");
            if (organization) {
                setOrganization({ ...organization, name }); // basic update
            }
        } else {
            alert("Failed");
        }
        setIsLoading(false);
    };

    return (
        <Card className="max-w-2xl">
            <CardHeader>
                <CardTitle>Organization Profile</CardTitle>
                <CardDescription>Manage your company details.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Approval Status</Label>
                        <div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${status === 'approved' ? 'bg-green-100 text-green-700' :
                                status === 'rejected' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                {status.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Company Name</Label>
                        <Input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            disabled={!isOwner}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Tell us about your company..."
                            disabled={!isOwner}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Logo URL</Label>
                        <Input
                            value={logo}
                            onChange={e => setLogo(e.target.value)}
                            placeholder="https://example.com/logo.png"
                            disabled={!isOwner}
                        />
                    </div>

                    {isOwner && (
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}

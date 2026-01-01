"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Copy, Check, Mail } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useOrgStore } from "@/store/org-store";
// Note: We need the org slug. We can get it from the store (client) or pass it via props if this was server component 
// but this is a complex UI, so client component is easier.
// However, the page needs to be wrapped or fetch org. 
// Simpler: Fetch org in server page wrapper, pass to client component.
// But for now, let's use useOrgStore or assume we can fetch it? 
// Actually, let's make the page async server component and pass org to client form.

// PAGE FILE
// e:\Fu\start-kit-master\app\dashboard\employees\invite\page.tsx

export default function CustomInvitePageWrapper() {
    // Just rendering the client component below? 
    // Wait, I can put the client component in a separate file or inline it? 
    // Next.js App Router: Page can be server.

    return (
        <CustomInviteForm />
    );
}

// Separate component to handle client logic
import { getOrganizationAction } from "@/app/actions/get-organization";
import { useEffect } from "react";

function CustomInviteForm() {
    const [role, setRole] = useState("viewer");
    const [copied, setCopied] = useState(false);
    const [org, setOrg] = useState<{ slug: string, name: string } | null>(null);

    useEffect(() => {
        getOrganizationAction().then(setOrg);
    }, []);

    const inviteLink = typeof window !== "undefined" && org?.slug
        ? `${window.location.origin}/join/${org.slug}?role=${role}`
        : "";

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        toast.success("Custom invite link copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleEmail = () => {
        if (!org) return;
        const subject = `Join ${org.name} as ${role}`;
        const body = `Hi,\n\nI'd like to invite you to join ${org.name} with the role of ${role.toUpperCase()}. Click the link below to get started:\n\n${inviteLink}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    if (!org) return <div className="p-6">Loading organization details...</div>;

    return (
        <div className="p-6 space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/employees">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Create Invite Link</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Customize Invitation</CardTitle>
                    <CardDescription>
                        Generate a specialized link that pre-selects a role for the new member.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Select Role</Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="viewer">Viewer (Read Only)</SelectItem>
                                <SelectItem value="manager">Manager (Can Edit)</SelectItem>
                                <SelectItem value="admin">Admin (Full Access)</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            This role will be suggested when the user joins.
                            {role !== 'viewer' && <span className="text-amber-600 block mt-1">Note: Be careful sharing links with high privileges.</span>}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label>Generated Link</Label>
                        <div className="flex items-center gap-2">
                            <Input value={inviteLink} readOnly className="bg-muted" />
                            <Button size="icon" onClick={handleCopy} disabled={!org}>
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>

                    <Button className="w-full gap-2" onClick={handleEmail} disabled={!org}>
                        <Mail className="w-4 h-4" />
                        Send via Email
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

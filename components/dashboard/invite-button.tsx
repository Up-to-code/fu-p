"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, Mail, UserPlus } from "lucide-react";
import { toast } from "sonner";

export function InviteButton({ slug, orgName }: { slug: string, orgName: string }) {
    const [copied, setCopied] = useState(false);

    const inviteLink = typeof window !== "undefined" ? `${window.location.origin}/join/${slug}` : "";

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        toast.success("Invite link copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleEmail = () => {
        const subject = `Join ${orgName} on generic-app-name`;
        const body = `Hi,\n\nI'd like to invite you to join ${orgName}. Click the link below to get started:\n\n${inviteLink}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Invite Member
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Invite to {orgName}</DialogTitle>
                    <DialogDescription>
                        Share this link to invite team members to your organization.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                        <Input
                            id="link"
                            defaultValue={inviteLink}
                            readOnly
                        />
                    </div>
                    <Button type="submit" size="sm" className="px-3" onClick={handleCopy}>
                        <span className="sr-only">Copy</span>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>
                <div className="flex justify-center border-t pt-4 mt-2">
                    <Button variant="outline" className="w-full gap-2" onClick={handleEmail}>
                        <Mail className="h-4 w-4" />
                        Send via Email
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

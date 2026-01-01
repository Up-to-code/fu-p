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
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>
                        Anyone with the link can join <strong>{orgName}</strong>.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 mt-2">
                    <div className="space-y-2">
                        <Label>Invite Link</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="link"
                                value={inviteLink}
                                readOnly
                                className="bg-muted/50"
                            />
                            <Button type="button" size="icon" onClick={handleCopy} className="shrink-0">
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or</span>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full gap-2" onClick={handleEmail}>
                        <Mail className="h-4 w-4" />
                        Send Invite via Email
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

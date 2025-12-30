"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { createOrganizationAction, checkSlugAvailability } from "@/app/actions/organization";
import { useRouter } from "next/navigation";
import { Loader2, Check, X } from "lucide-react";
import { useSlugAvailability } from "@/hooks/use-slug-availability";

export function CreateOrgButton({ triggerLabel = "Create Organization" }: { triggerLabel?: string }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    // Only validate if user explicitly types a slug
    const { isAvailable, isValidating } = useSlugAvailability(slug);

    const handleCreate = async () => {
        if (!name.trim()) return;

        setLoading(true);
        setError("");
        try {
            const result = await createOrganizationAction(name, slug.trim() || undefined);
            if (result.success) {
                setOpen(false);
                router.refresh();
            } else {
                setError(result.error || "Failed using that name/slug.");
            }
        } catch (error) {
            console.error(error);
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>{triggerLabel}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Organization</DialogTitle>
                    <DialogDescription>
                        Enter a name and optional unique ID for your organization.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                            disabled={loading}
                            placeholder="Acme Corp"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4 relative">
                        <Label htmlFor="slug" className="text-right">
                            Slug (ID)
                        </Label>
                        <Input
                            id="slug"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="col-span-3 pr-8"
                            disabled={loading}
                            placeholder="acme-corp (optional)"
                        />
                        <div className="flex items-center absolute right-3 top-1/2 -translate-y-1/2">
                            {slug && isValidating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                            {slug && !isValidating && isAvailable === true && <Check className="h-4 w-4 text-green-500" />}
                            {slug && !isValidating && isAvailable === false && <X className="h-4 w-4 text-red-500" />}
                        </div>
                    </div>
                    {slug && !isValidating && isAvailable === false && (
                        <p className="text-xs text-red-500 text-right col-span-4 -mt-2">Slug is already taken</p>
                    )}
                    {error && (
                        <div className="text-sm text-red-500 font-medium text-center">
                            {error}
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={handleCreate} disabled={loading || !name.trim()}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Organization
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

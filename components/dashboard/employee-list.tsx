"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addEmployeeAction, updateMemberRoleAction } from "@/app/actions/employees"; // Added updateMemberRoleAction here too just in case though dynamic import is used below
import { usePermissions } from "@/hooks/use-permissions";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InviteButton } from "@/components/dashboard/invite-button";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Protect } from "@/components/dashboard/protect";
import { Users, Plus, User } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Employee {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string | null;
}

export function EmployeeList({
    initialEmployees,
    orgSlug,
    orgName
}: {
    initialEmployees: Employee[],
    orgSlug?: string,
    orgName?: string
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "viewer",
        password: ""
    });

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const res = await addEmployeeAction(formData);

        if (res.success) {
            setIsOpen(false);
            setFormData({
                name: "",
                email: "",
                role: "viewer",
                password: ""
            });
            router.refresh();
            toast.success(`Employee created! Password: ${formData.password}`, {
                duration: 10000,
                action: {
                    label: "Copy",
                    onClick: () => navigator.clipboard.writeText(formData.password)
                }
            });
        } else {
            const errorMsg = (res as any).error || "Failed to create employee";
            toast.error(errorMsg);
        }
        setIsLoading(false);
    };

    return (
        <div className="space-y-4">
            {/* Action Bar */}
            <div className="flex justify-end items-center gap-3">
                {orgSlug && orgName && (
                    <Protect permission="users.invite">
                        <InviteButton slug={orgSlug} orgName={orgName} />
                    </Protect>
                )}
                <Protect permission="users.create">
                    <Button onClick={() => setIsOpen(true)} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Employee
                    </Button>
                </Protect>
            </div>

            {/* Add Employee Modal */}
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Team Member">
                <p className="text-muted-foreground text-sm -mt-2 mb-6">
                    Add a new member to your organization.
                </p>
                <form onSubmit={handleCreate} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="emp-name">Full Name</Label>
                        <Input
                            id="emp-name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="John Doe"
                            required
                            className="h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="emp-email">Email Address</Label>
                        <Input
                            id="emp-email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="john@example.com"
                            required
                            className="h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="emp-password">Initial Password</Label>
                        <Input
                            id="emp-password"
                            type="text"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="min. 8 characters"
                            required
                            className="h-11"
                        />
                        <p className="text-xs text-muted-foreground">
                            The password will be shown in a toast after creation.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="emp-role">Role</Label>
                        <select
                            id="emp-role"
                            className="flex h-11 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors hover:border-ring/50"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="admin">Admin - Full access</option>
                            <option value="manager">Manager - Products & orders</option>
                            <option value="viewer">Viewer - Read-only</option>
                        </select>
                    </div>
                    <div className="pt-2">
                        <Button
                            type="submit"
                            className="w-full h-11 shadow-lg shadow-primary/20"
                            disabled={isLoading}
                        >
                            {isLoading ? "Adding..." : "Add Team Member"}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Employee List or Empty State */}
            {initialEmployees.length === 0 ? (
                <EmptyState
                    title="No team members yet"
                    description="Invite team members or add them manually to start collaborating."
                    icon={Users}
                    actionComponent={
                        <div className="flex gap-2">
                            {orgSlug && orgName && (
                                <Protect permission="users.invite">
                                    <InviteButton slug={orgSlug} orgName={orgName} />
                                </Protect>
                            )}
                            <Protect permission="users.create">
                                <Button variant="outline" onClick={() => setIsOpen(true)}>
                                    Add Manually
                                </Button>
                            </Protect>
                        </div>
                    }
                />
            ) : (
                <div className="border rounded-xl overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="font-semibold">Member</TableHead>
                                <TableHead className="font-semibold">Email</TableHead>
                                <TableHead className="font-semibold">Role</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {initialEmployees.map((emp) => (
                                <TableRow key={emp.id} className="hover:bg-muted/30">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={emp.image || ""} alt={emp.name} />
                                                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                                                    {emp.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>{emp.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{emp.email}</TableCell>
                                    <TableCell>
                                        <RoleSelect
                                            currentRole={emp.role}
                                            memberId={emp.id}
                                            memberName={emp.name}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}

function RoleSelect({ currentRole, memberId, memberName }: { currentRole: string, memberId: string, memberName: string }) {
    const { can, isOwner } = usePermissions();
    const [isLoading, setIsLoading] = useState(false);
    const { useRouter } = require("next/navigation");
    const router = useRouter();

    const canEdit = can('users.edit') && currentRole !== 'owner'; // Can't edit owner's role generally

    const handleRoleChange = async (newRole: string) => {
        setIsLoading(true);
        const { updateMemberRoleAction } = await import("@/app/actions/employees");
        const res = await updateMemberRoleAction(memberId, newRole);

        if (res.success) {
            toast.success(`Updated ${memberName}'s role to ${newRole}`);
            router.refresh();
        } else {
            const errorMsg = (res as any).error || "Failed to update role";
            toast.error(errorMsg);
        }
        setIsLoading(false);
    };

    if (!canEdit) {
        return (
            <span className={`capitalize px-2.5 py-1 rounded-full text-xs font-medium ${currentRole === 'owner' ? 'bg-purple-100 text-purple-700' :
                currentRole === 'admin' ? 'bg-blue-100 text-blue-700' :
                    currentRole === 'manager' ? 'bg-orange-100 text-orange-700' :
                        'bg-slate-100 text-slate-600'
                }`}>
                {currentRole}
            </span>
        );
    }

    return (
        <select
            className="h-8 w-32 rounded-md border border-input bg-background px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            value={currentRole}
            onChange={(e) => handleRoleChange(e.target.value)}
            disabled={isLoading}
        >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="viewer">Viewer</option>
        </select>
    );
}

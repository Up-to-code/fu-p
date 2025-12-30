"use client";

import { useState } from "react";
import { addEmployeeAction } from "@/app/actions/employees";
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
    const { useRouter } = require("next/navigation");
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
                duration: 10000, // Long duration for password visibility
                action: {
                    label: "Copy",
                    onClick: () => navigator.clipboard.writeText(formData.password)
                }
            });
        } else {
            toast.error(res.error || "Failed to create employee");
        }
        setIsLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    {orgSlug && orgName && (
                        <Protect permission="users.invite">
                            <InviteButton slug={orgSlug} orgName={orgName} />
                        </Protect>
                    )}
                    <Protect permission="users.create">
                        <Button onClick={() => setIsOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Manual
                        </Button>
                    </Protect>
                </div>
                <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add New Employee">
                    <form onSubmit={handleCreate} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Password</Label>
                            <Input
                                type="text"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                placeholder="Set initial password"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <select
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                                <option value="viewer">Viewer</option>
                            </select>
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Adding..." : "Add Employee"}
                        </Button>
                    </form>
                </Modal>
            </div>

            {initialEmployees.length === 0 ? (
                <EmptyState
                    title="No employees found"
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
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {initialEmployees.map((emp) => (
                                <TableRow key={emp.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={emp.image || ""} alt={emp.name} />
                                            <AvatarFallback className="bg-slate-100">
                                                <User className="w-4 h-4 text-slate-500" />
                                            </AvatarFallback>
                                        </Avatar>
                                        {emp.name}
                                    </TableCell>
                                    <TableCell>{emp.email}</TableCell>
                                    <TableCell>
                                        <span className={`capitalize px-2 py-1 rounded-full text-xs font-medium ${emp.role === 'owner' ? 'bg-purple-100 text-purple-700' :
                                            emp.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                                                emp.role === 'manager' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-slate-100 text-slate-700'
                                            }`}>
                                            {emp.role}
                                        </span>
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

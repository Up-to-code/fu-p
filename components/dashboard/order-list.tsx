"use client";

import { updateOrderStatusAction } from "@/app/actions/orders";
import { Protect } from "@/components/dashboard/protect";
import { CurrencyDisplay } from "@/components/currency-display";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "../ui/badge";
// @ts-ignore
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { trackOrderStatusChanged } from "@/lib/analytics";

interface Order {
    id: string;
    customerName: string;
    totalAmount: string | number;
    status: string;
    createdAt: string;
    itemCount: number;
}

const STATUS_LABELS: Record<string, string> = {
    received: "Received",
    confirmed: "Confirmed",
    rejected: "Rejected",
    preparing: "Preparing",
    ready: "Ready",
    picked_up: "Picked Up",
    in_transit: "In Transit",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    completed: "Completed",
    cancelled: "Cancelled",
    delayed: "Delayed",
    failed: "Failed",
    return_requested: "Return Requested",
    refunded: "Refunded",
};

const STATUS_COLORS: Record<string, string> = {
    received: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    confirmed: "bg-indigo-100 text-indigo-700 hover:bg-indigo-100",
    rejected: "bg-red-100 text-red-700 hover:bg-red-100",
    preparing: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
    ready: "bg-green-100 text-green-700 hover:bg-green-100",
    picked_up: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    in_transit: "bg-cyan-100 text-cyan-700 hover:bg-cyan-100",
    out_for_delivery: "bg-sky-100 text-sky-700 hover:bg-sky-100",
    delivered: "bg-green-100 text-green-700 hover:bg-green-100",
    completed: "bg-green-100 text-green-700 hover:bg-green-100",
    cancelled: "bg-gray-100 text-gray-700 hover:bg-gray-100",
    delayed: "bg-orange-100 text-orange-700 hover:bg-orange-100",
    failed: "bg-red-100 text-red-700 hover:bg-red-100",
    return_requested: "bg-purple-100 text-purple-700 hover:bg-purple-100",
    refunded: "bg-pink-100 text-pink-700 hover:bg-pink-100",
};

export function OrderList({ initialOrders }: { initialOrders: Order[] }) {
    const router = useRouter();
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const handleStatusChange = async (id: string, newStatus: string) => {
        setUpdatingId(id);
        try {
            const result = await updateOrderStatusAction(id, newStatus);
            if (result.success) {
                // Track order status change
                trackOrderStatusChanged(id, newStatus);

                toast.success(`Order status updated to ${STATUS_LABELS[newStatus]}`);
                router.refresh();
            } else if ("error" in result) {
                toast.error(result.error as string);
            }
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="w-[100px]">Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead className="text-center">Items</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialOrders.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                <p className="text-sm">No orders found.</p>
                            </TableCell>
                        </TableRow>
                    ) : (
                        initialOrders.map((order) => (
                            <TableRow key={order.id} className="group hover:bg-muted/30 transition-colors">
                                <TableCell>
                                    <Link
                                        href={`/dashboard/orders/${order.id}`}
                                        className="font-mono text-xs text-primary hover:underline font-medium"
                                    >
                                        #{order.id.slice(-6).toUpperCase()}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm">{order.customerName}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                    {order.createdAt ? format(new Date(order.createdAt), "MMM d, yyyy") : "N/A"}
                                </TableCell>
                                <TableCell className="font-medium">
                                    <CurrencyDisplay amount={order.totalAmount} />
                                </TableCell>
                                <TableCell className="text-center text-sm">
                                    <span className="bg-muted px-2 py-0.5 rounded-full text-xs font-medium">
                                        {order.itemCount}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Protect permission="orders.manage" fallback={
                                        <Badge className={`${STATUS_COLORS[order.status]} border-none font-medium`}>
                                            {STATUS_LABELS[order.status] || order.status}
                                        </Badge>
                                    }>
                                        <div className="flex justify-end">
                                            <Select
                                                defaultValue={order.status}
                                                onValueChange={(val) => handleStatusChange(order.id, val)}
                                                disabled={updatingId === order.id}
                                            >
                                                <SelectTrigger className={`w-[160px] h-8 text-xs font-medium border-none shadow-none ${STATUS_COLORS[order.status]}`}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent align="end" className="max-h-[300px]">
                                                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                                                        <SelectItem key={value} value={value} className="text-xs">
                                                            {label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </Protect>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

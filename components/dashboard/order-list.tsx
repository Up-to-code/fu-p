"use client";

import { updateOrderStatusAction } from "@/app/actions/orders";
import { Protect } from "@/components/dashboard/protect";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";


interface Order {
    id: string;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    itemCount: number;
}

export function OrderList({ initialOrders }: { initialOrders: Order[] }) {
    const { useRouter } = require("next/navigation");
    const router = useRouter();

    const handleStatusChange = async (id: string, newStatus: string) => {
        await updateOrderStatusAction(id, newStatus);
        router.refresh();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed": return "bg-green-100 text-green-700";
            case "returned": return "bg-red-100 text-red-700";
            default: return "bg-yellow-100 text-yellow-700";
        }
    };

    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialOrders.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                No orders found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        initialOrders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-mono text-xs">{order.id.slice(-6)}</TableCell>
                                <TableCell className="font-medium">{order.customerName}</TableCell>
                                <TableCell>{new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</TableCell>
                                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                                <TableCell>{order.itemCount}</TableCell>
                                <TableCell>
                                    <Protect permission="orders.manage" fallback={
                                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10 ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    }>
                                        <select
                                            defaultValue={order.status}
                                            className={`block w-[130px] rounded-md border-0 py-1.5 pl-3 pr-10 text-xs font-medium sm:text-sm sm:leading-6 focus:ring-2 focus:ring-inset focus:ring-indigo-600 ${getStatusColor(order.status)}`}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="completed">Completed</option>
                                            <option value="returned">Returned</option>
                                        </select>
                                    </Protect>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div >
    );
}

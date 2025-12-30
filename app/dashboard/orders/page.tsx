import { getOrdersAction } from "@/app/actions/orders";
import { OrderList } from "@/components/dashboard/order-list";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ShoppingBag } from "lucide-react";

export default async function OrdersPage() {
    const orders = await getOrdersAction();

    if (!orders || orders.length === 0) {
        return (
            <div className="p-6 space-y-6">
                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                <EmptyState
                    title="No orders yet"
                    description="When you receive orders, they will appear here. Share your store link to get started!"
                    icon={ShoppingBag}
                />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            <OrderList initialOrders={orders} />
        </div>
    );
}

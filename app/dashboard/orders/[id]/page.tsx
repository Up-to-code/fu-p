import { registry } from "@/lib/registry";
import { withOrg } from "@/lib/action-context";
// @ts-ignore
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CurrencyDisplay } from "@/components/currency-display";
import { ChevronLeft, ShoppingBag, Truck, Package, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

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
    received: "bg-blue-100 text-blue-700",
    confirmed: "bg-indigo-100 text-indigo-700",
    rejected: "bg-red-100 text-red-700",
    preparing: "bg-yellow-100 text-yellow-700",
    ready: "bg-green-100 text-green-700",
    picked_up: "bg-emerald-100 text-emerald-700",
    in_transit: "bg-cyan-100 text-cyan-700",
    out_for_delivery: "bg-sky-100 text-sky-700",
    delivered: "bg-green-100 text-green-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-gray-100 text-gray-700",
    delayed: "bg-orange-100 text-orange-700",
    failed: "bg-red-100 text-red-700",
    return_requested: "bg-purple-100 text-purple-700",
    refunded: "bg-pink-100 text-pink-700",
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const order = await withOrg(async ({ orgId }) => {
        return await registry.orders.findById(id, orgId);
    });

    if (!order) {
        notFound();
    }

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="rounded-full">
                    <Link href="/dashboard/orders">
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
                    <p className="text-muted-foreground text-sm font-mono uppercase tracking-wider">
                        ID: {order.id} • Main Order: {order.mainOrderId}
                    </p>
                </div>
                <div className="ml-auto">
                    <Badge className={`${STATUS_COLORS[order.status]} border-none px-3 py-1 text-sm font-semibold shadow-sm`}>
                        {STATUS_LABELS[order.status] || order.status}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Items and Customer Info */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-none shadow-premium rounded-2xl overflow-hidden">
                        <CardHeader className="bg-muted/30 pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5 text-primary" />
                                Order Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/10 hover:bg-muted/10 border-none">
                                        <TableHead className="pl-6">Product</TableHead>
                                        <TableHead className="text-center">Quantity</TableHead>
                                        <TableHead className="text-right pr-6">Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.items?.map((item) => (
                                        <TableRow key={item.id} className="border-muted/50">
                                            <TableCell className="pl-6 py-4 font-medium">
                                                {item.productName || "Product"}
                                                <div className="text-xs text-muted-foreground font-mono mt-0.5">
                                                    {item.productId}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">x{item.quantity}</TableCell>
                                            <TableCell className="text-right pr-6 font-semibold">
                                                <CurrencyDisplay amount={Number(item.price)} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="bg-muted/5 border-none">
                                        <TableCell colSpan={2} className="pl-6 py-6 font-bold text-lg uppercase tracking-tight">
                                            Total
                                        </TableCell>
                                        <TableCell className="text-right pr-6 py-4 text-xl font-bold text-primary">
                                            <CurrencyDisplay amount={Number(order.totalAmount)} />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-premium rounded-2xl overflow-hidden">
                        <CardHeader className="bg-muted/30">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Package className="h-5 w-5 text-primary" />
                                Delivery Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Customer</h4>
                                        <p className="font-semibold text-lg">{order.customerName}</p>
                                        {order.customerEmail && <p className="text-sm text-muted-foreground">{order.customerEmail}</p>}
                                        {order.customerPhone && <p className="text-sm text-muted-foreground">{order.customerPhone}</p>}
                                    </div>
                                    {order.address && (
                                        <div>
                                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Shipping Address</h4>
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                                {(() => {
                                                    try {
                                                        const parsed = JSON.parse(order.address);
                                                        if (typeof parsed === 'object' && parsed !== null) {
                                                            return Object.values(parsed).filter(Boolean).join(', ');
                                                        }
                                                        return order.address;
                                                    } catch (e) {
                                                        return order.address;
                                                    }
                                                })()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Order Date</h4>
                                        <p className="font-medium">{format(new Date(order.createdAt), "PPP p")}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Estimated Ready Time</h4>
                                        <p className="font-medium">
                                            {order.estimatedReadyTime
                                                ? format(new Date(order.estimatedReadyTime), "PPP p")
                                                : "Not set"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Timeline / History */}
                <div className="space-y-6">
                    <Card className="border-none shadow-premium bg-slate-900 text-white rounded-2xl h-fit">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Clock className="h-5 w-5 text-blue-400" />
                                Order History
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Tracking lifecycle transitions
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="relative pb-8">
                            <div className="absolute left-[27px] top-6 bottom-10 w-0.5 bg-slate-800" />
                            <div className="space-y-8 relative">
                                {order.history?.map((entry, i) => (
                                    <div key={entry.id} className="flex gap-4">
                                        <div className={`mt-1 h-6 w-6 rounded-full flex items-center justify-center ring-4 ring-slate-900 z-10 ${i === 0 ? "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-slate-700"
                                            }`}>
                                            {i === 0 ? <CheckCircle2 className="h-3.5 w-3.5" /> : <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />}
                                        </div>
                                        <div className="space-y-1">
                                            <p className={`font-semibold text-sm ${i === 0 ? "text-blue-400" : "text-slate-200"}`}>
                                                {STATUS_LABELS[entry.status] || entry.status}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {format(new Date(entry.createdAt), "MMM d, h:mm a")}
                                            </p>
                                            {entry.notes && (
                                                <p className="text-xs text-slate-500 italic bg-slate-800/50 p-2 rounded mt-2 border-l-2 border-slate-700">
                                                    "{entry.notes}"
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-premium rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Truck className="h-5 w-5 text-primary" />
                                Webhook Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {order.webhooks?.length === 0 ? (
                                    <p className="text-sm text-muted-foreground italic text-center py-4">No webhooks sent yet</p>
                                ) : (
                                    order.webhooks?.slice(0, 5).map((log) => (
                                        <div key={log.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/5">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-mono font-bold truncate max-w-[120px]">{log.eventType}</span>
                                                <span className="text-[10px] text-muted-foreground">{format(new Date(log.sentAt), "MMM d, HH:mm")}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {log.success ? (
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                                )}
                                                <Badge variant="outline" className="text-[10px] h-5 px-1 font-mono">
                                                    {log.responseStatus || "ERR"}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

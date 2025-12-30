import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { BarChart3, Package, Globe } from "lucide-react";

export default function PartnerLandingPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                        Grow Your Furniture Business
                    </h1>
                    <p className="mt-6 text-xl text-gray-500 max-w-3xl mx-auto">
                        Join our exclusive partner network. Manage your products, orders, and organization in one unified platform.
                    </p>
                    <div className="mt-10 flex justify-center gap-4">
                        <Link href="/auth/signup">
                            <Button size="lg" className="px-8 text-lg">Become a Partner</Button>
                        </Link>
                        <Link href="/auth/login">
                            <Button size="lg" variant="outline" className="px-8 text-lg">Login</Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card>
                        <CardHeader>
                            <Package className="w-10 h-10 text-primary mb-2" />
                            <CardTitle>Product Management</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                Easily upload, organize, and manage your entire furniture catalog. Set prices, stock levels, and more.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <BarChart3 className="w-10 h-10 text-primary mb-2" />
                            <CardTitle>Sales Analytics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                Track revenue, best-selling items, and customer trends with our built-in analytics dashboard.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Globe className="w-10 h-10 text-primary mb-2" />
                            <CardTitle>Organization Control</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                Full control over your organization profile, employees, and settings. All in one place.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* How it Works */}
            <div className="bg-white py-16 border-t">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        {[
                            { step: "1", title: "Sign Up", desc: "Create your partner account." },
                            { step: "2", title: "Get Approved", desc: "We review your organization." },
                            { step: "3", title: "Add Products", desc: "List your inventory." },
                            { step: "4", title: "Start Selling", desc: "Reach thousands of customers." },
                        ].map((item) => (
                            <div key={item.step} className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                                    {item.step}
                                </div>
                                <h3 className="font-semibold text-lg">{item.title}</h3>
                                <p className="text-gray-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

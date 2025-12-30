import { Card, CardContent } from "@/components/ui/card";
import { Globe, Package, BarChart3, ShieldCheck, LayoutDashboard, CheckCircle2 } from "lucide-react";

export function FeaturesSection() {
    return (
        <section id="features" className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Partner With Us?</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        We bridge the gap between your unique furniture styles and customers looking for quality.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Globe,
                            title: "Massive Exposure",
                            desc: "Instantly list your products on our marketplace app and reach thousands of active buyers daily.",
                        },
                        {
                            icon: Package,
                            title: "Easy Product Management",
                            desc: "Upload your catalog, set prices, and manage variants with our intuitive partner dashboard.",
                        },
                        {
                            icon: BarChart3,
                            title: "Sales Insights",
                            desc: "See exactly which of your items are trending. Track views, clicks, and conversions in real-time.",
                        },
                        {
                            icon: ShieldCheck,
                            title: "Verified Badge",
                            desc: "Stand out with a verified partner badge. Build instant trust with customers looking for authentic quality.",
                        },
                        {
                            icon: LayoutDashboard,
                            title: "Brand Studio",
                            desc: "Full control over your store's aesthetic. Customize your logo, banners, and collection layouts.",
                        },
                        {
                            icon: CheckCircle2,
                            title: "Automated Fulfillment",
                            desc: "We handle the logistics coordination. You just pack, we generate the labels and track the shipment.",
                        },
                    ].map((feature, i) => (
                        <Card key={i} className="group border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                            <CardContent className="pt-8 relative z-10">
                                <div className="w-14 h-14 bg-slate-50 border rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

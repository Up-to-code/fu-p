import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export function TestimonialsSection() {
    return (
        <section id="testimonials" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Trusted by Industry Leaders</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        See what other furniture brands have to say about partnering with Houses.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            quote: "Houses transformed our digital presence. We've seen a 300% increase in online inquiries since joining.",
                            author: "Sarah Johnson",
                            role: "Owner, Modern Living Co.",
                            rating: 5,
                        },
                        {
                            quote: "The dashboard is incredibly intuitive. Managing our 500+ SKU catalog has never been easier.",
                            author: "Michael Chen",
                            role: "Operations Director, WoodWorks",
                            rating: 5,
                        },
                        {
                            quote: "A true partnership. Their support team goes above and beyond to ensure our products are showcased perfectly.",
                            author: "Emma Davis",
                            role: "Founder, Nordic Designs",
                            rating: 4,
                        },
                    ].map((item, i) => (
                        <Card key={i} className="border-none shadow-sm bg-slate-50">
                            <CardContent className="pt-8">
                                <div className="flex gap-1 text-yellow-400 mb-4">
                                    {[...Array(5)].map((_, starIndex) => (
                                        <Star
                                            key={starIndex}
                                            className={`w-4 h-4 ${starIndex < item.rating ? "fill-current" : "text-slate-300"}`}
                                        />
                                    ))}
                                </div>
                                <blockquote className="text-lg text-slate-700 mb-6 leading-relaxed">"{item.quote}"</blockquote>
                                <div>
                                    <div className="font-bold text-slate-900">{item.author}</div>
                                    <div className="text-sm text-slate-500">{item.role}</div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

import { ArrowRight } from "lucide-react";

export function HowItWorksSection() {
    return (
        <section id="solutions" className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <span className="text-primary font-semibold tracking-wider uppercase text-sm">Simple Process</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">How Houses Works</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                        Three simple steps to start selling your furniture to a global audience.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 relative">
                    {/* Connecting lines for desktop */}
                    <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-slate-200 via-primary/20 to-slate-200" />

                    {[
                        {
                            step: "01",
                            title: "Apply & Verify",
                            desc: "Submit your business details. We verify quality standards to maintain our marketplace's prestige."
                        },
                        {
                            step: "02",
                            title: "List Your Catalog",
                            desc: "Use our bulk upload tools or API to sync your inventory. Add high-res photos and rich descriptions."
                        },
                        {
                            step: "03",
                            title: "Start Selling",
                            desc: "Go live! Orders appear instantly in your dashboard. Print labels and ship with confidence."
                        }
                    ].map((item, i) => (
                        <div key={i} className="relative flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-white border-4 border-slate-50 shadow-xl flex items-center justify-center mb-8 relative z-10 group transition-transform hover:scale-105">
                                <span className="text-3xl font-black text-slate-200 group-hover:text-primary transition-colors">{item.step}</span>
                                {i < 2 && <ArrowRight className="absolute -right-16 top-1/2 -translate-y-1/2 text-slate-300 w-8 h-8 hidden md:block" />}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                            <p className="text-slate-500 leading-relaxed max-w-xs">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

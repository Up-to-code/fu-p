import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
    return (
        <section className="py-24 relative overflow-hidden bg-slate-900">
            <div className="absolute inset-0 bg-primary/20 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/30 rounded-full blur-[120px]" />

            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Ready to expand your reach?</h2>
                <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                    Join <span className="text-white font-semibold">Houses</span> today. The fastest way to get your furniture into beautiful homes.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link href="/register">
                        <Button size="lg" className="h-16 px-12 text-lg rounded-full bg-white text-slate-900 hover:bg-slate-100 hover:scale-105 transition-all shadow-xl font-bold">
                            Join Application Waitlist
                        </Button>
                    </Link>
                </div>
                <p className="mt-8 text-sm text-slate-400 font-medium">
                    Limited spots available for Q1 2025 • No credit card required of initial apply
                </p>
            </div>
        </section>
    );
}

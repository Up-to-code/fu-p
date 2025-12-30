export function StatsSection() {
    return (
        <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { label: "Active Partners", value: "2,000+" },
                        { label: "Products Listed", value: "50k+" },
                        { label: "Orders Processed", value: "1M+" },
                        { label: "Revenue Generated", value: "$500M+" },
                    ].map((stat, i) => (
                        <div key={i} className="space-y-2">
                            <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">{stat.value}</div>
                            <div className="text-slate-400 font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

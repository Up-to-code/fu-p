import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          Accepting New Partners for Q1 2025
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-5xl mx-auto leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700">
          The Growth Engine for <span className="text-primary bg-primary/10 px-2 rounded-lg italic">Modern</span> Furniture Brands.
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 leading-relaxed">
          Don't just sell furniture—build a legacy. Houses connects your craftsmanship with a community of design-conscious buyers ready to purchase.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000">
          <Link href="/register">
            <Button size="lg" className="text-lg px-8 h-14 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
              Become a Partner <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="text-lg px-8 h-14 rounded-full border-slate-200 hover:bg-slate-50">
              Partner Login
            </Button>
          </Link>
        </div>

        {/* Hero Image Mockup */}
        <div className="mt-20 relative mx-auto max-w-5xl animate-in fade-in zoom-in duration-1000 delay-300">
          <div className="rounded-2xl border bg-white/50 backdrop-blur shadow-2xl p-2 md:p-4">
            <div className="rounded-xl bg-slate-100 aspect-[16/9] flex items-center justify-center overflow-hidden border relative">
              {/* Abstract Dashboard Representation */}
              <div className="absolute inset-0 bg-slate-50 grid grid-cols-4 grid-rows-3 gap-4 p-8">
                <div className="col-span-1 row-span-3 bg-white border rounded-xl p-4 space-y-4">
                  <div className="h-8 w-24 bg-slate-100 rounded" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-4 w-full bg-slate-50 rounded" />
                    ))}
                  </div>
                </div>
                <div className="col-span-3 row-span-1 grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white border rounded-xl p-4 flex flex-col justify-between">
                      <div className="h-8 w-8 bg-primary/10 rounded-full mb-2" />
                      <div className="h-6 w-16 bg-slate-100 rounded" />
                    </div>
                  ))}
                </div>
                <div className="col-span-3 row-span-2 bg-white border rounded-xl p-6 flex items-end gap-4">
                  {[40, 60, 45, 70, 50, 80, 65, 85].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-primary/10 rounded-t-lg hover:bg-primary/20 transition-colors"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="bg-white/90 backdrop-blur px-6 py-3 rounded-full border shadow-sm text-sm font-medium text-slate-500">
                  Houses Partner Dashboard
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

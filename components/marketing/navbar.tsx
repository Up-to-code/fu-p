"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingNavbar() {
    return (
        <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur border-b">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                        H
                    </div>
                    <span className="text-xl font-bold text-slate-900">Houses</span>
                </div>
                <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
                    <Link href="#features" className="hover:text-primary transition-colors">Benefits</Link>
                    <Link href="#solutions" className="hover:text-primary transition-colors">How it Works</Link>
                    <Link href="#testimonials" className="hover:text-primary transition-colors">Success Stories</Link>
                    <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
                </nav>
                <div className="flex gap-4">
                    <Link href="/login">
                        <Button variant="ghost" className="text-slate-600 hover:text-primary">Log in</Button>
                    </Link>
                    <Link href="/register">
                        <Button className="rounded-full px-6">Join Houses</Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}

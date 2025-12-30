import Link from "next/link";

export function LandingFooter() {
    return (
        <footer className="border-t py-12 bg-slate-50 text-slate-600">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center text-white text-xs font-bold">
                                H
                            </div>
                            <span className="font-bold text-slate-900">Houses</span>
                        </div>
                        <p className="text-sm text-slate-500">
                            The premier marketplace for quality furniture partners.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#features" className="hover:text-primary">Features</Link></li>
                            <li><Link href="#pricing" className="hover:text-primary">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-primary">API</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-primary">About</Link></li>
                            <li><Link href="#" className="hover:text-primary">Blog</Link></li>
                            <li><Link href="#" className="hover:text-primary">Careers</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-primary">Privacy</Link></li>
                            <li><Link href="#" className="hover:text-primary">Terms</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm">
                        &copy; 2025 Houses Inc. All rights reserved.
                    </div>
                    <div className="flex gap-6">
                        <Link href="#" className="text-slate-400 hover:text-slate-900 transition-colors">Twitter</Link>
                        <Link href="#" className="text-slate-400 hover:text-slate-900 transition-colors">GitHub</Link>
                        <Link href="#" className="text-slate-400 hover:text-slate-900 transition-colors">LinkedIn</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

import Link from "next/link";
import { Hexagon } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 py-16 text-slate-300">
            <div className="container px-4 md:px-6">
                <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                    <div className="col-span-2">
                        <Link href="/" className="mb-6 flex items-center space-x-2">
                            <div className="bg-violet-600 p-2 rounded-lg">
                                <Hexagon className="h-6 w-6 text-white" fill="white" />
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight">CommerceAdmin</span>
                        </Link>
                        <p className="max-w-xs text-sm text-slate-400 leading-relaxed">
                            The premium solution for modern e-commerce management. Efficient, scalable, and beautifully designed for growth.
                        </p>
                    </div>
                    <div>
                        <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">
                            Product
                        </h3>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="#" className="hover:text-violet-400 transition-colors">Features</Link></li>
                            <li><Link href="#" className="hover:text-violet-400 transition-colors">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-violet-400 transition-colors">Showcase</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">
                            Company
                        </h3>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="#" className="hover:text-violet-400 transition-colors">About</Link></li>
                            <li><Link href="#" className="hover:text-violet-400 transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-violet-400 transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">
                            Legal
                        </h3>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="#" className="hover:text-violet-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-violet-400 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-16 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
                    &copy; {new Date().getFullYear()} CommerceAdmin. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

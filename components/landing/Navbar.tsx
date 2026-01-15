'use client'

import Link from 'next/link'
import { Store, ShoppingBag, LogIn } from 'lucide-react'
import { Button } from '../ui/button'

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
            <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                        <Store size={18} />
                    </div>
                    <span>Empire</span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/shop" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                        Shop
                    </Link>
                    <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                        Features
                    </Link>
                    <Link href="#pricing" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                        Pricing
                    </Link>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost" className="text-slate-600 hover:text-blue-600 hover:bg-blue-50">
                            <LogIn size={18} className="mr-2" />
                            Login
                        </Button>
                    </Link>
                    <Link href="/shop">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100">
                            <ShoppingBag size={18} className="mr-2" />
                            Shop Now
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}

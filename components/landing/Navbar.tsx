'use client'

import Link from 'next/link'
import { Store, ShoppingBag, LogIn, LogOut, User } from 'lucide-react'
import { Button } from '../ui/button'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function Navbar() {
    const [user, setUser] = useState<any>(null)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        // Check initial user
        supabase.auth.getUser().then(({ data }) => setUser(data.user))

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })
        return () => subscription.unsubscribe()
    }, [supabase])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        setUser(null)
    }

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
                    {user && (
                        <Link href="/orders" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                            My Orders
                        </Link>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <Button variant="ghost" onClick={handleLogout} className="text-slate-600 hover:text-red-600 hover:bg-red-50">
                            <LogOut size={18} className="mr-2" />
                            Logout
                        </Button>
                    ) : (
                        <Link href="/login">
                            <Button variant="ghost" className="text-slate-600 hover:text-blue-600 hover:bg-blue-50">
                                <LogIn size={18} className="mr-2" />
                                Login
                            </Button>
                        </Link>
                    )}

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

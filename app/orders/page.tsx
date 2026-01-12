'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Package, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { Footer } from '@/components/landing/Footer'

interface Order {
    id: string
    created_at: string
    status: string
    total_amount: number
    shipping_address: any
    items: any[]
}

export default function MyOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchOrders = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                setLoading(false)
                return
            }

            const { data } = await supabase
                .from('orders')
                .select(`
                    *,
                    items:order_items(
                        *,
                        product:products(name, image_url)
                    )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (data) setOrders(data)
            setLoading(false)
        }

        fetchOrders()
    }, [])

    if (loading) return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-200 h-16 flex items-center px-4 md:px-6">
                <Link href="/" className="font-bold text-xl text-slate-900">Store</Link>
            </header>
            <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
            <Footer />
        </div>
    )

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-50">
                <Link href="/" className="font-bold text-xl text-slate-900">E-Commerce Store</Link>
                <nav className="flex items-center gap-4">
                    <Link href="/shop" className="text-sm font-medium text-slate-600 hover:text-slate-900">Shop</Link>
                </nav>
            </header>

            <main className="flex-1 container py-12 px-4 md:px-6">
                <h1 className="text-3xl font-bold mb-8 text-slate-900">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">No orders yet</h2>
                        <p className="text-slate-500 mb-6">Start shopping to see your orders here.</p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                                <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                    <div>
                                        <p className="text-sm text-slate-500 uppercase tracking-wide font-medium">Order Placed</p>
                                        <p className="font-medium text-slate-900">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 uppercase tracking-wide font-medium">Total</p>
                                        <p className="font-bold text-slate-900">${order.total_amount}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 uppercase tracking-wide font-medium">Order #</p>
                                        <p className="font-mono text-slate-600">{order.id.slice(0, 8)}</p>
                                    </div>
                                    <div>
                                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold
                                            ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                                    order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'}
                                        `}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-sm font-medium text-slate-900 mb-4">Items Ordered</h3>
                                    <div className="space-y-4">
                                        {order.items?.map((item: any) => (
                                            <div key={item.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-slate-100 rounded-md flex items-center justify-center">
                                                        <Package className="w-6 h-6 text-slate-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900">{item.product?.name || 'Product'}</p>
                                                        <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <p className="font-medium text-slate-900">${item.price_at_time}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}

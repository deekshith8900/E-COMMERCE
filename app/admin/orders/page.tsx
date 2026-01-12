'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Package, CheckCircle, Clock, Truck } from 'lucide-react'
// Imports removed

// We'll use a standard HTML select for simplicity if shadcn component isn't fully installed,
// but let's try to stick to clean UI.

interface Order {
    id: string
    created_at: string
    status: string
    total_amount: number
    payment_status: string
    shipping_address: any
    user: { email: string }
    items: any[]
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchOrders = async () => {
        const { data } = await supabase
            .from('orders')
            .select(`
        *,
        items:order_items(
            *,
            product:products(name)
        )
      `)
            .order('created_at', { ascending: false })

        // We sadly can't easily join auth.users in standard query without a view,
        // so we might just show the User ID or fetch profiles if we had a link.
        // For now, let's assume we link to Profiles if we set up FK correctly or just show Order ID.
        // Actually schema_phase4 said user_id references auth.users.
        // RLS allows us to see it.

        if (data) setOrders(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const updateStatus = async (orderId: string, newStatus: string) => {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId)

        if (!error) {
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
        }
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            case 'processing': return 'bg-blue-100 text-blue-800'
            case 'shipped': return 'bg-purple-100 text-purple-800'
            case 'delivered': return 'bg-green-100 text-green-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Order Management</h1>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                        <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Items</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-b hover:bg-slate-50">
                                <td className="px-6 py-4 font-mono text-xs">{order.id.slice(0, 8)}...</td>
                                <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium">{order.shipping_address?.fullName}</span>
                                        <span className="text-xs text-slate-500">{order.shipping_address?.city}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-bold">${order.total_amount}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-xs text-slate-500">
                                    {order.items?.length} items
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        className="border rounded px-2 py-1 text-xs"
                                        value={order.status}
                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {orders.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        No orders found.
                    </div>
                )}
            </div>
        </div>
    )
}

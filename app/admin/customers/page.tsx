'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Users, Search } from 'lucide-react'

interface Customer {
    user_id: string
    email: string
    full_name: string
    total_orders: number
    total_spent: number
    last_order_date: string
}

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const supabase = createClient()

    useEffect(() => {
        const fetchCustomers = async () => {
            // Call the RPC function we just created
            const { data, error } = await supabase.rpc('get_admin_customers')

            if (error) {
                console.error('Error fetching customers:', error)
                console.log('Error details:', JSON.stringify(error, null, 2))
                alert('Failed to fetch customers: ' + error.message)
            } else if (data) {
                setCustomers(data)
            }
            setLoading(false)
        }

        fetchCustomers()
    }, [])

    const filteredCustomers = customers.filter(c =>
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) return (
        <div className="p-8 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    )

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Customers</h1>
                    <p className="text-muted-foreground">View and manage your registered customers.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-medium flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            All Customers ({customers.length})
                        </CardTitle>
                        <div className="relative w-72">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                placeholder="Search by name or email..."
                                className="pl-8 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 font-medium text-slate-500">Customer</th>
                                    <th className="px-6 py-3 font-medium text-slate-500">Email</th>
                                    <th className="px-6 py-3 font-medium text-slate-500">Total Orders</th>
                                    <th className="px-6 py-3 font-medium text-slate-500">Total Spent</th>
                                    <th className="px-6 py-3 font-medium text-slate-500">Last Active</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.length > 0 ? (
                                    filteredCustomers.map((customer) => (
                                        <tr key={customer.user_id} className="border-b hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                {customer.full_name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {customer.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {customer.total_orders} orders
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-900">
                                                ${Number(customer.total_spent).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {customer.last_order_date ? new Date(customer.last_order_date).toLocaleDateString() : 'Never'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                            No customers found matching "{searchTerm}"
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

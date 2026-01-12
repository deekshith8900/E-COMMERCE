'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DollarSign, ShoppingBag, CreditCard, TrendingUp } from 'lucide-react'

interface DashboardStats {
    totalRevenue: number
    totalOrders: number
    avgOrderValue: number
    pendingOrders: number
}

interface ChartData {
    date: string
    revenue: number
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        pendingOrders: 0
    })
    const [chartData, setChartData] = useState<ChartData[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchData = async () => {
            // Fetch all orders
            const { data: orders } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: true })

            if (!orders) return

            // Calculate Stats
            const totalOrders = orders.length
            const paidOrders = orders.filter(o => o.payment_status === 'Paid')
            const totalRevenue = paidOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
            const avgOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0
            const pendingOrders = orders.filter(o => o.status === 'Pending').length

            setStats({
                totalRevenue,
                totalOrders,
                avgOrderValue,
                pendingOrders
            })

            // Calculate Chart Data (Revenue per Day)
            const revenueByDate: Record<string, number> = {}
            paidOrders.forEach(order => {
                const date = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                revenueByDate[date] = (revenueByDate[date] || 0) + (order.total_amount || 0)
            })

            const chart = Object.keys(revenueByDate).map(date => ({
                date,
                revenue: revenueByDate[date]
            }))

            setChartData(chart)
            setLoading(false)
        }

        fetchData()
    }, [])

    if (loading) return <div className="p-8">Loading Dashboard...</div>

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your store performance.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Lifetime earnings</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{stats.totalOrders}</div>
                        <p className="text-xs text-muted-foreground">All time orders</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingOrders}</div>
                        <p className="text-xs text-muted-foreground">Orders needing attention</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.avgOrderValue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Per paid order</p>
                    </CardContent>
                </Card>
            </div>

            {/* Chart */}
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <div className="h-[350px] w-full">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <Tooltip
                                        formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Revenue']}
                                        cursor={{ fill: 'transparent' }}
                                    />
                                    <Bar dataKey="revenue" fill="#0f172a" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400">
                                No paid orders yet to display.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

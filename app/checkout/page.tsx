'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/components/providers/CartProvider'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, ArrowLeft, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart()
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<any>(null)
    const router = useRouter()
    const supabase = createClient()

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: ''
    })

    const [success, setSuccess] = useState(false)

    // Check Auth & Empty Cart
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login?next=/checkout')
            } else {
                setUser(user)
            }
        }
        checkUser()

        if (items.length === 0 && !success) {
            router.push('/shop')
        }
    }, [items, router, supabase, success])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return
        setLoading(true)

        try {
            // 1. Create Order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: user.id,
                    status: 'Pending',
                    total_amount: cartTotal,
                    shipping_address: formData,
                    payment_status: 'Pending' // Explicitly Pending until paid
                })
                .select()
                .single()

            if (orderError) throw orderError

            // 2. Create Order Items
            const orderItems = items.map(item => ({
                order_id: order.id,
                product_id: item.id,
                quantity: item.quantity,
                price_at_time: item.price
            }))

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems)

            if (itemsError) throw itemsError

            // 3. Initiate Payment (Call Next.js API)
            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_id: order.id })
            })

            if (!response.ok) throw new Error('Failed to initiate payment')

            const { client_secret } = await response.json()

            console.log('Payment Initiated:', client_secret)

            // 4. Simulate Payment Success
            // We call our own internal webhook
            await fetch('/api/webhook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'payment_intent.succeeded',
                    data: {
                        order_id: order.id,
                        amount: Math.round(cartTotal * 100),
                        id: `sim_txn_${Date.now()}`
                    }
                })
            })

            // 5. Clear Cart & Redirect
            setSuccess(true)
            clearCart()
            router.push('/checkout/success')

        } catch (error: any) {
            alert(`Checkout Failed: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    if (!user || items.length === 0) return null

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                <Link href="/shop" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-8">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Shop
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Shipping Form */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Full Name</label>
                                <Input
                                    required name="fullName"
                                    placeholder="John Doe"
                                    value={formData.fullName} onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1 block">Address</label>
                                <Input
                                    required name="address"
                                    placeholder="123 Main St"
                                    value={formData.address} onChange={handleInputChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">City</label>
                                    <Input
                                        required name="city"
                                        placeholder="New York"
                                        value={formData.city} onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">State</label>
                                    <Input
                                        required name="state"
                                        placeholder="NY"
                                        value={formData.state} onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">ZIP Code</label>
                                    <Input
                                        required name="zip"
                                        placeholder="10001"
                                        value={formData.zip} onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Country</label>
                                    <Input
                                        required name="country"
                                        placeholder="USA"
                                        value={formData.country} onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full mt-6" size="lg" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    `Pay $${cartTotal.toFixed(2)}`
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-slate-50 p-6 rounded-xl">
                        <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                        <div className="space-y-4 mb-6">
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium text-slate-900">{item.quantity}x</span>
                                        <span className="text-slate-600 truncate max-w-[140px]">{item.name}</span>
                                    </div>
                                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between text-slate-500 text-sm">
                                <span>Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-500 text-sm">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-slate-900 border-t pt-4 mt-2">
                                <span>Total</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mt-8 bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                            <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-blue-700">
                                This is a secure checkout. Your payment details are encrypted.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

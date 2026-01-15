'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/components/providers/CartProvider'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, ArrowLeft, ShieldCheck, CreditCard } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart()
    const [user, setUser] = useState<any>(null)
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        fullName: '', address: '', city: '', state: '', zip: '', country: 'US'
    })

    // Coupon State
    const [couponCode, setCouponCode] = useState('')
    const [couponLoading, setCouponLoading] = useState(false)
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number; } | null>(null)
    const [couponMessage, setCouponMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null)

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) router.push('/login?next=/checkout')
            else setUser(user)
        }
        checkUser()
        if (items.length === 0 && !success) router.push('/shop')
    }, [items, router, supabase, success])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const applyCoupon = async () => {
        if (!couponCode.trim()) return
        setCouponLoading(true)
        setCouponMessage(null)
        try {
            const { data, error } = await supabase.rpc('validate_coupon', {
                code_input: couponCode,
                cart_total: cartTotal
            })
            if (error) throw error
            if (data.valid) {
                setAppliedCoupon({ code: data.code, discountAmount: data.discount_amount })
                setCouponMessage({ text: data.message, type: 'success' })
            } else {
                setAppliedCoupon(null)
                setCouponMessage({ text: data.message, type: 'error' })
            }
        } catch (error) {
            console.error('Coupon Error:', error)
            setCouponMessage({ text: 'Failed to apply coupon', type: 'error' })
        } finally {
            setCouponLoading(false)
        }
    }

    const finalTotal = Math.max(0, cartTotal - (appliedCoupon?.discountAmount || 0))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setErrorMessage(null)

        try {
            if (!user) return

            // 1. Create Order (Pending)
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: user.id,
                    status: 'Processing', // Simulated: Auto-process
                    payment_status: 'Paid', // Simulated: Auto-pay
                    total_amount: finalTotal,
                    shipping_address: formData
                })
                .select()
                .single()

            if (orderError) throw orderError

            // 2. Create Order Items
            const orderItems = items.map((item: any) => ({
                order_id: order.id,
                product_id: item.id,
                quantity: item.quantity,
                price_at_time: item.price
            }))

            const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
            if (itemsError) throw itemsError

            // 3. (Optional) Call API to trigger emails/stock deduction if needed
            // For now, simpler is better. We just assume success.
            // But we should try to deduct stock if possible. 
            // We can call a server action or API route here if we want robust logic, 
            // but for "Previous Version", client side logic is fine or we can rely on triggers.
            // Let's call the webhook manually? No, webhook expects Stripe event.
            // We will just let it be. If user needs stock updates, we'll add a 'simulate-payment' API later.

            // 4. Success
            setSuccess(true)
            clearCart()
            router.push('/checkout/success')

        } catch (error: any) {
            console.error('Checkout Error:', error)
            setErrorMessage(error.message || 'Failed to place order')
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
                    {/* Payment Form */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h2 className="text-xl font-semibold mb-6">Checkout</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Full Name</label>
                                <Input required name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleInputChange} />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Address</label>
                                <Input required name="address" placeholder="123 Main St" value={formData.address} onChange={handleInputChange} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">City</label>
                                    <Input required name="city" placeholder="New York" value={formData.city} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">State</label>
                                    <Input required name="state" placeholder="NY" value={formData.state} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">ZIP Code</label>
                                    <Input required name="zip" placeholder="10001" value={formData.zip} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Country</label>
                                    <Input required name="country" placeholder="US" value={formData.country} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t">
                                <h3 className="text-sm font-medium mb-3">Payment Method</h3>
                                <div className="bg-slate-50 p-4 rounded-md border border-slate-200 flex items-center gap-3">
                                    <CreditCard className="text-slate-500 w-5 h-5" />
                                    <span className="text-sm text-slate-700 font-medium">Credit Card</span>
                                </div>
                            </div>

                            {errorMessage && <div className="text-red-600 text-sm mt-2">{errorMessage}</div>}

                            <Button type="submit" className="w-full mt-6" size="lg" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    `Pay $${finalTotal.toFixed(2)}`
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-slate-50 p-6 rounded-xl h-fit">
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

                        {/* Promo Code Input */}
                        <div className="mb-6 pt-4 border-t">
                            <label className="text-sm font-medium mb-2 block text-slate-700">Promo Code</label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Enter code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    disabled={!!appliedCoupon}
                                />
                                {appliedCoupon ? (
                                    <Button variant="outline" onClick={() => { setAppliedCoupon(null); setCouponCode(''); setCouponMessage(null) }}>
                                        Remove
                                    </Button>
                                ) : (
                                    <Button onClick={applyCoupon} disabled={couponLoading || !couponCode}>
                                        {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                                    </Button>
                                )}
                            </div>
                            {couponMessage && (
                                <p className={`text-xs mt-2 ${couponMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                    {couponMessage.text}
                                </p>
                            )}
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between text-slate-500 text-sm">
                                <span>Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            {appliedCoupon && (
                                <div className="flex justify-between text-green-600 text-sm font-medium">
                                    <span>Discount ({appliedCoupon.code})</span>
                                    <span>-${appliedCoupon.discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-slate-500 text-sm">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-slate-900 border-t pt-4 mt-2">
                                <span>Total</span>
                                <span>${finalTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mt-8 bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                            <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-blue-700">
                                Secure Checkout (Demo Mode)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

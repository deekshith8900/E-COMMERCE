import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { order_id, coupon_code } = body

        // Initialize Supabase Admin Client
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // 1. Fetch Order Total
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('total_amount') // This is the original subtotal before discount was fully applied in DB
            .eq('id', order_id)
            .single()

        if (orderError || !order) {
            throw new Error('Order not found')
        }

        let finalAmount = order.total_amount

        // 2. Validate Coupon if provided
        if (coupon_code) {
            const { data: validation, error: rpcError } = await supabase.rpc('validate_coupon', {
                code_input: coupon_code,
                cart_total: order.total_amount
            })

            if (rpcError) throw rpcError

            if (validation.valid) {
                finalAmount = order.total_amount - validation.discount_amount
            }
        }

        // Ensure amount is at least $0.50 (Stripe min), we use cents
        const amountInCents = Math.round(Math.max(0.5, finalAmount) * 100)

        // Initialize Stripe
        const Stripe = require('stripe')
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

        // Create PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: "usd",
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                order_id: order_id, // Important for webhook
            }
        })

        return NextResponse.json({
            client_secret: paymentIntent.client_secret,
            amount: finalAmount,
            currency: "usd"
        })
    } catch (error: any) {
        console.error('Payment Intent Error:', error)
        return NextResponse.json({ error: error.message || 'Failed to create payment intent' }, { status: 400 })
    }
}

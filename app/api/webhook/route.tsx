
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
// Removed local client import to avoid confusion
import { OrderConfirmationTemplate } from '@/components/email/OrderConfirmationTemplate'

// Need to allow reading raw body for signature verification
export const config = {
    api: {
        bodyParser: false,
    },
}

export async function POST(request: Request) {
    try {
        const body = await request.text()
        const sig = request.headers.get('stripe-signature') as string

        const { Stripe } = await import('stripe')
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

        let event

        try {
            if (!process.env.STRIPE_WEBHOOK_SECRET) {
                // Return 200 to avoid retries if secret is missing in dev
                console.warn('STRIPE_WEBHOOK_SECRET is missing. Skipping verification.')
                return NextResponse.json({ status: "skipped" })
            }
            event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
        } catch (err: any) {
            console.error(`Webhook signature verification failed: ${err.message} `)
            return NextResponse.json({ error: `Webhook Error: ${err.message} ` }, { status: 400 })
        }

        // Initialize Supabase Service Role Client (Safe for Webhook)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // Handle the event
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object as any
            const { order_id } = paymentIntent.metadata

            if (!order_id) {
                console.error('Missing order_id in metadata')
                return NextResponse.json({ status: "ignored_no_order_id" })
            }

            console.log(`Payment succeeded for order ${order_id}`)

            // 1. Update Order Status
            const { error: orderError } = await supabase
                .from("orders")
                .update({ status: "Processing", payment_status: "Paid" })
                .eq("id", order_id)

            if (orderError) throw orderError

            // 2. Log Transaction
            const { error: txError } = await supabase
                .from("transactions")
                .insert({
                    order_id,
                    provider_id: paymentIntent.id,
                    amount: paymentIntent.amount, // Stripe amount is in cents
                    status: "success",
                    provider: "stripe"
                })

            if (txError) throw txError

            // 3. Decrement Stock
            const { data: orderItems, error: itemsError } = await supabase
                .from('order_items')
                .select('product_id, quantity')
                .eq('order_id', order_id)

            if (!itemsError && orderItems) {
                for (const item of orderItems) {
                    // Fetch current stock
                    const { data: product } = await supabase
                        .from('products')
                        .select('stock_quantity')
                        .eq('id', item.product_id)
                        .single()

                    if (product) {
                        const newStock = Math.max(0, product.stock_quantity - item.quantity)
                        await supabase
                            .from('products')
                            .update({ stock_quantity: newStock })
                            .eq('id', item.product_id)
                    }
                }
            }

            // 4. Send Confirmation Email
            if (process.env.RESEND_API_KEY) {
                try {
                    const { data: orderData } = await supabase
                        .from('orders')
                        .select('total_amount, user_id')
                        .eq('id', order_id)
                        .single()

                    if (orderData) {
                        // In a real app with Service Role, we'd fetch email from auth.users
                        // For this demo, we'll try to get it from the session or metadata
                        // Since we are in a webhook, we don't have a session. 
                        // We need the Service Role client to get the user's email from ID.

                        const supabaseAdmin = createClient(
                            process.env.NEXT_PUBLIC_SUPABASE_URL!,
                            process.env.SUPABASE_SERVICE_ROLE_KEY!
                        )
                        const { data: userData } = await supabaseAdmin.auth.admin.getUserById(orderData.user_id)

                        if (userData.user?.email) {
                            const { Resend } = await import('resend')
                            const resend = new Resend(process.env.RESEND_API_KEY)

                            await resend.emails.send({
                                from: 'Acme Store <onboarding@resend.dev>',
                                to: userData.user.email,
                                subject: 'Order Confirmation',
                                react: <OrderConfirmationTemplate
                                    orderId={order_id}
                                    customerName={userData.user.user_metadata?.full_name || 'Customer'}
                                    amount={orderData.total_amount * 100}
                                />
                            })
                            console.log(`Email sent to ${userData.user.email} `)
                        }
                    }
                } catch (emailError) {
                    console.error('Failed to send email:', emailError)
                    // Don't fail the webhook just because email failed
                }
            } else {
                console.log('Skipping email: RESEND_API_KEY not set')
            }

            return NextResponse.json({ status: "success" })
        }

        return NextResponse.json({ status: "ignored" })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}

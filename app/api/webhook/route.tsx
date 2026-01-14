import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
// Removed local client import to avoid confusion
import { OrderConfirmationTemplate } from '@/components/email/OrderConfirmationTemplate'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { type, data } = body

        // Initialize Supabase Service Role Client (Safe for Webhook)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        if (type === "payment_intent.succeeded") {
            const { order_id, id: transaction_id, amount } = data

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
                    provider_id: transaction_id,
                    amount: amount, // Assuming already processed format
                    status: "success",
                    provider: "simulated"
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
                            console.log(`Email sent to ${userData.user.email}`)
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

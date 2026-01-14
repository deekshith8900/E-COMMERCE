import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { type, data } = body

        // We need a Supabase client that can write to tables. 
        // For this demo, we can use the regular client if RLS allows, 
        // or we rely on the fact that this is a simulated local loop.
        // Ideally, this uses Service Role for secure updates, but let's stick to standard client for simplicity in this demo phase.
        const supabase = createClient()

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

            return NextResponse.json({ status: "success" })
        }

        return NextResponse.json({ status: "ignored" })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}

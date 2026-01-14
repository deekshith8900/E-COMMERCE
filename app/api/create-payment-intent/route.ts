import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Mock Logic similar to Python backend
        return NextResponse.json({
            client_secret: `simulated_secret_${Math.random().toString(36).substring(7)}`,
            amount: 100.00,
            currency: "usd"
        })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 400 })
    }
}

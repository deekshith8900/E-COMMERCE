'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <div className="text-center space-y-6 max-w-md">
                <div className="flex justify-center">
                    <CheckCircle className="w-24 h-24 text-green-500" />
                </div>

                <h1 className="text-3xl font-bold text-slate-900">Order Placed Successfully!</h1>

                <p className="text-slate-600 text-lg">
                    Thank you for your purchase. We have received your order and are processing it.
                </p>

                <div className="pt-6 space-y-3">
                    <Link href="/shop" className="block w-full">
                        <Button className="w-full" size="lg">Continue Shopping</Button>
                    </Link>
                    <Link href="/" className="block w-full">
                        <Button variant="outline" className="w-full">Return Home</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

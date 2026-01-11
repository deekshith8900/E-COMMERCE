'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import type { Product } from '@/app/shop/page'

export default function ProductCard({ product }: { product: Product }) {
    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-slate-100 flex flex-col">
            <div className="relative aspect-square w-full bg-slate-100">
                {product.image_url ? (
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-300">
                        No Image
                    </div>
                )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
                <div className="text-xs font-medium text-blue-600 mb-1">
                    {product.category?.name || 'Item'}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2 line-clamp-1">
                    {product.name}
                </h3>
                <div className="mt-auto flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-900">
                        ${product.price}
                    </span>
                    <Button size="sm" className="rounded-full w-10 h-10 p-0">
                        <ShoppingCart className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

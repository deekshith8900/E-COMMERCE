'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/providers/CartProvider'
import { Loader2, ArrowLeft, ShoppingCart, Check } from 'lucide-react'
import Link from 'next/link'

interface Product {
    id: string
    name: string
    description: string
    price: number
    stock_quantity: number
    image_url: string
    category: { name: string } | null
}

export default function ProductDetailPage() {
    const { id } = useParams()
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [adding, setAdding] = useState(false)

    const { addItem } = useCart()
    const supabase = createClient()

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return

            const { data } = await supabase
                .from('products')
                .select('*, categories(name)')
                .eq('id', id)
                .single()

            if (data) {
                setProduct({
                    ...data,
                    category: data.categories
                })
            }
            setLoading(false)
        }
        fetchProduct()
    }, [id])

    const handleAddToCart = () => {
        if (!product) return
        setAdding(true)
        addItem(product)

        // Show success feedback briefly
        setTimeout(() => setAdding(false), 1000)
    }

    if (loading) {
        return (
            <div className="min-h-screen py-20 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen py-20 text-center">
                <h2 className="text-xl font-semibold">Product not found</h2>
                <Link href="/shop">
                    <Button variant="ghost">Back to Shop</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href="/shop" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-8">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Shop
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-12 md:gap-8">
                        {/* Image Section */}
                        <div className="aspect-square relative bg-slate-100">
                            {product.image_url ? (
                                <Image
                                    src={product.image_url}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-300">
                                    No Image Available
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                            <div className="mb-2">
                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-blue-50 text-blue-700">
                                    {product.category?.name || 'Item'}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                                {product.name}
                            </h1>
                            <p className="text-2xl font-bold text-slate-900 mb-6">
                                ${product.price}
                            </p>

                            <div className="prose prose-slate mb-8">
                                <p className="text-slate-600 leading-relaxed">
                                    {product.description || 'No description available for this product.'}
                                </p>
                            </div>

                            <div className="mt-auto pt-6 border-t border-slate-100">
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`text-sm font-medium ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                                    </span>
                                </div>

                                <Button
                                    size="lg"
                                    className="w-full text-lg h-14"
                                    onClick={handleAddToCart}
                                    disabled={product.stock_quantity === 0}
                                >
                                    {adding ? (
                                        <>
                                            <Check className="mr-2 h-5 w-5" />
                                            Added to Cart
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="mr-2 h-5 w-5" />
                                            Add to Cart
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

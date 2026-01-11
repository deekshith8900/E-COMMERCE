'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import ProductCard from '@/components/shop/ProductCard'
import { Loader2 } from 'lucide-react'

export interface Product {
    id: string
    name: string
    price: number
    image_url: string
    category: { name: string } | null
}

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await supabase
                .from('products')
                .select('*, categories(name)')
                .eq('is_active', true)

            if (data) {
                // Transform the data to match our interface
                const formatted = data.map((item: any) => ({
                    ...item,
                    category: item.categories
                }))
                setProducts(formatted)
            }
            setLoading(false)
        }
        fetchProducts()
    }, [])

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">Shop Our Collection</h1>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-slate-500">No products found. Check back soon!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

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
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([])
    const [loading, setLoading] = useState(true)

    const [error, setError] = useState<string | null>(null)

    // Filter States
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')

    const supabase = createClient()

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Products
                const { data: productsData, error: productsError } = await supabase
                    .from('products')
                    .select('*, categories(name)')
                    .eq('is_active', true)

                if (productsError) throw productsError

                // Fetch Categories
                const { data: categoriesData, error: categoriesError } = await supabase
                    .from('categories')
                    .select('id, name')

                if (categoriesError) throw categoriesError

                if (productsData) {
                    const formatted = productsData.map((item: any) => ({
                        ...item,
                        category: item.categories
                    }))
                    setProducts(formatted)
                    setFilteredProducts(formatted)
                }

                if (categoriesData) {
                    setCategories(categoriesData)
                }
            } catch (err: any) {
                console.error('Shop fetch error:', err)
                setError(err.message || 'Failed to load products')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    // Handle Filtering
    useEffect(() => {
        let result = products

        if (searchQuery) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        if (selectedCategory !== 'All') {
            result = result.filter(p =>
                p.category?.name === selectedCategory
            )
        }

        setFilteredProducts(result)
    }, [searchQuery, selectedCategory, products])

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">Shop Our Collection</h1>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-md mb-8 border border-red-200">
                        <p className="font-bold">Error Loading Products:</p>
                        <p>{error}</p>
                        <div className="mt-4 text-xs font-mono bg-red-100 p-2 rounded">
                            <p><strong>Debug Info:</strong></p>
                            <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 15) + '...' : 'UNDEFINED'}</p>
                            <p>Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 5) + '...') : 'UNDEFINED'}</p>
                            <p>If URL is "https://placeho...", then Env Vars are MISSING in Vercel.</p>
                        </div>
                    </div>
                )}

                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="flex h-10 w-full sm:w-80 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <select
                        className="flex h-10 w-full sm:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="All">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-slate-500">No products found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

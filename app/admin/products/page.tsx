'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import ProductForm from '@/components/admin/ProductForm'
import { Button } from '@/components/ui/button'
import { Plus, Package, Edit, Trash2 } from 'lucide-react'
import Image from 'next/image'

interface Product {
    id: string
    name: string
    description: string
    price: number
    stock_quantity: number
    category_id: string
    category: { name: string } | null
    image_url: string
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [showForm, setShowForm] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const supabase = createClient()

    const fetchProducts = async () => {
        const { data } = await supabase
            .from('products')
            .select(`
        *,
        categories (name)
      `)
            .order('created_at', { ascending: false })

        if (data) {
            // Map the joined category data to a simpler structure if needed, or use as is
            const formatted = data.map((item: any) => ({
                ...item,
                category: item.categories // Supabase returns the joined table as the singular/plural name
            }))
            setProducts(formatted)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return

        const { error } = await supabase.from('products').delete().eq('id', id)
        if (error) {
            alert('Error deleting product')
            console.error(error)
        } else {
            fetchProducts()
        }
    }

    const handleEdit = (product: Product) => {
        setEditingProduct(product)
        setShowForm(true)
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Products</h1>
                    <p className="text-muted-foreground">Manage your inventory and store catalog.</p>
                </div>
                <Button onClick={() => {
                    if (showForm) {
                        setShowForm(false)
                        setEditingProduct(null)
                    } else {
                        setShowForm(true)
                        setEditingProduct(null)
                    }
                }}>
                    {showForm ? 'Cancel' : (
                        <>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Product
                        </>
                    )}
                </Button>
            </div>

            {showForm && (
                <div className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
                    <h2 className="text-xl font-semibold mb-4 text-primary">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                    <ProductForm
                        initialData={editingProduct}
                        onSuccess={() => {
                            setShowForm(false)
                            setEditingProduct(null)
                            fetchProducts()
                        }}
                    />
                </div>
            )}

            {products.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed rounded-xl bg-slate-50/50">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">No products found</h3>
                    <p className="text-slate-500">Get started by creating a new product.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    <div className="rounded-md border bg-white">
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[100px]">Image</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Stock</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {products.map((product) => (
                                        <tr key={product.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle">
                                                {product.image_url ? (
                                                    <div className="relative w-12 h-12 rounded-md overflow-hidden border">
                                                        <Image
                                                            src={product.image_url}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-12 h-12 rounded-md bg-slate-100 flex items-center justify-center">
                                                        <Package className="w-6 h-6 text-slate-300" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 align-middle font-medium">{product.name}</td>
                                            <td className="p-4 align-middle">
                                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                                    {product.category?.name || 'Uncategorized'}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle">${product.price}</td>
                                            <td className="p-4 align-middle">
                                                <span className={product.stock_quantity > 0 ? "text-green-600" : "text-red-600"}>
                                                    {product.stock_quantity}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(product)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(product.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Upload, Loader2, X } from 'lucide-react'
import Image from 'next/image'

interface Category {
    id: string
    name: string
}

interface Product {
    id: string
    name: string
    description: string
    price: number
    stock_quantity: number
    category_id: string
    image_url: string
}

export default function ProductForm({ onSuccess, initialData }: { onSuccess?: () => void, initialData?: Product | null }) {
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null)

    // Form State
    const [name, setName] = useState(initialData?.name || '')
    const [description, setDescription] = useState(initialData?.description || '')
    const [price, setPrice] = useState(initialData?.price?.toString() || '')
    const [stock, setStock] = useState(initialData?.stock_quantity?.toString() || '')
    const [categoryId, setCategoryId] = useState(initialData?.category_id || '') // Assuming category_id is available or we map it

    const supabase = createClient()

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from('categories').select('id, name')
            if (data) setCategories(data)
        }
        fetchCategories()
    }, [])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            let imageUrl = initialData?.image_url || ''

            // 1. Upload new Image if changed
            if (imageFile) {
                const formData = new FormData()
                formData.append('file', imageFile)

                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
                const response = await fetch(`${apiUrl}/upload`, {
                    method: 'POST',
                    body: formData,
                })

                if (!response.ok) throw new Error('Failed to upload image')

                const data = await response.json()
                imageUrl = data.url
            }

            const productData = {
                name,
                description,
                price: parseFloat(price),
                stock_quantity: parseInt(stock),
                category_id: categoryId || null,
                image_url: imageUrl,
            }

            let error;

            if (initialData?.id) {
                // Update existing
                const { error: updateError } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', initialData.id)
                error = updateError
            } else {
                // Insert new
                const { error: insertError } = await supabase
                    .from('products')
                    .insert(productData)
                error = insertError
            }

            if (error) throw error

            if (onSuccess) onSuccess()
            alert(initialData ? 'Product updated successfully!' : 'Product created successfully!')

        } catch (error: any) {
            console.error(error)
            alert(`Error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="space-y-2">
                <label className="text-sm font-medium">Product Name</label>
                <Input
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Premium Wireless Headphones"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe the product features..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Price ($)</label>
                    <Input
                        required
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        placeholder="0.00"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Stock Quantity</label>
                    <Input
                        required
                        type="number"
                        value={stock}
                        onChange={e => setStock(e.target.value)}
                        placeholder="0"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Product Image</label>
                <div className="flex items-center gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('image-upload')?.click()}
                        className="w-full h-32 border-dashed"
                    >
                        {imagePreview ? (
                            <div className="relative w-full h-full">
                                <Image
                                    src={imagePreview}
                                    alt="Preview"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <Upload className="w-8 h-8" />
                                <span>Click to upload image</span>
                            </div>
                        )}
                    </Button>
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </div>
            </div>

            <div className="flex gap-4">
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {initialData ? 'Updating...' : 'Creating...'}
                        </>
                    ) : (
                        initialData ? 'Update Product' : 'Create Product'
                    )}
                </Button>
            </div>
        </form>
    )
}

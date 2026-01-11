import { createClient } from '@/lib/supabase/server'
import { Metadata } from 'next'
import ProductDetailClient from './client'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const { id } = await params
    const supabase = await createClient()

    const { data: product } = await supabase
        .from('products')
        .select('name, description, image_url')
        .eq('id', id)
        .single()

    if (!product) {
        return {
            title: 'Product Not Found',
        }
    }

    return {
        title: `${product.name} | E-Commerce Store`,
        description: product.description,
        openGraph: {
            title: product.name,
            description: product.description,
            images: product.image_url ? [product.image_url] : [],
        },
    }
}

export default async function ProductPage() {
    return <ProductDetailClient />
}

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

export default async function ProductPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const supabase = await createClient()

    // Fetch Product
    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    // Fetch Review Stats
    const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('product_id', id)

    const reviewCount = reviews?.length || 0
    const averageRating = reviewCount > 0
        ? (reviews!.reduce((acc, curr) => acc + curr.rating, 0) / reviewCount).toFixed(1)
        : null

    // JSON-LD Structured Data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product?.name,
        description: product?.description,
        image: product?.image_url,
        offers: {
            '@type': 'Offer',
            price: product?.price,
            priceCurrency: 'USD',
            availability: product?.stock_quantity && product.stock_quantity > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
        },
        ...(averageRating && {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: averageRating,
                reviewCount: reviewCount
            }
        })
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductDetailClient />
        </>
    )
}

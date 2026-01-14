'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { StarRating } from '@/components/ui/StarRating'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, User } from 'lucide-react'
import Link from 'next/link'

interface Review {
    id: string
    created_at: string
    rating: number
    comment: string
    user_id: string
    // In a real app, strict relation types would be better
    user_metadata?: { full_name?: string }
}

export function ReviewSection({ productId }: { productId: string }) {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)

    // Form State
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

    const supabase = createClient()

    useEffect(() => {
        const fetchData = async () => {
            // 1. Get User
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)

            // 2. Get Reviews
            // Ideally we join with profiles, but simplified first.
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('product_id', productId)
                .order('created_at', { ascending: false })

            if (data) setReviews(data)
            setLoading(false)
        }
        fetchData()
    }, [productId, supabase])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user || rating === 0) return

        setSubmitting(true)
        setStatus('idle')

        try {
            const { error } = await supabase
                .from('reviews')
                .insert({
                    product_id: productId,
                    user_id: user.id,
                    rating,
                    comment
                })

            if (error) throw error

            setStatus('success')
            setComment('')
            setRating(0)

            // Refresh list (optimistic update would be better but this is fine)
            const { data } = await supabase
                .from('reviews')
                .select('*')
                .eq('product_id', productId)
                .order('created_at', { ascending: false })
            if (data) setReviews(data)

        } catch (error) {
            console.error(error)
            setStatus('error')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <div className="py-8 text-center text-slate-500">Loading reviews...</div>

    return (
        <div className="py-12 border-t border-slate-100 mt-12 bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Customer Reviews</h2>

            {/* List */}
            <div className="space-y-8 mb-12">
                {reviews.length === 0 ? (
                    <p className="text-slate-500 italic">No reviews yet. Be the first to review this product!</p>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} className="border-b border-slate-50 last:border-0 pb-6 last:pb-0">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center">
                                        <User className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <span className="font-medium text-slate-900 line-clamp-1">Verified Customer</span>
                                </div>
                                <span className="text-xs text-slate-400">{new Date(review.created_at).toLocaleDateString()}</span>
                            </div>
                            <StarRating rating={review.rating} size={16} />
                            <p className="mt-3 text-slate-600 leading-relaxed">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Form */}
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                <h3 className="font-semibold text-lg mb-4">Write a Review</h3>

                {user ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
                            <StarRating rating={rating} interactive onRatingChange={setRating} size={24} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Comment</label>
                            <Textarea
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                placeholder="Tell us what you liked or didn't like..."
                                required
                            />
                        </div>

                        {status === 'error' && <p className="text-red-600 text-sm">Failed to submit review. Try again.</p>}
                        {status === 'success' && <p className="text-green-600 text-sm">Review submitted successfully!</p>}

                        <Button type="submit" disabled={submitting || rating === 0}>
                            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Review
                        </Button>
                    </form>
                ) : (
                    <div className="text-center py-6">
                        <p className="text-slate-600 mb-4">Please log in to leave a review.</p>
                        <Link href={`/login?next=/shop/product/${productId}`}>
                            <Button variant="outline">Log In</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

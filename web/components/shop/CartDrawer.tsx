'use client'

import { useState } from 'react'
import { useCart } from '@/components/providers/CartProvider'
import { Button } from '@/components/ui/button'
import { ShoppingBag, X, Trash2, Plus, Minus } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function CartDrawer() {
    const [isOpen, setIsOpen] = useState(false)
    const { items, removeItem, updateQuantity, cartCount, cartTotal } = useCart()
    const router = useRouter()

    const handleCheckout = () => {
        setIsOpen(false)
        router.push('/checkout')
    }

    return (
        <>
            {/* Floating Cart Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-105 flex items-center justify-center"
            >
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                        {cartCount}
                    </span>
                )}
            </button>

            {/* Drawer Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black z-[999]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 20 }}
                            className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white z-[1000] shadow-2xl flex flex-col"
                        >
                            <div className="p-4 border-b flex items-center justify-between">
                                <h2 className="text-lg font-semibold flex items-center">
                                    <ShoppingBag className="w-5 h-5 mr-2" />
                                    Your Cart ({cartCount})
                                </h2>
                                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {items.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                                        <ShoppingBag className="w-12 h-12 opacity-20" />
                                        <p>Your cart is empty.</p>
                                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                                            Continue Shopping
                                        </Button>
                                    </div>
                                ) : (
                                    items.map((item) => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="relative w-20 h-20 bg-slate-100 rounded-md overflow-hidden flex-shrink-0">
                                                {item.image_url && (
                                                    <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                                                )}
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="font-medium text-sm line-clamp-1">{item.name}</h3>
                                                    <p className="text-sm font-semibold text-slate-900">${item.price}</p>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center border rounded-md">
                                                        <button
                                                            className="p-1 hover:bg-slate-100"
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="text-xs w-6 text-center">{item.quantity}</span>
                                                        <button
                                                            className="p-1 hover:bg-slate-100"
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-red-500 hover:text-red-600 p-1"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {items.length > 0 && (
                                <div className="p-4 border-t space-y-4 bg-slate-50">
                                    <div className="flex justify-between items-center text-lg font-bold">
                                        <span>Total</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <Button
                                        className="w-full h-12 text-lg"
                                        onClick={handleCheckout}
                                    >
                                        Checkout Now
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

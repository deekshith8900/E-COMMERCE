"use client";

import { Button } from "../ui/button";
import { ArrowRight, ShoppingBag, LayoutDashboard, Database, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative overflow-hidden pt-16 pb-24 md:pt-32 md:pb-40 bg-white">
            {/* Background Shapes */}
            <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-yellow-400/10 blur-[120px]" />
            <div className="absolute bottom-0 left-0 -z-10 h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[120px]" />

            <div className="container px-4 md:px-6">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">

                    {/* Left Column: Content */}
                    <div className="flex flex-col items-start text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-6 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
                            v2.0 Now Available
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="mb-6 text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl md:text-7xl leading-[1.1]"
                        >
                            Manage Your <br />
                            <span className="text-blue-600">Empire</span> with <br />
                            <span className="text-yellow-500">Unmatched Speed</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mb-8 max-w-[600px] text-lg text-slate-600 md:text-xl leading-relaxed"
                        >
                            The enterprise-grade operating system for modern retail. Sync inventory, process payments, and track growth in one dashboard.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col gap-4 sm:flex-row w-full sm:w-auto"
                        >
                            <Link href="/shop">
                                <Button size="lg" className="h-14 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold shadow-xl shadow-blue-100 transition-all hover:-translate-y-1">
                                    Start Shopping
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button variant="outline" size="lg" className="h-14 px-8 rounded-xl border-2 border-slate-200 text-lg font-bold text-slate-700 hover:border-yellow-400 hover:bg-yellow-50 transition-all">
                                    Admin Dashboard
                                </Button>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right Column: Visual/Graphic */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex items-center justify-center lg:justify-end"
                    >
                        <div className="relative h-[400px] w-full max-w-[500px] rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 shadow-2xl flex flex-col justify-between">
                            {/* Abstract Dashboard UI Mockup */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex space-x-2">
                                    <div className="h-3 w-3 rounded-full bg-red-400/80" />
                                    <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                                    <div className="h-3 w-3 rounded-full bg-green-400/80" />
                                </div>
                                <div className="h-2 w-20 rounded-full bg-white/20" />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-4 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                                    <div className="h-10 w-10 rounded-lg bg-yellow-400 flex items-center justify-center text-blue-900"><TrendingUp size={20} /></div>
                                    <div className="space-y-2">
                                        <div className="h-2 w-24 rounded bg-white/40" />
                                        <div className="h-2 w-16 rounded bg-white/20" />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                                    <div className="h-10 w-10 rounded-lg bg-blue-400 flex items-center justify-center text-white"><Database size={20} /></div>
                                    <div className="space-y-2">
                                        <div className="h-2 w-32 rounded bg-white/40" />
                                        <div className="h-2 w-20 rounded bg-white/20" />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                                    <div className="h-10 w-10 rounded-lg bg-pink-400 flex items-center justify-center text-white"><LayoutDashboard size={20} /></div>
                                    <div className="space-y-2">
                                        <div className="h-2 w-28 rounded bg-white/40" />
                                        <div className="h-2 w-12 rounded bg-white/20" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

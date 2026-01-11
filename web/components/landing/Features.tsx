"use client";

import { motion } from "framer-motion";
import { Package, ShieldCheck, BarChart3, Zap } from "lucide-react";

const features = [
    {
        icon: Package,
        color: "bg-blue-100 text-blue-600",
        title: "Inventory Control",
        description: "Real-time stock tracking with automated low-stock alerts.",
    },
    {
        icon: ShieldCheck,
        color: "bg-yellow-100 text-yellow-700",
        title: "Secure Payments",
        description: "End-to-end encrypted transactions and secure access.",
    },
    {
        icon: BarChart3,
        color: "bg-blue-100 text-blue-600",
        title: "Deep Analytics",
        description: "Visualize revenue streams and customer behavior trends.",
    },
    {
        icon: Zap,
        color: "bg-yellow-100 text-yellow-700",
        title: "Lightning Fast",
        description: "Built on Next.js 14 for sub-second page loads.",
    },
];

export function Features() {
    return (
        <section className="bg-slate-50 py-24 text-slate-900">
            <div className="container px-4 md:px-6">
                <div className="mb-16 flex flex-col items-center text-center">
                    <span className="mb-4 font-bold tracking-wider text-blue-600 uppercase text-sm">Features</span>
                    <h2 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl text-slate-900">
                        Powering Modern Commerce
                    </h2>
                    <p className="max-w-[700px] text-lg text-slate-600">
                        Everything you need to scale your operations, wrapped in a clear, intuitive interface.
                    </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="h-full" /* Ensure container takes full height */
                        >
                            <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-8 shadow-sm border border-slate-100 transition-all hover:-translate-y-2 hover:shadow-lg hover:border-blue-200">
                                <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl ${feature.color}`}>
                                    <feature.icon className="h-7 w-7" />
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-slate-900">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-500 leading-relaxed flex-1">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

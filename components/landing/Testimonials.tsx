"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
    {
        quote: "This platform revolutionized how we manage our inventory. The interface is stunning and so easy to use.",
        author: "Sarah Johnson",
        role: "CEO, FashionForward",
        iconColor: "text-blue-500",
    },
    {
        quote: "The analytics provided are unmatched. We've scaled our revenue by 40% since switching.",
        author: "Mark Davis",
        role: "Director, TechGadgets",
        iconColor: "text-yellow-500",
    },
    {
        quote: "Minimal, fast, and reliable. Exactly what a modern e-commerce business needs backend.",
        author: "Elena Rodriguez",
        role: "Founder, LuxeHome",
        iconColor: "text-blue-500",
    },
];

export function Testimonials() {
    return (
        <section className="bg-slate-50 py-24 relative overflow-hidden">
            <div className="container px-4 md:px-6 relative z-10">
                <h2 className="mb-16 text-center text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900">
                    Trusted by Leaders
                </h2>

                <div className="grid gap-8 md:grid-cols-3">
                    {testimonials.map((t, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="rounded-3xl p-8 shadow-sm bg-white border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow"
                        >
                            <div className="mb-6">
                                <Quote className={t.iconColor} size={48} />
                            </div>
                            <div>
                                <p className="mb-6 text-lg font-medium leading-relaxed text-slate-700">"{t.quote}"</p>
                                <div>
                                    <p className="font-bold text-slate-900">{t.author}</p>
                                    <p className="text-sm text-slate-500">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

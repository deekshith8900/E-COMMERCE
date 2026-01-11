"use client";

import { Button } from "../ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const plans = [
    {
        name: "Starter",
        price: "$29",
        description: "Essential tools for small businesses.",
        features: ["Up to 100 Products", "Basic Analytics", "Standard Support"],
        featured: false,
    },
    {
        name: "Pro",
        price: "$99",
        description: "Advanced power for growing brands.",
        features: ["Unlimited Products", "Advanced Analytics", "Priority Support", "Custom Domain"],
        featured: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "Scalable solutions for large teams.",
        features: ["Dedicated Manager", "SLA", "Custom Integrations", "24/7 Support"],
        featured: false,
    },
];

export function Pricing() {
    return (
        <section className="py-24 bg-white border-t border-slate-100">
            <div className="container px-4 md:px-6">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                        Simple Pricing
                    </h2>
                    <p className="text-lg text-slate-600">
                        Choose the plan that fits your business needs.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3 lg:gap-8 items-stretch">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="h-full"
                        >
                            <div className={`relative flex h-full flex-col rounded-3xl p-8 transition-all ${plan.featured
                                    ? "bg-white shadow-xl ring-2 ring-blue-600 scale-105 z-10"
                                    : "bg-slate-50 border border-slate-200 hover:bg-white hover:shadow-lg"
                                }`}>
                                {plan.featured && (
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-md">
                                        Most Popular
                                    </div>
                                )}

                                <div className="mb-8">
                                    <h3 className={`text-xl font-bold ${plan.featured ? "text-blue-600" : "text-slate-900"}`}>{plan.name}</h3>
                                    <div className="mt-4 flex items-baseline">
                                        <span className="text-5xl font-extrabold tracking-tight text-slate-900">
                                            {plan.price}
                                        </span>
                                        {plan.price !== "Custom" && <span className="ml-1 text-slate-500 font-medium">/mo</span>}
                                    </div>
                                    <p className="mt-4 text-slate-500">{plan.description}</p>
                                </div>

                                <ul className="mb-8 space-y-4 flex-1">
                                    {plan.features.map((feat, i) => (
                                        <li key={i} className="flex items-start">
                                            <div className={`mr-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${plan.featured ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-600"}`}>
                                                <Check className="h-3 w-3" />
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">{feat}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    className={`w-full h-12 rounded-xl font-bold text-base transition-all ${plan.featured
                                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
                                            : "bg-white border-2 border-slate-200 text-slate-700 hover:border-yellow-400 hover:bg-yellow-50"
                                        }`}
                                >
                                    Get Started
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";

export default function ShopPage() {
    const { user, signOut } = useAuth();

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="mx-auto max-w-4xl">
                <header className="flex items-center justify-between rounded-3xl bg-white p-6 shadow-sm border border-slate-100 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Shop</h1>
                        {user && <p className="text-sm text-slate-500">Welcome, {user.email}</p>}
                    </div>
                    <div className="flex gap-4">
                        {!user ? (
                            <>
                                {/* Placeholder for non-logged in */}
                            </>
                        ) : (
                            <Button onClick={signOut} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                                Sign Out
                            </Button>
                        )}
                    </div>
                </header>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Products Placeholder */}
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 h-64 flex items-center justify-center text-slate-300">
                            Product Placeholder {i}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

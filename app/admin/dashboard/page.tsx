"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
    const { user, signOut } = useAuth();

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Basic Sidebar */}
            <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <span className="text-xl font-bold text-blue-400">AdminPanel</span>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/20">
                        <LayoutDashboard size={18} />
                        Dashboard
                    </Link>
                    {/* More Links Later */}
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-4 py-2">
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
                            {user?.email?.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="text-xs text-slate-400 overflow-hidden text-ellipsis w-32">
                            {user?.email}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <header className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900">Dashboard</h1>
                    <Button onClick={signOut} variant="ghost" className="text-slate-500 hover:text-red-600 gap-2">
                        <LogOut size={18} />
                        Sign Out
                    </Button>
                </header>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Revenue</h3>
                        <p className="mt-2 text-3xl font-bold text-slate-900">$0.00</p>
                    </div>
                    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Active Orders</h3>
                        <p className="mt-2 text-3xl font-bold text-slate-900">0</p>
                    </div>
                    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Products</h3>
                        <p className="mt-2 text-3xl font-bold text-slate-900">0</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

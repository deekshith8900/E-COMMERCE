"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${location.origin}/auth/callback?next=/update-password`,
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage("Check your email for the password reset link.");
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
                <div className="text-center">
                    <Link href="/login" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Login
                    </Link>
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        Reset Password
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Enter your email to receive a reset link.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleReset}>
                    <div>
                        <label htmlFor="email" className="sr-only">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="relative block w-full rounded-xl border-2 border-slate-100 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                            placeholder="Email address"
                        />
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 text-center font-medium">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600 text-center font-medium">
                            {message}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Send Reset Link"}
                    </Button>
                </form>
            </div>
        </div>
    );
}

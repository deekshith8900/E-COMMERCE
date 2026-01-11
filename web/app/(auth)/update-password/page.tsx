"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push("/admin/dashboard"); // Redirect to dashboard after success
            router.refresh();
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        Set New Password
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Enter your new password below.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleUpdate}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="password" className="sr-only">
                                New Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="relative block w-full rounded-xl border-2 border-slate-100 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                                placeholder="New Password"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="sr-only">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="relative block w-full rounded-xl border-2 border-slate-100 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                                placeholder="Confirm New Password"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 text-center font-medium">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Update Password"}
                    </Button>
                </form>
            </div>
        </div>
    );
}

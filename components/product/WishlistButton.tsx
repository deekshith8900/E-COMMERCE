"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
    productId: string;
    className?: string;
    iconSize?: number;
}

export default function WishlistButton({
    productId,
    className,
    iconSize = 24,
}: WishlistButtonProps) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const supabase = createClient();
    const router = useRouter();

    // Check Auth & Wishlist Status on Mount
    useEffect(() => {
        async function checkStatus() {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) return;
            setUserId(session.user.id);

            const { data } = await supabase
                .from("wishlist")
                .select("id")
                .eq("user_id", session.user.id)
                .eq("product_id", productId)
                .single();

            if (data) setIsWishlisted(true);
        }
        checkStatus();
    }, [productId, supabase]);

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating if inside a link
        e.stopPropagation();

        if (!userId) {
            alert("Please log in to add items to your wishlist.");
            router.push("/login");
            return;
        }

        if (loading) return;
        setLoading(true);

        // Optimistic Update
        const previousState = isWishlisted;
        setIsWishlisted(!previousState);

        try {
            if (previousState) {
                // Remove
                const { error } = await supabase
                    .from("wishlist")
                    .delete()
                    .eq("user_id", userId)
                    .eq("product_id", productId);

                if (error) throw error;
            } else {
                // Add
                const { error } = await supabase
                    .from("wishlist")
                    .insert({ user_id: userId, product_id: productId });

                if (error) throw error;
            }
        } catch (error) {
            console.error("Error toggling wishlist:", error);
            setIsWishlisted(previousState); // Revert on error
            alert("Failed to update wishlist. Please try again.");
        } finally {
            setLoading(false);
            router.refresh(); // Refresh to update any server-side lists if needed
        }
    };

    return (
        <button
            onClick={toggleWishlist}
            disabled={loading}
            className={cn(
                "p-2 rounded-full transition-colors hover:bg-gray-100",
                isWishlisted ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-gray-500",
                className
            )}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
            <Heart
                size={iconSize}
                className={cn("transition-all", isWishlisted && "fill-current")}
            />
        </button>
    );
}

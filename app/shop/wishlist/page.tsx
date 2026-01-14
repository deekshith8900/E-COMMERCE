import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProductCard from "@/components/shop/ProductCard";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch Wishlist with Product Details
    const { data: wishlistItems, error } = await supabase
        .from("wishlist")
        .select(`
      id,
      products (
        id,
        name,
        description,
        price,
        stock_quantity,
        image_url,
        category_id,
        categories (
          name
        )
      )
    `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching wishlist:", error);
        return <div>Error loading wishlist</div>;
    }

    // Transform data to match Product interface
    // The query returns { products: { ... } } inside each wishlist item
    // We need to extract the product and map 'categories' to 'category'
    const products = wishlistItems?.map((item: any) => {
        const p = item.products;
        return {
            ...p,
            category: p.categories, // Map categories -> category
        };
    }) || [];

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link
                        href="/shop"
                        className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Shop
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-full text-red-600">
                            <Heart className="w-6 h-6 fill-current" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">My Wishlist</h1>
                    </div>
                    <p className="mt-2 text-slate-600">
                        {products.length} {products.length === 1 ? "item" : "items"} saved for later
                    </p>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                            <Heart className="w-8 h-8 text-slate-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">
                            Your wishlist is empty
                        </h2>
                        <p className="text-slate-500 mb-6">
                            Start exploring and save your favorite items!
                        </p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

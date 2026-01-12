import type { NextConfig } from "next";

console.log("---------------------------------------------------");
console.log("BUILD DEBUG: NEXT_PUBLIC_SUPABASE_URL =", process.env.NEXT_PUBLIC_SUPABASE_URL ? "DEFINED" : "MISSING");
console.log("---------------------------------------------------");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};

export default nextConfig;

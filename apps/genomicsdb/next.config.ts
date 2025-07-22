import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    /* eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    }, */
    // assetPrefix: {`process.env.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : null`}, // Ensures static assets are served from the correct path
    experimental: 
        serverActions: {
            allowedOrigins: ["www.niagads.org", "*.niagads.org"],
            allowedDevOrigins: [
                "localhost:3000", // Default Next.js dev server
                "127.0.0.1:3000", // Localhost with IP
                "localhost:8010", // Custom dev port
                "127.0.0.1:8010", // Custom dev port with IP
                "www.niagads.org", // Live site domain
                "*.niagads.org", // Subdomains of niagads.org
            ],
        },
    },
    images: {
        unoptimized: true,
    },
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: `${process.env.INTERNAL_BACKEND_SERVICE_URL}/:path*`,
            },
        ];
    },
};

export default nextConfig;

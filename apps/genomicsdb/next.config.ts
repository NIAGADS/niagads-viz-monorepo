import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    /* eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    }, */
    images: {
        unoptimized: true,
    },
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: `${process.env.INTERNAL_BACKEND_SERVICE_URL}/:path*`,
                basePath: false,
            },
        ];
    },
};

export default nextConfig;

import type { NextConfig } from "next";

if (!process.env.API_INTERNAL_URL) {
    throw new Error("API_INTERNAL_URL is not set");
}

const nextConfig: NextConfig = {
    reactStrictMode: true,
    devIndicators: false,
    allowedDevOrigins: ["api.niagads.org"],
};

export default nextConfig;

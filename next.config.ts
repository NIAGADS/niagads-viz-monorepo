import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */

    /* for accessing GenomicsDB services and static files; e.g., genome browser tracks
    async rewrites() {
        return [
            {
                source: '/service/:path*',
                destination: 'https://www.niagads.org/genomics/service/:path*'
            },
            {
                source: '/files/:path*',
                destination: 'https://www.niagads.org/genomics/files/:path*'
            }
        ]
    }
    */
};

export default nextConfig;

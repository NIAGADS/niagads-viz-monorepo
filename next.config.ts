import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    assetPrefix: '/igvbrowser-static',
    // TEMP for accessing GenomicsDB services and static files; e.g., genome browser tracks
    async rewrites() {
        return [
            {
                source: '/service/:path*',
                destination: 'https://www.niagads.org/genomics/service/:path*'
            },
            {
                source: '/files/:path*',
                destination: 'https://www.niagads.org/genomics/files/:path*'
            },
            {
                source: '/api/:path*',
                destination: 'http://localhost:8000/:path*'
            }
        ]
    },

    async redirects() {
        return [
            {
                source: '/gene/:path*',
                destination: 'https://www.niagads.org/genomics/app/record/gene/:path*',
                permanent: true
            },
            {
                source: '/variant/:path*',
                destination: 'https://www.niagads.org/genomics/app/record/variant/:path*',
                permanent: true
            }, 
            {
                source: '/record/:path*',
                destination: 'https://www.niagads.org/genomics/app/record/:path*',
                permanent: true
            },
        ]
    }

};

export default nextConfig;



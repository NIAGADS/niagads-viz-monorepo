import type { NextConfig } from "next";


const nextConfig = {

        async rewrites() {
            return [
                {
                    source: '/service/:path*',
                    destination: 'https://www.niagads.org/genomics/service/:path*'
                },
                { source: '/files/:path*',
                    destination: 'https://www.niagads.org/genomics/files/:path*'
                }
            ]
        }
    
};

export default nextConfig;

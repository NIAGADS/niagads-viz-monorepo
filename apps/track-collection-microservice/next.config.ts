import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    compiler: { styledComponents: true },
    /* config options here */
    assetPrefix: '/track-collection-static',
    eslint: {
        ignoreDuringBuilds: true,
    },
    /* for accessing GenomicsDB services and static files; e.g., genome browser tracks */
    async rewrites() {
        return [
            {
                source: '/service/:path*',
                destination: 'https://www.niagads.org/genomics/service/:path*'
            },
            {
                source: '/api/:path*',
                destination: `${process.env.NIAGADS_API_HOST}/:path*`,
                basePath: false
            },
            /* {
                 source: '/files/:path*',
                 destination: 'https://www.niagads.org/genomics/files/:path*'
             }*/
        ]
    },

    /* for redirects to the GenomicsDB; e.g., record links */
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
            /*  {
                  source: '/record/:path*',
                  destination: 'https://www.niagads.org/genomics/app/record/:path*',
                  permanent: true
              }, */
        ]
    }

};

export default nextConfig;

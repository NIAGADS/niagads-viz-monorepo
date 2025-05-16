import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // for accessing GenomicsDB services and static files; e.g., genome browser tracks
    async rewrites() {
        return [
            {
                source: "/service/:path*",
                destination: "https://www.niagads.org/genomics/service/:path*",
            },
            {
                source: "/files/:path*",
                destination: "https://www.niagads.org/genomics/files/:path*",
            },
            {
                source: "/api/:path*",
                destination: `${process.env.API_PUBLIC_URL}/:path*`,
                basePath: false,
            },
        ];
    },

    // for redirects to the GenomicsDB; e.g., record links
    async redirects() {
        return [
            {
                source: "/gene/:path*",
                destination: "https://www.niagads.org/genomics/app/record/gene/:path*",
                permanent: true,
            },
            {
                source: "/variant/:path*",
                destination: "https://www.niagads.org/genomics/app/record/variant/:path*",
                permanent: true,
            },
            {
                source: "/record/:path*",
                destination: "https://www.niagads.org/genomics/app/record/:path*",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;

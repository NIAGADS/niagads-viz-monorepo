import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    turbopack: {
        //root: path.join(__dirname, '..'), // include files outside of app
    },
    experimental: {
        serverSourceMaps: true,
    },
    //transpilePackages: ['@niagads/common', '@niagads/ui', '@niagads/table'],
    // for accessing GenomicsDB services and static files; e.g., genome browser tracks
    /*
    async rewrites() {
        return [
            {
                source: "/docs/:path*",
                destination: "http://localhost:3000/docs/:path*",
            },
            {
                source: "/",
                destination: "http://localhost:3001/",
            },
        ];
    },*/
    /*
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
    },*/
};

export default nextConfig;

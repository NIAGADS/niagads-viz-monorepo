import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
    extension: /\.mdx?$/,
    options: {
        remarkPlugins: [["remark-toc", { heading: "On this page", maxDepth: 3 }]],
        rehypePlugins: ["rehype-slug"],
    },
});

const nextConfig: NextConfig = { pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"] };

export default withMDX(nextConfig);

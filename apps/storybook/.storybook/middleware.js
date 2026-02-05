const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function expressMiddleware(router) {
    router.use(
        "/genomics-service/**",
        createProxyMiddleware({
            target: "https://www.niagads.org/genomics/service",
            changeOrigin: true,
            secure: false,
            pathRewrite: { "^/genomics-service": "" }
        })
    );

    router.use(
        "/api/feature-lookup",
        createProxyMiddleware({
            target: "https://api.niagads.org/genomics/service/igvbrowser/feature",
            changeOrigin: true,
            secure: true,
            pathRewrite: { "/api/feature-lookup": "" },
        })
    );
    router.use(
        "/api/**",
        createProxyMiddleware({
            target: "https://api.niagads.org",
            changeOrigin: true,
            secure: true,
            pathRewrite: (path, req) => {
                const rewritten = path.replace(/^\/api/, "");
                console.log("Rewritten path for /api/**:", rewritten);
                return rewritten;
            }
        })
    );

    router.use(
        "/record/**",
        createProxyMiddleware({
            target: "https://api.niagads.org",
            changeOrigin: true,
            secure: false,
        })
    );
};

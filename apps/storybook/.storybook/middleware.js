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
        "/api/feature-lookup/**",
        createProxyMiddleware({
            target: "https://api.niagads.org/",
            changeOrigin: true,
            secure: true,
            pathRewrite: { "^/api/feature-lookup": "/genomics/service/igvbrowser/feature" },
            onProxyReq: (proxyReq, req, res) => {
                // Compose the full URL from proxyReq
                const protocol = proxyReq.agent && proxyReq.agent.protocol ? proxyReq.agent.protocol.replace(':', '') : 'https';
                const host = proxyReq.getHeader('host');
                const path = proxyReq.path;
                const fullUrl = `${protocol}://${host}${path}`;
                console.log("Actual outgoing proxied request URL:", fullUrl);
                console.log("Proxy request headers:", proxyReq.getHeaders());
            }
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

const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function expressMiddleware(router) {
    router.use(
        "/genomics-service/**",
        createProxyMiddleware({
            target: "https://www.niagads.org/genomics/service",
            changeOrigin: true,
            secure: false,
        })
    );

    router.use(
        "/api/**",
        createProxyMiddleware({
            target: "https://api.niagads.org",
            changeOrigin: true,
            secure: false,
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

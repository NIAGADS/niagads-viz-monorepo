const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function expressMiddleware(router) {
    router.use(
        "/service/**",
        createProxyMiddleware({
            target: "https://www.niagads.org/genomics",
            changeOrigin: true,
            secure: false,
        })
    );
};

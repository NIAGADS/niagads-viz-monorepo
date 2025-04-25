/** @type {import('postcss-load-config').Config} */
const config = {
    plugins: {
        "@tailwindcss/postcss": {},
    },
    inject: true,
    extensions: [".css"],
    minimize: true,
};

export default config;

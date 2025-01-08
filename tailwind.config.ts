import type { Config } from "tailwindcss";

const defaultTheme = require("tailwindcss/defaultTheme");

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: "#3d5263",
                secondary: "#f9c664",
                accent: "#618eb5",
                "accent-dark": "#27333f",
            },
            fontFamily: {
                sans: ['"Open Sans"', ...defaultTheme.fontFamily.sans],
                inter: ["Inter"],
                roboto: ["Roboto"],
            },
        },
    },
    plugins: [],
} satisfies Config;

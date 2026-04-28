import type { StorybookConfig } from "@storybook/nextjs-vite";
import { createRequire } from "node:module";
import { mergeConfig } from "vite";
import path from "path";

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
    stories: ["../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

    core: {
        disableTelemetry: true, // Disables telemetry (tracking / usage stats)
    },

    typescript: {
        reactDocgen: "react-docgen-typescript",
    },

    addons: ["@storybook/addon-links", "@storybook/addon-docs"],

    framework: {
        name: "@storybook/nextjs-vite",
        options: {},
    },

    async viteFinal(config) {
        return mergeConfig(config, {
            resolve: {
                alias: {
                    // Explicitly point to /src instead of the package root
                    "@niagads/table": path.resolve(import.meta.dirname, "../../../packages/Table/src"),
                },
            },

            build: {
                // Force source maps to be generated even in development
                sourcemap: true,
            },

            optimizeDeps: {
                // IMPORTANT: Prevent Vite from "pre-bundling" your packages into one big file
                exclude: ["@miagads/table", "@my-org/ui"],
            },
            // Ensure the browser can access these files across monorepo boundaries
            server: {
                fs: {
                    allow: ["../../../"], // Allow access to monorepo root
                },
            },
        });
    },
};

export default config;

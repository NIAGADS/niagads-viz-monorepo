import type { StorybookConfig } from "@storybook/nextjs-vite";
// This file has been automatically migrated to valid ESM format by Storybook.
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { join } from "path";
import path from "node:path";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    // enable source maps and debugging in .tsx files
    async viteFinal(config, options) {
        const { mergeConfig } = await import("vite");
        // Check if we are running in local dev mode
        // Storybook's 'configType' is usually 'DEVELOPMENT' or 'PRODUCTION'
        const isDev = options.configType === "DEVELOPMENT";
        console.log("DIRNAME");
        console.log(__dirname);

        return mergeConfig(config, {
            resolve: {
                alias: isDev
                    ? [
                          {
                              find: "@niagads/table",
                              replacement: join(__dirname, "../../../packages/Table/src/index.ts"),
                          },
                          {
                              find: "@niagads/charts",
                              replacement: join(__dirname, "../../../packages/Charts/src/index.ts"),
                          },
                          {
                              find: "@niagads/ui",
                              replacement: join(__dirname, "../../../packages/UI/src/index.ts"),
                          },
                          {
                              find: "@niagads/common",
                              replacement: join(__dirname, "../../../packages/Common/src/index.ts"),
                          },
                      ]
                    : [],
            },
            // This part is for local development (npm run storybook)
            server: {
                sourcemap: true,
                fs: {
                    // Strictly allow the root of your monorepo
                    allow: [path.resolve(__dirname, "../../../")],
                },
            },
            // This part is for the production build (npm run build-storybook)
            build: {
                sourcemap: true,
            },
            // Optional: useful for debugging CSS/Sass in dev tools
            css: {
                devSourcemap: true,
            },
        });
    },
};

export default config;

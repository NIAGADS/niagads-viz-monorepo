// This file has been automatically migrated to valid ESM format by Storybook.
import { createRequire } from "node:module";
import type { StorybookConfig } from "@storybook/nextjs-vite";

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
    stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

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
};
export default config;

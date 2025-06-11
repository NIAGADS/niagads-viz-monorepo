import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";
import del from "rollup-plugin-delete";
import { dts } from "rollup-plugin-dts";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

export default [
    {
        input: ["./src/index.ts"],
        output: [
            {
                format: "esm",
                sourcemap: true,
                dir: "dist",
                preserveModules: true,
                preserveModulesRoot: "src",
            },
        ],
        external: [/node_modules/, "tslib"],
        plugins: [
            resolve(),
            commonjs(),
            external(),
            typescript({
                tsconfig: "./tsconfig.build.json",
                exclude: ["**/__deprecated__/"],
            }),
            postcss({
                config: {
                    path: "./postcss.config.js",
                },
            }),
            terser(),
            copy({
                targets: [
                    { src: "assets/**/*", dest: "dist/assets" }, // copies all files from assets to dist/assets
                ],
                // Optional: set copyOnce: true to only copy on first build (for watch mode)
                // copyOnce: true,
            }),
        ],
    },
    {
        input: ["./dist/dts/index.d.ts"],
        output: [{ file: "./dist/index.d.ts", format: "es" }],
        plugins: [dts(), del({ hook: "buildEnd", targets: "./dist/dts" })],
        external: [/\.css$/u], // HACK: Fix for this problem https://github.com/Swatinem/rollup-plugin-dts/issues/165]
    },
];

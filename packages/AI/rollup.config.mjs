import commonjs from "@rollup/plugin-commonjs";
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
        external: [/node_modules/, /@tanstack\/ai-react/, "tslib"],
        plugins: [
            commonjs(),
            typescript({
                tsconfig: "./tsconfig.build.json",
                exclude: ["**/__deprecated__/"],
            }),
            postcss({
                config: {
                    path: "./postcss.config.js",
                },
                extract: false,
                extensions: [".css"],
                minimize: false,
                sourceMap: true,
                modules: true,
            }),
            {
                name: "Custom Rollup Plugin`",
                generateBundle: (options, bundle) => {
                    Object.entries(bundle).forEach((entry) => {
                        if (!entry[0].match(/.*(.css.js)$/)) {
                            return;
                        }

                        bundle[entry[0]].code = entry[1].code.replace(
                            /".*\/node_modules\/.*\/style-inject.es.js"/,
                            '"style-inject"'
                        );
                    });
                },
            },
            external(),
            resolve(),
            terser(),
        ],
    },
    {
        input: ["./dist/dts/index.d.ts"],
        output: [{ file: "./dist/index.d.ts", format: "es" }],
        plugins: [dts(), del({ hook: "buildEnd", targets: "./dist/dts" })],
        external: [/\.css$/u],
    },
];

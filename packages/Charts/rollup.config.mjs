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
        external: [/node_modules/, "tslib"],
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
                extract: "niagads-ui.css",
                extensions: [".css"],
                minimize: false, // when minimized not all the tailwind classes get exported
                sourceMap: true,
                modules: false,
            }),
            {
                name: "Custom Rollup Plugin`",
                generateBundle: (options, bundle) => {
                    Object.entries(bundle).forEach((entry) => {
                        // early return if the file we're currently looking at doesn't need to be acted upon by this plugin
                        if (!entry[0].match(/.*(.css.js)$/)) {
                            return;
                        }

                        // this line only runs for .scss.js files, which were generated by the postcss plugin.
                        // depending on the use-case, the relative path to style-inject might need to change
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
        plugins: [dts()],
        external: [/\.css$/u], // HACK: Fix for this problem https://github.com/Swatinem/rollup-plugin-dts/issues/165]
    },
];

import path from "node:path";
import resolve from "@rollup/plugin-node-resolve";
import size from "rollup-plugin-bundle-size";
import strip_comments from "strip-comments";
import terser from "@rollup/plugin-terser";
import typescript from '@rollup/plugin-typescript';

const terser_options = {
    output: {
        comments: false
    },
    compress: {
        passes: 5,
        ecma: 2020,
        drop_console: false,
        drop_debugger: true,
        pure_getters: true,
        arguments: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_methods: true
    }
};

const plugins = [
    resolve(),
    typescript(),
    remove_comments(),
    trim_ws(),
    size()
];

export default [{
    input: "src/hotkey.ts",
    output: [{
        file: "dist/hotkey.esm.js",
        format: "esm"
    }, {
        file: "dist/hotkey.esm.min.js",
        format: "esm",
        plugins: [terser(terser_options)]
    }, {
        name: "window",
        file: "dist/hotkey.js",
        format: "iife",
        extend: true
    }, {
        name: "window",
        file: "dist/hotkey.min.js",
        format: "iife",
        extend: true,
        plugins: [terser(terser_options)]
    }],
    plugins
}]

function remove_comments() {
    return {
        name: "strip",
        transform(source) {
            return {
                code: strip_comments(source, {})
            };
        }
    };
}

function trim_ws() {
    return {
        name: "trim-ws",
        generateBundle(options, bundle) {
            if (options.file.match(/\.js$/)) {
                const key = path.basename(options.file);
                bundle[key].code = bundle[key].code.trim();
            }
        }
    };
}

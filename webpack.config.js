const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ExtensionReloaderPlugin = require("webpack-ext-reloader");

const mode = process.env.NODE_ENV;
const targetBrowser = process.env.TARGET_BROWSER;

module.exports = {
    mode,
    devtool: "inline-source-map",
    entry: {
        "content-script": "./src/my-content-script.js",
        background: "./src/my-background.js",
        popup: "./src/popup.js",
    },
    output: {
        publicPath: ".",
        path: path.resolve(__dirname, "dist/", targetBrowser),
        filename: "[name].bundle.js",
        libraryTarget: "umd",
    },
    resolve: {
        alias: {
            "webextension-polyfill-ts": path.resolve(
                path.join(__dirname, "node_modules", "webextension-polyfill")
            ),
        },
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [
                path.join(
                    process.cwd(),
                    path.resolve(__dirname, "dist/", targetBrowser)
                ),
            ],
            cleanStaleWebpackAssets: false,
            verbose: true,
        }),
        new ExtensionReloaderPlugin({
            // entries: {
            //     contentScript: "content-script",
            //     background: "background",
            //     extensionPage: "popup",
            // },
            port: targetBrowser === "chrome" ? 9090 : 9091,
            reloadPage: true,
            manifest: path.resolve(__dirname, "manifest.json"),
        }),

        new MiniCssExtractPlugin({ filename: "style.css" }),
        new CopyWebpackPlugin({
            patterns: [
                { from: "manifest.json" },
                { from: "./src/some-asset.txt" },
                { from: "./src/popup.html" },
                { from: "./icons" },
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [require("@babel/preset-env")],
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    "css-loader",
                ],
            },
            {
                test: /\.txt$/,
                use: "raw-loader",
            },
        ],
    },
};

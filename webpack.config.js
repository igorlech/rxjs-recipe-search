const path = require('path');
const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const isProduction = process.env.NODE_ENV == 'production';
const isLocalhost = process.env.NODE_ENV == 'localhost';

console.log('NODE_ENV:', process.env.NODE_ENV);

const config = {
    entry: './src/main.ts',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        plugins: [new TsconfigPathsPlugin()],
    },
    output: {
        path: path.resolve(__dirname, './wwwroot'),
        chunkFilename: '[chunkhash].js',
        publicPath: '/rxjs-recipe-search/',
    },
    devServer: {
        open: true,
        host: 'localhost',
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './src/index.html' }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/assets', to: 'assets' },
                { from: 'src/favicon.ico', to: '' },
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(svg)/,
                type: 'asset/inline',
            },
            {
                test: /\.(jpg|gif|png)/,
                type: 'asset/resource',
            },
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
            },
            {
                test: /\.(s?)css$/i,
                use: [isLocalhost ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
            },
            {
                // test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                test: /\.(eot|svg|ttf|woff|woff2)$/i,
                type: 'asset',
            },
        ],
    },
};

module.exports = () => {
    if (!isLocalhost) {
        config.plugins.push(
            new MiniCssExtractPlugin({
                chunkFilename: '[chunkhash].css',
            })
        );
    }

    if (isProduction) {
        config.devtool = false; // 'sourece-map'
        config.mode = 'production';
        config.performance = {
            hints: 'warning',
            maxEntrypointSize: 256000,
            maxAssetSize: 256000,
        };
    } else {
        config.devtool = 'eval-source-map';
        config.mode = 'development';
        config.performance = { hints: false };
    }

    return config;
};

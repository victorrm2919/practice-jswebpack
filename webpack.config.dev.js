const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
    mode: 'development',
    entry: './src/index.js', //Punto de entrada de la aplicacion
    output: {
        path: path.resolve(__dirname, 'dist'), //path donde se guarda el proyecto con webpack
        filename: '[name].[contenthash].js', //nombre del archivo resultante
        assetModuleFilename: 'assets/images/[hash][ext][query]'
    },
    resolve: {
        extensions: ['.js'], //Que extensiones trabaja webpack
        alias: {
            '@utils': path.resolve(__dirname, 'src/utils/'), //ubicacion de la carpeta
            '@templates': path.resolve(__dirname, 'src/templates/'), //ubicacion de la carpeta
            '@styles': path.resolve(__dirname, 'src/styles/'), //ubicacion de la carpeta
            '@images': path.resolve(__dirname, 'src/assets/images/'), //ubicacion de la carpeta
        }
    },
    module: {
        rules: [
            { //Intregracion de babel, babel-loader
                test: /\.m?js$/,  //Expresion regular, donde archivos .m o .js son los archivos a trabajar
                exclude: /node_modules/, //Carpeta a excluir
                use: {
                    loader: 'babel-loader' //Que loader
                }
            },
            { //Configuracion loader css
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader,
                    'css-loader'
                ],
            },
            {
                test: /\.png/,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2)$/,
                type: 'asset/resource',
                generator: {
                    filename: "assets/fonts/[name].[contenthash].[ext]"
                }
            }
        ]
    },
    plugins: [ //Configuracion para html webpack plugin
        new HtmlWebpackPlugin({
            inject: true,
            template: './public/index.html',
            filename: './index.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'assets/[name].[contenthash].css'
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src", "assets/images"), //En from se puede mover una carpeta o solo un archivo
                    to: "assets/images"
                }
            ]
        }),
        new Dotenv(),
    ],
};

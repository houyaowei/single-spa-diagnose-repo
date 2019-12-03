const webpack = require("webpack");
const path = require("path");
const getRules = require("./webpack-common.loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const config = {
		mode: "development",
		context: path.join(__dirname, "src/"),
		entry: {
				app: "./app/app.js",
				portal: "./app/portal.js"
		},

		// 配置模块如何解析
		resolve: {
				extensions: [".js"],
		},

		// 文件导出的配置
		output: {
				path: path.join(__dirname, "/portal"),
				filename: "[name].js",
				library: "portal"
		},
		plugins: [
				// 将样式文件 抽取至独立文件内
				new MiniCssExtractPlugin({filename: "app-[contenthash:20].min.css", allChunks: true, disable: false}),

				// 将文件复制到构建目录 CopyWebpackPlugin->
				// https://github.com/webpack-contrib/copy-webpack-plugin
				new CopyWebpackPlugin([
						{
								from: path.join(__dirname, "/src/favicon.ico"),
								to: "",
								toType: "file"
						}, {
								from: "assets/lib/",
								to: "libs/",
								force: true
						}
				]),

				// 配置环境变量
				new webpack.DefinePlugin({
						"process.env": {
								NODE_ENV: JSON.stringify("development")
						}
				}),

				// 首页
				new HtmlWebpackPlugin({
						template: "index.html",
						excludeChunks: ["login"],
						chunks: [
								"app", "main"
						],
						chunksSortMode: "manual"
				}),
				// 打包分析
				new BundleAnalyzerPlugin({
						// 是否启动后打开窗口
						openAnalyzer: false
				}),
				new webpack.HotModuleReplacementPlugin()
		],
		node: {
				fs: "empty"
		},
		// 处理项目中的不同类型的模块
		module: {
				rules: getRules()
		},
		externals: [],
		devServer: {
				contentBase: [
						__dirname + "/dist"
				],
				headers: {
						"Access-Control-Allow-Origin": "*"
				}
		}
};

module.exports = config;

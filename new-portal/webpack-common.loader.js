const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = () => {
	return [
		{
			parser: {
				System: false
			}
		},
		{
			enforce: "pre",
			test: /\.js$/,
			include: [path.join(__dirname, "src")],
			exclude: /node_modules/
		},
		{
			test: /\.js$/,
			exclude: /(node_modules|bower_components)/,
			use: ["babel-loader"]
		},
		{
			test: /\.(le|c)ss/,
			use: [
				{
					loader: MiniCssExtractPlugin.loader
				},
				{
					loader: "css-loader",
					options: {
						url: true, // 启用/禁用 url() 处理
						sourceMap: true // 启用/禁用 Sourcemaps
					}
				},
				{
					loader: "postcss-loader"
				},
				{
					loader: "resolve-url-loader"
				},
				{
					loader: "less-loader",
					options: {
						sourceMap: false // 启用/禁用 Sourcemaps
					}
				}
			]
		},
		{
			test: /(\.tpl\.html$|login\.html|loginout\.html|timeout\.html|wxLogin\.html)/,
			use: [
				{
					loader: "html-loader",
					options: {
						query: { interpolate: true },
						minimize: true,
						removeComments: false,
						collapseWhitespace: false
					}
				}
			],
			exclude: /(node_modules|bower_components)/,
			include: path.join(__dirname, "src")
		},
		{
			test: /((?!tpl).)*\.html$/,
			use: {
				loader: "file-loader",
				options: {
					name: "[path][name]-[hash:20].[ext]"
				}
			},
			exclude: /(node_modules|bower_components|index|login|login_loading|wxLogin\.html)/,
			include: path.join(__dirname, "src")
		},
		{
			test: /\.(jpe?g|png|gif|svg)$/i,
			use: [
				{
					loader: "file-loader",
					options: {
						name: "[path][name]-[hash:20].[ext]"
					}
				}
			]
		}
	];
};

const path = require("path");
const ContextReplacementPlugin = require("webpack/lib/ContextReplacementPlugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    entry: "src/singleSpaEntry.js",
    store: "src/reducers/store.js"
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "release"),
    libraryTarget: "amd",
    library: "a1App"
  },
  devServer: {
    disableHostCheck: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  },
  module: {
    rules: [
      {
        parser: {
          System: false
        }
      },
      {
        test: /\.js?$/,
        exclude: [path.resolve(__dirname, "node_modules")],
        loader: "babel-loader"
      },
      {
        test: /\.html$/,
        exclude: /node_modules|svelte/,
        loader: "html-loader"
      },
       {
        test: /\.css/,
        use: ["style-loader", "css-loader"]
      },
       {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: "application/octet-stream"
            }
          }
        ]
      },
       {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader:"file-loader"
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name]-[hash:8].[ext]',
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".js"],
    modules: [__dirname, "node_modules"]
  },
  devtool: "eval-source-map",
  externals: [],
  plugins: [
    new CopyWebpackPlugin([
      {
        from: "src/singleSpaEntry.js"
      }
    ])
  ]
};

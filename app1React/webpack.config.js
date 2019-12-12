const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "eval-source-map",

  entry: {
    entry: "./src/entry.js"
    // store: "./src/store.js"
  },

  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "release"),
    library: "reactApp",
    libraryTarget: "amd"
  },
  devServer: {
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
      }, {
        test: /\.js/,
        use: ["babel-loader?cacheDirectory"],
        exclude: /node_modules/
      }, {
        test: /\.css/,
        use: ["style-loader", "css-loader"]
      }, {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              publicPath: "/reactApp/"
            }
          }
        ]
      }
    ]
  },
  plugins: [new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "src/entry.js"),
        to: "/"
      }
    ])]
};

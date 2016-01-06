"use strict";

var path =    require("path");
var webpack = require("webpack");

module.exports = {
  entry: [
    "webpack-hot-middleware/client",
    path.resolve(__dirname, "src", "app.js")
  ],
  module: {
    loaders: [
      { // babel
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel"
      },
      { // CSS
        test: /\.css$/,
        loader: "style!css"
      },
      { // SASS
        test: /\.scss$/,
        loader: "style!css!sass"
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: "url?limit=10000"
      },
      {
        test: /\.html$/, loader: "html"
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  output: {
    path: path.resolve(__dirname, "public"),
    publicPath: "/",
    filename: "app.js"
  }
};

"use strict";

const compression = require("compression");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const UIPORT = process.env.UIPORT || 4001;

// 调试环境，加载webpack的调试中间价
if (process.env.NODE_ENV !== "production") {
  console.log("Development Mode");
  console.log("Using webpack-dev-middleware");
  console.log("Using webpack-hot-middleware");

  const bs                   = require("browser-sync");
  const webpack              = require("webpack");
  const webpackDevMiddleware = require("webpack-dev-middleware");
  const webpackHotMiddleware = require("webpack-hot-middleware");
  const webpackConfig        = require("./webpack.config.dev");
  let compiler = webpack(webpackConfig);

  bs.init({
    port: PORT,
    ui: {
      port: UIPORT
    },
    server: {
      baseDir: "public",
      middleware: [
        webpackDevMiddleware(compiler, {
          publicPath: webpackConfig.output.publicPath,
          noInfo: true, // display no info to console (only warnings and errors)
          quiet: false, // display nothing to the console
          stats: {
            colors: true
          }
        }),
        webpackHotMiddleware(compiler)
      ]
    },
    files: [
      "public/*"
    ]
  }, function () {
    console.log (`listenning on ${PORT}`);
  });

  /*
  let compiler = webpack(webpackConfig);

  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    noInfo: true, // display no info to console (only warnings and errors)
    quiet: false, // display nothing to the console
    stats: {
      colors: true
    }
  }));
  app.use(webpackHotMiddleware(compiler));
  */
} else {
  console.log("Production Mode");
  app.use(compression());

  app.use(express.static(__dirname + "/public"));

  // 404 服务
  app.use((req, res, next) => {
    var err = new Error("Page Not Found");
    err.status = 404;
    next(err);
  });

  // 500 服务
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.end(`message: ${err.message}`);
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log (`listenning on ${PORT}`);
  });
}

"use strict";

let express = require("express");
let compression = require("compression");
let app = express();

// 调试环境，加载webpack的调试中间价
if (process.env.NODE_ENV !== "production") {
  console.log("Development mode, using webpack-dev-middleware");

  let webpack              = require("webpack");
  let webpackDevMiddleware = require("webpack-dev-middleware");
  let webpackHotMiddleware = require("webpack-hot-middleware");
  let webpackConfig        = require("./webpack.config.dev");

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
}

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


let PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log (`listenning on ${PORT}`);
});

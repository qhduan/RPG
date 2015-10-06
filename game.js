/*

Online A-RPG Game, Built using JavaScript
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/
"use strict";

var fs = require("fs");
var grunt = require("grunt");
var babel = require("babel-core");

grunt.tasks(["babel"], {}, function () {
  // 把文件合并
  grunt.tasks(["concat"]);

  grunt.tasks(["watch"]);

  // 监视grunt-contrib-watch的事件，重新编译指定文件
  // 如果直接运行babel命令，会把所有文件都重新编译，很慢
  grunt.event.on("watch", function (action, filepath, target) {
    var outputPath = filepath.replace("src", "data/js");
    babel.transformFile(filepath, { sourceMap: "inline" }, function (err, result) {
      if (err) throw err;
      // 保存转换好的代码
      fs.writeFile(outputPath, result.code, { encoding: "utf8" }, function (err) {
        if (err) throw err;
        console.log("babel compiled", filepath, outputPath);
      });
      // 把文件合并
      grunt.tasks(["concat"]);
      // 把转换好的map保存
      fs.writeFile(outputPath + ".map", JSON.stringify(result.map), { encoding: "utf8" }, function (err) {
        if (err) throw err;
      });
    });
  });

  console.log("\nGrunt Done, Game Starting...\n");

  var express = require("express");
  var compression = require("compression");

  var app = express();
  app.use(compression());
  app.use(express.static("data/"));

  var PORT = 9000;

  app.listen(PORT, function () {
    console.log("Game Flying at ", PORT);
  });

});

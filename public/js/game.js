/*

A-RPG Game, Built using Node.js + JavaScript + ES6
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

(function () {
  "use strict";

  // root级别api入口
  var Game = window.Game = {
    items: {}, // 物品的缓冲
    resources: {}, // 保存所有音频，图像等，结构为 { src: object }
    config: { // 保存所有设置（默认设置）
      walk: 4, // 角色行走速度
      run: 8, // 角色跑动速度
      width: 800, // 渲染窗口的原始大小
      height: 450,
      scale: false }
  };

  // 如果为true，则在下一次tick事件后会调用stage.update，然后再自动置为false
  // 如果不拉伸，那么无论浏览器窗口多大，都是原始大小；拉伸则按比例填满窗口
  var updateStageNextTick = false;

  Game.update = function () {
    //updateStageNextTick = true;
  };

  Game.preload = function (resources, callback) {

    // image.json中包含一些游戏无论如何都需要的图片，所以必须加载
    resources = ["/image.json"].concat(Object.keys(resources));

    // 排除已经有了的图片
    resources = resources.filter(function (element) {
      if (Game.resources.hasOwnProperty(element)) return false;
      return true;
    });

    // 如果所有图片都有了，就立刻回调
    if (resources.length <= 0) {
      return callback();
    }

    // 进度条
    var con = document.getElementById("ProgressBar");
    var bar = document.getElementById("ProgressBarInner");
    var second = 0;
    var opacity = 100;
    var start = new Date().getTime();
    con.style.zIndex = 999;
    con.style.opacity = 1;
    bar.style.width = "20%";
    bar.innerHTML = "";

    // 新建队列
    var queue = new Sprite.Loader();

    // 向进度条反馈进度
    queue.on("progress", function (event) {
      var progress = queue.progress;
      var now = new Date().getTime();

      var second = (now - start) / 1000;

      progress *= 80;
      progress += 20;
      progress = progress.toFixed(0) + "%";

      // 更新进度条
      bar.style.width = progress;
      bar.innerHTML = second.toFixed(2) + "s " + progress;
    });

    queue.on("complete", function () {

      (function HideLoadingBar() {
        opacity -= 10;
        con.style.opacity = opacity / 100;
        if (opacity <= 0) {
          con.style.zIndex = -999;
        } else {
          setTimeout(HideLoadingBar, 25);
        }
      })();

      resources.forEach(function (element) {
        var obj = Sprite.Cache[element];
        Game.resources[element] = obj;

        // 把image.json中的base64 data uri的图片转换为DOM element
        if (element == "/image.json") {
          for (var key in obj) {
            var image = new Image();
            image.src = obj[key];
            Game.resources[key] = image;
          }
        }
      });
      callback();
    });

    resources.forEach(function (element) {

      if (element.indexOf(".ogg") != -1) {
        var a = new Audio();
        if (a.canPlayType("audio/ogg").length) {
          queue.add(element);
        } else if (a.canPlayType("audio/mpeg").length) {
          queue.add(element.replace(".ogg", ".mp3"));
        }
      } else {
        queue.add(element);
      }
    });

    queue.start();
  };

  Game.init = function () {

    Game.stage = new Sprite.Stage(Game.config.width, Game.config.height);
    document.body.appendChild(Game.stage.canvas);
    Game.stage.canvas.style.position = "fixed";

    Game.mapLayer = new Sprite.Container();
    Game.mapLayer.name = "mapLayer";

    Game.actorLayer = new Sprite.Container();
    Game.actorLayer.name = "actorLayer";

    Game.itemLayer = new Sprite.Container();
    Game.itemLayer.name = "itemLayer";

    Game.heroLayer = new Sprite.Container();
    Game.heroLayer.name = "heroLayer";

    Game.spellLayer = new Sprite.Container();
    Game.spellLayer.name = "spellLayer";

    Game.dialogueLayer = new Sprite.Container();
    Game.dialogueLayer.name = "dialogueLayer";

    Game.uiLayer = new Sprite.Container();
    Game.uiLayer.name = "uiLayer";

    Game.stage.appendChild(Game.mapLayer, Game.actorLayer, Game.itemLayer, Game.heroLayer, Game.spellLayer, Game.dialogueLayer, Game.uiLayer);

    /*
    Sprite.Ticker.on("tick", function () {
      if (updateStageNextTick) {
        Game.stage.update();
        updateStageNextTick = false;
      }
    });
    */

    var fps = 0;
    var start = new Date().getTime();

    function update() {
      if (Game.stage.update()) fps++;

      //window.requestAnimationFrame(update);
    }

    setInterval(function () {
      var now = new Date().getTime();
      var f = fps / ((now - start) / 1000);
      fps = 0;
      start = now;
      //console.log(f);
      document.getElementById("fps").innerHTML = f.toFixed(2);
    }, 500);

    setInterval(update, 20);
    //window.requestAnimationFrame(update);

    console.log("RPG Game Flying!");
  };
})();
//# sourceMappingURL=game.js.map

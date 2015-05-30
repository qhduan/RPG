/*

Online A-RPG Game, Built using Node.js + createjs
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

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  "use strict";

  // root级别api入口
  var Game = window.Game = {
    items: {}, // 物品的缓冲
    resources: {}, // 保存所有音频，图像等，结构为 { src: object }
    config: { // 保存所有设置（默认设置）
      walk: 4, // 角色行走速度
      run: 8, // 角色跑动速度
      width: 960, // 渲染窗口的大小，更大的大小是经过收缩的
      height: 540
    }
  };

  Game.EventClass = (function () {
    function EventClass() {
      _classCallCheck(this, EventClass);

      this.listeners = {};
      this.once = {};
    }

    _createClass(EventClass, [{
      key: "on",
      value: function on(event, callback) {
        if (this.once[event]) return callback(this);

        if (!this.listeners[event]) this.listeners[event] = {};

        var id = uuid.v4();
        this.listeners[event][id] = callback;
      }
    }, {
      key: "off",
      value: function off(event, id) {
        if (this.listeners[event] && this.listeners[event][id]) {
          delete this.listeners[event][id];
          return true;
        }
        return false;
      }
    }, {
      key: "emit",
      value: function emit(event, once) {
        if (this.listeners[event]) {
          for (var key in this.listeners[event]) {
            this.listeners[event][key](this);
          }
        }
        if (once) {
          this.once[event] = true;
        }
      }
    }]);

    return EventClass;
  })();

  // 如果为true，则在下一次tick事件后会调用stage.update，然后再自动置为false
  var updateStageNextTick = false;

  Game.update = function () {
    updateStageNextTick = true;
  };

  var oninitCallbackList = [];
  var inited = false;

  Game.oninit = function (callback) {
    if (inited) callback();else oninitCallbackList.push(callback);
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

    // 新建队列，加载sound插件
    var queue = new createjs.LoadQueue(true);
    queue.installPlugin(createjs.Sound);

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
        var obj = queue.getResult(element);
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
    }, this);

    resources.forEach(function (element) {

      if (element.indexOf(".ogg") != -1) {
        var a = new Audio();
        if (a.canPlayType("audio/ogg").length) {
          queue.loadFile({
            src: element
          });
        } else if (a.canPlayType("audio/mpeg").length) {
          queue.loadFile({
            src: element.replace(".ogg", ".mp3")
          });
        }
      } else {
        queue.loadFile({
          src: element
        });
      }
    });
  };

  Game.init = function () {

    createjs.Ticker.framerate = 60;
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;

    var canvasObj = document.getElementById("game");
    canvasObj.width = Game.config.width;
    canvasObj.height = Game.config.height;
    Game.stage = new createjs.Stage(canvasObj);
    Game.stage.enableMouseOver(10);
    createjs.Touch.enable(Game.stage);

    Game.mapLayer = new createjs.Container();
    Game.mapLayer.name = "mapLayer";

    Game.actorLayer = new createjs.Container();
    Game.actorLayer.name = "actorLayer";

    Game.itemLayer = new createjs.Container();
    Game.itemLayer.name = "itemLayer";

    Game.heroLayer = new createjs.Container();
    Game.heroLayer.name = "heroLayer";

    Game.playerLayer = new createjs.Container();
    Game.playerLayer.name = "playerLayer";

    Game.spellLayer = new createjs.Container();
    Game.spellLayer.name = "spellLayer";

    Game.dialogueLayer = new createjs.Container();
    Game.dialogueLayer.name = "dialogueLayer";

    Game.uiLayer = new createjs.Container();
    Game.uiLayer.name = "uiLayer";

    Game.stage.addChild(Game.mapLayer, Game.actorLayer, Game.itemLayer, Game.heroLayer, Game.playerLayer, Game.spellLayer, Game.dialogueLayer, Game.uiLayer);

    createjs.Ticker.on("tick", function () {
      if (updateStageNextTick) {
        Game.stage.update();
        updateStageNextTick = false;
      }
    });

    CalculateWindowSize();
    window.addEventListener("resize", function () {
      CalculateWindowSize();
    });

    inited = true;
    oninitCallbackList.forEach(function (element) {
      element();
    });

    console.log("RPG Game Flying!");
  };

  // 当窗口大小改变时改变游戏窗口大小
  function CalculateWindowSize() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    var ratio = Game.config.width / Game.config.height;

    // width first
    var w = width;
    var h = w / ratio;

    // then height
    if (h > height) {
      h = height;
      w = h * ratio;
    }

    w = parseInt(w);
    h = parseInt(h);
    var left = (width - w) / 2;

    Game.stage.canvas.style.left = left.toFixed(0) + "px";

    var scale = Math.min(w / Game.config.width, h / Game.config.height);

    if (w < Game.config.width || h < Game.config.height) {
      w = Game.config.width;
      h = Game.config.height;
      scale = 1;
    }

    //Game.stage.setTransform(0, 0, scale, scale);
    Game.stage.scaleX = scale;
    Game.stage.scaleY = scale;
    Game.stage.canvas.width = w;
    Game.stage.canvas.height = h;

    if (Game.hero) Game.hero.focus();

    Game.stage.update();
  };
})();
//# sourceMappingURL=game.js.map
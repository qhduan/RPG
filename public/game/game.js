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
(function () {
  "use strict";

  // root级别api入口
  var Game = window.Game = {
    items: {}, // 物品的缓冲
    areas: {}, // 缓存所有地图和地图对象，结构为 { areaId: areaObj }
    resources: {}, // 保存所有音频，图像等，结构为 { src: object }
    config: { // 保存所有设置（默认设置）
      walk: 4, // 角色行走速度
      run: 8, // 角色跑动速度
      getSpeed: function () {
      },
      width: 800, // 渲染窗口的大小，更大的大小是经过收缩的
      height: 450
    }
  };
  // 如果为true，则在下一次tick事件后会调用stage.update，然后再自动置为false
  var updateStageNextTick = false;

  Game.updateStage = function () {
    updateStageNextTick = true;
  };

  var oninitCallbackList = [];
  var inited = false;

  Game.oninit = function (callback) {
    if (inited) callback();
    else oninitCallbackList.push(callback);
  };

  Game.preload = function (resources, callback) {

    var con = document.getElementById("TopLoadingBarCon");
    var bar = document.getElementById("TopLoadingBarInner");
    var second = 0;
    var opacity = 100;
    var start = new Date().getTime();
    con.style.zIndex = 999;
    con.style.opacity = 1;

    resources = resources.filter(function (element) {
      if (Game.resources.hasOwnProperty(element.src))
        return false;
      return true;
    });

    if (resources.length <= 0)
      return callback();

    var queue = new createjs.LoadQueue(true);
    queue.installPlugin(createjs.Sound);

    queue.on("progress", function (event) {
      var progress = queue.progress;
      var now = new Date().getTime();

      var second = (now - start) / 1000;

      progress *= 100;
      progress = progress.toFixed(0) + "%";

      // 更新进度条
      bar.style.width = progress;
      bar.innerHTML = second.toFixed(2) + "s " + progress;
    });

    queue.on("complete", function() {

      function HideLoadingBar() {
        opacity -= 10;
        con.style.opacity = opacity / 100;
        if (opacity <= 0) {
          con.style.zIndex = -999;
        } else {
          setTimeout(HideLoadingBar, 25);
        }
      }
      HideLoadingBar();

      resources.forEach(function (element) {
        var obj = queue.getResult(element);
        Game.resources[element] = obj;
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
  function CalculateWindowSize () {
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

    Game.width = w;
    Game.height = h;

    Game.stage.canvas.style.left = left.toFixed(0) + "px";

    var scale = Math.min(
      w / Game.config.width,
      h / Game.config.height
    );

    Game.stage.setTransform(0, 0, scale, scale);
    Game.stage.canvas.width = w;
    Game.stage.canvas.height = h;

    if (Game.hero) Game.hero.focus();

    Game.stage.update();

  };


})();

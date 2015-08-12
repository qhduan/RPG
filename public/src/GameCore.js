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
(function () {
  "use strict";

  // root级别api入口
  var Game = window.Game = {
    items: {
      // 保存items的Game.ItemClass对象缓存
    },
    config: { // 保存所有设置（默认设置）
      walk: 4, // 角色行走速度
      run: 8, // 角色跑动速度
      width: 800, // 渲染窗口的原始大小
      height: 480,
      scale: false, // 如果不拉伸，那么无论浏览器窗口多大，都是原始大小；拉伸则按比例填满窗口
      fps: 35, // 锁定fps到指定数值，如果设置为<=0，则不限制
    }
  };

  Game.ShowWindow = function (id) {
    var elements = document.getElementsByClassName("game-window");
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = "none";
    }
    if (id && document.getElementById(id)) {
      document.getElementById(id).style.display = "block";
    }
  }


  // 当窗口大小改变时改变游戏窗口大小
  Game.ResizeWindow = function () {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var scale = 1;
    var leftMargin = 0;
    var topMargin = 0;

    if (Game.config.scale == false) {
      // 不拉伸游戏窗口，按原始大小计算窗口居中
      leftMargin = Math.floor((width - Game.config.width) / 2);
      topMargin = Math.floor((height - Game.config.height) / 2);
    } else {
      // 拉伸游戏窗口，首先计算游戏原始大小比例
      var ratio = Game.config.width / Game.config.height;
      // width first
      var w = width;
      var h = w / ratio;
      // then height
      if (h > height) {
        h = height;
        w = h * ratio;
      }

      w = Math.floor(w);
      h = Math.floor(h);
      leftMargin = Math.floor((width - w) / 2);
      topMargin = Math.floor((height - h) / 2);

      scale = Math.min(
        w / Game.config.width,
        h / Game.config.height
      );
    }

    // html窗口拉伸（css中控制了原始大小）
    var elements = document.getElementsByClassName("game-window");
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.transformOrigin = "0 0";
      elements[i].style.transform = `scale(${scale}, ${scale})`;
      elements[i].style.left = `${leftMargin}px`;
      elements[i].style.top = `${topMargin}px`;
    }
    // 游戏画布拉伸
    if (Game.stage && Game.stage.canvas) {
      Game.stage.canvas.style.transformOrigin = "0 0";
      Game.stage.canvas.style.transform = `scale(${scale}, ${scale})`;
      Game.stage.canvas.style.left = `${leftMargin}px`;
      Game.stage.canvas.style.top = `${topMargin}px`;
    }

    if (Game.hero) {
      Game.hero.focus();
    }

  };

  Game.ResizeWindow();
  window.addEventListener("resize", function () {
    Game.ResizeWindow();
  });

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

    Game.skillLayer = new Sprite.Container();
    Game.skillLayer.name = "skillLayer";

    Game.dialogueLayer = new Sprite.Container();
    Game.dialogueLayer.name = "dialogueLayer";

    Game.stage.appendChild(
      Game.mapLayer,
      Game.actorLayer,
      Game.itemLayer,
      Game.heroLayer,
      Game.skillLayer,
      Game.dialogueLayer
    );

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

    function update () {
      if (Game.stage.update())
        fps++;

      //window.requestAnimationFrame(update);
    }

    setInterval(function () {
      var now = new Date().getTime();
      var f = fps / ((now - start)/1000);
      fps = 0;
      start = now;
      //console.log(f);
      document.getElementById("fps").innerHTML = f.toFixed(2);
    }, 500);

    if (Game.config.fps > 0) {
      setInterval(update, Math.floor(1000 / Game.config.fps));
    } else {
      setInterval(update, 0);
    }


    //window.requestAnimationFrame(update);

    Game.ResizeWindow();

    console.log("RPG Game Flying!");
  };



})();

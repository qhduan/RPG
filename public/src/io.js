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

  // 封装socket.io client的一些功能
  Game.io = {
    getList: {}
  };



  Game.io.hit = function (spellId, actorIds) {
    Game.io.socket.emit("hit", {
      spellId: spellId,
      actorIds: actorIds
    });
  };

  function DamageHandle (data) {
    for (var key in data) {
      if (Game.area.actors[key])
        Game.area.actors[key].damage(data[key]);
      if (Game.area.heros[key])
        Game.area.heros[key].damage(data[key]);
    }
  }

  Game.io.updateHero = function (object) {
    Game.io.socket.emit("updateHero", {
      object: object
    });
  };

  Game.io.get = function (path, data, callback) {
    var id = uuid.v4();
    Game.io.getList[id] = callback;
    Game.io.socket.emit("get", {
      id: id,
      path: path,
      data: data
    });
  };

  function GetHandle (data) {
    if (Game.io.getList[data.id]) {
      Game.io.getList[data.id](data.data);
      delete Game.io.getList[data.id];
    } else {
      console.log(data);
      throw "GetHandle IO Error";
    }
  };

  Game.io.talk = function (talk) {
    Game.io.socket.emit("talk", talk);
  };

  Game.io.sync = function (type, data) {
    Game.io.socket.emit(type, data);
  };

  Game.io.init = function (callback) {

    // 从页面地址找到服务器地址，服务器地址就是web地址的hostname，但是没有path
    // 如果直接用io("/")的方法链接服务器，那么端口必须是80
    var url = (function GetServerURL () {
      var a = document.createElement("a");
      a.href = document.URL;
      var u = "http://" + a.hostname;
      if (a.port && a.port.length) {
        u += ":" + a.port;
      }
      return u;
    })();

    var socket = Game.io.socket = io(url);

    Game.io.socket.on("connect", function () {

      socket.on("disconnect", function () {
        alert("断开了服务器");
        window.location.href = "/";
      });

      socket.on("talk", function (data) {
        var id = data.id;
        if (Game.area.actors[id]) {
          Game.area.actors[id].popup(data.talk);
        }
        if (Game.area.heros[id]) {
          Game.area.heros[id].popup(data.talk);
        }
      });

      socket.on("damage", DamageHandle);

      socket.on("get", GetHandle);

      // 有角色（玩家，怪物，NPC）移动时的事件
      socket.on("move", function (data) {
        if (Game.area.heros[data.id]) {
          Game.area.heros[data.id].goto(
            data.data.x,
            data.data.y,
            data.data.speed,
            false
          );
        }
      });

      // 有角色（玩家或怪物）攻击时的事件
      socket.on("attack", function (data) {
        if (Game.area.heros[data.id]) {
          Game.area.heros[data.id].fire(
            data.data.num,
            data.data.direction
          );
        }
      });

      // 有玩家离开这个区域时的事件
      socket.on("removeHero", function (data) {
        for (var key in Game.area.heros) {
          if (key == data.id) {
            Game.area.heros[key].remove(Game.heroLayer);
          }
        }
      });

      // 有玩家登录这个区域时的事件
      socket.on("addHero", function (data) {
        var heroData = data.hero;

        var resources = {};
        for (var key in heroData.spells) {
          var spellData = heroData.spells[key];

          resources[spellData.image] = "image";
          resources[spellData.sound] = "sound";
        }

        // 加载这个hero所携带的资源（图片，技能图片，等）
        Game.preload(resources, function () {
          Game.drawHero(heroData.custom, function (heroImage) {
            heroData.image = heroImage;

            var heroObj = new Game.ActorClass(heroData);
            Game.area.heros[heroObj.id] = heroObj;
            heroObj.on("complete", function () {
              heroObj.draw(Game.heroLayer);
            });
          });
        });

      });

      callback();

      // 这个变量和下面的onbeforeunload事件用来控制firefox的一个bug
      // 如果触发了onbeforeunload事件则不响应disconnect事件，避免firefox提示内存泄漏
      window.onbeforeunload = function () {
        socket.off("disconnect");
        socket.close();
      };
    });
  };

})();

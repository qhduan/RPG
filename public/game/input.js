

~function () {
  "use strict";

  var keyTable = {
    "left": 37,
    "up": 38,
    "right": 39,
    "down": 40,
    "shift": 16
  };

  var pressed = {};

  // 封装Game.key.isPressed方法，用来检测某个案件是否按下
  // usage: if (Game.key.isPressed("left")) { /* true */ } else { /* false */ }
  Game.key = {
    isPressed: function (keyStr) {
      return pressed[keyTable[keyStr]];
    }
  };

  Game.stage.on("stagemousedown", function (event) {
    if (event.nativeEvent.button == 0) { // mouse left click
    }
  });

  Game.stage.on("stagemouseup", function (event) {
    if (event.nativeEvent.button == 0) { // mouse left click
    }
  });

  Game.stage.on("mouseleave", function (event) { // mouse leave canvas
  });

  window.addEventListener("keydown", function (event) {
    event = event || window.event;
    var keyCode = event.keyCode;

    pressed[keyCode] = true;
  });

  window.addEventListener("keyup", function (event) {
    event = event || window.event;
    var keyCode = event.keyCode;

    if (pressed.hasOwnProperty(keyCode)) {
      delete pressed[keyCode];
    }
  });

  createjs.Ticker.on("tick", function () {

    if (!Game.hero) return;
    if (!Game.currentMap) return;

    var speed = Game.config.walk;
    var skew = parseInt(Game.config.walk / 1.4);

    if (Game.key.isPressed("shift")) { // run key
      speed = Game.config.run;
      skew = parseInt(Game.config.run / 1.4);
    }

    var state;
    if (Game.key.isPressed("shift"))
      state = "run";
    else
      state = "walk";

    var moved = false;
    // 计算八个方向角色的动画和面向
    if (Game.key.isPressed("up") && Game.key.isPressed("right")) {
      moved = Game.hero.go(state + "up", skew);
      moved = Game.hero.go(state + "right", skew, false) || moved;
      if (!moved) Game.hero.face("up");
    } else if (Game.key.isPressed("down") && Game.key.isPressed("right")) {
      moved = Game.hero.go(state + "down", skew);
      moved = Game.hero.go(state + "right", skew, false) || moved;
      if (!moved) Game.hero.face("down");
    } else if (Game.key.isPressed("down") && Game.key.isPressed("left")) {
      moved = Game.hero.go(state + "down", skew);
      moved = Game.hero.go(state + "left", skew, false) || moved;
      if (!moved) Game.hero.face("down");
    } else if (Game.key.isPressed("up") && Game.key.isPressed("left")) {
      moved = Game.hero.go(state + "up", skew);
      moved = Game.hero.go(state + "left", skew, false) || moved;
      if (!moved) Game.hero.face("up");
    } else if (Game.key.isPressed("left")) {
      moved = Game.hero.go(state + "left", speed);
      if (!moved) Game.hero.face("left");
    } else if (Game.key.isPressed("up")) {
      moved = Game.hero.go(state + "up", speed);
      if (!moved) Game.hero.face("up");
    } else if (Game.key.isPressed("right")) {
      moved = Game.hero.go(state + "right", speed);
      if (!moved) Game.hero.face("right");
    } else if (Game.key.isPressed("down")) {
      moved = Game.hero.go(state + "down", speed);
      if (!moved) Game.hero.face("down");
    } else {
      Game.hero.stop();
    }

    Game.hero.focus();
  });


}();

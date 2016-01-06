/*

2D Game Sprite Library, Built using JavaScript ES6
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

/*

SpriteTween.get(Game.hero)
.promise( () => {
  return new Promise((resolve) => {
    Game.hero.goto(Game.hero.x, Game.hero.y + 5,"walk").then(resolve);
  })
})
.wait(2000)
.promise( () => {
  return new Promise((resolve) => {
    Game.hero.goto(Game.hero.x + 5, Game.hero.y, "walk").then(resolve);
  })
})
.to({alpha: 0}, 500)
.wait(500)
.to({alpha: 1}, 500)
.call( () => {
  Game.popup(Game.hero.sprite, "hello", 0, -50);
})
.wait(2000)
.call( () => {
  console.log("ok");
});


*/


/**
 * @fileoverview SpriteTween
 * @author mail@qhduan.com (QH Duan)
 */


"use strict";

import SpriteUtil from "./Util.js";
import SpriteEvent from "./Event.js";

let internal = SpriteUtil.namespace();

export default class SpriteTween extends SpriteEvent {

  static get (object) {
    return new SpriteTween(object);
  }

  constructor (object) {
    super();
    let privates = internal(this);
    privates.object = object;
    privates.callback = null;
    privates.action = [];
    privates.doing = false;
  }

  nextAction () {
    let privates = internal(this);
    if (privates.doing == false && privates.action.length > 0) {
      let action = privates.action[0];
      privates.action.splice(0, 1);
      switch (action.type) {
        case "to":
          this.toAction(action.attributes, action.time);
          break;
        case "wait":
          this.waitAction(action.time);
          break;
        case "call":
          this.callAction(action.callback);
          break;
        case "promise":
          this.promiseAction(action.callback);
          break;
        default:
          console.error(action);
          throw new Error("SpriteTween got invalid action");
      }
    }
  }

  toAction (attributes, time) {
    let privates = internal(this);
    privates.doing = true;

    let splice = Math.min(100, time);
    let t = time / splice;
    let step = {};

    for (let key in attributes) {
      if (Number.isFinite(attributes[key])) {
        step[key] = attributes[key] - privates.object[key];
        step[key] /= splice;
      }
    }

    let count = 0;
    let inter = setInterval(() => {
      count++;
      if (count >= splice) {
        for (let key in attributes) {
          privates.object[key] = attributes[key];
        }
        clearInterval(inter);
        privates.doing = false;
        this.nextAction();
      } else {
        for (let key in step) {
          privates.object[key] += step[key];
        }
      }
    }, t);
  }

  to (attributes, time) {
    internal(this).action.push({
      type: "to",
      attributes: attributes,
      time: time
    });
    this.nextAction();
    return this;
  }

  promiseAction (callback) {
    this.doing = true;
    callback().then(() => {
      this.doing = false;
      this.nextAction();
    });
  }

  promise (callback) {
    internal(this).action.push({
      type: "promise",
      callback: callback
    });
    this.nextAction();
    return this;
  }

  callAction (callback) {
    this.doing = true;
    callback();
    this.doing = false;
    this.nextAction();
  }

  call (callback) {
    internal(this).action.push({
      type: "call",
      callback: callback
    });
    this.nextAction();
    return this;
  }

  waitAction (time) {
    let privates = internal(this);
    privates.doing = true;
    setTimeout(() => {
      privates.doing = false;
      this.nextAction();
    }, time);
  }

  wait (time) {
    internal(this).action.push({
      type: "wait",
      time: time
    });
    this.nextAction();
    return this;
  }
}

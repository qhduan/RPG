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

/**
 * @fileoverview Sprite.Tween
 * @author mail@qhduan.com (QH Duan)
 */

(function () {
 "use strict";

  let internal = Sprite.Namespace();

  Sprite.assign("Tween", class SpriteTween extends Sprite.Event {

    static get (object) {
      return new Sprite.Tween(object);
    }

    constructor (object) {
      super();
      let privates = internal(this);
      privates.object = object;
      privates.callback = null;
    }

    to (attributes, time) {
      let privates = internal(this);

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
          if (privates.callback) {
            privates.callback();
          }
        } else {
          for (let key in step) {
            privates.object[key] += step[key];
          }
        }
      }, t);

      return this;
    }

    call (callback) {
      let privates = internal(this);
      if (callback) {
        privates.callback = callback;
      }
      return this;
    }

    wait (time) {
      return this;
    }
  });

})();

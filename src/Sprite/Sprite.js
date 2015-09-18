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
 * @fileoverview Define the Sprite in window, declare the Sprite.Base
 * @author mail@qhduan.com (QH Duan)
 */

(function () {
  "use strict";

  class SpriteCore {
    register (name, object) {
      Object.defineProperty(this, name, {
        enumerable: false,
        configurable: false,
        writable: false,
        value: object
      });

      return this;
    }
  };

  let Sprite = window.Sprite = new SpriteCore();

  /**
   * Function Sprite.Namespace, return an unique Private-Properties function
   * for javascript private properties need, for es6
   */
  Sprite.register("Namespace", function () {
    /**
     * Using closure variable store private properties
     * and different file have different "privateProperties"
     */
    let privateProperties = new WeakMap();
    return function (object) {
      if (privateProperties.has(object) == false) {
        privateProperties.set(object, {});
      }
      return privateProperties.get(object);
    };
  });

  /**
   * @param {number} N The min number
   * @param {number} M The max number
   * @return {number} A random integer N <= return < M, aka. [N, M)
   */
  Sprite.register("rand", function (N, M) {
    let r = M - N;
    r *= Math.random();
    return N + Math.floor(r);
  });

  /**
   * @param {Object} object The object we require copy
   * @return {Object} A deep copy of object
   */
  Sprite.register("copy", function (object) {
    return JSON.parse(JSON.stringify(object));
  });

  Sprite.register("each", function (obj, functional) {
    if (obj.forEach) {
      obj.forEach(functional);
    } else {
      for (let key in obj) {
        functional(obj[key], key, obj);
      }
    }
  });

  Sprite.register("uuid", function () {
    // generate a UUID
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/x|y/g, function (c) {
      let r = Math.floor(Math.random() * 16);
      if (c == "x") {
        return r.toString(16);
      } else {
        return (r & 0x03 | 0x08).toString(16);
      }
    });
  });

  Sprite.register("btoa", function (str) {
    // convert str to base64
    return window.btoa(unescape(encodeURIComponent(str)));
  });

  Sprite.register("atob", function (str) {
    // convert base64 str to original
    return decodeURIComponent(escape(window.atob(str)));
  });


})();

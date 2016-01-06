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
 * @fileoverview Define SpriteBitmap
 * @author mail@qhduan.com (QH Duan)
*/

"use strict";

export default class SpriteUtil {

  static timeout (ms) {
    return new Promise ( (resolve, reject) => {
      setTimeout(resolve, ms);
    });
  }

  /**
   * Function SpriteUtil.namespace, return an unique Private-Properties function
   * for javascript private properties need, for es6
   * @return {object} privates
  */
  static namespace () {
    /**
     * Using closure variable store private properties
     * and different file have different "privateProperties"
    */
    let privates = new WeakMap();
    return (object) => {
      if (privates.has(object) == false) {
        privates.set(object, {});
      }
      return privates.get(object);
    };
  }

  static uuid () {
    // generate a UUID
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/x|y/g, (c) => {
      let r = Math.floor(Math.random() * 16);
      if (c == "x") {
        return r.toString(16);
      } else {
        return (r & 0x03 | 0x08).toString(16);
      }
    });
  }

  static copy (obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  static btoa (str) {
    // convert str to base64
    return window.btoa(unescape(encodeURIComponent(str)));
  }

  static atob (str) {
    // convert base64 str to original
    return decodeURIComponent(escape(window.atob(str)));
  }

  /**
   * @param {number} N The min number
   * @param {number} M The max number
   * @return {number} A random integer N <= return < M, aka. [N, M)
  */
  static randInt (N, M) {
    let r = M - N;
    r *= Math.random();
    return N + Math.floor(r);
  }

}

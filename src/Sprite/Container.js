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
 * @fileoverview Class Sprite.Container, it's a general container
 * Contain Sprite.Sheet, Sprite.Bitmap, Sprite.Shape, Sprite.Text, Sprite.Frame or Sprite.Container
 * @author mail@qhduan.com (QH Duan)
 */

( () => {
 "use strict";

  let internal = Sprite.Util.namespace();

  /**
   * Contain everything which inherit from Sprite.Display
   * @class
  */
  class SpriteContainer extends Sprite.Display {

    /**
     * Construct Sprite.Container
     * @constructor
     */
    constructor () {
      super();
      let privates = internal(this);
      /**
       * Contain all children element
       * @private
       */
      privates.children = [];
      /**
       * Cached canvas
       */
      privates.cacheCanvas = null;
    }

    /**
     * @return {Array} Children array
     */
    get children () {
      return internal(this).children;
    }

    set children (value) {
      throw new Error("Sprite.Container.children readonly");
    }

    /**
     * @return {Object} Cached canvas
     */
    get cacheCanvas () {
      return internal(this).cacheCanvas;
    }

    set cacheCanvas (value) {
      throw new Error("Sprite.Container.cacheCanvas readonly");
    }

    /**
     * Remove canvas cache
     */
    clearCache () {
      internal(this).cacheCanvas = null;
    }

    /**
     * Prerender all children as cache
     * generate a just size cache
     */
    cache (width, height) {
      let privates = internal(this);
      if (privates.cacheCanvas) {
        this.clearCache();
      }
      let p = this.parent;
      this.parent = null;

      let canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      let context = canvas.getContext("2d");
      this.draw(context);
      privates.cacheCanvas = canvas;

      this.parent = p;
    }

    get cacheX () {
      return internal(this).cacheX;
    }

    set cacheX (value) {
      throw new Error("Sprite.Container.cacheX readonly");
    }

    get cacheY () {
      return internal(this).cacheY;
    }

    set cacheY (value) {
      throw new Error("Sprite.Container.cacheY readonly");
    }

    /**
     * Hit test
     */
    hitTest (x, y) {
      let privates = internal(this);
      if (this.cacheCanvas) {
        return super.hitTest(x, y);
      } else {
        let hitted = [];
        for (let child of this.children) {
          let ret = child.hitTest(x, y);
          if (ret instanceof Array) {
            hitted = hitted.concat(ret);
          } else if (ret === true) {
            hitted.push(child);
          }
        }
        return hitted;
      }
    }

    /**
     * Draw all children in this container on context
     * @param {Object} renderer Sprite.Webgl/Sprite.Canvas/Context
     */
    draw (renderer) {
      let privates = internal(this);
      if (this.alpha < 0.01 || this.visible != true) {
        return;
      }

      if (this.cacheCanvas) {
        let x = this.x;
        let y = this.y;
        this.x += privates.cacheX;
        this.y += privates.cacheY;
        this.drawImage(renderer, this.cacheCanvas,
          0, 0, this.cacheCanvas.width, this.cacheCanvas.height);
        this.x = x;
        this.y = y;
      } else {
        if (this.children.length > 0) {
          for (let child of this.children) {
            if (child.visible == true && child.alpha >= 0.01) {
              child.draw(renderer);
            }
          }
        }
      }
    }

    /**
    */
    hasChild (element) {
      if (this.children.indexOf(element) != -1) {
        return true;
      }
      return false;
    }

    /**
     * Append one or more children into container
     * eg. c.appendChild(childA) c.appendChild(childA, childB)
     * @param one or more children
     */
    appendChild () {
      let args = Array.prototype.slice.call(arguments);

      if (args.length <= 0) {
        throw new Error("Sprite.Container.appendChild got an invalid arguments");
      }

      for (let element of args) {
        if (element instanceof Sprite.Display == false) {
          console.error(element);
          throw new Error("Sprite.Container.appendChild only accept Sprite.Display or it's sub-class");
        }
        element.parent = this;
        this.children.push(element);
      }

      this.emit("addedChildren");
    }

    /**
     * Append one or more children into container at certain position
     * eg. c.appendChildAt(0, childA) c.appendChildAt(0, childA, childB)
     * @param one or more children
     */
    appendChildAt () {
      let args = Array.prototype.slice.call(arguments);

      if (args.length <= 1) {
        console.log(arguments, this);
        throw new TypeError("Sprite.Container.appendChildAt has an invalid arguments");
      }

      let index = args[0];
      for (let i = 1, len = args.length; i < len; i++) {
        if (args[i] instanceof Sprite.Display == false) {
          console.error(args[i]);
          throw new Error("Sprite.Container.appendChildAt only can accept Sprite.Display or it's sub-class");
        }
        args[i].parent = this;
        this.children.splice(index, 0, args[i]);
      }

      this.emit("addedChildren");
    }

    /**
     * Remove one child from a container
     * eg. c.removeChild(childA)
     * @param {Object} element The child you want to remove
     * @return {boolean} If found and removed element, return true, otherwise, false
     */
    removeChild (element) {
      let index = this.children.indexOf(element);
      if (index != -1) { // found it
        this.children[index].parent = null;
        this.children.splice(index, 1);
        this.emit("removedChildren");
        return true;
      } else { // not found, element not a child
        return false;
      }
    }

    /**
     * remove all children of container
     */
    clear () {
      let privates = internal(this);
      for (let child of privates.children) {
        child.parent = null;
      }
      privates.children = [];
      this.clearCache();
      this.emit("removedChildren");
    }

  }

  Sprite.assign("Container", SpriteContainer);


})();

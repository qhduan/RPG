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

/// @file SpriteContainer.js
/// @namespace Sprite
/// class Sprite.Container

(function (Sprite) {
  "use strict";

  let internal = Sprite.Namespace();

  /// @class Sprite.Container
  /// inherit the Sprite.Display
  Sprite.Container = class Container extends Sprite.Display {

    /// @function Sprite.Container.constructor
    /// construct a Sprite.Container object
    constructor () {
      super();
      internal(this).children = [];
      internal(this).cacheCanvas = null;
    }

    get children () {
      return internal(this).children;
    }

    set children (value) {
      throw new Error("Sprite.Container.children readonly");
    }

    get cacheCanvas () {
      return internal(this).cacheCanvas;
    }

    set cacheCanvas (value) {
      throw new Error("Sprite.Container.cacheCanvas readonly");
    }

    /// @function Sprite.Container.cache
    /// make a cache canvas of container
    cache (x, y, width, height) {
      let canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      let context = canvas.getContext("2d");
      this.draw(context);
      internal(this).cacheCanvas = canvas;
    }

    /// @function Sprite.Container.hitTest
    hitTest (x, y) {
      if (this.cacheCanvas) {
        return super.hitTest(x, y);
      } else {
        var hitted = [];
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

    /// @function Sprite.Container.draw
    /// draw all children in this container on context
    /// @param context, a 2d context from canvas
    draw (renderer) {
      if (this.visible != true)
        return;

      if (this.cacheCanvas) {
        this.drawImage(renderer, this.cacheCanvas,
          0, 0, this.cacheCanvas.width, this.cacheCanvas.height,
          0, 0, this.cacheCanvas.width, this.cacheCanvas.height);
      } else {
        if (this.children.length > 0) {
          for (let child of this.children) {
            child.draw(renderer)
          }
        }
      }
    }

    /// @function Sprite.Container.appendChild
    /// append one or more children into container
    /// eg. c.appendChild(childA) c.appendChild(childA, childB)
    /// @param one or more children
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

    /// @function Sprite.Container.appendChildAt
    /// append one or more children into container at certain position
    /// eg. c.appendChildAt(0, childA) c.appendChildAt(0, childA, childB)
    /// @param one or more children
    appendChildAt () {
      let args = Array.prototype.slice.call(arguments);

      if (args.length <= 1) {
        console.log(arguments, this);
        throw new TypeError("Sprite.Container.appendChildAt has an invalid arguments");
      }

      let index = args[0];
      for (let i = 1; i < args.length; i++) {
        if (args[i] instanceof Sprite.Display == false) {
          console.error(args[i]);
          throw new Error("Sprite.Container.appendChildAt only can accept Sprite.Display or it's sub-class");
        }
        args[i].parent = this;
        this.children.splice(index, 0, args[i]);
      }

      this.emit("addedChildren");
    }

    /// @function Sprite.Container.removeChild
    /// remove one child from a container
    /// eg. c.removeChild(childA)
    /// @param the child you want to remove
    removeChild (element) {
      let index = this.children.indexOf(element);
      if (index != -1) { // 删除成功
        this.children[index].parent = null;
        this.children.splice(index, 1);
        this.emit("removedChildren");
        return true;
      } else { // 没有找到需要删除的对象
        return false;
      }
    }

    /// @function Sprite.Container.clear
    /// remove all children of container
    clear () {
      for (let child of this.children) {
        child.parent = null;
      }
      internal(this).children = [];
      this.emit("removedChildren");
      return true;
    }

  };

})(Sprite);

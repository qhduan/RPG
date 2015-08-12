
/// @file SpriteContainer.js
/// @namespace Sprite
/// class Sprite.Container

(function () {

  "use strict";

  /// @class Sprite.Container
  /// inherit the Sprite.Display
  Sprite.Container = class Container extends Sprite.Display {

    /// @function Sprite.Container.constructor
    /// construct a Sprite.Container object
    constructor () {
      super();
      this._children = [];
    }

    get children () {
      return this._children;
    }

    set children (value) {
      throw new TypeError("Sprite.Container.children readonly");
    }

    get cacheCanvas () {
      return this._cacheCanvas;
    }

    set cacheCanvas (value) {
      throw new TypeError("Sprite.Container.cacheCanvas readonly");
    }

    /// @function Sprite.Container.cache
    /// make a cache canvas of container
    cache (x, y, width, height) {
      var canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      var context = canvas.getContext("2d");
      this.draw(context);
      this._cacheCanvas = canvas;
    }

    /// @function Sprite.Container.hitTest
    hitTest (x, y) {
      if (this._cacheCanvas) {
        return super.hitTest(x, y);
      } else {
        var hitted = [];
        for (var i = 0; i < this.children.length; i++) {
          var ret = this.children[i].hitTest(x, y);
          if (ret instanceof Array) {
            hitted = hitted.concat(ret);
          } else if (ret === true) {
            hitted.push(this.children[i]);
          }
        }
        return hitted;
      }
    }

    /// @function Sprite.Container.draw
    /// draw all children in this container on context
    /// @param context, a 2d context from canvas
    draw (context, callback) {
      if (this._cacheCanvas) {
        this.drawImage(context, this._cacheCanvas,
          0, 0, this._cacheCanvas.width, this._cacheCanvas.height,
          0, 0, this._cacheCanvas.width, this._cacheCanvas.height);

        if (callback) callback();
      } else {
        if (this._children.length <= 0) {
          return;
        }

        this._children.forEach((element) => {
          element.draw(context);
        });
      }
    }

    /// @function Sprite.Container.appendChild
    /// append one or more children into container
    /// eg. c.appendChild(childA) c.appendChild(childA, childB)
    /// @param one or more children
    appendChild () {
      if (arguments.length <= 0) {
        console.log(arguments, this);
        throw new TypeError("Sprite.Container.appendChild has an invalid arguments");
      }

      for (let i = 0; i < arguments.length; i++) {
        if (arguments[i] instanceof Sprite.Display == false) {
          console.log(arguments[i]);
          throw new TypeError("Sprite.Container.appendChild only can append Sprite.Display or it's sub-class");
        }
        arguments[i].parent = this;
        this._children.push(arguments[i]);
      }

      this.emit("addedChildren");
    }

    /// @function Sprite.Container.appendChildAt
    /// append one or more children into container at certain position
    /// eg. c.appendChildAt(0, childA) c.appendChildAt(0, childA, childB)
    /// @param one or more children
    appendChildAt () {
      if (arguments.length <= 1) {
        console.log(arguments, this);
        throw new TypeError("Sprite.Container.appendChildAt has an invalid arguments");
      }

      var index = arguments[0];
      for (let i = 1; i < arguments.length; i++) {
        if (arguments[i] instanceof Sprite.Display == false) {
          console.log(arguments[i]);
          throw new TypeError("Sprite.Container.appendChild only can append Sprite.Display or it's sub-class");
        }
        arguments[i].parent = this;
        this._children.splice(index, 0, arguments[i]);
      }

      this.emit("addedChildren");
    }

    /// @function Sprite.Container.removeChild
    /// remove one child from a container
    /// eg. c.removeChild(childA)
    /// @param the child you want to remove
    removeChild (element) {
      var index = this._children.indexOf(element);
      if (index != -1) { // 删除成功
        this._children[index].parent = null;
        this._children.splice(index, 1);
        this.emit("removedChildren");
        return true;
      } else { // 没有找到需要删除的对象
        return false;
      }
    }

  };

})();

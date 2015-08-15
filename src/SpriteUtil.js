
(function () {
  "use strict";

  Sprite.Util = class Util {

    static each (obj, functional) {
      for (var key in obj) {
        functional(obj[key], key, obj);
      }
    }

    static id () {
      // generate a UUID
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/x|y/g, function (c) {
        var r = Math.floor(Math.random() * 16);
        if (c == "x") {
          return r.toString(16);
        } else {
          return (r & 0x03 | 0x08).toString(16);
        }
      });
    }

    static btoa (str) {
      // convert str to base64
      return window.btoa(unescape(encodeURIComponent(str)));
    }

    static atob (str) {
      // convert base64 str to original
      return decodeURIComponent(escape(window.atob(str)));
    }

  };


})();

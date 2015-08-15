"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  "use strict";

  Sprite.Util = (function () {
    function Util() {
      _classCallCheck(this, Util);
    }

    _createClass(Util, null, [{
      key: "each",
      value: function each(obj, functional) {
        for (var key in obj) {
          functional(obj[key], key, obj);
        }
      }
    }, {
      key: "id",
      value: function id() {
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
    }, {
      key: "btoa",
      value: function btoa(str) {
        // convert str to base64
        return window.btoa(unescape(encodeURIComponent(str)));
      }
    }, {
      key: "atob",
      value: function atob(str) {
        // convert base64 str to original
        return decodeURIComponent(escape(window.atob(str)));
      }
    }]);

    return Util;
  })();
})();
//# sourceMappingURL=SpriteUtil.js.map

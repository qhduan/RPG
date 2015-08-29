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

/// @file SpriteEvent.js
/// @namespace Sprite
/// class Sprite.Event

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  "use strict";

  /// @class Sprite.Event
  Sprite.Event = (function () {

    /// @function Sprite.Event.constructor
    /// construct a Sprite.Event

    function Event() {
      _classCallCheck(this, Event);

      this._listeners = {};
      this._once = {};
      this._parent = null;
    }

    _createClass(Event, [{
      key: "hasEvent",

      /// @function Sprite.Event.hasEvent
      value: function hasEvent(event) {
        if (this._listeners[event]) return true;
        return false;
      }

      /// @function Sprite.Event.on
      /// book a listener of event in this object
      /// @param event, the event to book
      /// @param listener, the listener to book
    }, {
      key: "on",
      value: function on(event, listener) {
        if (this._once[event]) {
          listener({
            type: event,
            target: this,
            data: this._once[event]
          });
          return;
        }

        if (!this._listeners[event]) this._listeners[event] = {};

        var id = Sprite.Util.id();

        this._listeners[event][id] = listener;
        return id;
      }

      /// @function Sprite.Event.off
      /// release a event listener
      /// @param event, the event to release
      /// @param id, the id on the book
    }, {
      key: "off",
      value: function off(event, id) {
        if (this._listeners[event] && this._listeners[event][id]) {
          delete this._listeners[event][id];
          return true;
        }
        return false;
      }

      /// @function Sprite.Event.emit
      /// emit a event
      /// @param event, the event you want emit
      /// @param once, is it an once event? eg. oncomplete onload maybe an once event
      /// @param data, optional, the data you want send to listener
    }, {
      key: "emit",
      value: function emit(event, once, data) {
        if (once) {
          if (typeof data != "undefined") {
            this._once[event] = data;
          } else {
            this._once[event] = true;
          }
        }

        var pop = true;

        if (this._listeners[event]) {

          for (var key in this._listeners[event]) {
            if (this._listeners[event][key]({
              type: event,
              target: this,
              data: data
            }) === false) {
              pop = false;
            }
          }
        }

        if (this.parent && pop == true) {
          this.parent.emit(event, false, data);
        }
      }
    }, {
      key: "parent",
      get: function get() {
        return this._parent;
      },
      set: function set(value) {
        this._parent = value;
      }
    }]);

    return Event;
  })();
})();
//# sourceMappingURL=SpriteEvent.js.map

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
 * @fileoverview Class Sprite.Event
 * @author mail@qhduan.com (QH Duan)
 */

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  /**
   * Class Sprite.Event, hold all events emit, bubble
   * @class
   */
  Sprite.assign("Event", (function () {
    /**
     * construct Sprite.Event
     * @constructor
     */

    function SpriteEvent() {
      _classCallCheck(this, SpriteEvent);

      var privates = internal(this);
      /**
       * Contain all event and its' listeners
       @type {Object}
       @private
       */
      privates.listeners = new Map();
      /**
       * Contain an event is once or not
       * @type {Object}
       * @private
       */
      privates.once = new Map();
      /**
       * Parent of this object
       * @type {Object}
       */
      privates.parent = null;
    }
    /**
     * @return {Object} parent we hold, an object or null
     */

    _createClass(SpriteEvent, [{
      key: "on",

      /**
       * Register an event
       * @param {string} event The event type, eg. "click"
       * @param {function} listener The function when event fired
       */
      value: function on(event, listener) {
        var privates = internal(this);
        // If event is an once event, when some client register this event after event fired, we just return it
        if (privates.once.has(event)) {
          listener({
            type: event,
            target: this,
            data: privates.once.get(event)
          });
          return null;
        } else {
          if (privates.listeners.has(event) == false) {
            privates.listeners.set(event, new Map());
          }

          var id = Sprite.uuid();
          privates.listeners.get(event).set(id, listener);
          return id;
        }
      }
      /**
       * Remove an event Register
       * @param {string} event The event type you want to remove. eg. "click"
       * @param {string} id The id of event, the id is what returned by "on" function
       */

    }, {
      key: "off",
      value: function off(event, id) {
        var privates = internal(this);
        if (privates.listeners.has(event) && privates.listeners.get(event).has(id)) {
          privates.listeners.get(event).delete(id);
          if (privates.listeners.get(event).size <= 0) {
            privates.listeners.delete(event);
          }
          return true;
        }
        return false;
      }
      /**
       * Fire an event from children
       * @param {string} event Event type
       * @param {Object} target Event target
       * @param {Object} data Data
       */

    }, {
      key: "emitBubble",
      value: function emitBubble(event, target, data) {
        var privates = internal(this);
        var bubble = true;

        if (privates.listeners.has(event)) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = privates.listeners.get(event).values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var listener = _step.value;

              if (listener({ type: event, target: target, data: data }) === false) {
                // If client return just "false", stop propagation
                bubble = false;
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }

        if (privates.parent && bubble == true) {
          privates.parent.emitBubble(event, target, data);
        }
      }
      /**
       * Fire an event
       * @param {string} event The event type you want to fire
       * @param {boolean} once Whether or not the event is once, if true, the event fire should only once, like "complete"
       * @param {Object} data The data to listener, undefined or null is OK
       */

    }, {
      key: "emit",
      value: function emit(event, once, data) {
        var privates = internal(this);
        if (once) {
          if (typeof data != "undefined") {
            privates.once.set(event, data);
          } else {
            privates.once.set(event, null);
          }
        }

        // wheter or not bubble the event, default true
        var bubble = true;

        if (privates.listeners.has(event)) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = privates.listeners.get(event).values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var listener = _step2.value;

              if (listener({ type: event, target: this, data: data }) === false) {
                // If client return just "false", stop propagation
                bubble = false;
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }

        if (privates.parent && bubble == true) {
          privates.parent.emitBubble(event, this, data);
        }
      }
    }, {
      key: "parent",
      get: function get() {
        var privates = internal(this);
        return privates.parent;
      }
      /**
       * Set parent of object
       * @param {Object} value New parent value, or null
       */
      ,
      set: function set(value) {
        var privates = internal(this);
        privates.parent = value;
      }
    }]);

    return SpriteEvent;
  })());
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlRXZlbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxDQUFDLFlBQVk7QUFDWixjQUFZLENBQUM7O0FBRVosTUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRTs7Ozs7O0FBQUMsQUFNbEMsUUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPOzs7Ozs7QUFLbkIsYUFMMkIsV0FBVyxHQUt2Qjs0QkFMWSxXQUFXOztBQU1wQyxVQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDOzs7Ozs7QUFBQyxBQU05QixjQUFRLENBQUMsU0FBUyxHQUFHLElBQUksR0FBRyxFQUFFOzs7Ozs7QUFBQyxBQU0vQixjQUFRLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFOzs7OztBQUFDLEFBSzFCLGNBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0tBQ3hCOzs7O0FBQUE7aUJBeEIwQixXQUFXOzs7Ozs7Ozt5QkE2Q2xDLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDbkIsWUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQzs7QUFBQyxBQUU5QixZQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQzVCLGtCQUFRLENBQUM7QUFDUCxnQkFBSSxFQUFFLEtBQUs7QUFDWCxrQkFBTSxFQUFFLElBQUk7QUFDWixnQkFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztXQUMvQixDQUFDLENBQUM7QUFDSCxpQkFBTyxJQUFJLENBQUM7U0FDYixNQUFNO0FBQ0wsY0FBSSxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLEVBQUU7QUFDMUMsb0JBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJ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SyxLQUFLLEVBQUU7O0FBRWpFLHNCQUFNLEdBQUcsS0FBSyxDQUFDO2VBQ2hCO2FBQ0Y7Ozs7Ozs7Ozs7Ozs7OztTQUNGOztBQUVELFlBQUksUUFBUSxDQUFDLE1BQU0sSUFBSSxNQUFNLElBQUksSUFBSSxFQUFFO0FBQ3JDLGtCQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQy9DO09BQ0Y7OzswQkEzR2E7QUFDWixZQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsZUFBTyxRQUFRLENBQUMsTUFBTSxDQUFDO09BQ3hCOzs7Ozs7d0JBS1csS0FBSyxFQUFFO0FBQ2pCLFlBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixnQkFBUSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7T0FDekI7OztXQXZDMEIsV0FBVztPQXdJdEMsQ0FBQztDQUdKLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6IlNwcml0ZUV2ZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuMkQgR2FtZSBTcHJpdGUgTGlicmFyeSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IENsYXNzIFNwcml0ZS5FdmVudFxuICogQGF1dGhvciBtYWlsQHFoZHVhbi5jb20gKFFIIER1YW4pXG4gKi9cblxuKGZ1bmN0aW9uICgpIHtcbiBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgaW50ZXJuYWwgPSBTcHJpdGUuTmFtZXNwYWNlKCk7XG5cbiAgLyoqXG4gICAqIENsYXNzIFNwcml0ZS5FdmVudCwgaG9sZCBhbGwgZXZlbnRzIGVtaXQsIGJ1YmJsZVxuICAgKiBAY2xhc3NcbiAgICovXG4gIFNwcml0ZS5hc3NpZ24oXCJFdmVudFwiLCBjbGFzcyBTcHJpdGVFdmVudCB7XG4gICAgLyoqXG4gICAgICogY29uc3RydWN0IFNwcml0ZS5FdmVudFxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgLyoqXG4gICAgICAgKiBDb250YWluIGFsbCBldmVudCBhbmQgaXRzJyBsaXN0ZW5lcnNcbiAgICAgICBAdHlwZSB7T2JqZWN0fVxuICAgICAgIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIHByaXZhdGVzLmxpc3RlbmVycyA9IG5ldyBNYXAoKTtcbiAgICAgIC8qKlxuICAgICAgICogQ29udGFpbiBhbiBldmVudCBpcyBvbmNlIG9yIG5vdFxuICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIHByaXZhdGVzLm9uY2UgPSBuZXcgTWFwKCk7XG4gICAgICAvKipcbiAgICAgICAqIFBhcmVudCBvZiB0aGlzIG9iamVjdFxuICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMucGFyZW50ID0gbnVsbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBwYXJlbnQgd2UgaG9sZCwgYW4gb2JqZWN0IG9yIG51bGxcbiAgICAgKi9cbiAgICBnZXQgcGFyZW50ICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcmV0dXJuIHByaXZhdGVzLnBhcmVudDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IHBhcmVudCBvZiBvYmplY3RcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdmFsdWUgTmV3IHBhcmVudCB2YWx1ZSwgb3IgbnVsbFxuICAgICAqL1xuICAgIHNldCBwYXJlbnQgKHZhbHVlKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHByaXZhdGVzLnBhcmVudCA9IHZhbHVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlciBhbiBldmVudFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudCBUaGUgZXZlbnQgdHlwZSwgZWcuIFwiY2xpY2tcIlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyIFRoZSBmdW5jdGlvbiB3aGVuIGV2ZW50IGZpcmVkXG4gICAgICovXG4gICAgb24gKGV2ZW50LCBsaXN0ZW5lcikge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICAvLyBJZiBldmVudCBpcyBhbiBvbmNlIGV2ZW50LCB3aGVuIHNvbWUgY2xpZW50IHJlZ2lzdGVyIHRoaXMgZXZlbnQgYWZ0ZXIgZXZlbnQgZmlyZWQsIHdlIGp1c3QgcmV0dXJuIGl0XG4gICAgICBpZiAocHJpdmF0ZXMub25jZS5oYXMoZXZlbnQpKSB7XG4gICAgICAgIGxpc3RlbmVyKHtcbiAgICAgICAgICB0eXBlOiBldmVudCxcbiAgICAgICAgICB0YXJnZXQ6IHRoaXMsXG4gICAgICAgICAgZGF0YTogcHJpdmF0ZXMub25jZS5nZXQoZXZlbnQpXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChwcml2YXRlcy5saXN0ZW5lcnMuaGFzKGV2ZW50KSA9PSBmYWxzZSkge1xuICAgICAgICAgIHByaXZhdGVzLmxpc3RlbmVycy5zZXQoZXZlbnQsIG5ldyBNYXAoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgaWQgPSBTcHJpdGUudXVpZCgpO1xuICAgICAgICBwcml2YXRlcy5saXN0ZW5lcnMuZ2V0KGV2ZW50KS5zZXQoaWQsIGxpc3RlbmVyKTtcbiAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYW4gZXZlbnQgUmVnaXN0ZXJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnQgVGhlIGV2ZW50IHR5cGUgeW91IHdhbnQgdG8gcmVtb3ZlLiBlZy4gXCJjbGlja1wiXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGlkIFRoZSBpZCBvZiBldmVudCwgdGhlIGlkIGlzIHdoYXQgcmV0dXJuZWQgYnkgXCJvblwiIGZ1bmN0aW9uXG4gICAgICovXG4gICAgb2ZmIChldmVudCwgaWQpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgaWYgKHByaXZhdGVzLmxpc3RlbmVycy5oYXMoZXZlbnQpICYmIHByaXZhdGVzLmxpc3RlbmVycy5nZXQoZXZlbnQpLmhhcyhpZCkpIHtcbiAgICAgICAgcHJpdmF0ZXMubGlzdGVuZXJzLmdldChldmVudCkuZGVsZXRlKGlkKTtcbiAgICAgICAgaWYgKHByaXZhdGVzLmxpc3RlbmVycy5nZXQoZXZlbnQpLnNpemUgPD0gMCkge1xuICAgICAgICAgIHByaXZhdGVzLmxpc3RlbmVycy5kZWxldGUoZXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBGaXJlIGFuIGV2ZW50IGZyb20gY2hpbGRyZW5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnQgRXZlbnQgdHlwZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXQgRXZlbnQgdGFyZ2V0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgRGF0YVxuICAgICAqL1xuICAgIGVtaXRCdWJibGUgKGV2ZW50LCB0YXJnZXQsIGRhdGEpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgbGV0IGJ1YmJsZSA9IHRydWU7XG5cbiAgICAgIGlmIChwcml2YXRlcy5saXN0ZW5lcnMuaGFzKGV2ZW50KSkge1xuICAgICAgICBmb3IgKGxldCBsaXN0ZW5lciBvZiBwcml2YXRlcy5saXN0ZW5lcnMuZ2V0KGV2ZW50KS52YWx1ZXMoKSkge1xuICAgICAgICAgIGlmIChsaXN0ZW5lcih7IHR5cGU6IGV2ZW50LCB0YXJnZXQ6IHRhcmdldCwgZGF0YTogZGF0YSB9KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIC8vIElmIGNsaWVudCByZXR1cm4ganVzdCBcImZhbHNlXCIsIHN0b3AgcHJvcGFnYXRpb25cbiAgICAgICAgICAgIGJ1YmJsZSA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocHJpdmF0ZXMucGFyZW50ICYmIGJ1YmJsZSA9PSB0cnVlKSB7XG4gICAgICAgIHByaXZhdGVzLnBhcmVudC5lbWl0QnViYmxlKGV2ZW50LCB0YXJnZXQsIGRhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBGaXJlIGFuIGV2ZW50XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50IFRoZSBldmVudCB0eXBlIHlvdSB3YW50IHRvIGZpcmVcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IG9uY2UgV2hldGhlciBvciBub3QgdGhlIGV2ZW50IGlzIG9uY2UsIGlmIHRydWUsIHRoZSBldmVudCBmaXJlIHNob3VsZCBvbmx5IG9uY2UsIGxpa2UgXCJjb21wbGV0ZVwiXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgVGhlIGRhdGEgdG8gbGlzdGVuZXIsIHVuZGVmaW5lZCBvciBudWxsIGlzIE9LXG4gICAgICovXG4gICAgZW1pdCAoZXZlbnQsIG9uY2UsIGRhdGEpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgaWYgKG9uY2UpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBkYXRhICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBwcml2YXRlcy5vbmNlLnNldChldmVudCwgZGF0YSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJpdmF0ZXMub25jZS5zZXQoZXZlbnQsIG51bGwpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHdoZXRlciBvciBub3QgYnViYmxlIHRoZSBldmVudCwgZGVmYXVsdCB0cnVlXG4gICAgICBsZXQgYnViYmxlID0gdHJ1ZTtcblxuICAgICAgaWYgKHByaXZhdGVzLmxpc3RlbmVycy5oYXMoZXZlbnQpKSB7XG4gICAgICAgIGZvciAobGV0IGxpc3RlbmVyIG9mIHByaXZhdGVzLmxpc3RlbmVycy5nZXQoZXZlbnQpLnZhbHVlcygpKSB7XG4gICAgICAgICAgaWYgKGxpc3RlbmVyKHsgdHlwZTogZXZlbnQsIHRhcmdldDogdGhpcywgZGF0YTogZGF0YSB9KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIC8vIElmIGNsaWVudCByZXR1cm4ganVzdCBcImZhbHNlXCIsIHN0b3AgcHJvcGFnYXRpb25cbiAgICAgICAgICAgIGJ1YmJsZSA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocHJpdmF0ZXMucGFyZW50ICYmIGJ1YmJsZSA9PSB0cnVlKSB7XG4gICAgICAgIHByaXZhdGVzLnBhcmVudC5lbWl0QnViYmxlKGV2ZW50LCB0aGlzLCBkYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG5cbn0pKCk7XG4iXX0=

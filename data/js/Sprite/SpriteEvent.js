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

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
       * @param {function} listener The callback function when event fired
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
          privates.listeners.get(event)["delete"](id);
          if (privates.listeners.get(event).size <= 0) {
            privates.listeners["delete"](event);
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
              if (!_iteratorNormalCompletion && _iterator["return"]) {
                _iterator["return"]();
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
              if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                _iterator2["return"]();
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
      },

      /**
       * Set parent of object
       * @param {Object} value New parent value, or null
       */
      set: function set(value) {
        var privates = internal(this);
        privates.parent = value;
      }
    }]);

    return SpriteEvent;
  })());
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlRXZlbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxDQUFDLFlBQVk7QUFDWixjQUFZLENBQUM7O0FBRVosTUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDOzs7Ozs7QUFNbEMsUUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPOzs7Ozs7QUFLUCxhQUxlLFdBQVcsR0FLdkI7NEJBTFksV0FBVzs7QUFNcEMsVUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDOzs7Ozs7QUFNOUIsY0FBUSxDQUFDLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDOzs7Ozs7QUFNL0IsY0FBUSxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDOzs7OztBQUsxQixjQUFRLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztLQUN4Qjs7Ozs7O2lCQXhCMEIsV0FBVzs7Ozs7Ozs7YUE2Q25DLFlBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUNuQixZQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTlCLFlBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDNUIsa0JBQVEsQ0FBQztBQUNQLGdCQUFJLEVBQUUsS0FBSztBQUNYLGtCQUFNLEVBQUUsSUFBSTtBQUNaLGdCQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO1dBQy9CLENBQUMsQ0FBQztBQUNILGlCQUFPLElBQUksQ0FBQztTQUNiLE1BQU07QUFDTCxjQUFJLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssRUFBRTtBQUMxQyxvQkFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUks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QUFLLEVBQUU7O0FBRWpFLHNCQUFNLEdBQUcsS0FBSyxDQUFDO2VBQ2hCO2FBQ0Y7Ozs7Ozs7Ozs7Ozs7OztTQUNGOztBQUVELFlBQUksUUFBUSxDQUFDLE1BQU0sSUFBSSxNQUFNLElBQUksSUFBSSxFQUFFO0FBQ3JDLGtCQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQy9DO09BQ0Y7OztXQTNHVSxlQUFHO0FBQ1osWUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlCLGVBQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQztPQUN4Qjs7Ozs7O1dBS1UsYUFBQyxLQUFLLEVBQUU7QUFDakIsWUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlCLGdCQUFRLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztPQUN6Qjs7O1dBdkMwQixXQUFXO09Bd0l0QyxDQUFDO0NBR0osQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiU3ByaXRlRXZlbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG4yRCBHYW1lIFNwcml0ZSBMaWJyYXJ5LCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgQ2xhc3MgU3ByaXRlLkV2ZW50XG4gKiBAYXV0aG9yIG1haWxAcWhkdWFuLmNvbSAoUUggRHVhbilcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCBpbnRlcm5hbCA9IFNwcml0ZS5OYW1lc3BhY2UoKTtcblxuICAvKipcbiAgICogQ2xhc3MgU3ByaXRlLkV2ZW50LCBob2xkIGFsbCBldmVudHMgZW1pdCwgYnViYmxlXG4gICAqIEBjbGFzc1xuICAgKi9cbiAgU3ByaXRlLmFzc2lnbihcIkV2ZW50XCIsIGNsYXNzIFNwcml0ZUV2ZW50IHtcbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3QgU3ByaXRlLkV2ZW50XG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICAvKipcbiAgICAgICAqIENvbnRhaW4gYWxsIGV2ZW50IGFuZCBpdHMnIGxpc3RlbmVyc1xuICAgICAgIEB0eXBlIHtPYmplY3R9XG4gICAgICAgQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMubGlzdGVuZXJzID0gbmV3IE1hcCgpO1xuICAgICAgLyoqXG4gICAgICAgKiBDb250YWluIGFuIGV2ZW50IGlzIG9uY2Ugb3Igbm90XG4gICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZXMub25jZSA9IG5ldyBNYXAoKTtcbiAgICAgIC8qKlxuICAgICAgICogUGFyZW50IG9mIHRoaXMgb2JqZWN0XG4gICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICovXG4gICAgICBwcml2YXRlcy5wYXJlbnQgPSBudWxsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IHBhcmVudCB3ZSBob2xkLCBhbiBvYmplY3Qgb3IgbnVsbFxuICAgICAqL1xuICAgIGdldCBwYXJlbnQgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICByZXR1cm4gcHJpdmF0ZXMucGFyZW50O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgcGFyZW50IG9mIG9iamVjdFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZSBOZXcgcGFyZW50IHZhbHVlLCBvciBudWxsXG4gICAgICovXG4gICAgc2V0IHBhcmVudCAodmFsdWUpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcHJpdmF0ZXMucGFyZW50ID0gdmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGFuIGV2ZW50XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50IFRoZSBldmVudCB0eXBlLCBlZy4gXCJjbGlja1wiXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gbGlzdGVuZXIgVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHdoZW4gZXZlbnQgZmlyZWRcbiAgICAgKi9cbiAgICBvbiAoZXZlbnQsIGxpc3RlbmVyKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIC8vIElmIGV2ZW50IGlzIGFuIG9uY2UgZXZlbnQsIHdoZW4gc29tZSBjbGllbnQgcmVnaXN0ZXIgdGhpcyBldmVudCBhZnRlciBldmVudCBmaXJlZCwgd2UganVzdCByZXR1cm4gaXRcbiAgICAgIGlmIChwcml2YXRlcy5vbmNlLmhhcyhldmVudCkpIHtcbiAgICAgICAgbGlzdGVuZXIoe1xuICAgICAgICAgIHR5cGU6IGV2ZW50LFxuICAgICAgICAgIHRhcmdldDogdGhpcyxcbiAgICAgICAgICBkYXRhOiBwcml2YXRlcy5vbmNlLmdldChldmVudClcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHByaXZhdGVzLmxpc3RlbmVycy5oYXMoZXZlbnQpID09IGZhbHNlKSB7XG4gICAgICAgICAgcHJpdmF0ZXMubGlzdGVuZXJzLnNldChldmVudCwgbmV3IE1hcCgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpZCA9IFNwcml0ZS51dWlkKCk7XG4gICAgICAgIHByaXZhdGVzLmxpc3RlbmVycy5nZXQoZXZlbnQpLnNldChpZCwgbGlzdGVuZXIpO1xuICAgICAgICByZXR1cm4gaWQ7XG4gICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhbiBldmVudCBSZWdpc3RlclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudCBUaGUgZXZlbnQgdHlwZSB5b3Ugd2FudCB0byByZW1vdmUuIGVnLiBcImNsaWNrXCJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgVGhlIGlkIG9mIGV2ZW50LCB0aGUgaWQgaXMgd2hhdCByZXR1cm5lZCBieSBcIm9uXCIgZnVuY3Rpb25cbiAgICAgKi9cbiAgICBvZmYgKGV2ZW50LCBpZCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBpZiAocHJpdmF0ZXMubGlzdGVuZXJzLmhhcyhldmVudCkgJiYgcHJpdmF0ZXMubGlzdGVuZXJzLmdldChldmVudCkuaGFzKGlkKSkge1xuICAgICAgICBwcml2YXRlcy5saXN0ZW5lcnMuZ2V0KGV2ZW50KS5kZWxldGUoaWQpO1xuICAgICAgICBpZiAocHJpdmF0ZXMubGlzdGVuZXJzLmdldChldmVudCkuc2l6ZSA8PSAwKSB7XG4gICAgICAgICAgcHJpdmF0ZXMubGlzdGVuZXJzLmRlbGV0ZShldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEZpcmUgYW4gZXZlbnQgZnJvbSBjaGlsZHJlblxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudCBFdmVudCB0eXBlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHRhcmdldCBFdmVudCB0YXJnZXRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSBEYXRhXG4gICAgICovXG4gICAgZW1pdEJ1YmJsZSAoZXZlbnQsIHRhcmdldCwgZGF0YSkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBsZXQgYnViYmxlID0gdHJ1ZTtcblxuICAgICAgaWYgKHByaXZhdGVzLmxpc3RlbmVycy5oYXMoZXZlbnQpKSB7XG4gICAgICAgIGZvciAobGV0IGxpc3RlbmVyIG9mIHByaXZhdGVzLmxpc3RlbmVycy5nZXQoZXZlbnQpLnZhbHVlcygpKSB7XG4gICAgICAgICAgaWYgKGxpc3RlbmVyKHsgdHlwZTogZXZlbnQsIHRhcmdldDogdGFyZ2V0LCBkYXRhOiBkYXRhIH0pID09PSBmYWxzZSkge1xuICAgICAgICAgICAgLy8gSWYgY2xpZW50IHJldHVybiBqdXN0IFwiZmFsc2VcIiwgc3RvcCBwcm9wYWdhdGlvblxuICAgICAgICAgICAgYnViYmxlID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwcml2YXRlcy5wYXJlbnQgJiYgYnViYmxlID09IHRydWUpIHtcbiAgICAgICAgcHJpdmF0ZXMucGFyZW50LmVtaXRCdWJibGUoZXZlbnQsIHRhcmdldCwgZGF0YSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEZpcmUgYW4gZXZlbnRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnQgVGhlIGV2ZW50IHR5cGUgeW91IHdhbnQgdG8gZmlyZVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gb25jZSBXaGV0aGVyIG9yIG5vdCB0aGUgZXZlbnQgaXMgb25jZSwgaWYgdHJ1ZSwgdGhlIGV2ZW50IGZpcmUgc2hvdWxkIG9ubHkgb25jZSwgbGlrZSBcImNvbXBsZXRlXCJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSBUaGUgZGF0YSB0byBsaXN0ZW5lciwgdW5kZWZpbmVkIG9yIG51bGwgaXMgT0tcbiAgICAgKi9cbiAgICBlbWl0IChldmVudCwgb25jZSwgZGF0YSkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBpZiAob25jZSkge1xuICAgICAgICBpZiAodHlwZW9mIGRhdGEgIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIHByaXZhdGVzLm9uY2Uuc2V0KGV2ZW50LCBkYXRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcml2YXRlcy5vbmNlLnNldChldmVudCwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gd2hldGVyIG9yIG5vdCBidWJibGUgdGhlIGV2ZW50LCBkZWZhdWx0IHRydWVcbiAgICAgIGxldCBidWJibGUgPSB0cnVlO1xuXG4gICAgICBpZiAocHJpdmF0ZXMubGlzdGVuZXJzLmhhcyhldmVudCkpIHtcbiAgICAgICAgZm9yIChsZXQgbGlzdGVuZXIgb2YgcHJpdmF0ZXMubGlzdGVuZXJzLmdldChldmVudCkudmFsdWVzKCkpIHtcbiAgICAgICAgICBpZiAobGlzdGVuZXIoeyB0eXBlOiBldmVudCwgdGFyZ2V0OiB0aGlzLCBkYXRhOiBkYXRhIH0pID09PSBmYWxzZSkge1xuICAgICAgICAgICAgLy8gSWYgY2xpZW50IHJldHVybiBqdXN0IFwiZmFsc2VcIiwgc3RvcCBwcm9wYWdhdGlvblxuICAgICAgICAgICAgYnViYmxlID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwcml2YXRlcy5wYXJlbnQgJiYgYnViYmxlID09IHRydWUpIHtcbiAgICAgICAgcHJpdmF0ZXMucGFyZW50LmVtaXRCdWJibGUoZXZlbnQsIHRoaXMsIGRhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==

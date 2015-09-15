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

(function (Sprite) {
  "use strict";

  let internal = Sprite.Namespace();

  /**
   * Class Sprite.Event, hold all events emit, bubble
   * @class
   */
  Sprite.Event = class SpriteEvent {
    /**
     * construct Sprite.Event
     * @constructor
     */
    constructor () {
      /**
       * Contain all event and its' listeners
       @type {Object}
       @private
       */
      internal(this).listeners = new Map();
      /**
       * Contain an event is once or not
       * @type {Object}
       * @private
       */
      internal(this).once = new Map();
      /**
       * Parent of this object
       * @type {Object}
       */
      internal(this).parent = null;
    }
    /**
     * @return {Object} parent we hold, an object or null
     */
    get parent () {
      return internal(this).parent;
    }
    /**
     * Set parent of object
     * @param {Object} value New parent value, or null
     */
    set parent (value) {
      internal(this).parent = value;
    }
    /**
     * Register an event
     * @param {string} event The event type, eg. "click"
     * @param {function} listener The callback function when event fired
     */
    on (event, listener) {
      // If event is an once event, when some client register this event after event fired, we just return it
      if (internal(this).once.has(event)) {
        listener({
          type: event,
          target: this,
          data: internal(this).once.get(event)
        });
        return null;
      } else {
        if (internal(this).listeners.has(event) == false) {
          internal(this).listeners.set(event, new Map());
        }

        let id = Sprite.uuid();
        internal(this).listeners.get(event).set(id, listener);
        return id;
      }
    }
    /**
     * Remove an event Register
     * @param {string} event The event type you want to remove. eg. "click"
     * @param {string} id The id of event, the id is what returned by "on" function
     */
    off (event, id) {
      if (internal(this).listeners.has(event) && internal(this).listeners.get(event).has(id)) {
        internal(this).listeners.get(event).delete(id);
        if (internal(this).listeners.get(event).size <= 0) {
          internal(this).listeners.delete(event);
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
    emitBubble (event, target, data) {
      let bubble = true;

      if (internal(this).listeners.has(event)) {
        for (let listener of internal(this).listeners.get(event).values()) {
          if (listener({ type: event, target: target, data: data }) === false) {
            // If client return just "false", stop propagation
            bubble = false;
          }
        }
      }

      if (
        internal(this).parent &&
        bubble == true
      ) {
        internal(this).parent.emitBubble(event, target, data);
      }
    }
    /**
     * Fire an event
     * @param {string} event The event type you want to fire
     * @param {boolean} once Whether or not the event is once, if true, the event fire should only once, like "complete"
     * @param {Object} data The data to listener, undefined or null is OK
     */
    emit (event, once, data) {
      if (once) {
        if (typeof data != "undefined") {
          internal(this).once.set(event, data);
        } else {
          internal(this).once.set(event, null);
        }
      }

      // wheter or not bubble the event, default true
      let bubble = true;
      
      if (internal(this).listeners.has(event)) {
        for (let listener of internal(this).listeners.get(event).values()) {
          if (listener({ type: event, target: this, data: data }) === false) {
            // If client return just "false", stop propagation
            bubble = false;
          }
        }
      }

      if (
        internal(this).parent &&
        bubble == true
      ) {
        internal(this).parent.emitBubble(event, this, data);
      }
    }
  };

})(Sprite);

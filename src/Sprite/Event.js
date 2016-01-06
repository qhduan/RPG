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
 * @fileoverview Class SpriteEvent
 * @author mail@qhduan.com (QH Duan)
*/


"use strict";

import Util from "./Util.js";

let internal = Util.namespace();

/**
 * Class SpriteEvent, hold all events emit, bubble
 * @class
*/
export default class Event {
  /**
   * construct SpriteEvent
   * @constructor
   */
  constructor () {
    let privates = internal(this);
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
  get parent () {
    let privates = internal(this);
    return privates.parent;
  }
  /**
   * Set parent of object
   * @param {Object} value New parent value, or null
   */
  set parent (value) {
    let privates = internal(this);
    privates.parent = value;
  }
  /**
   * Register an event
   * @param {string} event The event type, eg. "click"
   * @param {function} listener The function when event fired
   */
  on (event, listener) {
    let privates = internal(this);
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

      let id = Util.uuid();
      privates.listeners.get(event).set(id, listener);
      return id;
    }
  }
  /**
   * Remove an event Register
   * @param {string} event The event type you want to remove. eg. "click"
   * @param {string} id The id of event, the id is what returned by "on" function
   */
  off (event, id) {
    let privates = internal(this);
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
  emitBubble (event, target, data) {
    let privates = internal(this);
    let bubble = true;

    if (privates.listeners.has(event)) {
      for (let listener of privates.listeners.get(event).values()) {
        if (listener({ type: event, target: target, data: data }) === false) {
          // If client return just "false", stop propagation
          bubble = false;
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
  emit (event, once, data) {
    let privates = internal(this);
    if (once) {
      if (typeof data != "undefined") {
        privates.once.set(event, data);
      } else {
        privates.once.set(event, null);
      }
    }

    // wheter or not bubble the event, default true
    let bubble = true;

    if (privates.listeners.has(event)) {
      for (let listener of privates.listeners.get(event).values()) {
        if (listener({ type: event, target: this, data: data }) === false) {
          // If client return just "false", stop propagation
          bubble = false;
        }
      }
    }

    if (privates.parent && bubble == true) {
      privates.parent.emitBubble(event, this, data);
    }
  }
}

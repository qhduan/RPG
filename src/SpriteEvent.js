/// @file SpriteEvent.js
/// @namespace Sprite
/// class Sprite.Event

(function () {
  "use strict";

  /// @class Sprite.Event
  Sprite.Event = class Event {

    /// @function Sprite.Event.constructor
    /// construct a Sprite.Event
    constructor () {
      this._listeners = {};
      this._once = {};
    }

    /// #function Sprite.Event.hasEvent
    hasEvent (event) {
      if (this._listeners[event])
        return true;
      return false;
    }

    /// @function Sprite.Event.on
    /// book a listener of event in this object
    /// @param event, the event to book
    /// @param listener, the listener to book
    on (event, listener) {
      if (this._once[event]) {
        listener({
          type: event,
          target: this,
          data: this._once[event]
        });
        return;
      }

      if (!this._listeners[event])
        this._listeners[event] = {};

      var id = Sprite.Util.id();

      this._listeners[event][id] = listener;
      return id;
    }

    /// @function Sprite.Event.off
    /// release a event listener
    /// @param event, the event to release
    /// @param id, the id on the book
    off (event, id) {
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
    emit (event, once, data) {
      if (once) {
        if (typeof data != "undefined") {
          this._once[event] = data;
        } else {
          this._once[event] = true;
        }
      }

      var pop = true;

      if (this._listeners[event]) {

        for (let key in this._listeners[event]) {
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
  };

})();

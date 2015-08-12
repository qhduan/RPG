/// @file SpriteTicker.js
/// @namespace Sprite
/// class Sprite.Ticker

(function () {
  class Ticker extends Sprite.Event {
    constructor () {
      super();

      this.tick();
    }

    tick () {
      this.emit("tick");
      window.requestAnimationFrame(() => {
        this.tick();
      });
    }
  };

  Sprite.Ticker = new Ticker();

})();


(function () {


  var keyTable = {
    "left": 37,
    "up": 38,
    "right": 39,
    "down": 40,
    "shift": 16,
    "a": 65,
    "b": 66,
    "c": 67,
    "d": 68,
    "e": 69,
    "f": 70,
    "g": 71,
    "h": 72,
    "i": 73,
    "j": 74,
    "k": 75,
    "l": 76,
    "m": 77,
    "n": 78,
    "o": 79,
    "p": 80,
    "q": 81,
    "r": 82,
    "s": 83,
    "t": 84,
    "u": 85,
    "v": 86,
    "w": 87,
    "x": 88,
    "y": 89,
    "z": 90,
    "0": 48,
    "1": 49,
    "2": 50,
    "3": 51,
    "4": 52,
    "5": 53,
    "6": 54,
    "7": 55,
    "8": 56,
    "9": 57
  };

  var pressed = {};

  document.addEventListener("keydown", function (event) {
    event = event || window.event;
    var keyCode = event.keyCode;

    pressed[keyCode] = true;
  });

  document.addEventListener("keyup", function (event) {
    event = event || window.event;
    var keyCode = event.keyCode;

    if (pressed[keyCode])
      delete pressed[keyCode];
  });

  Sprite.Input = {
    pressed: function (keyStr) {
      if (pressed.hasOwnProperty(keyStr))
        return pressed[keyStr];
      return pressed[keyTable[keyStr]];
    }
  };

})();

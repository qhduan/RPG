
~function () {
  "use strict";

  Game.io = {}; // 封装socket.io client的一些功能

  var ioGetCallback = {};

  ~function ConnectSocketServer () {
    Game.io.socket = io(document.URL);

    Game.io.socket.on("connect", function (socket) {
      console.log("Socket Connected");
    });

    Game.io.socket.on("disconnect", function (socket) {
      console.log("Socket Disconnected");
    });

    Game.io.socket.on("message", function (data) {
      console.log(data);
    });

    Game.io.socket.on("get", function (data) {
      if (data.error) {
        console.log("error", data.id, data.error);
        data = null;
      }

      if (ioGetCallback[data.id]) {
        ioGetCallback[data.id].forEach(function (element) {
          element(data);
        });
        delete ioGetCallback[data.id];
      }
    });

  }();

  // 从服务器直接获取某类的某个id的资源
  Game.io.get = function (type, id, callback) {
    if (ioGetCallback[id]) {
      ioGetCallback[id].push(callback);
    } else {
      ioGetCallback[id] = [callback];
    }
    Game.io.socket.emit("get", {
      type: type,
      id: id
    });
  };


  Game.load = function (id, src, callback) {
    var queue = new createjs.LoadQueue();
    queue.on("complete", callback, queue);
    queue.loadFile({
      id: id,
      src: src
    });
  }

  var loadResourceTypeList = {};

  Game.loadTypeReg = function (type, callback) {
    loadResourceTypeList[type] = callback;
  }

  Game.loads = function (list, callback) {
    var count = 0 - list.length;
    var result = {};

    console.log("load", "0%");

    list.forEach(function (element, index, array) {
      var type = element.type;
      var id = element.id;
      loadResourceTypeList[type](id, function (obj) {
        result[id] = obj;
        count++;

        var progress = (count + list.length) / list.length;
        progress *= 100;
        progress = progress.toFixed(0) + "%";

        console.log("load", progress);

        if (count >= 0) {
          if (callback) callback(result);
        }
      });
    });
  };

}();



self.onmessage = function (event) {
  var data = event.data;
  self.postMessage(data.data);
}

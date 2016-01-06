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
 * @fileoverview SpriteLoader, fetch resource
 * @author mail@qhduan.com (QH Duan)
 */

 "use strict";

 import Util from "./Util.js";

 let internal = Util.namespace();

/**
 * Cache all url and element
 */
let Cache = new Map();
/**
 * When some url in Downloading, the url is downloading,
 * and other thread want it have to wait
 */
let Downloading = new Map();

function fetchData (url, callback, timeout = 0) {

  let type = null;
  if (url.match(/\.js$/i)) {
    type = "js";
  } else if (url.match(/\.(jpe?g|png|bmp|gif)$/i)) {
    type = "image";
  } else if (url.match(/\.(wav|mp3|ogg)$/i)) {
    type = "audio";
  } else if (url.match(/\.json$/i)) {
    type = "json";
  } else {
    console.error(url);
    throw new Error("fetchData got an invalid url");
  }

  // finished
  const gotData = function (obj) {

    if ( !Cache.has(url) ) {
      Cache.set(url, obj);
    }

    if (type == "json") {
      obj = Util.copy(obj);
    }

    if (callback) {
      callback(obj);
    }
    if (Downloading.has(url)) {
      const callbacks = Downloading.get(url);
      for (const cb of callbacks) {
        if (cb) {
          cb(obj);
        }
      }
      Downloading.delete(url);
    }
  };

  if (Cache.has(url)) {
    gotData(Cache.get(url));
    return;
  }

  if ( !timeout ) {
    if (Downloading.has(url)) {
      Downloading.get(url).push(callback);
      return;
    }

    Downloading.set(url, []);
  }

  if (type == "js") {
    let tag = document.createElement("script");
    tag.async = "async";
    tag["data-callback"] = func => {
      gotData(func);
    };
    tag.src = url;
    document.body.appendChild(tag);
  } else {

    let req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.timeout = 10000; // 10 seconds

    // looks like req.responseType=blob has some async problem, so I use arraybuffer
    switch (type) {
      case "image":
        req.responseType = "arraybuffer";
        break;
      case "audio":
        req.responseType = "arraybuffer";
        break;
      case "json":
        req.responseType = "json";
        break;
      default:
        console.error(type, url);
        throw new Error("fetchData something wrong");
    }

    if (typeof callback != "function")
      callback = () => {};

    req.ontimeout = () => {
      if (timeout >= 2) {
        console.error(url);
        alert(`资源${url}超时没有加载成功！`);
        throw new Error("SpriteLoader.fetchData timeout 3 times");
      } else {
        console.error("SpriteLoader.fetchData timeout try again, ", timeout + 1, " ", url);
        setTimeout( () => {
          fetchData(url, callback, timeout + 1);
        }, 50);
      }
    };

    let done = false;
    req.onreadystatechange = () => {
      if (req.readyState == 4 && !done) {
        done = true;
        if (req.response) {
          if (type == "image") {
            let arraybuffer = req.response;
            let image = new Image();
            image.onload = () => {
              // window.URL.revokeObjectURL(image.src);
              image.onload = null;
              gotData(image);
            };
            image.src = window.URL.createObjectURL(new window.Blob([arraybuffer]));
          } else if (type == "audio") {
            let arraybuffer = req.response;
            let audio = new Audio();
            audio.oncanplay = () => {
              // 如果reoke掉audio，那么audio.load()方法则不能用了
              // window.URL.revokeObjectURL(audio.src);
              audio.oncanplay = null;
              gotData(audio);
            };
            audio.src = window.URL.createObjectURL(new window.Blob([arraybuffer]));
          } else if (type == "json") {
            let json = req.response;
            if ( !json ) {
              console.error(url);
              throw new Error("Loader invalid json");
            }
            gotData(json);
          }
        } else {
          console.error("url: ", url);
          console.error("response: ", req.response,
          " readyState: ", req.readyState,
          " status: ", req.status,
          " statusText: ", req.statusText);
          if (timeout >= 2) {
            console.error(url);
            alert(`资源${url}错误没有加载成功！`);
            throw new Error("SpriteLoader.fetchData error 3 times");
          } else {
            console.error("SpriteLoader.fetchData error try again, ", timeout + 1, " ", url);
            setTimeout( () => {
              fetchData(url, callback, timeout + 1);
            }, 50);
          }
        }
      }
    };
    req.send();

  }

}

export default class Loader {

  static load () {
    const args = Array.prototype.slice.call(arguments);

    return new Promise( (resolve, reject) => {

      let urls = [];

      for (const element of args) {
        if (typeof element == "string") {
          urls.push(element);
        } else if (element instanceof Array) {
          for (const u of element) {
            urls.push(u);
          }
        } else {
          console.error(element, args);
          throw new Error("SpriteLoader.load got invalid argument");
        }
      }

      let done = 0;
      let ret = [];
      ret.length = urls.length;

      const gotResult = () => {
        done++;

        if (done >= ret.length) {
          resolve(ret);
        }
      };

      urls.forEach((element, index) => {
        fetchData(element, (result) => {
          ret[index] = result;
          gotResult();
        });
      });

    });
  }

}

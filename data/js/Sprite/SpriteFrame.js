"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
 * @fileoverview Class Sprite.Frame
 * @author mail@qhduan.com (QH Duan)
 */

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  /**
   * Class Sprite.Frame, a frame of Sprite.Sheet
   * @class
   */
  Sprite.assign("Frame", (function (_Sprite$Display) {
    _inherits(SpriteFrame, _Sprite$Display);

    function SpriteFrame(image, sx, sy, width, height) {
      _classCallCheck(this, SpriteFrame);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SpriteFrame).call(this));

      var privates = internal(_this);
      privates.image = image;
      privates.sx = sx;
      privates.sy = sy;
      _this.width = width;
      _this.height = height;
      return _this;
    }
    /**
     * @return {Image} Return the image this Sprite.Frame hold
     */

    _createClass(SpriteFrame, [{
      key: "print",
      value: function print() {
        console.log(internal(this));
      }

      /**
       * @return {Object} Clone this Sprite.Frame
       */

    }, {
      key: "clone",
      value: function clone() {
        var frame = new Sprite.Frame(this.image, this.sx, this.sy, this.width, this.height);
        frame.x = this.x;
        frame.y = this.y;
        frame.parent = this.parent;
        return frame;
      }

      /**
       * @param {Object} renderer
       */

    }, {
      key: "draw",
      value: function draw(renderer) {
        this.drawImage(renderer, this.image, this.sx, this.sy, this.width, this.height);
      }
    }, {
      key: "image",
      get: function get() {
        var privates = internal(this);
        return privates.image;
      },
      set: function set(value) {
        throw new Error("Sprite.Frame.image readonly");
      }

      /**
       * @return {number} Return sx
       */

    }, {
      key: "sx",
      get: function get() {
        var privates = internal(this);
        return privates.sx;
      },
      set: function set(value) {
        throw new Error("Sprite.Frame.sx readonly");
      }

      /**
       * @return {number} Return sy
       */

    }, {
      key: "sy",
      get: function get() {
        var privates = internal(this);
        return privates.sy;
      },
      set: function set(value) {
        throw new Error("Sprite.Frame.sy readonly");
      }
    }]);

    return SpriteFrame;
  })(Sprite.Display));
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlRnJhbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsQ0FBQyxZQUFZO0FBQ1osY0FBWSxDQUFDOztBQUVaLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUU7Ozs7OztBQUFDLEFBTWxDLFFBQU0sQ0FBQyxNQUFNLENBQUMsT0FBTztjQUFRLFdBQVc7O0FBRXRDLGFBRjJCLFdBQVcsQ0FFekIsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTs0QkFGaEIsV0FBVzs7eUVBQVgsV0FBVzs7QUFJcEMsVUFBSSxRQUFRLEdBQUcsUUFBUSxPQUFNLENBQUM7QUFDOUIsY0FBUSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDdkIsY0FBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDakIsY0FBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDakIsWUFBSyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLFlBQUssTUFBTSxHQUFHLE1BQU0sQ0FBQzs7S0FDdEI7Ozs7QUFBQTtpQkFWMEIsV0FBVzs7OEJBK0M3QjtBQUNQLGVBQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7T0FDN0I7Ozs7Ozs7OzhCQUtRO0FBQ1AsWUFBSSxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUMxQixJQUFJLENBQUMsS0FBSyxFQUNWLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFDaEIsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUN4QixDQUFDO0FBQ0YsYUFBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2pCLGFBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNqQixhQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDM0IsZUFBTyxLQUFLLENBQUM7T0FDZDs7Ozs7Ozs7MkJBS0ssUUFBUSxFQUFFO0FBQ2QsWUFBSSxDQUFDLFNBQVMsQ0FDWixRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFDcEIsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUNoQixJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQ3hCLENBQUM7T0FDSDs7OzBCQTdEWTtBQUNYLFlBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixlQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUM7T0FDdkI7d0JBRVUsS0FBSyxFQUFFO0FBQ2hCLGNBQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztPQUNoRDs7Ozs7Ozs7MEJBS1M7QUFDUixZQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsZUFBTyxRQUFRLENBQUMsRUFBRSxDQUFDO09BQ3BCO3dCQUVPLEtBQUssRUFBRTtBQUNiLGNBQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztPQUM3Qzs7Ozs7Ozs7MEJBS1M7QUFDUixZQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsZUFBTyxRQUFRLENBQUMsRUFBRSxDQUFDO09BQ3BCO3dCQUVPLEtBQUssRUFBRTtBQUNiLGNBQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztPQUM3Qzs7O1dBN0MwQixXQUFXO0tBQVMsTUFBTSxDQUFDLE9BQU8sRUE2RTdELENBQUM7Q0FHSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJTcHJpdGVGcmFtZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbjJEIEdhbWUgU3ByaXRlIExpYnJhcnksIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbi8qKlxuICogQGZpbGVvdmVydmlldyBDbGFzcyBTcHJpdGUuRnJhbWVcbiAqIEBhdXRob3IgbWFpbEBxaGR1YW4uY29tIChRSCBEdWFuKVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGludGVybmFsID0gU3ByaXRlLk5hbWVzcGFjZSgpO1xuXG4gIC8qKlxuICAgKiBDbGFzcyBTcHJpdGUuRnJhbWUsIGEgZnJhbWUgb2YgU3ByaXRlLlNoZWV0XG4gICAqIEBjbGFzc1xuICAgKi9cbiAgU3ByaXRlLmFzc2lnbihcIkZyYW1lXCIsIGNsYXNzIFNwcml0ZUZyYW1lIGV4dGVuZHMgU3ByaXRlLkRpc3BsYXkge1xuXG4gICAgY29uc3RydWN0b3IgKGltYWdlLCBzeCwgc3ksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHByaXZhdGVzLmltYWdlID0gaW1hZ2U7XG4gICAgICBwcml2YXRlcy5zeCA9IHN4O1xuICAgICAgcHJpdmF0ZXMuc3kgPSBzeTtcbiAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtJbWFnZX0gUmV0dXJuIHRoZSBpbWFnZSB0aGlzIFNwcml0ZS5GcmFtZSBob2xkXG4gICAgICovXG4gICAgZ2V0IGltYWdlICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcmV0dXJuIHByaXZhdGVzLmltYWdlO1xuICAgIH1cblxuICAgIHNldCBpbWFnZSAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5GcmFtZS5pbWFnZSByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IFJldHVybiBzeFxuICAgICAqL1xuICAgIGdldCBzeCAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHJldHVybiBwcml2YXRlcy5zeDtcbiAgICB9XG5cbiAgICBzZXQgc3ggKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuRnJhbWUuc3ggcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBSZXR1cm4gc3lcbiAgICAgKi9cbiAgICBnZXQgc3kgKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICByZXR1cm4gcHJpdmF0ZXMuc3k7XG4gICAgfVxuXG4gICAgc2V0IHN5ICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLkZyYW1lLnN5IHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIHByaW50ICgpIHtcbiAgICAgIGNvbnNvbGUubG9nKGludGVybmFsKHRoaXMpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IENsb25lIHRoaXMgU3ByaXRlLkZyYW1lXG4gICAgICovXG4gICAgY2xvbmUgKCkge1xuICAgICAgbGV0IGZyYW1lID0gbmV3IFNwcml0ZS5GcmFtZShcbiAgICAgICAgdGhpcy5pbWFnZSxcbiAgICAgICAgdGhpcy5zeCwgdGhpcy5zeSxcbiAgICAgICAgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHRcbiAgICAgICk7XG4gICAgICBmcmFtZS54ID0gdGhpcy54O1xuICAgICAgZnJhbWUueSA9IHRoaXMueTtcbiAgICAgIGZyYW1lLnBhcmVudCA9IHRoaXMucGFyZW50O1xuICAgICAgcmV0dXJuIGZyYW1lO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZW5kZXJlclxuICAgICAqL1xuICAgIGRyYXcgKHJlbmRlcmVyKSB7XG4gICAgICB0aGlzLmRyYXdJbWFnZShcbiAgICAgICAgcmVuZGVyZXIsIHRoaXMuaW1hZ2UsXG4gICAgICAgIHRoaXMuc3gsIHRoaXMuc3ksXG4gICAgICAgIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0XG4gICAgICApO1xuICAgIH1cblxuICB9KTtcblxuXG59KSgpO1xuIl19

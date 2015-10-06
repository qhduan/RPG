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

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

      _get(Object.getPrototypeOf(SpriteFrame.prototype), "constructor", this).call(this);
      var privates = internal(this);
      privates.image = image;
      privates.sx = sx;
      privates.sy = sy;
      this.width = width;
      this.height = height;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TcHJpdGUvU3ByaXRlRnJhbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsQ0FBQyxZQUFZO0FBQ1osY0FBWSxDQUFDOztBQUVaLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7Ozs7O0FBTWxDLFFBQU0sQ0FBQyxNQUFNLENBQUMsT0FBTztjQUFRLFdBQVc7O0FBRTFCLGFBRmUsV0FBVyxDQUV6QixLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFOzRCQUZoQixXQUFXOztBQUdwQyxpQ0FIeUIsV0FBVyw2Q0FHNUI7QUFDUixVQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsY0FBUSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDdkIsY0FBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDakIsY0FBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDakIsVUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbkIsVUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7S0FDdEI7Ozs7OztpQkFWMEIsV0FBVzs7YUErQ2hDLGlCQUFHO0FBQ1AsZUFBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztPQUM3Qjs7Ozs7OzthQUtLLGlCQUFHO0FBQ1AsWUFBSSxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUMxQixJQUFJLENBQUMsS0FBSyxFQUNWLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFDaEIsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUN4QixDQUFDO0FBQ0YsYUFBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2pCLGFBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNqQixhQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDM0IsZUFBTyxLQUFLLENBQUM7T0FDZDs7Ozs7OzthQUtJLGNBQUMsUUFBUSxFQUFFO0FBQ2QsWUFBSSxDQUFDLFNBQVMsQ0FDWixRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFDcEIsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUNoQixJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQ3hCLENBQUM7T0FDSDs7O1dBN0RTLGVBQUc7QUFDWCxZQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsZUFBTyxRQUFRLENBQUMsS0FBSyxDQUFDO09BQ3ZCO1dBRVMsYUFBQyxLQUFLLEVBQUU7QUFDaEIsY0FBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO09BQ2hEOzs7Ozs7O1dBS00sZUFBRztBQUNSLFlBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixlQUFPLFFBQVEsQ0FBQyxFQUFFLENBQUM7T0FDcEI7V0FFTSxhQUFDLEtBQUssRUFBRTtBQUNiLGNBQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztPQUM3Qzs7Ozs7OztXQUtNLGVBQUc7QUFDUixZQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsZUFBTyxRQUFRLENBQUMsRUFBRSxDQUFDO09BQ3BCO1dBRU0sYUFBQyxLQUFLLEVBQUU7QUFDYixjQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUM7T0FDN0M7OztXQTdDMEIsV0FBVztLQUFTLE1BQU0sQ0FBQyxPQUFPLEVBNkU3RCxDQUFDO0NBR0osQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiU3ByaXRlRnJhbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG4yRCBHYW1lIFNwcml0ZSBMaWJyYXJ5LCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgQ2xhc3MgU3ByaXRlLkZyYW1lXG4gKiBAYXV0aG9yIG1haWxAcWhkdWFuLmNvbSAoUUggRHVhbilcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCBpbnRlcm5hbCA9IFNwcml0ZS5OYW1lc3BhY2UoKTtcblxuICAvKipcbiAgICogQ2xhc3MgU3ByaXRlLkZyYW1lLCBhIGZyYW1lIG9mIFNwcml0ZS5TaGVldFxuICAgKiBAY2xhc3NcbiAgICovXG4gIFNwcml0ZS5hc3NpZ24oXCJGcmFtZVwiLCBjbGFzcyBTcHJpdGVGcmFtZSBleHRlbmRzIFNwcml0ZS5EaXNwbGF5IHtcblxuICAgIGNvbnN0cnVjdG9yIChpbWFnZSwgc3gsIHN5LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICBwcml2YXRlcy5pbWFnZSA9IGltYWdlO1xuICAgICAgcHJpdmF0ZXMuc3ggPSBzeDtcbiAgICAgIHByaXZhdGVzLnN5ID0gc3k7XG4gICAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHJldHVybiB7SW1hZ2V9IFJldHVybiB0aGUgaW1hZ2UgdGhpcyBTcHJpdGUuRnJhbWUgaG9sZFxuICAgICAqL1xuICAgIGdldCBpbWFnZSAoKSB7XG4gICAgICBsZXQgcHJpdmF0ZXMgPSBpbnRlcm5hbCh0aGlzKTtcbiAgICAgIHJldHVybiBwcml2YXRlcy5pbWFnZTtcbiAgICB9XG5cbiAgICBzZXQgaW1hZ2UgKHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcHJpdGUuRnJhbWUuaW1hZ2UgcmVhZG9ubHlcIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBSZXR1cm4gc3hcbiAgICAgKi9cbiAgICBnZXQgc3ggKCkge1xuICAgICAgbGV0IHByaXZhdGVzID0gaW50ZXJuYWwodGhpcyk7XG4gICAgICByZXR1cm4gcHJpdmF0ZXMuc3g7XG4gICAgfVxuXG4gICAgc2V0IHN4ICh2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ByaXRlLkZyYW1lLnN4IHJlYWRvbmx5XCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gUmV0dXJuIHN5XG4gICAgICovXG4gICAgZ2V0IHN5ICgpIHtcbiAgICAgIGxldCBwcml2YXRlcyA9IGludGVybmFsKHRoaXMpO1xuICAgICAgcmV0dXJuIHByaXZhdGVzLnN5O1xuICAgIH1cblxuICAgIHNldCBzeSAodmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwcml0ZS5GcmFtZS5zeSByZWFkb25seVwiKTtcbiAgICB9XG5cbiAgICBwcmludCAoKSB7XG4gICAgICBjb25zb2xlLmxvZyhpbnRlcm5hbCh0aGlzKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDbG9uZSB0aGlzIFNwcml0ZS5GcmFtZVxuICAgICAqL1xuICAgIGNsb25lICgpIHtcbiAgICAgIGxldCBmcmFtZSA9IG5ldyBTcHJpdGUuRnJhbWUoXG4gICAgICAgIHRoaXMuaW1hZ2UsXG4gICAgICAgIHRoaXMuc3gsIHRoaXMuc3ksXG4gICAgICAgIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0XG4gICAgICApO1xuICAgICAgZnJhbWUueCA9IHRoaXMueDtcbiAgICAgIGZyYW1lLnkgPSB0aGlzLnk7XG4gICAgICBmcmFtZS5wYXJlbnQgPSB0aGlzLnBhcmVudDtcbiAgICAgIHJldHVybiBmcmFtZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVuZGVyZXJcbiAgICAgKi9cbiAgICBkcmF3IChyZW5kZXJlcikge1xuICAgICAgdGhpcy5kcmF3SW1hZ2UoXG4gICAgICAgIHJlbmRlcmVyLCB0aGlzLmltYWdlLFxuICAgICAgICB0aGlzLnN4LCB0aGlzLnN5LFxuICAgICAgICB0aGlzLndpZHRoLCB0aGlzLmhlaWdodFxuICAgICAgKTtcbiAgICB9XG5cbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==

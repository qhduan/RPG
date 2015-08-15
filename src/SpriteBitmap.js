/// @file SpriteBitmap.js
///

(function () {

  Sprite.Bitmap = class Bitmap extends Sprite.Display {

    constructor (image) {
      super();
      this._image = image;
      this._width = image.width;
      this._height = image.height;
    }

    clone () {
      var bitmap = new Bitmap(this._image);
      bitmap.x = this.x;
      bitmap.y = this.y;
      bitmap.center.x = this.center.x;
      bitmap.center.y = this.center.y;
      bitmap.scale.x = this.scale.x;
      bitmap.scale.y = this.scale.y;
      return bitmap;
    }

    get width () {
      return this._width;
    }

    set width (value) {
      this._width = value;
    }

    get height () {
      return this._height;
    }

    set height (value) {
      this._height = value;
    }

    draw (context) {
      if (this._image && this._image.width > 0 && this._image.height > 0) {
        this.drawImage(context, this._image,
          0, 0, this._width, this._height,
          0, 0, this._width, this._height);
      }
    }

  };

})();

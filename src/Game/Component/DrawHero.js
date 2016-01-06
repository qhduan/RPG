/*

A-RPG Game, Built using JavaScript ES6
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


"use strict";

import Sprite from "../../Sprite/Sprite.js";

let internal = Sprite.Util.namespace();

// 合并图片
// 把images中的所有图片按顺序draw到一个canvas上面，然后用canvas.toDataURL返回一张叠好的图片
function CombineHeroImage (images, width, height) {
  return new Promise( (resolve, reject) => {
    let canvas = document.createElement("canvas");
    canvas.height = height;
    canvas.width = width;
    let context = canvas.getContext("2d");
    context.clearRect(0, 0, width, height);

    let length = images.length - 1; // 最后一张图是武器
    for (let i = 0; i < length; i++) {
      let img = images[i];
      context.drawImage(
        img, 0, 0, img.width, img.height,
        0, 0, width, height
      );
    }

    let withoutWeapon = null;
    let withWeapon = null;

    let promises = new Set();

    withoutWeapon = new Image();
    withoutWeapon.src = canvas.toDataURL("image/png");

    promises.add(
      new Promise( (resolve, reject) => {
        if (withoutWeapon.complete) {
          resolve();
        } else {
          withoutWeapon.onload = () => {
            resolve();
          };
        }
      })
    );

    context.drawImage(
      images[length], 0, 0, images[length].width, images[length].height,
      0, 0, width, height
    );

    withWeapon = new Image();
    withWeapon.src = canvas.toDataURL("image/png");

    promises.add(
      new Promise( (resolve, reject) => {
        if (withWeapon.complete) {
          resolve();
        } else {
          withWeapon.onload = () => {
            resolve();
          };
        }
      })
    );

    // Promise es6
    Promise.all(promises).then( () => {
      resolve([withoutWeapon, withWeapon]);
    });
  });
}


function Check (str) {
  if (typeof str == "string" && str.length > 0)
    return true;
  return false;
}

// 把多张图片合成一张，并返回
export default function DrawHero (heroCustom) {
  return new Promise( (resolve, reject) => {
    let BASE = "hero";
    let imageUrls = [];

    if (Check(heroCustom.sex) && Check(heroCustom.body)) {
      // 必须按顺序
      // 身体
      imageUrls.push(`${BASE}/body/${heroCustom.sex}/${heroCustom.body}.png`);
      // 眼睛
      if (Check(heroCustom.eyes))
        imageUrls.push(`${BASE}/body/${heroCustom.sex}/eyes/${heroCustom.eyes}.png`);
      // 衣服
      if (Check(heroCustom.shirts))
        imageUrls.push(`${BASE}/shirts/${heroCustom.sex}/${heroCustom.shirts}.png`);
      if (Check(heroCustom.pants))
        imageUrls.push(`${BASE}/pants/${heroCustom.sex}/${heroCustom.pants}.png`);
      if (Check(heroCustom.shoes))
      // 盔甲
        imageUrls.push(`${BASE}/shoes/${heroCustom.sex}/${heroCustom.shoes}.png`);
      if (Check(heroCustom.armorchest))
        imageUrls.push(`${BASE}/armor/chest/${heroCustom.sex}/${heroCustom.armorchest}.png`);
      if (Check(heroCustom.armorarm))
        imageUrls.push(`${BASE}/armor/arm/${heroCustom.sex}/${heroCustom.armorarm}.png`);
      if (Check(heroCustom.armorlegs))
        imageUrls.push(`${BASE}/armor/legs/${heroCustom.sex}/${heroCustom.armorlegs}.png`);
      if (Check(heroCustom.armorfeet))
        imageUrls.push(`${BASE}/armor/feet/${heroCustom.sex}/${heroCustom.armorfeet}.png`);
      // 头发
      if (Check(heroCustom.hair) && Check(heroCustom.haircolor))
        imageUrls.push(`${BASE}/hair/${heroCustom.sex}/${heroCustom.hair}/${heroCustom.haircolor}.png`);
      // 头
      if (Check(heroCustom.head))
        imageUrls.push(`${BASE}/head/${heroCustom.sex}/${heroCustom.head}.png`);
      // 头盔
      if (Check(heroCustom.armorhelms))
        imageUrls.push(`${BASE}/armor/helms/${heroCustom.sex}/${heroCustom.armorhelms}.png`);
      // 武器（包括所有武器）
      imageUrls.push(`${BASE}/weapons/${heroCustom.sex}/weapons.png`);
    }

    Sprite.Loader.load(imageUrls).then( (data) => {
      CombineHeroImage(data, heroCustom.width, heroCustom.height).then( (data) => {
        resolve(data);
      });
    });
  });


}

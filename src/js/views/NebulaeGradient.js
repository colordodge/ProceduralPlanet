import * as THREE from 'three'


class NebulaeGradient {

  constructor() {
    this.waterLevel = 0.0;

    this.desatAmount = Math.random();


    let h = this.randRange(0.0, 1.0);
    let s = this.randRange(0.3, 0.7);
    // let s = 1;
    let l = this.randRange(0.4, 0.6);
    // let l = 0.5;
    this.baseColor = new THREE.Color().setHSL(h, s, l);
    this.colorAngle = this.randRange(0.0, 0.5)
    // console.log("nebula colorAngle = " + this.colorAngle);

    // this.generateTexture();
  }

  generateTexture() {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "nebulaeCanvas";
    this.canvas.width = 512;
    this.canvas.height = 512;
    this.canvas.style.width = "200px";
    this.canvas.style.height = "200px";
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.ctx = this.canvas.getContext("2d");

    this.fillBaseColor();

    let numStrips = Math.round(Math.random()*80) + 20;
    numStrips = 20;
    for (let i=0; i<numStrips; i++) {
      this.randomGradientCircle();
    }

    // document.body.appendChild(this.canvas);
    this.texture = new THREE.CanvasTexture(this.canvas);
  }

  fillBaseColor() {
    this.ctx.fillStyle = this.toCanvasColor(this.baseColor);
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  randomGradientRect() {
    let x1 = Math.random() * this.width;
    let y1 = Math.random() * this.height;
    let x2 = x1 + Math.random() * 100+100 * (Math.round(Math.random())*2-1);
    let y2 = y1 + Math.random() * 100+100 * (Math.round(Math.random())*2-1);

    let gradient = this.ctx.createLinearGradient(x1, y1, x2, y2);

    let c = this.randomColor();
    gradient.addColorStop(0, "rgba("+c.r+", "+c.g+", "+c.b+", 0.0)");
    gradient.addColorStop(0.5, "rgba("+c.r+", "+c.g+", "+c.b+", 1.0)");
    gradient.addColorStop(1, "rgba("+c.r+", "+c.g+", "+c.b+", 0.0)");

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  randomGradientCircle() {
    let x1 = Math.random() * this.width;
    let y1 = Math.random() * this.height;
    let size = Math.random()*200+30;
    let x2 = x1;
    let y2 = y1;
    let r1 = 0;
    let r2 = size;

    let gradient = this.ctx.createRadialGradient(x1,y1,r1,x2,y2,r2);

    let c = this.randomColor();

    gradient.addColorStop(0, "rgba("+c.r+", "+c.g+", "+c.b+", 1.0)");
    gradient.addColorStop(1, "rgba("+c.r+", "+c.g+", "+c.b+", 0.0)");

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }


  randomColor() {

    let newColor = this.baseColor.clone();

    let hOffset = 0.0;
    let range = 0.1;
    let n = Math.random();
    if (n < 0.33) {
      hOffset = 0.0 + this.randRange(-range, range);
    } else if (n < 0.66) {
      hOffset = this.colorAngle + this.randRange(-range, range);
    } else {
      hOffset = -this.colorAngle + this.randRange(-range, range);
    }

    let sOffset = this.randRange(-0.4, 0.4);
    let lOffset = this.randRange(-0.4, 0.4);

    newColor.offsetHSL(hOffset, sOffset, lOffset);

    return {r: Math.round(newColor.r*255),
            g: Math.round(newColor.g*255),
            b: Math.round(newColor.b*255)};

  }

  toCanvasColor(c) {
    return "rgba("+Math.round(c.r*255)+", "+Math.round(c.g*255)+", "+Math.round(c.b*255)+", 1.0)";
  }

  randRange(low, high) {
    let range = high - low;
    let n = Math.random() * range;
    return low + n;
  }

  mix(v1, v2, amount) {
    let dist = v2 - v1;
    return v1 + (dist * amount);
  }

}

export default NebulaeGradient;

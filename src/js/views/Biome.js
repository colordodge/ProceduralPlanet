import * as THREE from 'three'


class Biome {

  constructor() {

    this.canvas = document.createElement("canvas");
    this.canvas.id = "biomeCanvas";
    this.canvas.width = 512;
    this.canvas.height = 512;
    this.canvas.style.width = "200px";
    this.canvas.style.height = "200px";
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.ctx = this.canvas.getContext("2d");

    document.body.appendChild(this.canvas);
    this.toggleCanvasDisplay(false);

  }

  generateTexture(props) {

    this.waterLevel = props.waterLevel;

    let h = this.randRange(0.0, 1.0);
    let s = this.randRange(0.0, 0.5);
    let l = this.randRange(0.3, 0.5);
    this.baseColor = new THREE.Color().setHSL(h, s, l);
    this.colorAngle = this.randRange(0.0, 0.5)
    this.satRange = this.randRange(0.3, 0.5);
    this.lightRange = this.randRange(0.3, 0.5);
    this.circleSize = this.randRange(50, 200);


    this.drawBase();

    // circles
    let numCircles = Math.round(this.randRange(10, 100));
    // numCircles = 100;
    for (let i=0; i<numCircles; i++) {
      this.randomGradientCircle();
    }

    this.drawDetail();
    this.drawInland();
    this.drawBeach();
    this.drawWater();


    this.texture = new THREE.CanvasTexture(this.canvas);
  }

  toggleCanvasDisplay(value) {
    if (value) {
      this.canvas.style.display = "block";
    } else {
      this.canvas.style.display = "none";
    }
  }

  drawBase() {
    this.fillBaseColor();

    for (let i=0; i<5; i++) {
      let x = 0;
      let y =0;
      let width = this.width;
      let height = this.height;
      this.randomGradientRect(x, y, width, height);
    }
  }

  drawDetail() {
    // land detail
    let landDetail = Math.round(this.randRange(0, 5));
    // landDetail = 20;
    // console.log("landDetail = " + landDetail);
    for (let i=0; i<landDetail; i++) {
      let x1 = this.randRange(0, this.width);
      let y1 = this.randRange(0, this.height);
      let x2 = this.randRange(0, this.width);
      let y2 = this.randRange(0, this.height);
      let width = x2-x1;
      let height = y2-y1;

      // this.randomGradientStrip(0, 0, this.width, this.height);
      this.randomGradientStrip(x1, y1, width, height);
    }
  }

  drawRivers() {
    // rivers
    let c = this.randomColor();
    this.ctx.strokeStyle = "rgba("+c.r+", "+c.g+", "+c.b+", 0.5)";

    let x = this.randRange(0, this.width);
    let y = this.randRange(0, this.height);
    let prevX = x;
    let prevY = y;

    for (let i=0; i<5; i++) {
      x = this.randRange(0, this.width);
      y = this.randRange(0, this.height);

      this.ctx.moveTo(prevX, prevY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();

      prevX = x;
      prevY = y;
    }
  }

  randomCircle() {
    let x = this.randRange(0, this.width);
    let y = this.randRange(0, this.height);
    let rad = this.randRange(0, 10);
    // rad = 3;

    let c = this.randomColor();
    this.ctx.fillStyle = "rgba("+c.r+", "+c.g+", "+c.b+", 0.5)";
    // this.ctx.lineWidth = 1;

    this.ctx.beginPath();
    this.ctx.arc(x, y, rad, 0, 2*Math.PI);
    this.ctx.fill();
  }

  randomGradientStrip(x, y, width, height) {
    let x1 = this.randRange(0, this.width);
    let y1 = this.randRange(0, this.height);
    let x2 = this.randRange(0, this.width);
    let y2 = this.randRange(0, this.height);

    let gradient = this.ctx.createLinearGradient(x1, y1, x2, y2);

    let c = this.randomColor();
    gradient.addColorStop(this.randRange(0, 0.5), "rgba("+c.r+", "+c.g+", "+c.b+", 0.0)");
    gradient.addColorStop(0.5, "rgba("+c.r+", "+c.g+", "+c.b+", 0.8)");
    gradient.addColorStop(this.randRange(0.5, 1.0), "rgba("+c.r+", "+c.g+", "+c.b+", 0.0)");

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(x, y, width, height);
  }

  blackWhiteGradient() {
    let x1 = 0;
    let y1 = 0;
    let x2 = this.width;
    let y2 = this.height;

    let gradient = this.ctx.createLinearGradient(x1, y1, x2, y2);


    gradient.addColorStop(0, "rgba(255, 255, 255, 1.0)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 1.0)");

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  fillBaseColor() {
    this.ctx.fillStyle = this.toCanvasColor(this.baseColor);
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  randomGradientRect(x, y, width, height) {
    let x1 = this.randRange(0, this.width);
    let y1 = this.randRange(0, this.height);
    let x2 = this.randRange(0, this.width);
    let y2 = this.randRange(0, this.height);

    let gradient = this.ctx.createLinearGradient(x1, y1, x2, y2);

    let c = this.randomColor();
    gradient.addColorStop(0, "rgba("+c.r+", "+c.g+", "+c.b+", 0.0)");
    gradient.addColorStop(1, "rgba("+c.r+", "+c.g+", "+c.b+", 1.0)");

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(x, y, width, height);
  }

  drawWater() {
    let x1 = 0;
    let y1 = this.height - (this.height * this.waterLevel);
    let x2 = 0;
    let y2 = this.height;

    let gradient = this.ctx.createLinearGradient(x1, y1, x2, y2);

    let c = this.randomWaterColor();

    let falloff = 1.3;
    let falloff2 = 1.0;
    let falloff3 = 0.7;
    let opacity = 0.9;
    // gradient.addColorStop(0.0, "rgba("+cr+", "+cg+", "+cb+", "+0+")");
    gradient.addColorStop(0.0, "rgba("+Math.round(c.r*falloff)+", "+Math.round(c.g*falloff)+", "+Math.round(c.b*falloff)+", "+opacity+")");
    gradient.addColorStop(0.2, "rgba("+Math.round(c.r*falloff2)+", "+Math.round(c.g*falloff2)+", "+Math.round(c.b*falloff2)+", "+opacity+")");
    gradient.addColorStop(0.8, "rgba("+Math.round(c.r*falloff3)+", "+Math.round(c.g*falloff3)+", "+Math.round(c.b*falloff3)+", "+opacity+")");

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(x1, y1, this.width, this.height);
  }

  drawBeach() {
    this.beachSize = 7;

    let x1 = 0;
    let y1 = this.height - (this.height * this.waterLevel) - this.beachSize;
    let x2 = 0;
    let y2 = this.height - (this.height * this.waterLevel);

    let gradient = this.ctx.createLinearGradient(x1, y1, x2, y2);

    let c = this.randomColor();
    let falloff = 1.0;
    let falloff2 = 1.0;
    // gradient.addColorStop(0.0, "rgba("+cr+", "+cg+", "+cb+", "+0+")");
    gradient.addColorStop(0.0, "rgba("+Math.round(c.r*falloff)+", "+Math.round(c.g*falloff)+", "+Math.round(c.b*falloff)+", "+0.0+")");
    gradient.addColorStop(1.0, "rgba("+Math.round(c.r*falloff2)+", "+Math.round(c.g*falloff2)+", "+Math.round(c.b*falloff2)+", "+0.3+")");

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(x1, y1, this.width, this.beachSize);
  }

  drawInland() {
    this.inlandSize = 100;

    let x1 = 0;
    let y1 = this.height - (this.height * this.waterLevel) - this.inlandSize;
    let x2 = 0;
    let y2 = this.height - (this.height * this.waterLevel);

    let gradient = this.ctx.createLinearGradient(x1, y1, x2, y2);

    let c = this.randomColor();
    let falloff = 1.0;
    let falloff2 = 1.0;
    // gradient.addColorStop(0.0, "rgba("+cr+", "+cg+", "+cb+", "+0+")");
    gradient.addColorStop(0.0, "rgba("+Math.round(c.r*falloff)+", "+Math.round(c.g*falloff)+", "+Math.round(c.b*falloff)+", "+0.0+")");
    gradient.addColorStop(1.0, "rgba("+Math.round(c.r*falloff2)+", "+Math.round(c.g*falloff2)+", "+Math.round(c.b*falloff2)+", "+0.5+")");

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(x1, y1, this.width, this.inlandSize);
  }

  randomGradientCircle() {
    let x1 = this.randRange(0, this.width);
    let y1 = this.randRange(0, this.height) - this.height * this.waterLevel;
    let size = this.randRange(1, this.circleSize);
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

  randomWaterColor() {
    let newColor = this.baseColor.clone();
    let sOffset = this.randRange(-0.3, 0);
    // let sOffset = 0;
    let hOffset = 0.0;
    let range = 0.5;
    let n = this.randRange(0,1);
    if (n < 0.33) {
      hOffset = 0.0 + this.randRange(-range, range);
    } else if (n < 0.66) {
      hOffset = this.colorAngle + this.randRange(-range, range);
    } else {
      hOffset = -this.colorAngle + this.randRange(-range, range);
    }
    newColor.offsetHSL(hOffset, sOffset, 0);
    let c = newColor.getHSL();
    newColor.setHSL(c.h, this.randRange(0.1, 0.4), this.randRange(0.2, 0.4));
    return {r: Math.round(newColor.r*255),
            g: Math.round(newColor.g*255),
            b: Math.round(newColor.b*255)};
  }

  randomColor() {

    let newColor = this.baseColor.clone();

    let hOffset = 0.0;
    let range = 0.1;
    let n = this.randRange(0,1);
    if (n < 0.33) {
      hOffset = 0.0 + this.randRange(-range, range);
    } else if (n < 0.66) {
      hOffset = this.colorAngle + this.randRange(-range, range);
    } else {
      hOffset = -this.colorAngle + this.randRange(-range, range);
    }

    let sOffset = this.randRange(-this.satRange, this.satRange);
    let lOffset = this.randRange(-this.lightRange, this.lightRange*0.5);

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
    let n = window.rng() * range;
    return low + n;
  }

  mix(v1, v2, amount) {
    let dist = v2 - v1;
    return v1 + (dist * amount);
  }

}

export default Biome;

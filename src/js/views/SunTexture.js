import * as THREE from 'three'

export default class SunTexture {

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "sunCanvas";
    this.width = 1024;
    this.height = 1024;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.width = "500px";
    this.canvas.style.height = "500px";
    this.ctx = this.canvas.getContext("2d");

    this.texture = new THREE.CanvasTexture(this.canvas);

    document.body.appendChild(this.canvas);
    this.toggleCanvasDisplay(false);
  }


  generateTexture() {

    let h = this.randRange(0.0, 1.0);
    let s = this.randRange(0.0, 0.5);
    let l = this.randRange(0.2, 0.5);
    this.baseColor = new THREE.Color().setHSL(h, s, l);

    this.baseHue = this.randRange(0.0, 1.0);


    this.clear();
    this.drawBaseGradient();
    this.drawStarGradient();
    this.drawBeams();
    this.drawHalo();
    // this.drawBaseGradient2();


    this.texture = new THREE.CanvasTexture(this.canvas);
  }

  clear() {
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawBaseGradient() {
    let x = this.width/2;
    let y = this.width/2;
    let r1 = 0;
    let r2 = this.width/2;

    let h = this.baseHue;
    let s = 0.8;
    let l = 0.1;
    // console.log("h = " + h);

    let gradient = this.ctx.createRadialGradient(x,y,r1,x,y,r2);
    this.addColorToGradient(0, {h:h, s:s, l:l, a:0.5}, gradient);
    this.addColorToGradient(0.4, {h:h, s:s, l:l, a:0.7}, gradient);
    this.addColorToGradient(0.6, {h:h-0.05, s:s, l:l, a:0.3}, gradient);
    this.addColorToGradient(0.9, {h:h, s:s, l:l, a:0}, gradient);
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawStarGradient() {
    let x = this.width/2;
    let y = this.width/2;
    let r1 = 0;
    let r2 = this.width/2;

    let h = this.baseHue-0.1;
    let s = 0.6;
    let l = 0.4;
    // console.log("h = " + h);

    let size = 0.03;
    size = this.randRange(0.03, 0.07);

    let gradient = this.ctx.createRadialGradient(x,y,r1,x,y,r2);
    this.addColorToGradient(0, {h:h, s:s, l:1.0, a:1.0}, gradient);
    this.addColorToGradient(size, {h:h, s:s, l:0.9 , a:1.0}, gradient);
    this.addColorToGradient(size*2, {h:h, s:s, l:0.6, a:0.9}, gradient);
    this.addColorToGradient(size*6.0, {h:h, s:s, l:0.4, a:0.4}, gradient);
    this.addColorToGradient(size*11, {h:h, s:s, l:0.0, a:0.0}, gradient);
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawBeams() {

    let x = this.width/2;
    let y = this.width/2;
    let r1 = 0;
    let r2 = this.width/2;

    let h = this.baseHue;
    let s = 1.0;
    let l = 0.9;
    // console.log("h = " + h);

    let dist = this.randRange(0.5, 1.0);
    dist = 1;
    let gradient = this.ctx.createRadialGradient(x,y,r1,x,y,r2);
    this.addColorToGradient(0, {h:h, s:s, l:l, a:0.1}, gradient);
    this.addColorToGradient(0.15, {h:h, s:s, l:l, a:0.025}, gradient);
    this.addColorToGradient(dist, {h:h, s:s, l:l , a:0.0}, gradient);

    let numBeams = Math.floor(this.randRange(1, 5));
    numBeams *= 2;
    let size = this.randRange(0.05, 0.2);
    let angleStep = Math.PI*2 / numBeams;
    for (let i=0; i<numBeams; i++) {
      let a = angleStep*i;

      for (let j=0; j<5; j++) {
        a += 0.02;
        this.ctx.beginPath();
        this.ctx.moveTo(x,y);
        this.ctx.arc(x,y,r2,a,a+size);
        this.ctx.lineTo(x,y);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
      }
    }

    // dist = this.randRange(0.9, 1.0);
    // numBeams = Math.floor(this.randRange(2, 8));
    // numBeams *= 2;
    // l = this.randRange(0.5, 1.0);
    size = this.randRange(0.01, 0.1);
    gradient = this.ctx.createRadialGradient(x,y,r1,x,y,r2);
    this.addColorToGradient(0, {h:h, s:s, l:l, a:0.1}, gradient);
    this.addColorToGradient(0.15, {h:h, s:s, l:l, a:0.025}, gradient);
    this.addColorToGradient(dist, {h:h, s:s, l:l , a:0.0}, gradient);
    let offset = this.randRange(0.1, Math.PI);
    for (let i=0; i<numBeams; i++) {
      let a = angleStep*i+offset;

      for (let j=0; j<3; j++) {
        a += 0.02;
        this.ctx.beginPath();
        this.ctx.moveTo(x,y);
        this.ctx.arc(x,y,r2,a,a+size);
        this.ctx.lineTo(x,y);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
      }
    }

  }

  drawHalo() {
    let x = this.width/2;
    let y = this.width/2;
    let r1 = 0;
    let r2 = this.width/2;

    let h = this.baseHue+this.randRange(-0.2, 0.2);

    // h = this.randRange(0,1);
    let s = 1.0;
    let l = 0.7;
    // console.log("h = " + h);

    let pos = 0.23;
    pos = this.randRange(0.1, 0.2);
    let width = 0.05;
    // width = this.randRange(0.01, 0.03);

    let gradient = this.ctx.createRadialGradient(x,y,r1,x,y,r2);
    this.addColorToGradient(pos-width, {h:h, s:s, l:l, a:0.0}, gradient);
    this.addColorToGradient(pos, {h:h, s:s, l:l, a:0.2}, gradient);
    this.addColorToGradient(pos+width, {h:h, s:s, l:l, a:0.0}, gradient);

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  addColorToGradient(pos, color, gradient) {
    gradient.addColorStop(pos, this.getRGBAString(color));
  }

  getRGBAString(color) {
    let threeColor = new THREE.Color().setHSL(color.h, color.s, color.l)
    let c = {
      r: Math.round(threeColor.r*255),
      g: Math.round(threeColor.g*255),
      b: Math.round(threeColor.b*255)
    };
    let colorString = "rgba("+c.r+", "+c.g+", "+c.b+"," + color.a + ")";
    return colorString;
  }

  toggleCanvasDisplay(value) {
    if (value) {
      this.canvas.style.display = "block";
    } else {
      this.canvas.style.display = "none";
    }
  }

  randRange(low, high) {
    let range = high - low;
    let n = window.rng() * range;
    return low + n;
  }


}

import * as THREE from 'three'
import SunTexture from 'views/SunTexture.js'

export default class Sun {

  constructor() {
    this.view = new THREE.Object3D();
    this.setup();
  }

  setup() {
    let loader = new THREE.TextureLoader();
    this.textureFlare = loader.load( 'assets/textures/lenseFlareSun.jpg' );
    this.textureRing = loader.load( 'assets/textures/lenseFlareRing.jpg' );
    this.textureBlur = loader.load( 'assets/textures/lenseFlareBlur.jpg' );
    // this.textureSun = loader.load( 'assets/textures/lenseFlare.jpg' );

    this.sunTexture = new SunTexture();

  }

  createLenseFlare() {

    let h = this.randRange(0,1);
    let s = 1.0;
    let l = 1.0;
    var sunColor = new THREE.Color().setHSL(h, s, l);
    var sunColor2 = new THREE.Color().setHSL(this.randRange(0,1), s, 0.5);
    let sunSize = this.randRange(1000, 2000);
    sunSize = 1500;
    this.lensFlare = new THREE.LensFlare( this.sunTexture.texture, sunSize, 0.0, THREE.AdditiveBlending, sunColor );
    this.lensFlare.add(this.sunTexture.texture, sunSize*2, 0.1, THREE.AdditiveBlending, sunColor, 0.2);


    let numFlares = 15;
    for (let i=0; i<numFlares; i++) {
      let size = this.randRange(5, 200);
      // size = Math.pow(size, 2) * 200;
      let offset = this.randRange(0.05, 0.4);
      let color = this.randomColor();
      let alpha = this.randRange(0.1, 0.3);
      this.lensFlare.add(this.textureBlur, size, offset, THREE.AdditiveBlending, color, alpha);
    }

    numFlares = 5;
    for (let i=0; i<numFlares; i++) {
      let size = this.randRange(5, 200);
      // size = Math.pow(size, 2) * 200;
      let offset = this.randRange(-0.05, -0.2);
      let color = this.randomColor();
      let alpha = this.randRange(0.1, 0.3);
      this.lensFlare.add(this.textureBlur, size, offset, THREE.AdditiveBlending, color, alpha);
    }


    let numRings = 3;
    for (let i=0; i<numRings; i++) {
      let size = this.randRange(200, 400);
      // size = Math.pow(size, 2) * 200;
      let offset = this.randRange(-0.1, 0.2);
      let color = this.randomColor();
      let alpha = this.randRange(0, 0.1);
      this.lensFlare.add(this.textureRing, size, offset, THREE.AdditiveBlending, color, alpha);
    }

    this.lensFlare.position.set(-20000, 20000, 20000);
    this.view.add( this.lensFlare );
  }

  randomColor() {
    let h = this.randRange(0, 1);
    let s = this.randRange(0, 0.9);
    let l = 0.5;
    let color = new THREE.Color().setHSL(h, s, l);
    return color;
  }

  randRange(low, high) {
    let range = high - low;
    let n = Math.random() * range;
    return low + n;
  }

  render() {

    this.sunTexture.generateTexture();
    this.view.remove(this.lensFlare);
    this.createLenseFlare();

    // this.sunTexture.generateTexture();
    //
    // this.view.remove(this.lenseFlare);
    //
    // var flareColor = new THREE.Color( 0xffffff );
    // this.lensFlare = new THREE.LensFlare( this.sunTexture.texture, 700, 0.0, THREE.AdditiveBlending, flareColor );
    // this.lensFlare.position.set(-20000, 20000, 20000);
    // this.view.add( this.lensFlare );

    // this.lensFlare.texture = this.sunTexture.texture;
    // this.lenseFlare.texture.needsUpdate = true;
    // this.sunTexture.texture.needsUpdate = true;

    // this.view.remove(this.lenseFlare);

    // var textureFlare = new THREE.TextureLoader().load( 'assets/textures/lenseFlare.jpg' );

  }

}

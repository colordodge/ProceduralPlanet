import * as THREE from 'three'
import shaderVert from 'shaders/planet.vert'
import shaderFrag from 'shaders/atmos.frag'

class Atmosphere {

  constructor() {
    this.view = new THREE.Object3D();

    this.time = 0.0;

    this.atmo1 = 0.5;
    this.atmo2 = 0.5;
    this.atmo3 = 1.0;
    this.atmo4 = 0.5;
    this.atmo5 = 0.1;

    // this.atmo1 = 0.23;
    // this.atmo2 = 0.55;
    // this.atmo3 = 2.0;
    // this.atmo4 = 0.46;
    // this.atmo5 = 0.36;

    // this.randomizeColor();
    this.color = new THREE.Color(0x00ffff);
    this.size = 1002;
    this.atmosphere = 0.3;
    // window.gui.add(this, "atmosphere", 0.0, 1.0).step(0.01);

    // window.gui.add(this, "atmo1", 0.0, 3.0);
    // window.gui.add(this, "atmo2", 0.0, 3.0);
    // window.gui.add(this, "atmo3", 0.0, 3.0);
    // window.gui.add(this, "atmo4", 0.0, 3.0);
    // window.gui.add(this, "atmo5", 0.0, 3.0);

    this.mat = new THREE.ShaderMaterial({
      vertexShader: shaderVert,
      fragmentShader: shaderFrag,
      uniforms: {
        "time" : {type: "f", value: this.time},
        "atmo1" : {type: "f", value: this.atmo1},
        "atmo2" : {type: "f", value: this.atmo2},
        "atmo3" : {type: "f", value: this.atmo3},
        "atmo4" : {type: "f", value: this.atmo4},
        "atmo5" : {type: "f", value: this.atmo5},
        "alpha" : {type: "f", value: this.atmosphere},
        "color" : {type: "c", value: this.color}
      }
    });

    this.mat.transparent = true;
    this.mat.blending = THREE.AdditiveBlending;
    // this.mat.side = THREE.DoubleSide;

    // this.mat = new THREE.MeshStandardMaterial({color: 0xFFFFFF});

    this.geo = new THREE.IcosahedronBufferGeometry(1, 6);
    this.sphere = new THREE.Mesh(this.geo, this.mat);
    this.sphere.scale.set(this.size, this.size, this.size);
    this.view.add(this.sphere);
  }

  update() {
    this.time += this.speed;
    this.mat.uniforms.time.value = this.time;
    this.mat.uniforms.atmo1.value = this.atmo1;
    this.mat.uniforms.atmo2.value = this.atmo2;
    this.mat.uniforms.atmo3.value = this.atmo3;
    this.mat.uniforms.atmo4.value = this.atmo4;
    this.mat.uniforms.atmo5.value = this.atmo5;
    this.mat.uniforms.alpha.value = this.atmosphere;
    this.mat.uniforms.color.value = this.color;
  }

  randomize() {
    this.randomizeColor();

  }

  randomizeColor() {
    this.color = new THREE.Color();

    this.color.r = this.randRange(0.5, 1.0);
    this.color.g = this.randRange(0.5, 1.0);
    this.color.b = this.randRange(0.5, 1.0);

    this.mat.uniforms.color.value = this.color;
  }

  randRange(low, high) {
    let range = high - low;
    let n = window.rng() * range;
    return low + n;
  }
}

export default Atmosphere;

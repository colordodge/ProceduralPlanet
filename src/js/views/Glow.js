import * as THREE from 'three'
import shaderVert from 'shaders/glow.vert'
import shaderFrag from 'shaders/glow.frag'

class Glow {

  constructor() {
    this.view = new THREE.Object3D();

    this.randomizeColor();

    this.size = 1030;
    this.glow = 1.0;

    this.c = 1.0;
    this.p = 1.4;

    // window.gui.add(this, "glow", 0.0, 1.0);

    let glowFolder = window.gui.addFolder('Glow');
    glowFolder.add(this, "c", 0, 1).step(0.01);
    glowFolder.add(this, "p", 0, 6).step(0.01);



    this.mat = new THREE.ShaderMaterial({
      vertexShader: shaderVert,
      fragmentShader: shaderFrag,
      uniforms: {
        "c":   { type: "f", value: 1.0 },
        "p":   { type: "f", value: 1.4 },
        glowColor: { type: "c", value: new THREE.Color(0x00ffff) },
        viewVector: { type: "v3", value: window.camera.position }
      }
    });

    this.mat.transparent = true;
    this.mat.blending = THREE.AdditiveBlending;
    this.mat.side = THREE.BackSide;

    // this.mat = new THREE.MeshStandardMaterial({color: 0xFFFFFF});

    this.geo = new THREE.IcosahedronBufferGeometry(1, 6);
    this.sphere = new THREE.Mesh(this.geo, this.mat);
    this.sphere.scale.set(this.size, this.size, this.size);
    this.view.add(this.sphere);
  }

  update() {
    this.mat.uniforms.c.value = this.c;
    this.mat.uniforms.p.value = this.p;
    this.mat.uniforms.viewVector.value = new THREE.Vector3().subVectors( window.camera.position, this.sphere.position );
  }

  randomize() {
    this.randomizeColor();
    this.mat.uniforms.color.value = this.color;
  }

  randomizeColor() {
    this.color = new THREE.Color();
    this.color.r = window.rng();
    this.color.g = window.rng();
    this.color.b = window.rng();
  }
}

export default Glow;

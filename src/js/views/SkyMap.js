import * as THREE from 'three'
import vertShader from 'shaders/texture.vert'
import fragShader from 'shaders/skyMap.frag'
import Map from 'views/Map.js'

class SkyMap extends Map {

  constructor() {
    super();
    this.setup();
    super.setup();
  }

  setup() {
    this.mats = [];

    for (let i = 0; i < 6; i++) {
      this.mats[i] = new THREE.ShaderMaterial({
        uniforms: {
          index: {type: "i", value: i},
          seed: {type: "f", value: 0},
          resolution: {type: "f", value: 0},
          res1: {type: "f", value: 0},
          res2: {type: "f", value: 0},
          resMix: {type: "f", value: 0},
          mixScale: {type: "f", value: 0},
          color1: {type: "c", value: new THREE.Color()},
          color2: {type: "c", value: new THREE.Color()},
          color3: {type: "c", value: new THREE.Color()},
          nebulaeMap: {type: "t", value: new THREE.Texture()}
        },
        vertexShader: vertShader,
        fragmentShader: fragShader,
        transparent: true,
        depthWrite: false
      });
    }
  }

  render(props) {
    // props.seed
    // props.resolution
    // props.res1
    // props.res2
    // props.resMix
    // props.mixScale

    for (let i = 0; i < 6; i++) {
      this.mats[i].uniforms.seed.value = props.seed;
      this.mats[i].uniforms.resolution.value = props.resolution;
      this.mats[i].uniforms.res1.value = props.res1;
      this.mats[i].uniforms.res2.value = props.res2;
      this.mats[i].uniforms.resMix.value = props.resMix;
      this.mats[i].uniforms.mixScale.value = props.mixScale;
      this.mats[i].uniforms.color1.value = props.color1;
      this.mats[i].uniforms.color2.value = props.color2;
      this.mats[i].uniforms.color3.value = props.color3;
      this.mats[i].uniforms.nebulaeMap.value = props.nebulaeMap;
      this.mats[i].needsUpdate = true;
    }

    super.render(props);
  }


}

export default SkyMap;

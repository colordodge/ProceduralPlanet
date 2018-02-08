import * as THREE from 'three'
import SkyMap from 'views/SkyMap.js'

class Sky {

  constructor() {
    this.view = new THREE.Object3D();

    this.materials = [];
    this.roughness = 0.8;
    this.metalness = 0.5;
    this.emissiveIntensity = 1.0;

    this.resolution = 1024;
    this.size = 50000;

    this.skyMaps = [];

    this.color1 = new THREE.Color();
    this.color2 = new THREE.Color();
    this.color3 = new THREE.Color();

    this.setup();
    // this.render();



    // this.rotate = true;
    //
    // window.gui.add(this, "rotate");
    // window.gui.add(this, "waterLevel", 0.0, 1.0);
    //
    // this.roughnessControl = window.gui.add(this, "roughness", 0.0, 1.0);
    // this.roughnessControl.onChange(value => { this.updateMaterial(); });
    //
    // this.metalnessControl = window.gui.add(this, "metalness", 0.0, 1.0);
    // this.metalnessControl.onChange(value => { this.updateMaterial(); });
    //
    // this.emissiveIntensityControl = window.gui.add(this, "emissiveIntensity", 0.0, 3.0);
    // this.emissiveIntensityControl.onChange(value => { this.updateMaterial(); });

  }

  update() {
    //
  }

  setup() {

    this.skyMap = new SkyMap();
    this.skyMaps = this.skyMap.maps;

    for (let i=0; i<6; i++) {
      let material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0xFFFFFF),
        side: THREE.BackSide,
      });
      this.materials[i] = material;
    }

    let geo = new THREE.BoxGeometry(1, 1, 1, 64, 64, 64);
    let radius = this.size;
    for (var i in geo.vertices) {
  		var vertex = geo.vertices[i];
  		vertex.normalize().multiplyScalar(radius);
  	}
    this.computeGeometry(geo);
    this.sphere = new THREE.Mesh(geo, this.materials);
    this.view.add(this.sphere);
  }

  render(props) {

    this.seed = this.randRange(0, 1000);

    this.skyMap.render({
      seed: this.seed,
      resolution: this.resolution,
        res1: this.randRange(0.5, 1.5),
      res2: this.randRange(0.5, 1.5),
      resMix: this.randRange(0.5, 1.5),
      mixScale: 0.5,
      color1: this.color1,
      color2: this.color2,
      color3: this.color3,
      nebulaeMap: props.nebulaeMap
    });

    this.updateMaterial();
  }

  updateMaterial() {
    for (let i=0; i<6; i++) {
      let material = this.materials[i];
      material.map = this.skyMaps[i];
    }
  }


  randRange(low, high) {
    let range = high - low;
    let n = Math.random() * range;
    return low + n;
  }

  computeGeometry(geometry) {
  	// geometry.makeGroups();
  	geometry.computeVertexNormals()
  	geometry.computeFaceNormals();
  	geometry.computeMorphNormals();
  	geometry.computeBoundingSphere();
  	geometry.computeBoundingBox();
  	geometry.computeLineDistances();

  	geometry.verticesNeedUpdate = true;
  	geometry.elementsNeedUpdate = true;
  	geometry.uvsNeedUpdate = true;
  	geometry.normalsNeedUpdate = true;
  	// geometry.tangentsNeedUpdate = true;
  	geometry.colorsNeedUpdate = true;
  	geometry.lineDistancesNeedUpdate = true;
  	// geometry.buffersNeedUpdate = true;
  	geometry.groupsNeedUpdate = true;
  }

}

export default Sky;

import * as THREE from 'three'

export default class Sun {

  constructor() {
    this.view = new THREE.Object3D();
    this.setup();
  }

  setup() {
    this.geo = new THREE.SphereGeometry(1000, 32, 32);
    this.mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xFFFFFF),
      emissive: new THREE.Color(0xFFFFAA)
    });
    this.mesh = new THREE.Mesh(this.geo, this.mat);
    this.view.add(this.mesh);
  }
}

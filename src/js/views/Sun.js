import * as THREE from 'three'

export default class Sun {

  constructor() {
    this.view = new THREE.Object3D();
    this.setup();
  }

  setup() {

    var textureFlare = new THREE.TextureLoader().load( 'assets/textures/lenseFlare.jpg' );
    var flareColor = new THREE.Color( 0xffffff );
    var lensFlare = new THREE.LensFlare( textureFlare, 700, 0.0, THREE.AdditiveBlending, flareColor );

    lensFlare.position.set(-20000, 20000, 20000);
    this.view.add( lensFlare );
  }
}

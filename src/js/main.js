import * as THREE from 'three'
import AbstractApplication from 'views/AbstractApplication'
import shaderVert from 'shaders/custom.vert'
import shaderFrag from 'shaders/custom.frag'
import Planet from 'views/Planet'
import RenderQueue from 'views/RenderQueue'


class Main extends AbstractApplication {

    constructor(){
        super();

        // texture loading example
        // var texture = new THREE.TextureLoader().load( 'assets/textures/crate.gif' );

        window.renderQueue = new RenderQueue();

        this.planet = new Planet();
        this.scene.add(this.planet.view);

        this.animate();
    }

    animate() {
      window.renderQueue.update();
      this.planet.update();
      super.animate();
    }

}

export default Main;

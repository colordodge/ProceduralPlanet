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


        // this.screenshotRenderer = new THREE.WebGLRenderer({antialiasing:true});
        // this.screenshotRenderer.setPixelRatio(window.devicePixelRatio);
        // this.screenshotRenderer.setSize( window.innerWidth, window.innerHeight );
        //
        // this.shouldCaptureScreenshot = false;
        // window.gui.add(this, "saveScreenshot");

        this.animate();
    }

    saveScreenshot() {
      this.shouldCaptureScreenshot = true;
    }

    takeScreenshot() {


      // document.body.appendChild( screenshotRenderer.domElement );

      // material.uniforms.resolution.value.x = window.innerWidth*2;
      // material.uniforms.resolution.value.y = window.innerHeight*2;
      // this.screenshotRenderer.render(this.scene, this.camera);

      // var w = window.open('', '');
      // w.document.title = "screenshot";
      // w.document.body.style.backgroundColor = "black";
      // w.document.body.style.margin = "0px";
      //
      // var img = new Image();
      // img.src = this.renderer.domElement.toDataURL();
      // img.width = window.innerWidth;
      // img.height = window.innerHeight;
      // w.document.body.appendChild(img);

      window.open( this.renderer.domElement.toDataURL( 'image/png' ), 'screenshot' );

      // material.uniforms.resolution.value.x = window.innerWidth;
      // material.uniforms.resolution.value.y = window.innerHeight;
    }

    animate() {
      window.renderQueue.update();
      this.planet.update();
      super.animate();

      // if (this.shouldCaptureScreenshot == true) {
      //   this.takeScreenshot();
      //   this.shouldCaptureScreenshot = false;
      // }
    }

}

export default Main;

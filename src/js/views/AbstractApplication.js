import 'three'
import 'three/examples/js/controls/OrbitControls'
import 'three/examples/js/controls/VRControls'

import dat from 'dat-gui'
import Stats from 'stats-js'

class AbstractApplication {

    constructor(){

        this._camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 100000 );
        this._camera.position.z = 2700;
        window.camera = this._camera;

        this._scene = new THREE.Scene();

        this._renderer = new THREE.WebGLRenderer({antialias: false, alpha: true});
        this._renderer.setPixelRatio( window.devicePixelRatio );

        // this._renderer.setPixelRatio( 3.0 );
        this._renderer.setSize( window.innerWidth, window.innerHeight );
        window.renderer = this._renderer;
        document.body.appendChild( this._renderer.domElement );

        // lights
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        this._scene.add(this.ambientLight);

        this.directionalLight = new THREE.DirectionalLight( 0xffffff, 1.6 );
        this.directionalLight.position.set( -1, 1.0, 1 );
        this._scene.add(this.directionalLight);


        // var textureFlare = textureLoader.load( "textures/lensflare/lensflare.png" );
        var textureFlare = new THREE.TextureLoader().load( 'assets/textures/lenseFlare.jpg' );
        var textureFlare2 = new THREE.TextureLoader().load( 'assets/textures/lenseFlare.png' );
        var flareColor = new THREE.Color( 0xffffff );

        var lensFlare = new THREE.LensFlare( textureFlare, 700, 0.0, THREE.AdditiveBlending, flareColor );

        // lensFlare.add( textureFlare, 900, 0.1, THREE.AdditiveBlending, new THREE.Color( 0x666666 ) );



        lensFlare.position.set(-20000, 20000, 20000);
        this._scene.add( lensFlare );

        // let directionalLight2 = new THREE.DirectionalLight( 0xffffff, 0.5 );
        // directionalLight2.position.set( -3, 10, 5 );
        // this._scene.add(directionalLight2);

        this._controls = new THREE.OrbitControls( this._camera, this._renderer.domElement );
        //this._controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
        this._controls.enableDamping = true;
        this._controls.dampingFactor = 0.1;
        this._controls.rotateSpeed = 0.1;
        this._controls.autoRotate = false;
        this._controls.autoRotateSpeed = 0.01;
        this._controls.zoomSpeed = 0.1;
        // this._controls.enableZoom = false;

        // gui
        window.gui = new dat.GUI();

        let lightFolder = gui.addFolder('Lighting');

        this.sunColor = {r:255, g:255, b:255};
        this.dirLightControl = lightFolder.addColor(this, "sunColor").onChange(value => {
          this.directionalLight.color.r = this.sunColor.r / 255;
          this.directionalLight.color.g = this.sunColor.g / 255;
          this.directionalLight.color.b = this.sunColor.b / 255;
        });

        lightFolder.add(this.directionalLight, "intensity", 0.0, 3.0);
        // this.dirLightControl.onChange(value => {});

        this.ambientColor = {r:255, g:255, b:255};
        this.ambientControl = lightFolder.addColor(this, "ambientColor").onChange(value => {
          this.ambientLight.color.r = this.ambientColor.r / 255;
          this.ambientLight.color.g = this.ambientColor.g / 255;
          this.ambientLight.color.b = this.ambientColor.b / 255;
        });

        lightFolder.add(this.ambientLight, "intensity", 0.0, 2.0);

        let cameraFolder = gui.addFolder('Camera');

        cameraFolder.add(this._controls, "autoRotate");

        this.fovControl = cameraFolder.add(this._camera, "fov", 20, 120);
        this.fovControl.onChange(value => { this._camera.updateProjectionMatrix() });

        // stats
        this.stats = new Stats();
        this.stats.setMode(0);
        // document.body.appendChild(this.stats.domElement);
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '10px';
        this.stats.domElement.style.top = '0px';

        window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
    }

    get renderer(){

        return this._renderer;

    }

    get camera(){

        return this._camera;

    }

    get scene(){

        return this._scene;

    }


    onWindowResize() {

        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize( window.innerWidth, window.innerHeight );

    }

    animate(timestamp) {
        this.stats.begin();
        requestAnimationFrame( this.animate.bind(this) );

        this._controls.update();
        this._renderer.render( this._scene, this._camera );
        this.stats.end();
    }


}
export default AbstractApplication;

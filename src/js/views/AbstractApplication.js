import 'three'
import 'three/examples/js/controls/OrbitControls'
import 'three/examples/js/controls/VRControls'

import dat from 'dat-gui'
import Stats from 'stats-js'

class AbstractApplication {

    constructor(){

        this._camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100000 );
        this._camera.position.z = 3500;
        window.camera = this._camera;

        this._scene = new THREE.Scene();

        this._renderer = new THREE.WebGLRenderer({antialias: false});
        this._renderer.setPixelRatio( window.devicePixelRatio );
        // this._renderer.setPixelRatio( 0.5 );
        this._renderer.setSize( window.innerWidth, window.innerHeight );
        window.renderer = this._renderer;
        document.body.appendChild( this._renderer.domElement );

        // lights
        let ambientLight = new THREE.AmbientLight(0xffffff, 0.0);
        this._scene.add(ambientLight);

        let directionalLight = new THREE.DirectionalLight( 0xffffff, 1.6 );
        directionalLight.position.set( -1, 1.0, 1 );
        this._scene.add(directionalLight);

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

        window.gui.add(this._controls, "autoRotate");

        this.fovControl = window.gui.add(this._camera, "fov", 20, 120);
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

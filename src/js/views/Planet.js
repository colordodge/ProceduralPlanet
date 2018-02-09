import * as THREE from 'three'
import textureVert from 'shaders/texture.vert'
import textureFrag from 'shaders/textureMap.frag'
import normalMapFrag from 'shaders/normalMap.frag'
import normalMapVert from 'shaders/normalMap.vert'
import roughnessMapFrag from 'shaders/roughnessMap.frag'
import Biome from 'views/Biome'
import Atmosphere from 'views/Atmosphere.js'
import NoiseMap from 'views/NoiseMap.js'
import TextureMap from 'views/TextureMap.js'
import NormalMap from 'views/NormalMap.js'
import RoughnessMap from 'views/RoughnessMap.js'
import Clouds from 'views/Clouds.js'
import Sky from 'views/Sky.js'
import Sun from 'views/Sun.js'
import Glow from 'views/Glow.js'
import NebulaeGradient from 'views/NebulaeGradient.js'
import seedrandom from 'seedrandom'


class Planet {

  constructor() {

    this.seedString = "Scarlett";
    this.initSeed();

    this.view = new THREE.Object3D();

    this.materials = [];
    this.roughness = 0.8;
    this.metalness = 0.5;
    this.normalScale = 3.0;
    this.resolution = 1024;
    this.size = 1000;
    this.waterLevel = 0.0;
    // this.waterLevel = 0.5;

    this.heightMaps = [];
    this.moistureMaps = [];
    this.textureMaps = [];
    this.normalMaps = [];
    this.roughnessMaps = [];

    let matFolder = gui.addFolder('Material');

    this.roughnessControl = matFolder.add(this, "roughness", 0.0, 1.0);
    this.roughnessControl.onChange(value => { this.updateMaterial(); });

    this.metalnessControl = matFolder.add(this, "metalness", 0.0, 1.0);
    this.metalnessControl.onChange(value => { this.updateMaterial(); });

    this.normalScaleControl = matFolder.add(this, "normalScale", -3.0, 6.0).listen();
    this.normalScaleControl.onChange(value => { this.updateMaterial(); });

    this.createScene();
    this.createSky();
    // this.createSun();
    // this.createClouds();
    // this.createGlow();
    this.createAtmosphere();

    this.renderScene();


    this.rotate = true;
    this.autoGenerate = false;
    this.autoGenCountCurrent = 0;
    this.autoGenCountMax = 1 * 60 * 60;

    window.gui.add(this, "rotate");

    this.resolutionControl = window.gui.add(this, "resolution", [256, 512, 1024, 2048, 4096]);



    window.gui.add(this, "autoGenerate");
    window.gui.add(this, "generateAll");

    document.addEventListener('keydown', (event) => {
      if (event.keyCode == 32) {
        this.generateAll();
      }
    });

  }

  update() {
    if (this.rotate) {
      this.ground.rotation.y += 0.0005;
      // this.clouds.view.rotation.y += 0.0007;
    }
    this.atmosphere.update();
    // this.glow.update();

    if (this.autoGenerate) {
      this.autoGenCountCurrent++;
      if (this.autoGenCountCurrent > this.autoGenCountMax) {
        this.generateAll();
      }
    }

    this.sky.view.position.copy(window.camera.position);

  }

  initSeed() {
    window.rng = seedrandom(this.seedString);
  }

  generateAll() {
    this.autoGenCountCurrent = 0;
    this.renderScene();
  }


  createScene() {
    this.heightMap = new NoiseMap();
    this.heightMaps = this.heightMap.maps;

    this.moistureMap = new NoiseMap();
    this.moistureMaps = this.moistureMap.maps;

    this.textureMap = new TextureMap();
    this.textureMaps = this.textureMap.maps;

    this.normalMap = new NormalMap();
    this.normalMaps = this.normalMap.maps;

    this.roughnessMap = new RoughnessMap();
    this.roughnessMaps = this.roughnessMap.maps;

    for (let i=0; i<6; i++) {
      let material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xFFFFFF)
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
    this.ground = new THREE.Mesh(geo, this.materials);
    this.view.add(this.ground);
  }


  renderScene() {

    this.initSeed();

    this.seed = this.randRange(0, 1) * 1000.0;
    this.waterLevel = this.randRange(0.1, 0.6);
    // this.clouds.resolution = this.resolution;

    this.updateNormalScaleForRes(this.resolution);
    this.renderBiomeTexture();
    this.renderNebulaeGradient();

    this.sky.resolution = this.resolution;
    this.sky.color1 = this.biome.randomNebulaeColor(0);
    this.sky.color2 = this.biome.randomNebulaeColor(1);
    this.sky.color3 = this.biome.randomNebulaeColor(2);


    this.atmosphere.randomizeColor();
    // this.clouds.randomizeColor();
    // this.clouds.color = this.atmosphere.color;

    window.renderQueue.start();


    this.heightMap.render({
      seed: this.seed,
      resolution: this.resolution,
      res1: this.randRange(0.1, 2.0),
      res2: this.randRange(0.1, 2.0),
      resMix: this.randRange(0.1, 2.0),
      mixScale: this.randRange(0.3, 0.7),
      doesRidged: Math.floor(this.randRange(0, 4))
      // doesRidged: 1
    });

    this.moistureMap.render({
      seed: this.seed + 392.253,
      resolution: this.resolution,
      res1: this.randRange(0.1, 2.0),
      res2: this.randRange(0.1, 2.0),
      resMix: this.randRange(0.1, 2.0),
      mixScale: this.randRange(0.3, 0.7),
      doesRidged: Math.floor(this.randRange(0, 4))
      // doesRidged: 0
    });

    this.textureMap.render({
      resolution: this.resolution,
      heightMaps: this.heightMaps,
      moistureMaps: this.moistureMaps,
      biomeMap: this.biome.texture
    });

    this.normalMap.render({
      resolution: this.resolution,
      waterLevel: this.waterLevel,
      heightMaps: this.heightMaps,
      textureMaps: this.textureMaps
    });

    this.roughnessMap.render({
      resolution: this.resolution,
      heightMaps: this.heightMaps,
      waterLevel: this.waterLevel
    });

    // this.clouds.render({
    //   waterLevel: this.waterLevel
    // });

    this.sky.render({
      nebulaeMap: this.nebulaeGradient.texture
    });



    window.renderQueue.addCallback(() => {
      this.updateMaterial();
    });
  }

  updateMaterial() {
    for (let i=0; i<6; i++) {
      let material = this.materials[i];
      material.roughness = this.roughness;
      material.metalness = this.metalness;

      // material.map = this.heightMaps[i];

      material.map = this.textureMaps[i];
      material.normalMap = this.normalMaps[i];
      material.normalScale = new THREE.Vector2(this.normalScale, this.normalScale);
      material.roughnessMap = this.roughnessMaps[i];

      material.needsUpdate = true;
    }
  }

  renderBiomeTexture() {
    this.biome = new Biome({waterLevel: this.waterLevel});
  }

  renderNebulaeGradient() {
    this.nebulaeGradient = new NebulaeGradient();
    // this.nebulaeGradient.baseColor = this.biome.baseColor;
    // this.nebulaeGradient.colorAngle = this.biome.colorAngle;
    this.nebulaeGradient.generateTexture();
  }

  createAtmosphere() {
    this.atmosphere = new Atmosphere();
    // this.atmosphere.color = this.glow.color;
    this.view.add(this.atmosphere.view);
  }

  createGlow() {
    this.glow = new Glow();
    // this.glow.color = this.atmosphere.color;
    this.view.add(this.glow.view);
  }

  createClouds() {
    this.clouds = new Clouds();
    this.view.add(this.clouds.view);
  }

  createSky() {
    this.sky = new Sky();
    this.view.add(this.sky.view);
  }

  createSun() {
    this.sun = new Sun();
    this.view.add(this.sun.view);
    this.sun.view.position.set( -20000, 20000, 20000 );
  }

  updateNormalScaleForRes(value) {
    if (value == 256) this.normalScale = 0.25;
    if (value == 512) this.normalScale = 0.5;
    if (value == 1024) this.normalScale = 1.0;
    if (value == 2048) this.normalScale = 1.5;
    if (value == 4096) this.normalScale = 3.0;
  }

  randRange(low, high) {
    let range = high - low;
    let n = window.rng() * range;
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

export default Planet;

import * as THREE from 'three'
import vertShader from 'shaders/atmosRing.vert'
import fragShader from 'shaders/atmosRing.frag'

class AtmosphereRing {

  constructor() {
    this.view = new THREE.Object3D();

    this.size = 1030;
    this.clock = new THREE.Clock();

    this.atmosphere = {
    	Kr: 0.0025,
    	Km: 0.0010,
    	ESun: 20.0,
    	g: -0.950,
    	innerRadius: 1000,
    	outerRadius: this.size,
    	wavelength: [0.650, 0.570, 0.475],
    	scaleDepth: 0.25,
    	mieScaleDepth: 0.5
    };

    let placeholderColor = new THREE.Vector4(0,0,0,1);

    // Used for the atmosphere shader
		this.atmosphereUniforms = {
			v3LightPosition: {type: "v3",value: new THREE.Vector3(-1,1,1)},
			v3InvWavelength: {type: "v3",value: new THREE.Vector3(1 / Math.pow(this.atmosphere.wavelength[0], 4), 1 / Math.pow(this.atmosphere.wavelength[1], 4), 1 / Math.pow(this.atmosphere.wavelength[2], 4))},
			fCameraHeight: {type: "f",value: 0},
			fCameraHeight2: {type: "f",value: 0},
			fInnerRadius: {type: "f",value: this.atmosphere.innerRadius},
			fInnerRadius2: {type: "f",value: this.atmosphere.innerRadius * this.atmosphere.innerRadius},
			fOuterRadius: {type: "f",value: this.atmosphere.outerRadius},
			fOuterRadius2: {type: "f",value: this.atmosphere.outerRadius * this.atmosphere.outerRadius},
			fKrESun: {type: "f",value: this.atmosphere.Kr * this.atmosphere.ESun},
			fKmESun: {type: "f",value: this.atmosphere.Km * this.atmosphere.ESun},
			fKr4PI: {type: "f",value: this.atmosphere.Kr * 4.0 * Math.PI},
			fKm4PI: {type: "f",value: this.atmosphere.Km * 4.0 * Math.PI},
			fScale: {type: "f",value: 1 / (this.atmosphere.outerRadius - this.atmosphere.innerRadius)},
			fScaleDepth: {type: "f",value: this.atmosphere.scaleDepth},
			fScaleOverScaleDepth: {type: "f",value: 1 / (this.atmosphere.outerRadius - this.atmosphere.innerRadius) / this.atmosphere.scaleDepth},
			g: {type: "f",value: this.atmosphere.g},
			g2: {type: "f",value: this.atmosphere.g * this.atmosphere.g},
			nSamples: {type: "i",value: 3},
			fSamples: {type: "f",value: 3.0},
			atmosphereColor: {type: "v3",value: placeholderColor},
			tDisplacement: {type: "t",value: 0},
			tSkyboxDiffuse: {type: "t",value: 0},
			fNightScale: {type: "f",value: 1},
			level: { type: "f", value: window.camera.position.length()}
		};

    this.mat = new THREE.ShaderMaterial({
      uniforms: 		this.atmosphereUniforms,
			vertexShader: 	vertShader,
			fragmentShader: fragShader,
			transparent: 	true,
			side: 			THREE.BackSide
    });

    this.geo = new THREE.IcosahedronGeometry(this.size, 6);
    this.sphere = new THREE.Mesh(this.geo, this.mat);
    // this.sphere.scale.set(this.size, this.size, this.size);
    this.view.add(this.sphere);

  }

  update() {
  	this.updateUniforms();
  }

  updateUniforms() {
    let atmosphereColor = new THREE.Vector3(0.72,0.27,0.35);

    let cameraHeight = window.camera.position.length();
    this.atmosphereUniforms.fCameraHeight.value = cameraHeight;
    this.atmosphereUniforms.fCameraHeight2.value = cameraHeight * cameraHeight;
    this.atmosphereUniforms.v3InvWavelength.value = new THREE.Vector3(1 / Math.pow(atmosphereColor.x,4),1 / Math.pow(atmosphereColor.y,4),1 / Math.pow(atmosphereColor.z,4));
    this.atmosphereUniforms.level.value = window.camera.position.distanceTo(new THREE.Vector3(0,0,0));
  }


}

export default AtmosphereRing;

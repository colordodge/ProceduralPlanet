// Initialize THREE.js
var scene = new THREE.Scene();
var width = window.innerWidth - 200;
var camera = new THREE.PerspectiveCamera( 30, width / window.innerHeight, 0.1, 20000 );
var renderer = new THREE.WebGLRenderer({
	antialias: true
});

renderer.setSize( width, window.innerHeight);
document.body.appendChild( renderer.domElement );

// Initialize global variables
// Geometries
var radius = 100;
var planetGeometry = new THREE.SphereGeometry( radius, 70, 70);
var sunGeometry = new THREE.SphereGeometry( radius, 40, 40);
radius += 0.1; // Prevents clipping problems between atmosphere and planet
var atmosphereGeometry = new THREE.SphereGeometry(radius*1.025, 100, 100);
var atmosphereGroundGeometry = new THREE.SphereGeometry(radius*1.01, 70, 70);

var sunColor = new THREE.Vector4(1,0.765,0.302,1);
var clock = new THREE.Clock();
var sunPos = new THREE.Vector3(0, 0, 4000);
var placeholderColor = new THREE.Vector4(0,0,0,1);

// Atmsphere variable used in the atmosphere shader
var atmosphere = {
	Kr: 0.0025,
	Km: 0.0010,
	ESun: 20.0,
	g: -0.950,
	innerRadius: 100,
	outerRadius: 102.5,
	wavelength: [0.650, 0.570, 0.475],
	scaleDepth: 0.25,
	mieScaleDepth: 0.1
};

// Initialize UI sliders
$("#noiseIntensity").noUiSlider({ range: { 'min': 1, 'max': 100 }, snap: false, start: 50 });
$("#noiseVariation").noUiSlider({ range: { 'min': 1, 'max': 100 }, snap: false, start: 50 });
$("#waterLevel").noUiSlider({ range: { 'min': -25, 'max': 25 }, snap: false, start: 2.20 });

$("#waterLevel").Link('lower').to($("#waterLevelValue"));
$("#noiseIntensity").Link('lower').to($("#noiseIntensityValue"));
$("#noiseVariation").Link('lower').to($("#noiseVariationValue"));

// Load shaders
SHADER_LOADER.load(
    function (data)
    {
    	// Initialize uniforms to send to the shaders
    	planetUniforms = {
		    time: { type: "f", value: 0 },
		    level: { type: "f", value: camera.position.length()},
		    sunPos: {type: "v3", value: sunPos},
		    diffuseLight: {type: "v4", value: sunColor},
		    diffuseMaterial: {type: "v4", value: placeholderColor},
		    sealevel: {type: "f", value: 0},
		    noiseIntensity: {type: "f", value: 0},
		    noiseType: {type: "f", value: 1},
		    noiseVariation: {type: "f", value: 0},
		    waterColor: {type: "v3", value: placeholderColor},
		    renderLevels: {type: "fv1", value: [6000.0, 6000.0, 6000.0, 5000.0, 1800.0, 950.0, 850.0, 500.0, 500, 500]},
		    shoreColor: {type: "v3", value: placeholderColor},
		    cloudColor: {type: "v3", value: placeholderColor},
		    renderClouds: {type: "f", value: 1}
		};

		sunUniforms = {
			diffuseLight: {type: "v4", value : sunColor}
		}

		// Used for the atmosphere shader
		atmosphereUniforms = {
			v3LightPosition: {type: "v3",value: new THREE.Vector3(0,0,1)},
			v3InvWavelength: {type: "v3",value: new THREE.Vector3(1 / Math.pow(atmosphere.wavelength[0], 4), 1 / Math.pow(atmosphere.wavelength[1], 4), 1 / Math.pow(atmosphere.wavelength[2], 4))},
			fCameraHeight: {type: "f",value: 0},
			fCameraHeight2: {type: "f",value: 0},
			fInnerRadius: {type: "f",value: atmosphere.innerRadius},
			fInnerRadius2: {type: "f",value: atmosphere.innerRadius * atmosphere.innerRadius},
			fOuterRadius: {type: "f",value: atmosphere.outerRadius},
			fOuterRadius2: {type: "f",value: atmosphere.outerRadius * atmosphere.outerRadius},
			fKrESun: {type: "f",value: atmosphere.Kr * atmosphere.ESun},
			fKmESun: {type: "f",value: atmosphere.Km * atmosphere.ESun},
			fKr4PI: {type: "f",value: atmosphere.Kr * 4.0 * Math.PI},
			fKm4PI: {type: "f",value: atmosphere.Km * 4.0 * Math.PI},
			fScale: {type: "f",value: 1 / (atmosphere.outerRadius - atmosphere.innerRadius)},
			fScaleDepth: {type: "f",value: atmosphere.scaleDepth},
			fScaleOverScaleDepth: {type: "f",value: 1 / (atmosphere.outerRadius - atmosphere.innerRadius) / atmosphere.scaleDepth},
			g: {type: "f",value: atmosphere.g},
			g2: {type: "f",value: atmosphere.g * atmosphere.g},
			nSamples: {type: "i",value: 3},
			fSamples: {type: "f",value: 3.0},
			atmosphereColor: {type: "v3",value: placeholderColor},
			tDisplacement: {type: "t",value: 0},
			tSkyboxDiffuse: {type: "t",value: 0},
			fNightScale: {type: "f",value: 1},
			level: { type: "f", value: camera.position.length()}
		};

		// Load shaders using Shader Loader JS
        var vShader = data.shader.vertex;
        var fShader = data.shader.fragment;
        var vShaderSun = data.shaderSun.vertex;
        var fShaderSun = data.shaderSun.fragment;
        var vShaderAtmosphere = data.shaderAtmosphere.vertex;
        var fShaderAtmosphere = data.shaderAtmosphere.fragment;
        var vShaderAtmosphereGround = data.shaderAtmosphereGround.vertex;
        var fShaderAtmosphereGround = data.shaderAtmosphereGround.fragment;

        // Create shader materials
        planetShader = new THREE.ShaderMaterial({
        	uniforms: 		planetUniforms,
		    vertexShader:   vShader,
		    fragmentShader: fShader
		});

        sunShader = new THREE.ShaderMaterial({
        	uniforms: 		sunUniforms,
		    vertexShader:   vShaderSun,
		    fragmentShader: fShaderSun
		});

        // The atmosphere outside the planet
		atmosphereShader = new THREE.ShaderMaterial({
			uniforms: 		atmosphereUniforms,
			vertexShader: 	vShaderAtmosphere,
			fragmentShader: fShaderAtmosphere,
			transparent: 	true,
			side: 			THREE.BackSide
		});

		// The atmosphere on the planet
		atmosphereGroundShader = new THREE.ShaderMaterial({
			uniforms: 		atmosphereUniforms,
			vertexShader: 	vShaderAtmosphereGround,
			fragmentShader: fShaderAtmosphereGround,
			transparent: 	true,
		});

		initialize();
    }
);

// Let's get this party started
function initialize() {
	// Create meshes
	planetMesh = new THREE.Mesh(planetGeometry, planetShader);
	sunMesh = new THREE.Mesh(sunGeometry, sunShader);
	atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereShader);
	atmosphereGroundMesh = new THREE.Mesh(atmosphereGroundGeometry, atmosphereGroundShader);

	// Add meshes
	scene.add( planetMesh );
	scene.add( sunMesh );
	scene.add( atmosphereMesh );
	scene.add( atmosphereGroundMesh );

	// Alter meshes
	sunMesh.scale.set(3,3,3);
	sunMesh.position.set(sunPos.x,sunPos.y,sunPos.z);

	// Handle user controls
	controls = new THREE.TrackballControls( camera, renderer.domElement);
	controls.target.set( 0, 0, 0 );
	controls.minDistance = 200.0;
	controls.maxDistance = 5000;
	controls.zoomSpeed = 0.1;
	controls.rotateSpeed = 0.05;
	controls.noPan = true;

	camera.position = new THREE.Vector3(atmosphere.innerRadius*6,atmosphere.innerRadius,atmosphere.innerRadius*2);

	render();
};

// Rendering function, runs (hopefully) many times every frame
function render() {
	// Update uniforms
	var delta = clock.getDelta();
	updateUniforms(delta);

	// Update world
	planetMesh.rotation.y += 0.001;
	controls.update();

	if($('#renderAtmosphere').prop('checked')) {
		atmosphereMesh.visible = true;
		atmosphereGroundMesh.visible = true;
	} else {
		atmosphereMesh.visible = false;
		atmosphereGroundMesh.visible = false;
	}

	if($('#renderClouds').prop('checked'))
		planetUniforms.renderClouds.value = 1;
	else
		planetUniforms.renderClouds.value = 0;

	renderer.render( scene, camera );

	// Call render again
	requestAnimationFrame( render );
};

function updateUniforms(delta) {
	var atmosphereColor;
	var color = $("#atmosphereColor").val();

	// Handle atmosphere color
	switch(color) {
		case "Blue":
			atmosphereColor = new THREE.Vector3(0.72,0.77,0.35);
			break;
		case "Pink":
			atmosphereColor = new THREE.Vector3(0.42,0.97,0.375);
			break;
		case "Green":
			atmosphereColor = new THREE.Vector3(0.72,0.37,0.575);
			break;
		case "Orange":
			atmosphereColor = new THREE.Vector3(0.36,0.524,0.79);
			break;
		case "White":
			atmosphereColor = new THREE.Vector3(0.66,0.424,0.34);
			break;
	}

	// Update planet uniforms
	planetUniforms.time.value += delta;
	planetUniforms.level.value = camera.position.distanceTo(new THREE.Vector3(0,0,0));
	planetUniforms.sealevel.value = $("#waterLevel").val()/120;
	planetUniforms.noiseIntensity.value = $("#noiseIntensity").val()/1000;
	planetUniforms.noiseType.value = $("#noiseType").val();
	planetUniforms.noiseVariation.value = $("#noiseVariation").val()/70;
	planetUniforms.waterColor.value = new THREE.Vector3(document.getElementById('waterColor').color.rgb[0],document.getElementById('waterColor').color.rgb[1],document.getElementById('waterColor').color.rgb[2]);
	planetUniforms.shoreColor.value = new THREE.Vector3(document.getElementById('shoreColor').color.rgb[0],document.getElementById('shoreColor').color.rgb[1],document.getElementById('shoreColor').color.rgb[2]);
	planetUniforms.cloudColor.value = new THREE.Vector3(document.getElementById('cloudColor').color.rgb[0],document.getElementById('cloudColor').color.rgb[1],document.getElementById('cloudColor').color.rgb[2]);
	planetUniforms.diffuseMaterial.value = new THREE.Vector4(document.getElementById('landColor').color.rgb[0],document.getElementById('landColor').color.rgb[1],document.getElementById('landColor').color.rgb[2],1);

	// Atmosphere
	var cameraHeight = camera.position.length();
	atmosphereUniforms.fCameraHeight.value = cameraHeight;
	atmosphereUniforms.fCameraHeight2.value = cameraHeight * cameraHeight;
	atmosphereUniforms.v3InvWavelength.value = new THREE.Vector3(1 / Math.pow(atmosphereColor.x,4),1 / Math.pow(atmosphereColor.y,4),1 / Math.pow(atmosphereColor.z,4));
	atmosphereUniforms.level.value = camera.position.distanceTo(new THREE.Vector3(0,0,0));
}

// Update window if resized
$(window).resize(function( event ) {
	width = window.innerWidth - 200;
	renderer.setSize( width, window.innerHeight);
	camera.aspect = width / window.innerHeight;
	camera.updateProjectionMatrix();
});

// Handle user browser notification
// IE can't even render the planet
// FF produces weird noise artefacts that I don't have time to fix ( related to sphere geometry? )
var isFirefox = typeof InstallTrigger !== 'undefined';
var isIE = /*@cc_on!@*/false || !!document.documentMode;
if(isIE || isFirefox){
	$("body").before("<h2 style='color:red;' id='browserCheck'>This application runs the best in the newest versions of safari or chrome</h2>");
	$("#renderClouds").remove();
	$("#renderCloudsP").remove();
}

import noise from 'glsl-noise/classic/3d'
import worley3D from 'glsl-worley/worley3D'

varying vec2 vUv;
uniform int index;
uniform float seed;
uniform float resolution;
uniform float res1;
uniform float res2;
uniform float resMix;
uniform float mixScale;
uniform sampler2D nebulaeMap;
const int octaves = 16;



vec3 getSphericalCoord(int index, float x, float y, float width) {
	width /= 2.0;
	x -= width;
	y -= width;
	vec3 coord = vec3(0.0, 0.0, 0.0);

	if (index == 0) {coord.x=width; coord.y=-y; coord.z=-x;}
	else if (index == 1) {coord.x=-width; coord.y=-y; coord.z=x;}
	else if (index == 2) {coord.x=x; coord.y=width; coord.z=y;}
	else if (index == 3) {coord.x=x; coord.y=-width; coord.z=-y;}
	else if (index == 4) {coord.x=x; coord.y=-y; coord.z=width;}
	else if (index == 5) {coord.x=-x; coord.y=-y; coord.z=-width;}

	return normalize(coord);
}

// float simplexRidged(vec3 pos, float seed) {
// 	float n = noise(vec4(pos, seed));
// 	n = (n + 1.0) * 0.5;
// 	n = 2.0 * (0.5 - abs(0.5 - n));
// 	return n;
// }

float simplexRidged(vec3 pos, float seed) {
	float n = noise(vec3(pos + seed));
	// n = (n + 1.0) * 0.5;
	// n = 2.0 * (0.5 - abs(0.5 - n));
	n = abs(n);
	return n;
}

float simplex(vec3 pos, float seed) {
	float n = noise(vec3(pos + seed));
	// return (n + 1.0) * 0.5;
	n = (n + 1.0) * 0.5;
	// n = 2.0 * (0.5 - abs(0.5 - n));
	return n;
}

float baseNoise(vec3 pos, float frq, float seed ) {
	float amp = 0.5;

	float n = 0.0;
	float gain = 1.0;
	for(int i=0; i<octaves; i++) {
		n +=  simplex(vec3(pos.x*gain/frq, pos.y*gain/frq, pos.z*gain/frq), seed+float(i)*10.0) * amp/gain;
		gain *= 2.0;
	}


	// n = fract(n*10.0);




	// n *= abs(sin(pos.y*10.0));

	// n += 0.4;

	// increase contrast
	n = ( (n - 0.5) * 3.0 ) + 0.6;

	// n = pow(n, 3.0);

	// n = pow( (1.0-n), 2.0);


	// n = pow(n, 2.0);


	// n = 1.0-n;
	// n = pow(n, 6.0);
	// n = 1.0-n;

	return n;
}

float ridgedNoise(vec3 pos, float frq, float seed) {
	float amp = 0.5;

	float n = 0.0;
	float gain = 1.0;
	for(int i=0; i<octaves; i++) {
		n +=  simplexRidged(vec3(pos.x*gain/frq, 2.0*pos.y*gain/frq, pos.z*gain/frq), seed+float(i)*10.0) * amp/gain;
		gain *= 2.0;
	}

	// n = pow(n, 5.0);

	// n = 1.0-n;
	// n = pow(n, 2.0);
	// n = 1.0-n;

	return n;
}

float invRidgedNoise(vec3 pos, float frq, float seed) {

	float amp = 0.5;

	float n = 0.0;
	float gain = 1.0;
	for(int i=0; i<octaves; i++) {
		n +=  simplexRidged(vec3(pos.x*gain/frq, pos.y*gain/frq, pos.z*gain/frq), seed+float(i)*10.0) * amp/gain;
		gain *= 2.0;
	}

  n = 1.0 - n;
	n = pow(n, 2.0);
  n = 1.0 - n;


	return n;
}

float cloud(vec3 pos, float seed) {
	float n = noise(vec3(pos + seed));
	// n = sin(n*4.0 * cos(n*2.0));
	n = sin(n*7.0);

	n = n*0.5 + 0.5;
	// n = 1.0-n;
	// n = n*1.2;
	// n = 1.0-n;

	return n;
}

float cloudNoise(vec3 pos, float frq, float seed) {
	float amp = 0.5;

	float n = 0.0;
	float gain = 1.0;
	for(int i=0; i<octaves; i++) {
		n +=  cloud(vec3(pos.x*gain/frq, 1.0*pos.y*gain/frq, pos.z*gain/frq), seed+float(i)*10.0) * amp/gain;
		gain *= 2.0;
	}

	// n = pow(n, 5.0);

	n = 1.0-n;
	n = pow(n, 1.0);
	n = 1.0-n;

	return n;
}

float star(vec3 pos, float seed) {
	float n = noise(vec3(pos + seed));

	n = abs(n);

	// n = n*0.5 + 0.5;

	// n = pow(n, 2.0);

	// n = 1.0-n;
	// n = n*1.2;
	// n = 1.0-n;

	return n;
}

float rand(vec3 co, float seed) {
   return fract(sin(dot(co.xyz,vec3(12.9898,78.233,34.830))) * (43758.5453+seed)/resolution);
}

float starNoise(vec3 pos, float seed) {

	float n = rand(pos.xyz*100.0, seed);

	// n = pow(n, 2.0);

	// if (n < 0.99) {
	// 	n = 0.0;
	// }

	return n;
}



void main() {
	float x = vUv.x;
	float y = 1.0 - vUv.y;
	vec3 sphericalCoord = getSphericalCoord(index, x*resolution, y*resolution, resolution);


  // create nebula

	float c1 = cloudNoise(sphericalCoord, res1, seed);
	float c2 = cloudNoise(sphericalCoord + vec3(c1*res2*0.2), res2, seed+310.4);
	// c2 = pow(c2, 5.0) * 1.0;
  float c3 = cloudNoise(sphericalCoord, resMix, seed + 661.384);

  float nebulaStrength = 2.0 * pow(c2, 3.0);
  // float nebulaStrength = 1.0;
	vec3 nColor = texture2D(nebulaeMap, vec2(c3, c1)).rgb * nebulaStrength;
	// float c4 = cloudNoise(sphericalCoord, resMix, seed + 61.684);
	// c4 = pow(c4, 3.0) * 1.0;
	// nColor = mix(nColor, nColor*0.3, c4*1.0);
  vec4 nebula = vec4(nColor, 1.0);


	// add in large stars to nebula
  float sub1 = baseNoise(sphericalCoord, 0.003, seed+322.284);
	vec2 F = worley3D((sphericalCoord * 150.0) + vec3(seed+35.890), 1.0, true);
	float F1 = F.x;
	float n2 = F1;
	n2 = 1.0 - n2;
	n2 *= 1.2;
	n2 = pow(n2, 7.0);
	n2 *= c2;
  n2 *= sub1;
	nebula += vec4(vec3(n2), 1.0);



  float c4 = invRidgedNoise(sphericalCoord, 1.0, seed+38.476);


  // c4 = ((c4 - 0.5) * 1.5) + 0.5;
  // nebula.rgb += c4*0.3;
  nebula.a = pow( c2, 1.0);
  // nebula.rgb = ((nebula.rgb - 0.5) * (1.0+c2*1.0)) + 0.5;







	gl_FragColor = nebula;
}

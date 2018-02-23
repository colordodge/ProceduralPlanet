import noise from 'glsl-noise/classic/3d'

varying vec2 vUv;
uniform int index;
uniform float seed;
uniform float resolution;
uniform float res1;
uniform float res2;
uniform float resMix;
uniform float mixScale;
uniform float doesRidged;
const int octaves = 16;

// #define M_PI 3.1415926535897932384626433832795;


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

float simplexRidged(vec3 pos, float seed) {
	float n = noise(vec3(pos + seed));
	n = (n + 1.0) * 0.5;
	n = 2.0 * (0.5 - abs(0.5 - n));
	return n;
}

float simplex(vec3 pos, float seed) {
	float n = noise(vec3(pos + seed));
	return (n + 1.0) * 0.5;
}

float baseNoise(vec3 pos, float frq, float seed ) {
	float amp = 0.5;

	float n = 0.0;
	float gain = 1.0;
	for(int i=0; i<octaves; i++) {
		n +=  simplex(vec3(pos.x*gain/frq, pos.y*gain/frq, pos.z*gain/frq), seed+float(i)*10.0) * amp/gain;
		gain *= 2.0;
	}

	// increase contrast
	n = ( (n - 0.5) * 2.0 ) + 0.5;

	return n;
}

float ridgedNoise(vec3 pos, float frq, float seed) {
	float amp = 0.5;
	float n = 0.0;
	float gain = 1.0;
	for(int i=0; i<octaves; i++) {
		n +=  simplexRidged(vec3(pos.x*gain/frq, pos.y*gain/frq, pos.z*gain/frq), seed+float(i)*10.0) * amp/gain;
		gain *= 2.0;
	}

	n = pow(n, 4.0);
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

	n = pow(n, 4.0);
	n = 1.0 - n;

	return n;
}

float cloud(vec3 pos, float seed) {
	float n = noise(vec3(pos + seed));
	// n = sin(n*4.0 * cos(n*2.0));
	n = sin(n*5.0);
	// n = abs(sin(n*5.0));
	// n = 1.0 - n;

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
		n +=  cloud(vec3(pos.x*gain/frq, pos.y*gain/frq, pos.z*gain/frq), seed+float(i)*10.0) * amp/gain;
		gain *= 2.0;
	}

	// n = pow(n, 5.0);

	n = 1.0-n;
	n = pow(n, 1.0);
	n = 1.0-n;

	return n;
}

void main() {
	float x = vUv.x;
	float y = 1.0 - vUv.y;
	vec3 sphericalCoord = getSphericalCoord(index, x*resolution, y*resolution, resolution);

	float sub1, sub2, sub3, n;

	float resMod = 1.0; // overall res magnification
	float resMod2 = mixScale; // minimum res mod

	if (doesRidged == 0.0) {
		sub1 = cloudNoise(sphericalCoord, res1*resMod, seed+11.437);
		sub2 = cloudNoise(sphericalCoord, res2*resMod, seed+93.483);
		sub3 = cloudNoise(sphericalCoord, resMix*resMod, seed+23.675);
		n = cloudNoise(sphericalCoord + vec3((sub1/sub3)*0.1), resMod2+sub2, seed+78.236);
	}
	else if (doesRidged == 1.0) {
		sub1 = ridgedNoise(sphericalCoord, res1*resMod, seed+83.706);
		sub2 = ridgedNoise(sphericalCoord, res2*resMod, seed+29.358);
		sub3 = ridgedNoise(sphericalCoord, resMix*resMod, seed+53.041);
		n = ridgedNoise(sphericalCoord + vec3((sub1/sub3)*0.1), resMod2+sub2, seed+34.982);
	}
	else  if (doesRidged == 2.0) {
		sub1 = invRidgedNoise(sphericalCoord, res1*resMod, seed+49.684);
		sub2 = invRidgedNoise(sphericalCoord, res2*resMod, seed+136.276);
		sub3 = invRidgedNoise(sphericalCoord, resMix*resMod, seed+3.587);
		n = invRidgedNoise(sphericalCoord + vec3((sub1/sub3)*0.1), resMod2+sub2, seed+33.321);
	}
	else {
		sub1 = baseNoise(sphericalCoord, res1*resMod, seed+52.284);
		sub2 = baseNoise(sphericalCoord, res2*resMod, seed+137.863);
		sub3 = baseNoise(sphericalCoord, resMix*resMod, seed+37.241);
		float alpha = sub1*3.14*2.0;
		float beta = sub2*3.14*2.0;
		float fx = cos(alpha)*cos(beta);
		float fz = sin(alpha)*cos(beta);
		float fy = sin(beta);
		n = baseNoise(sphericalCoord + (vec3(fx,fy,fz) * sub3), 1.0, seed+28.634);
	}

	gl_FragColor = vec4(vec3(n), 1.0);


}

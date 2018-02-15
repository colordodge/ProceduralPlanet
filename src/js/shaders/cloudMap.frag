import noise from 'glsl-noise/classic/4d'

varying vec2 vUv;
uniform int index;
uniform float seed;
uniform float resolution;
uniform float res1;
uniform float res2;
uniform float resMix;
uniform float mixScale;

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
	float n = noise(vec4(pos, seed));
	// n = (n + 1.0) * 0.5;
	// n = 2.0 * (0.5 - abs(0.5 - n));
	n = abs(n);
	return n;
}

float simplex(vec3 pos, float seed) {
	float n = noise(vec4(pos, seed));
	// return (n + 1.0) * 0.5;
	n = (n + 1.0) * 0.5;
	// n = 2.0 * (0.5 - abs(0.5 - n));
	return n;
}

float baseNoise(vec3 pos, float frq, float seed ) {
	const int octaves = 16;
	float amp = 0.5;

	float n = 0.0;
	float gain = 1.0;
	for(int i=0; i<octaves; i++) {
		n +=  simplexRidged(vec3(pos.x*gain/frq, pos.y*gain/frq, pos.z*gain/frq), seed+float(i)*10.0) * amp/gain;
		gain *= 2.0;
		// amp *= 2.0;
	}


	// n = fract(n*10.0);




	// n *= abs(sin(pos.y*10.0));

	// n += 0.4;

	// increase contrast
	n = ( (n - 0.5) * 2.0 ) + 0.6;

	// n = pow(n, 3.0);

	// n = pow( (1.0-n), 2.0);


	// n = pow(n, 2.0);


	// n = 1.0-n;
	// n = pow(n, 6.0);
	// n = 1.0-n;

	return n;
}

float ridgedNoise(vec3 pos, float frq, float seed) {
	const int octaves = 16;
	float amp = 0.5;

	float n = 0.0;
	float gain = 1.0;
	for(int i=0; i<octaves; i++) {
		n +=  simplexRidged(vec3(pos.x*gain/frq, 2.0*pos.y*gain/frq, pos.z*gain/frq), seed+float(i)*10.0) * amp/gain;
		gain *= 2.0;
	}

	// n = pow(n, 5.0);

	n = 1.0-n;
	n = pow(n, 6.0);
	n = 1.0-n;

	return n;
}

float billowNoise(vec3 pos, float frq, float seed) {
	const int octaves = 16;
	float amp = 0.5;

	float n = 0.0;
	float gain = 1.0;
	for(int i=0; i<octaves; i++) {
		n +=  simplexRidged(vec3(pos.x*gain/frq, pos.y*gain/frq, pos.z*gain/frq), seed+float(i)*10.0) * amp/gain;
		gain *= 2.0;
	}

	n = 1.0-n;
	n = pow(n, 1.0);
	n = 1.0-n;

	return n;
}

float cloud(vec3 pos, float seed) {
	float n = noise(vec4(pos, seed));
	// n = sin(n*4.0 * cos(n*2.0));
	n = sin(n*3.0);

	n = n*0.5 + 0.5;
	// n = abs(n);
	// n = 1.0-n;
	// n = n*1.2;
	// n = 1.0-n;

	return n;
}

float cloudNoise(vec3 pos, float frq, float seed) {
	const int octaves = 32;
	float amp = 0.5;

	float n = 0.0;
	float gain = 1.0;
	for(int i=0; i<octaves; i++) {
		n +=  cloud(vec3(pos.x*gain/frq, 1.0*pos.y*gain/frq, pos.z*gain/frq), seed+float(i)*10.0) * amp/gain;
		gain *= 2.0;
	}

	// n = pow(n, 5.0);

	n = 1.0-n;
	// n = pow(n, mixScale);
	n = pow(n, 1.0);
	n = 1.0-n;

	return n;
}

float perlin(vec3 pos, float seed) {
	float n = noise(vec4(pos, seed));
	n = (n + 1.0) * 0.5;
	return n;
}

float perlinNoise(vec3 pos, float frq, float seed ) {

	const int octaves = 16;
	float n = 0.0;
	float amplitude = 0.7;

	for (int i = 0; i < octaves; i++) {
		n += amplitude * perlin(pos*frq, seed);
		frq *= 2.0; // lacunarity = 2.0
		amplitude *= n; // gain = 0.5
	}

	n = pow(n, 2.0);

	return n;
}

void main() {
	float x = vUv.x;
	float y = 1.0 - vUv.y;
	vec3 sphericalCoord = getSphericalCoord(index, x*resolution, y*resolution, resolution);

	/////////////////
	float sub1 = baseNoise(sphericalCoord, 0.5, seed);
	float sub1b = billowNoise(sphericalCoord, 1.0, seed+93.386);
	float n1 = baseNoise(sphericalCoord + vec3(sub1*0.3), 0.5, seed+38.378);

	float sub2 = baseNoise(sphericalCoord, 0.5, seed+12.412);
	float n2 = baseNoise(sphericalCoord + vec3(sub2*0.3), 0.5+sub1b, seed+58.578);

	n1 = 1.0-n1;
	n1 *= 0.1;
	n1 = 1.0-n1;

	n2 = 1.0-n2;
	n2 = pow(n2, 5.0);
	n2 *= 0.3;
	n2 = 1.0-n2;
	n2 = pow(n2, 5.0);

	gl_FragColor = vec4(vec3(n1), n2);
	///////////////////


	// float sub1 = perlinNoise(sphericalCoord, 1.0, seed);
	// float n1 = billowNoise(sphericalCoord + vec3(sub1*0.1), 0.5, seed+38.378);
  //
	// gl_FragColor = vec4(vec3(n1), n1);


}

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
	n = 2.0 * (0.5 - abs(0.5 - n));
	return n;
}

float baseNoise(vec3 pos, float frq, float seed ) {
	const int octaves = 16;
	float amp = 0.57;

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
	// n = ( (n - 0.5) * 3.0 ) + 0.6;

	// n = pow(n, 3.0);

	// n = pow( (1.0-n), 2.0);


	n = pow(n, 2.0);


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

float cloud(vec3 pos, float seed) {
	float n = noise(vec4(pos, seed));
	// n = sin(n*4.0 * cos(n*2.0));
	n = sin(n*5.0);

	n = n*0.5 + 0.5;
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
	n = pow(n, mixScale);
	n = 1.0-n;

	return n;
}

void main() {
	float x = vUv.x;
	float y = 1.0 - vUv.y;
	vec3 sphericalCoord = getSphericalCoord(index, x*resolution, y*resolution, resolution);


	float n = cloudNoise(sphericalCoord, res1, seed);
	float n2 = cloudNoise(sphericalCoord + vec3(n*0.25), res2, seed+0.2);
	gl_FragColor = vec4(vec3(n2), 1.0);

	// float n1 = ridgedNoise(sphericalCoord, res1, seed);
	// n1 = 1.0-n1;
	// n1 = pow(n1, 1.0);
	// n1 = 1.0-n1;

	// float n2 = ridgedNoise(sphericalCoord, res2, seed+36.0);
	// float n3 = ridgedNoise(sphericalCoord, resMix, seed+46.0);
	// float n = mix(n1, n2, n3);

	// float maskN = baseNoise(sphericalCoord, mixScale, seed+36.0);

	// float n3 = max(n1, n2);

	// float nMix = ridgedNoise(sphericalCoord, resMix, seed+13.0);
	// float n = mix(n3, 0.0, nMix*mixScale);

	// n = n-(1.0-maskN);
	// float n = n1 * sin(n2+sphericalCoord.x) * 0.3;

	// if (n > 0.3) {
	// 	n = (n - 0.5) * 3.0;
	// 	// n = pow(n, 2.0);
	// } else {
	// 	// n = 0.0;
	// }

	// n = pow(n, 3.0);

	// if (n > 1.0) {
	// 	n = 1.0 - (n-1.0);
	// }




	// gl_FragColor = vec4(vec3(n), 1.0);
	// gl_FragColor = vec4(color, n);
}

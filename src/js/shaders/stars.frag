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


float simplex(vec3 pos, float seed) {
	float n = noise(vec3(pos + seed));
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
		n +=  simplex(vec3(pos.x*gain/frq, pos.y*gain/frq, pos.z*gain/frq), seed+float(i)*10.0) * amp/gain;
		gain *= 2.0;
	}

  // increase contrast
	n = ( (n - 0.5) * 3.0 ) + 0.6;
	return n;
}


void main() {
	float x = vUv.x;
	float y = 1.0 - vUv.y;
	vec3 sphericalCoord = getSphericalCoord(index, x*resolution, y*resolution, resolution);

  // create base stars
	vec2 F = worley3D((sphericalCoord * 200.0) + vec3(seed), 1.0, true);
  float F1 = F.x;
  float F2 = F.y;

	float n = F1;
	n = 1.0 - n;
	n *= 1.2;
	n = pow(n, 4.0);


	float sub1 = baseNoise(sphericalCoord, 0.003, seed+32.284);
	n *= sub1;
	vec3 starsColor = vec3(n);


  // float n;
  // float res = 200.0;
  // float mag = 0.7;
  // for (int i=0; i<4; i++) {
  //   vec2 F = worley3D((sphericalCoord * res) + vec3(seed), 1.0, true);
  //   float F1 = F.x;
  //   float F2 = F.y;
  //   n += pow(F1, 1.0) * mag;
  //   res *= 3.0;
  //   mag *= 0.5;
  // }
  // n = 1.0-n;
  // n = pow(n, 3.0);
  // vec3 starsColor = vec3(n);


	gl_FragColor = vec4(starsColor, 1.0);
}

import noise from 'glsl-noise/simplex/3d'


varying vec2 vUv;
uniform int index;

int mod(int x, int m) {
	return int(mod(float(x), float(m)));
}

float random5(vec3 co) {
	return fract(sin(dot(co.xyz ,vec3(12.9898,78.233,1.23456))) * 43758.5453);
}


float random4(float x, float y, float z) {
	return random5(vec3(x, y, z));
}

float random4(int x, int y, int z) {
	return random4(float(x), float(y), float(z));
}

float interpolation(float a, float b, float x) {
	float ft = x * 3.1415927;
	float f = (1.0 - cos(ft)) * 0.5;
	return a*(1.0-f) + b*f;
}

float tricosine(vec3 coordFloat) {
	vec3 coord0 = vec3(floor(coordFloat.x), floor(coordFloat.y), floor(coordFloat.z));
	vec3 coord1 = vec3(coord0.x+1.0, coord0.y+1.0, coord0.z+1.0);
	float xd = (coordFloat.x - coord0.x)/max(1.0, (coord1.x-coord0.x));
	float yd = (coordFloat.y - coord0.y)/max(1.0, (coord1.y-coord0.y));
	float zd = (coordFloat.z - coord0.z)/max(1.0, (coord1.z-coord0.z));
	float c00 = interpolation(random4(coord0.x, coord0.y, coord0.z), random4(coord1.x, coord0.y, coord0.z), xd);
	float c10 = interpolation(random4(coord0.x, coord1.y, coord0.z), random4(coord1.x, coord1.y, coord0.z), xd);
	float c01 = interpolation(random4(coord0.x, coord0.y, coord1.z), random4(coord1.x, coord0.y, coord1.z), xd);
	float c11 = interpolation(random4(coord0.x, coord1.y, coord1.z), random4(coord1.x, coord1.y, coord1.z), xd);
	float c0 = interpolation(c00, c10, yd);
	float c1 = interpolation(c01, c11, yd);
	float c = interpolation(c0, c1, zd);

	return c;
}

float nearestNeighbour(vec3 coordFloat) {
	return random4(int(floor(coordFloat.x)), int(floor(coordFloat.y)), int(floor(coordFloat.z)));
}

float helper(float x, float y, float z, float resolution) {
	x = (x+1.0)/2.0*resolution;
	y = (y+1.0)/2.0*resolution;
	z = (z+1.0)/2.0*resolution;

	vec3 coordFloat = vec3(x, y, z);
	float interpolated = tricosine(coordFloat);
	// float interpolated = noise(coordFloat);

	return interpolated*2.0 - 1.0;
}

vec3 scalarField(float x, float y, float z) {
	float resolution1 = 4.0;
	float resolution2 = 16.0;
	float resolution3 = 32.0;
	float resolution4 = 64.0;
	float resolution5 = 128.0;
	float resolutionMax = 256.0;

	vec3 coordFloat = vec3(0.0, 0.0, 0.0);

	float level1 = helper(x, y, z, resolution1);
	float level2 = helper(x, y, z, resolution2);
	float level3 = helper(x, y, z, resolution3);
	float level4 = helper(x, y, z, resolution4);
	float level5 = helper(x, y, z, resolution5);
	float levelMax = helper(x, y, z, resolutionMax);

	float c = 0.5;
	c *= 1.0 + level1*0.8;
	c *= 1.0 + level2*0.4;
	c *= 1.0 + level3*0.2;
	c *= 1.0 + level4*0.1;
	c *= 1.0 + level5*0.05;
	c *= 1.0 + levelMax*(0.025);

	if (c < 0.45) c *= 0.8;

	c = clamp(c, 0.0, 1.0);
	vec3 water = vec3(0.0, 0.2, 0.4) * (0.4+c*0.5);
	vec3 land = vec3(0.2, 0.4, 0.3) * c*0.8;
	vec3 peak = vec3(0.42, 0.4, 0.42) * c;
	// vec3 water = vec3(0.6, 0.2, 0.2) * (0.2 + c*0.3);
	// vec3 land = vec3(0.5, 0.4, 0.1) * c;
	// vec3 peak = vec3(0.2, 0.1, 0.32) * c;

	if (c < 0.5) {
		return water;
	}
	else if (c < 0.8) {
		return land;
	}
	else {
		return peak;
	}

	// return vec3(c);
}

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

void main() {
	float x = vUv.x;
	float y = 1.0 - vUv.y;
	vec3 sphericalCoord = getSphericalCoord(index, x*1024.0, y*1024.0, 1024.0);

	vec3 color = scalarField(sphericalCoord.x, sphericalCoord.y, sphericalCoord.z);

	gl_FragColor = vec4(color.x, color.y, color.z, 1.0);
}

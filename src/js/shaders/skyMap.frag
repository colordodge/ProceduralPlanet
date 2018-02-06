import noise from 'glsl-noise/classic/4d'

varying vec2 vUv;
uniform int index;
uniform float seed;
uniform float resolution;
uniform float res1;
uniform float res2;
uniform float resMix;
uniform float mixScale;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform sampler2D nebulaeMap;


// Permutation polynomial: (34x^2 + x) mod 289
vec3 permute(vec3 x) {
  return mod((34.0 * x + 1.0) * x, 289.0);
}

vec3 dist(vec3 x, vec3 y, vec3 z,  bool manhattanDistance) {
  return manhattanDistance ?  abs(x) + abs(y) + abs(z) :  (x * x + y * y + z * z);
}

vec2 worley3D(vec3 P, float jitter, bool manhattanDistance) {
	float K = 0.142857142857; // 1/7
	float Ko = 0.428571428571; // 1/2-K/2
	float  K2 = 0.020408163265306; // 1/(7*7)
	float Kz = 0.166666666667; // 1/6
	float Kzo = 0.416666666667; // 1/2-1/6*2

	vec3 Pi = mod(floor(P), 289.0);
 	vec3 Pf = fract(P) - 0.5;

	vec3 Pfx = Pf.x + vec3(1.0, 0.0, -1.0);
	vec3 Pfy = Pf.y + vec3(1.0, 0.0, -1.0);
	vec3 Pfz = Pf.z + vec3(1.0, 0.0, -1.0);

	vec3 p = permute(Pi.x + vec3(-1.0, 0.0, 1.0));
	vec3 p1 = permute(p + Pi.y - 1.0);
	vec3 p2 = permute(p + Pi.y);
	vec3 p3 = permute(p + Pi.y + 1.0);

	vec3 p11 = permute(p1 + Pi.z - 1.0);
	vec3 p12 = permute(p1 + Pi.z);
	vec3 p13 = permute(p1 + Pi.z + 1.0);

	vec3 p21 = permute(p2 + Pi.z - 1.0);
	vec3 p22 = permute(p2 + Pi.z);
	vec3 p23 = permute(p2 + Pi.z + 1.0);

	vec3 p31 = permute(p3 + Pi.z - 1.0);
	vec3 p32 = permute(p3 + Pi.z);
	vec3 p33 = permute(p3 + Pi.z + 1.0);

	vec3 ox11 = fract(p11*K) - Ko;
	vec3 oy11 = mod(floor(p11*K), 7.0)*K - Ko;
	vec3 oz11 = floor(p11*K2)*Kz - Kzo; // p11 < 289 guaranteed

	vec3 ox12 = fract(p12*K) - Ko;
	vec3 oy12 = mod(floor(p12*K), 7.0)*K - Ko;
	vec3 oz12 = floor(p12*K2)*Kz - Kzo;

	vec3 ox13 = fract(p13*K) - Ko;
	vec3 oy13 = mod(floor(p13*K), 7.0)*K - Ko;
	vec3 oz13 = floor(p13*K2)*Kz - Kzo;

	vec3 ox21 = fract(p21*K) - Ko;
	vec3 oy21 = mod(floor(p21*K), 7.0)*K - Ko;
	vec3 oz21 = floor(p21*K2)*Kz - Kzo;

	vec3 ox22 = fract(p22*K) - Ko;
	vec3 oy22 = mod(floor(p22*K), 7.0)*K - Ko;
	vec3 oz22 = floor(p22*K2)*Kz - Kzo;

	vec3 ox23 = fract(p23*K) - Ko;
	vec3 oy23 = mod(floor(p23*K), 7.0)*K - Ko;
	vec3 oz23 = floor(p23*K2)*Kz - Kzo;

	vec3 ox31 = fract(p31*K) - Ko;
	vec3 oy31 = mod(floor(p31*K), 7.0)*K - Ko;
	vec3 oz31 = floor(p31*K2)*Kz - Kzo;

	vec3 ox32 = fract(p32*K) - Ko;
	vec3 oy32 = mod(floor(p32*K), 7.0)*K - Ko;
	vec3 oz32 = floor(p32*K2)*Kz - Kzo;

	vec3 ox33 = fract(p33*K) - Ko;
	vec3 oy33 = mod(floor(p33*K), 7.0)*K - Ko;
	vec3 oz33 = floor(p33*K2)*Kz - Kzo;

	vec3 dx11 = Pfx + jitter*ox11;
	vec3 dy11 = Pfy.x + jitter*oy11;
	vec3 dz11 = Pfz.x + jitter*oz11;

	vec3 dx12 = Pfx + jitter*ox12;
	vec3 dy12 = Pfy.x + jitter*oy12;
	vec3 dz12 = Pfz.y + jitter*oz12;

	vec3 dx13 = Pfx + jitter*ox13;
	vec3 dy13 = Pfy.x + jitter*oy13;
	vec3 dz13 = Pfz.z + jitter*oz13;

	vec3 dx21 = Pfx + jitter*ox21;
	vec3 dy21 = Pfy.y + jitter*oy21;
	vec3 dz21 = Pfz.x + jitter*oz21;

	vec3 dx22 = Pfx + jitter*ox22;
	vec3 dy22 = Pfy.y + jitter*oy22;
	vec3 dz22 = Pfz.y + jitter*oz22;

	vec3 dx23 = Pfx + jitter*ox23;
	vec3 dy23 = Pfy.y + jitter*oy23;
	vec3 dz23 = Pfz.z + jitter*oz23;

	vec3 dx31 = Pfx + jitter*ox31;
	vec3 dy31 = Pfy.z + jitter*oy31;
	vec3 dz31 = Pfz.x + jitter*oz31;

	vec3 dx32 = Pfx + jitter*ox32;
	vec3 dy32 = Pfy.z + jitter*oy32;
	vec3 dz32 = Pfz.y + jitter*oz32;

	vec3 dx33 = Pfx + jitter*ox33;
	vec3 dy33 = Pfy.z + jitter*oy33;
	vec3 dz33 = Pfz.z + jitter*oz33;

	vec3 d11 = dist(dx11, dy11, dz11, manhattanDistance);
	vec3 d12 =dist(dx12, dy12, dz12, manhattanDistance);
	vec3 d13 = dist(dx13, dy13, dz13, manhattanDistance);
	vec3 d21 = dist(dx21, dy21, dz21, manhattanDistance);
	vec3 d22 = dist(dx22, dy22, dz22, manhattanDistance);
	vec3 d23 = dist(dx23, dy23, dz23, manhattanDistance);
	vec3 d31 = dist(dx31, dy31, dz31, manhattanDistance);
	vec3 d32 = dist(dx32, dy32, dz32, manhattanDistance);
	vec3 d33 = dist(dx33, dy33, dz33, manhattanDistance);

	vec3 d1a = min(d11, d12);
	d12 = max(d11, d12);
	d11 = min(d1a, d13); // Smallest now not in d12 or d13
	d13 = max(d1a, d13);
	d12 = min(d12, d13); // 2nd smallest now not in d13
	vec3 d2a = min(d21, d22);
	d22 = max(d21, d22);
	d21 = min(d2a, d23); // Smallest now not in d22 or d23
	d23 = max(d2a, d23);
	d22 = min(d22, d23); // 2nd smallest now not in d23
	vec3 d3a = min(d31, d32);
	d32 = max(d31, d32);
	d31 = min(d3a, d33); // Smallest now not in d32 or d33
	d33 = max(d3a, d33);
	d32 = min(d32, d33); // 2nd smallest now not in d33
	vec3 da = min(d11, d21);
	d21 = max(d11, d21);
	d11 = min(da, d31); // Smallest now in d11
	d31 = max(da, d31); // 2nd smallest now not in d31
	d11.xy = (d11.x < d11.y) ? d11.xy : d11.yx;
	d11.xz = (d11.x < d11.z) ? d11.xz : d11.zx; // d11.x now smallest
	d12 = min(d12, d21); // 2nd smallest now not in d21
	d12 = min(d12, d22); // nor in d22
	d12 = min(d12, d31); // nor in d31
	d12 = min(d12, d32); // nor in d32
	d11.yz = min(d11.yz,d12.xy); // nor in d12.yz
	d11.y = min(d11.y,d12.z); // Only two more to go
	d11.y = min(d11.y,d11.z); // Done! (Phew!)
	return sqrt(d11.xy); // F1, F2

}

// end worley

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

float invRidgedNoise(vec3 pos, float frq, float seed) {

	float amp = 0.5;

	float n = 0.0;
	float gain = 1.0;
	for(int i=0; i<16; i++) {
		n +=  simplexRidged(vec3(pos.x*gain/frq, pos.y*gain/frq, pos.z*gain/frq), seed+float(i)*10.0) * amp/gain;
		gain *= 2.0;
	}

	n = pow(n, 2.0);
	n = 1.0 - n;

	return n;
}

float cloud(vec3 pos, float seed) {
	float n = noise(vec4(pos, seed));
	// n = sin(n*4.0 * cos(n*2.0));
	n = sin(n*7.0);

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
	n = pow(n, 1.0);
	n = 1.0-n;

	return n;
}

float star(vec3 pos, float seed) {
	float n = noise(vec4(pos, seed));

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

// highp float rand(vec2 co)
// {
//     highp float a = 12.9898;
//     highp float b = 78.233;
//     highp float c = 43758.5453;
//     highp float dt= dot(co.xy ,vec2(a,b));
//     highp float sn= mod(dt,3.14);
//     return fract(sin(sn) * c);
// }

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


	vec2 F = worley3D((sphericalCoord * 200.0) + vec3(seed), 1.0, true);
  float F1 = F.x;
  float F2 = F.y;

	float n = F1;
	n = 1.0 - n;
	n *= 1.2;
	n = pow(n, 4.0);

	// float t = 0.4;
	// if (n < t) {
	// 	n = 0.0;
	// } else {
	// 	n = n - t;
	// 	n *= 1.0/t;
	// 	n = pow(n, 1.0);
	// }

	// n *= 0.8;



	float sub1 = baseNoise(sphericalCoord, 0.001, seed+32.284);
	n *= sub1;

	vec3 starsColor = vec3(n);




	float nebulaStrength = 2.0;
	float c1 = cloudNoise(sphericalCoord, res1, seed);
	float c2 = cloudNoise(sphericalCoord + vec3(c1*res2*0.3), res2, seed+10.4);
	c2 = pow(c2, 2.0) * 1.2;
	// c2 = clamp(c2, 0.0, 1.0);
	vec3 nColor = texture2D(nebulaeMap, vec2(0.5, c1)).rgb * c1 * c2 * nebulaStrength;

	// add in large stars to nebulae
	F = worley3D((sphericalCoord * 40.0) + vec3(seed+35.890), 1.0, true);
	F1 = F.x;
	float n2 = F1;
	n2 = 1.0 - n2;
	n2 *= 1.2;
	n2 = pow(n2, 10.0);
	n2 *= sub1;
	nColor += vec3(n2);

	// add in a smaller amount of even very big stars
	F = worley3D((sphericalCoord * 10.0) + vec3(seed+35.890), 1.0, true);
	F1 = F.x;
	n2 = F1;
	n2 = 1.0 - n2;
	n2 *= 1.2;
	n2 = pow(n2, 10.0);
	n2 *= c2;
	nColor += vec3(n2);


	vec3 nebula = mix(starsColor, nColor, c2);
	nebula *= 0.8;

	gl_FragColor = vec4(nebula, 1.0);


	///////////////////////////


	// float nebulaStrength = 0.6;
  //
	// float c1 = cloudNoise(sphericalCoord, res1, seed);
	// float c2 = cloudNoise(sphericalCoord + vec3(c1*res2*0.3), res2, seed+50.0);
	// c2 = pow(c2, 3.0);
	// vec3 nColor = color1 * c1 * nebulaStrength;
	// vec3 nebula = mix(starsColor, nColor, c2);
  //
	// float mod = -0.0;
  //
	// c1 = cloudNoise(sphericalCoord, res1+mod, seed);
	// c2 = cloudNoise(sphericalCoord + vec3(c1*(res2+mod)*0.3), (res2+mod), seed+50.3);
	// c2 = pow(c2, 3.0);
	// nColor = color2 * c1 * nebulaStrength;
	// nebula += mix(vec3(0.0), nColor, c2);
  //
	// mod = +0.0;
  //
	// c1 = cloudNoise(sphericalCoord, res1+mod, seed);
	// c2 = cloudNoise(sphericalCoord + vec3(c1*(res2+mod)*0.3), (res2+mod), seed+50.6);
	// c2 = pow(c2, 3.0);
	// nColor = color3 * c1 * nebulaStrength;
	// nebula += mix(vec3(0.0), nColor, c2);
  //
	// vec3 newColor = nebula;
  //
	// newColor *= 1.0;
  //
	// gl_FragColor = vec4(newColor, 1.0);


	////////////////////////////////////////




}

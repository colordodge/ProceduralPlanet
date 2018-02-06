import noise from 'glsl-noise/simplex/4d'

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 cameraVector;

uniform float time;

uniform float atmo1;
uniform float atmo2;
uniform float atmo3;
uniform float atmo4;
uniform float atmo5;

void main() {

    // float brightness = noise(gl_FragCoord.xx);

    // gl_FragColor = vec4(vec3(brightness), 1.0);
    //gl_FragColor = vec4(#ffff00, 1.0);


    float n1 = noise(vec4(vPosition*2.0, time));
    float n2 = noise(vec4(vPosition*4.0, time));
    float n3 = noise(vec4(vPosition*8.0, time));
    float n4 = noise(vec4(vPosition*16.0, time));
    float n5 = noise(vec4(vPosition*32.0, time));
    float n6 = noise(vec4(vPosition*64.0, time));

    float n = 0.5;
    n *= 1.0 + n1*0.8;
    n *= 1.0 + n2*0.4;
    n *= 1.0 + n3*0.2;
    n *= 1.0 + n4*0.1;
    n *= 1.0 + n5*0.05;
    n *= 1.0 + n6*0.025;

    // n = fract(n * 5.0);

    vec3 newColor = vec3(n);

    if (n < 0.5) {
      float r = (n*0.5) + 0.2;
      newColor = vec3(r*0.1, r*0.4, r*0.8);
    } else {

      vec3 grass = vec3(0.1, 0.3, 0.15) * n;
      vec3 mountain = vec3(0.4, 0.3, 0.2) * n;
      // mountain = vec3(0.0*n);

      float r = (n-0.5) * 2.0;

      newColor = mix(grass, mountain, n);

    }

    newColor = vec3(0.0);

    const float ambient = 0.1;
		vec3 light = vec3( 1.0 );
		light = normalize( light );
		float directional = max( dot( vNormal, light ), 0.0 ) * 1.0;
		vec4 texelColor = vec4( ( directional + ambient ) * newColor, 1.0 );

    // gl_FragColor = texelColor;

    // gl_FragColor = vec4(1.0);

    ////////////////////////////
    // atmospheric scattering
    ///////////////////////////

    float PI = 3.14159265358979323846264;
		// light = light - vPosition;
		vec3 cameraDir = normalize(cameraVector);

    // vec3 newNormal = bumpNormal(normalMap, vUv);
    vec3 newNormal = vNormal;

		light = normalize(light);

		float lightAngle = max(0.0, dot(newNormal, light));
		float viewAngle = max(0.0, dot(vNormal, cameraDir));
		float adjustedLightAngle = min(0.6, lightAngle) / 0.6;
		float adjustedViewAngle = min(0.65, viewAngle) / 0.65;
		float invertedViewAngle = pow(acos(viewAngle), 3.0) * 0.4;

		float dProd = 0.0;
		dProd += atmo1 * lightAngle;
		dProd += atmo2 * lightAngle * (invertedViewAngle - atmo5);
		dProd += invertedViewAngle * 1.5 * (max(-0.35, dot(vNormal, light)) + 0.35);
		dProd *= atmo3 + pow(invertedViewAngle/(PI/2.0), 2.0);

		dProd *= atmo4;
		vec4 atmColor = vec4(0.0, dProd*0.5, dProd, 1.0);

    // texelColor = texture2D(map, vUv) * min(asin(lightAngle), 1.0);
    // texelColor = newColor * min(asin(lightAngle), 1.0);

		gl_FragColor = texelColor + min(atmColor, 1.0);




    /////////////////////////


    // gl_FragColor = texelColor;


}

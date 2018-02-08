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

uniform float alpha;

uniform vec3 color;

void main() {

    vec3 newColor = vec3(0.0);

    const float ambient = 0.1;
		vec3 light = vec3( -1.0, 1.0, 1.0 );
		light = normalize( light );
		float directional = max( dot( vNormal, light ), 0.0 ) * 1.0;
		vec4 texelColor = vec4( ( directional + ambient ) * newColor, 0.0 );

    // gl_FragColor = texelColor;

    // gl_FragColor = vec4(1.0);



    ////////////////////////////
    // atmospheric scattering
    ///////////////////////////

    // float PI = 3.14159265358979323846264;
		// // light = light - vPosition;
		// vec3 cameraDir = normalize(cameraVector);
    //
    // // vec3 newNormal = bumpNormal(normalMap, vUv);
    // vec3 newNormal = vNormal;
    //
		// light = normalize(light);
    //
		// float lightAngle = max(0.0, dot(newNormal, light));
		// float viewAngle = max(0.0, dot(vNormal, cameraDir));
		// float adjustedLightAngle = min(0.6, lightAngle) / 0.6;
		// float adjustedViewAngle = min(0.65, viewAngle) / 0.65;
		// float invertedViewAngle = pow(acos(viewAngle), 3.0) * 0.4;
    //
		// float dProd = 0.0;
		// dProd += atmo1 * lightAngle;
		// dProd += atmo2 * lightAngle * (invertedViewAngle - atmo5);
		// dProd += invertedViewAngle * 1.5 * (max(-0.35, dot(vNormal, light)) + 0.35);
		// dProd *= atmo3 + pow(invertedViewAngle/(PI/2.0), 2.0);
    //
		// dProd *= atmo4;
		// vec4 atmColor = vec4(color, dProd);
    //
    // // texelColor = texture2D(map, vUv) * min(asin(lightAngle), 1.0);
    // // texelColor = newColor * min(asin(lightAngle), 1.0);
    //
		// gl_FragColor = texelColor + min(atmColor, alpha);

    /////////////////////////


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

		vec4 atmColor = vec4(color, dProd);

    // texelColor = texture2D(map, vUv) * min(asin(lightAngle), 1.0);
    // texelColor = newColor * min(asin(lightAngle), 1.0);

		gl_FragColor = texelColor + min(atmColor, alpha);


}

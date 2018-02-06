
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 cameraVector;

uniform float time;

void main() {
  // gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);

  // vPosition = normalize(position) * scale;
  vPosition = position;
  vNormal = normal;
  cameraVector = cameraPosition - vPosition;

	// vec3 newPosition = position + normal * amplitude * displacement;
	vec3 newPosition = position;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}

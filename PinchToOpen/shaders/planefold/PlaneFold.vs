varying vec2 vUV;
varying vec3 vViewPosition;
varying mat4 vMVMatrix;
varying vec3 vPosition;

uniform float morphTargetInfluences[4];

void main() {
    vMVMatrix = modelViewMatrix;
    vUV = uv;

    vec3 morphed = vec3( 0.0 );
    morphed += ( morphTarget0 - position ) * morphTargetInfluences[0];
    morphed += ( morphTarget1 - position ) * morphTargetInfluences[1];
    morphed += ( morphTarget2 - position ) * morphTargetInfluences[2];
    morphed += ( morphTarget3 - position ) * morphTargetInfluences[3];
    morphed += position;

    vec4 mvPosition = modelViewMatrix * vec4(morphed, 1.0);
    vViewPosition = -mvPosition.xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(morphed, 1.0);

    vPosition = gl_Position.xyz;
}
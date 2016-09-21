attribute vec3 offset;
attribute vec4 orientation;
attribute vec3 random;
attribute float released;

uniform float time;

varying vec2 vUVMatCap;
varying float vReleased;

#require(matcap.vs)

void main() {

    vReleased = released;

    // Update vertex positions based on offset and orientation buffers
    vec3 pos = position;

    pos *= random;

    vec4 or = orientation;
    vec3 vcV = cross(or.xyz, pos);
    pos = vcV * (2.0 * or.w) + (cross(or.xyz, vcV) * 2.0 + pos);
    pos += offset;

    pos.x += (1.0 - released) * 10000.0;

    // Update normals as well for matcap to work
    vec3 nml = normal;
    vec3 vcn = cross(or.xyz, normal);
    nml = vcn * (2.0 * or.w) + (cross(or.xyz, vcn) * 2.0 + nml);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    vUVMatCap = reflectMatcap(gl_Position.xyz, modelViewMatrix, nml);
}
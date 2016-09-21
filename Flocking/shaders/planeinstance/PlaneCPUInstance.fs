uniform sampler2D tMatCap;
uniform float alpha;

varying vec2 vUVMatCap;
varying float vReleased;

void main() {
    gl_FragColor = texture2D(tMatCap, vUVMatCap);
    gl_FragColor.a *= alpha;
    gl_FragColor.a *= vReleased;
}
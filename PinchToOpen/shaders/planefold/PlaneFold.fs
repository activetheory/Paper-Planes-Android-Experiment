varying vec2 vUV;
varying vec3 vViewPosition;
varying mat4 vMVMatrix;
varying vec3 vPosition;

uniform sampler2D tMatCap;
uniform sampler2D tFold;
uniform sampler2D tStamp;
uniform sampler2D tBorder;
uniform sampler2D tSplat;
uniform float fIntensity;
uniform float fAge;
uniform float fFade;
uniform vec3 splatColor;
uniform float splatAlpha;
uniform float splatScale;
uniform vec2 splatPosition;
uniform vec3 stripColor;
uniform float stripAlpha;

#require(matcap.vs)

vec3 blend(vec4 src, vec4 dst) {
    return src.rgb + (dst.rgb * (1.0 - src.a));
}

vec3 blendSplat(vec4 src, vec4 dst) {
   return src.rgb + (dst.rgb * (1.0 - src.a));
}

void main() {

    vec3 fdx = vec3(dFdx(vViewPosition.x), dFdx(vViewPosition.y), dFdx(vViewPosition.z));
    vec3 fdy = vec3(dFdy(vViewPosition.x), dFdy(vViewPosition.y), dFdy(vViewPosition.z));
    vec3 normal = normalize(cross(fdx,fdy));

    vec2 uvMatCap = reflectMatcap(vPosition, vMVMatrix, normal);

    vec4 matCap = texture2D(tMatCap, uvMatCap);
    vec4 folded = texture2D(tFold, vUV);
    vec4 stamp = texture2D(tStamp, vUV);
    vec4 border = texture2D(tBorder, vUV);
    stamp.a *= fIntensity * fFade;
    stamp.rgb *= stamp.a;

    border.rgb = mix(vec3(1.0), border.rgb, fIntensity * fFade);
    folded.rgb = mix(vec3(1.0), folded.rgb, 0.2 * fAge * fFade);

    vec2 scale = vec2(splatScale, splatScale * 21.0 / 30.0);
    vec2 uvSplat = vUV;
    uvSplat /= scale;
    uvSplat += vec2(0.5);
    uvSplat -= splatPosition / scale;
    vec4 splat = texture2D(tSplat, uvSplat);
    splat.a *= splatAlpha;
    splat.rgb *= splat.a;
    splat.rgb *= splatColor;

    gl_FragColor = matCap;
    gl_FragColor = mix(matCap, folded, 0.8);
    gl_FragColor *= border;
    gl_FragColor.rgb = blend(stamp, gl_FragColor);
    gl_FragColor.rgb = blendSplat(splat, gl_FragColor);

    gl_FragColor.rgb = mix(gl_FragColor.rgb, stripColor + vec3(0.2, 0.2, 0.3), smoothstep(0.96999, 0.97, vUV.y) * stripAlpha * 0.8 * (1.0 - fFade));
}
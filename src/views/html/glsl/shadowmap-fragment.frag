#include <packing>
uniform sampler2D uDepthMap;
varying vec4 vShadowCoord;
varying vec3 vNormal;
uniform vec3 uLightDir;
uniform vec3 uColor;

uniform bool uUsePCF;
uniform int uPCFRegion;
uniform float uPCFRadius;

float frustumTest(vec3 shadowCoord, float shadowFactor) {
  bvec4 inFrustumVec = bvec4(shadowCoord.x >= 0., shadowCoord.x <= 1., shadowCoord.y >= 0., shadowCoord.y <= 1.);
  bool inFrustum = all(inFrustumVec);

  bvec2 frustumTestVec = bvec2(inFrustum, shadowCoord.z <= 1.);
  bool frustumTest = all(frustumTestVec);

  if(frustumTest == false) {
    shadowFactor = 1.;
  }

  return shadowFactor;
}

float calcPCF(vec3 projCoords, float bias) {
  float shadowFactor = 0.;
  float currentDepth = projCoords.z;

  vec2 texelSize = 1. / vec2(textureSize(uDepthMap, 0));

  for(int x = -uPCFRegion; x <= uPCFRegion; x++) {
    for(int y = -uPCFRegion; y <= uPCFRegion; y++) {
      float shadowMapDepth = unpackRGBAToDepth(texture(uDepthMap, projCoords.xy + uPCFRadius * vec2(x, y) * texelSize));
      shadowFactor += step(currentDepth - bias, shadowMapDepth);
    }
  }

  int total = 2 * uPCFRegion + 1;
  return shadowFactor / float(total * total);
}

void main() {
  vec3 projCoords = vShadowCoord.xyz / vShadowCoord.w;
  projCoords = projCoords * 0.5 + 0.5;

  float cosTheta = dot(normalize(-uLightDir), vNormal);

  float difLight = max(0.0, cosTheta);

  float bias = 0.005 * tan(acos(cosTheta));
  bias = clamp(bias, 0.0, 0.0001);

  float shadowFactor = 0.;

  if(uUsePCF == true) {
    shadowFactor = calcPCF(projCoords, bias);
  } else {
    float depth = unpackRGBAToDepth(texture(uDepthMap, projCoords.xy));
    float currentDepth = projCoords.z;
    shadowFactor = step(currentDepth - bias, depth);
    shadowFactor = frustumTest(projCoords, shadowFactor);
  }

  float shading = shadowFactor * difLight;

  vec3 color = vec3(0.);

  color = mix(uColor - .1, uColor + .1, shading);

  gl_FragColor = vec4(color, 1.);
}
varying vec3 vNormal;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

varying vec4 vShadowCoord;

void main() {
  vNormal = normal;
  vec3 pos = position;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
  vShadowCoord = uProjectionMatrix * uViewMatrix * modelMatrix * vec4(pos, 1.0);
}
in vec3 position;
in vec3 normal;
in vec2 uv;

out vec2 vUv;
out vec3 vNormal;
out vec4 vPosition;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
  vUv = uv;

  vPosition = modelViewMatrix * vec4(position, 1.);
  vNormal = normalize(normalMatrix * normal);
}
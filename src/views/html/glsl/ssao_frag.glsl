precision highp float;
precision highp int;

in vec2 vUv;

layout(location = 0) out vec4 pc_FragColor;
uniform sampler2D gPosition;

void main() {
  float w = texture(gPosition, vUv).a;
  pc_FragColor = vec4(vec3(w), 1.);
}
uniform sampler2D tDiffuse;
uniform sampler2D tDiffuse2;

uniform vec2 resolution;

varying vec2 vUv;

void main() {

  vec2 texelSize = (1.0 / resolution);
  float result = 0.0;

  for(int i = -2; i <= 2; i++) {

    for(int j = -2; j <= 2; j++) {

      vec2 offset = (vec2(float(i), float(j))) * texelSize;
      result += texture2D(tDiffuse, vUv + offset).r;

    }

  }

  gl_FragColor = texture2D(tDiffuse2, vUv) * vec4(vec3(result / (5.0 * 5.0)), 1.0);

}
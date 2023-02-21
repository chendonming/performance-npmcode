precision highp float;
precision highp int;
layout(location = 0) out vec4 pc_FragColor;

in vec2 vUv;

uniform sampler2D gPosition;
uniform sampler2D gDepth;
uniform sampler2D gColor;
uniform sampler2D gNormal;
uniform vec3 uSamples[KERNELSIZE];
uniform sampler2D uTexNoise;
uniform vec2 uResolution;
uniform float uKernelSizeRadius;

void main() {
  vec2 noiseScale = vec2(uResolution.x / 4.0, uResolution.y / 4.0);
  vec3 normal = normalize(texture(gNormal, vUv).rgb);
  vec3 position = texture(gPosition, vUv).xyz;

  vec3 randomVec = texture(uTexNoise, vUv * noiseScale).xyz;
  vec3 tangent = normalize(randomVec - normal * dot(randomVec, normal));
  vec3 bitangent = cross(normal, tangent);
  mat3 TBN = mat3(tangent, bitangent, normal);

  float occlusion = 0.0;
  float sampleDepth = texture(gDepth, vUv).x;

  for(int i = 0; i < KERNELSIZE; ++i) {
    vec3 m_sample = TBN * uSamples[i]; // 切线->观察空间
    m_sample = position + m_sample * uKernelSizeRadius;

    // 观察空间中z坐标代表摄像机向外的方向
    float rangeCheck = smoothstep(0.0, 1.0, uKernelSizeRadius / abs(position.z - sampleDepth));
    occlusion += (sampleDepth >= m_sample.z ? 1.0 : 0.0) * rangeCheck;
  }

  occlusion = (occlusion / float(KERNELSIZE));
  pc_FragColor = vec4(vec3(occlusion), 1.);
}
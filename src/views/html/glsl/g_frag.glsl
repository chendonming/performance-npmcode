precision highp float;
precision highp int;

in vec3 vNormal;
in vec4 vPosition;

uniform vec3 uColor;
uniform float cameraNear;
uniform float cameraFar;

layout(location = 0) out vec3 gColor;
layout(location = 1) out vec4 gPosition;
layout(location = 2) out vec3 gNormal;

// 屏幕空间转观察空间深度值
float getLinearDepth(float depth, float cameraNear, float cameraFar) {
  float zNDC = 2. * depth - 1.; // 转换到NDC 裁剪空间
  return (2. * cameraFar * cameraNear) / (cameraFar + cameraNear - zNDC * (cameraFar - cameraNear));
}

void main() {
  gNormal = vNormal;

  // 观察空间的位置
  gPosition.xyz = vec3(vPosition);
  // 观察空间的深度值
  gPosition.a = getLinearDepth(gl_FragCoord.z, cameraNear, cameraFar);

  gColor = uColor;
}
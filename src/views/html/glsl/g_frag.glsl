precision highp float;
precision highp int;

in vec3 vNormal;
in vec4 vPosition;

uniform vec3 uColor;
uniform float cameraNear;
uniform float cameraFar;

layout(location = 0) out vec4 gColor;
layout(location = 1) out vec4 gPosition;
layout(location = 2) out vec4 gNormal;
layout(location = 3) out vec4 gDepth;

// 屏幕空间转观察空间深度值 转换为near-far的线性插值
float getLinearDepth(float depth, float n, float f) {
    float z = depth * 2. - 1.;// 转换到NDC 裁剪空间
    return (2. * f * n) / (f + n - z * (f - n));
}

void main() {
    gNormal = vec4(vNormal, 0.);

    float depth = getLinearDepth(gl_FragCoord.z, cameraNear, cameraFar) / cameraFar;
    // 观察空间的位置
    gPosition = vec4(vPosition.xyz, 1.);

    gDepth = vec4(vec3(depth), 1.);
    gColor = vec4(uColor, 1.);
}
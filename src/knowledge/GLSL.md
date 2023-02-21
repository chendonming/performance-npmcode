# 数据纹理格式说明

在片段着色器中尝试输出如下数据:

```glsl
layout(location = 0) out vec4 gColor;
void main() {
  gColor = vec4(.1, .1, .1, 1.);
}
```

在另一个片段着色器中使用:

```glsl
uniform sampler2D gDepth;

void main() {
  vec4 g = texture(gDepth, vUv);

  if(g.x == .1) {
    pc_FragColor = vec4(1., 1., 0., 1.);
  } else {
    pc_FragColor = vec4(1., 0., 0., 1.);
  }
}
```

你会发现输出的是红色，也就是说在这里 g.x 得到的不是 0.1

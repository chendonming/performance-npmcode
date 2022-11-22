<template>
  <h1>Basic 基矩阵</h1>
</template>

<script setup lang="ts">
import * as THREE from "three";
//@ts-ignore
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

/**
 * 探究矩阵意义<我们能否不展开矩阵直接明白矩阵的含义?>
 * 一般情况下我们都需要对矩阵展开才能大致明白矩阵的含义  是否能探寻出一般性规律在不展开的情况下了解矩阵的含义
 */
const props = defineProps({
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  controls: Object
});

const { scene, renderer, camera, controls } = props;
camera?.position.set(10, 16, 10)
controls?.update()

let v1 = new THREE.Vector3(),
  v2 = new THREE.Vector3(),
  v3 = new THREE.Vector3(),
  h1: THREE.ArrowHelper,
  h2: THREE.ArrowHelper,
  h3: THREE.ArrowHelper,
  mesh = createGeometry(),
  mesh1: THREE.LineSegments,
  status = false;
const gui = new GUI()
const debug = {
  v1x: 1,
  v1y: 0,
  v1z: 0,
  v2x: 0,
  v2y: 1,
  v2z: 0,
  v3x: 0,
  v3y: 0,
  v3z: 1,
  view: function () {
    status = !status
    if (mesh1) {
      mesh1.removeFromParent()
    }
    if (mesh) {
      mesh.removeFromParent()
    }

    if (status) {
      mesh1 = createGeometry()
    } else {
      scene?.add(mesh)
    }
  }
}

v1 = new THREE.Vector3(debug.v1x, debug.v1y, debug.v1z)
v2 = new THREE.Vector3(debug.v2x, debug.v2y, debug.v2z)
v3 = new THREE.Vector3(debug.v3x, debug.v3y, debug.v3z)
mesh.applyMatrix4(m1())
const min = -20;
const max = 20;
gui.add(debug, 'v1x', min, max).onChange((n: number) => {
  v1.x = n;
  console.log(v1)
  if (h1 && h2 && h3) {
    h1.removeFromParent()
    h2.removeFromParent()
    h3.removeFromParent()
  }
  mesh.removeFromParent();
  mesh = createGeometry();
  mesh.applyMatrix4(m1())
})
gui.add(debug, 'v1y', min, max).onChange((n: number) => {
  v1.y = n;
  if (h1 && h2 && h3) {
    h1.removeFromParent()
    h2.removeFromParent()
    h3.removeFromParent()
  }
  mesh.removeFromParent();
  mesh = createGeometry();
  mesh.applyMatrix4(m1())
})
gui.add(debug, 'v1z', min, max).onChange((n: number) => {
  v1.z = n;
  if (h1 && h2 && h3) {
    h1.removeFromParent()
    h2.removeFromParent()
    h3.removeFromParent()
  }
  mesh.removeFromParent();
  mesh = createGeometry();
  mesh.applyMatrix4(m1())
})
gui.add(debug, 'v2x', min, max).onChange((n: number) => {
  v2.x = n;
  if (h1 && h2 && h3) {
    h1.removeFromParent()
    h2.removeFromParent()
    h3.removeFromParent()
  }
  mesh.removeFromParent();
  mesh = createGeometry();
  mesh.applyMatrix4(m1())
})
gui.add(debug, 'v2y', min, max).onChange((n: number) => {
  v2.y = n;
  if (h1 && h2 && h3) {
    h1.removeFromParent()
    h2.removeFromParent()
    h3.removeFromParent()
  }
  mesh.removeFromParent();
  mesh = createGeometry();
  mesh.applyMatrix4(m1())
})
gui.add(debug, 'v2z', min, max).onChange((n: number) => {
  v2.z = n;
  if (h1 && h2 && h3) {
    h1.removeFromParent()
    h2.removeFromParent()
    h3.removeFromParent()
  }
  mesh.removeFromParent();
  mesh = createGeometry();
  mesh.applyMatrix4(m1())
})
gui.add(debug, 'v3x', min, max).onChange((n: number) => {
  v3.x = n;
  if (h1 && h2 && h3) {
    h1.removeFromParent()
    h2.removeFromParent()
    h3.removeFromParent()
  }
  mesh.removeFromParent();
  mesh = createGeometry();
  mesh.applyMatrix4(m1())
})
gui.add(debug, 'v3y', min, max).onChange((n: number) => {
  v3.y = n;
  if (h1 && h2 && h3) {
    h1.removeFromParent()
    h2.removeFromParent()
    h3.removeFromParent()
  }
  mesh.removeFromParent();
  mesh = createGeometry();
  mesh.applyMatrix4(m1())
})
gui.add(debug, 'v3z', min, max).onChange((n: number) => {
  v3.z = n;
  if (h1 && h2 && h3) {
    h1.removeFromParent()
    h2.removeFromParent()
    h3.removeFromParent()
  }
  mesh.removeFromParent();
  mesh = createGeometry();
  mesh.applyMatrix4(m1())
})
gui.add(debug, 'view').name('查看几何体原来的样子')

function m1() {
  const m = new THREE.Matrix4()

  h1 = new THREE.ArrowHelper(v1.clone().normalize(), new THREE.Vector3(), v1.length() / 2, new THREE.Color('red'))
  h2 = new THREE.ArrowHelper(v2.clone().normalize(), new THREE.Vector3(), v2.length() / 2, new THREE.Color('green'))
  h3 = new THREE.ArrowHelper(v3.clone().normalize(), new THREE.Vector3(), v3.length() / 2, new THREE.Color('blue'))
  scene?.add(h1, h2, h3)

  // 设置基矩阵
  m.set(
    v1.x, v2.x, v3.x, 0,
    v1.y, v2.y, v3.y, 0,
    v1.z, v2.z, v3.z, 0,
    0, 0, 0, 1
  )

  return m;
}

/**
 * 创建一个可以看见的物体
 */
function createGeometry() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const edges = new THREE.EdgesGeometry(geometry);
  const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.LineSegments(edges, material);
  scene?.add(cube);
  return cube;
}
</script>

<style scoped>
pre {
  position: fixed;
  top: 100px;
  left: 100px;
  font-size: 18px;
}
</style>

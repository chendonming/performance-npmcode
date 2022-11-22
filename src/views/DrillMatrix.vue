<template>
  <h1>演练：对三角面构造矩阵</h1>
</template>

<script setup lang="ts">
import * as THREE from "three";

const props = defineProps({
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  controls: Object
});
/**
 * 演练：在测量中对三角面构造矩阵
 */
const { scene, renderer, camera, controls } = props;

let v1 = new THREE.Vector3(0, 0, 0),
  v2 = new THREE.Vector3(1, 1, 1),
  v3 = new THREE.Vector3(1, 0, 1),
  normal = new THREE.Vector3()

const z = new THREE.Triangle(v1, v2, v3).getNormal(normal)
const x = new THREE.Vector3().subVectors(v1, v2).normalize();
const y = z.clone().cross(x)

const hn = new THREE.ArrowHelper(normal, new THREE.Vector3(), normal.length(), new THREE.Color(0xff0000))
scene?.add(hn)

const hx = new THREE.ArrowHelper(x, new THREE.Vector3(), x.length(), new THREE.Color(0xff00ff))
scene?.add(hx)

const hy = new THREE.ArrowHelper(y, new THREE.Vector3(), y.length(), new THREE.Color(0x000000))
scene?.add(hy)

{
  // 三角辅助对象
  const b = new THREE.BufferGeometry().setFromPoints([v1, v2, v3])
  const material = new THREE.LineBasicMaterial({
    color: 0x0000ff
  });
  const line = new THREE.LineLoop(b, material)
  scene?.add(line)
}
</script>

<style scoped>
h1 {
  position: fixed;
  top: 0;
  left: 100px;
}
</style>
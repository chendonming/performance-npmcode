<template>
  <h1>Matrix4 setPosition</h1>
</template>

<script setup lang="ts">
import * as THREE from "three";
//@ts-ignore
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

const props = defineProps({
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  controls: Object
});
/**
 * 演练测试Matrix4中的setPosition方法
 */
const { scene, renderer, camera, controls } = props;

let mesh = createGeometry()
let v1 = new THREE.Vector3(1, 1, 1)

const gui = new GUI()
const debug = {
  x: 1,
  y: 1,
  z: 1
}

gui.add(debug, 'x', -10, 10).onChange((v: number) => {
  v1.x = v;
  m1()
})

gui.add(debug, 'y', -10, 10).onChange((v: number) => {
  v1.y = v;
  m1()
})

gui.add(debug, 'z', -10, 10).onChange((v: number) => {
  v1.z = v;
  m1()
})

function m1() {
  const m = new THREE.Matrix4().setPosition(v1)
  if (mesh) {
    mesh.removeFromParent()
  }
  mesh = createGeometry()
  mesh.applyMatrix4(m)
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
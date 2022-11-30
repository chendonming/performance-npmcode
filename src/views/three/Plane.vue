<template>

</template>

<script setup lang="ts">
import * as THREE from "three";
//@ts-ignore
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

/**
 * 关于Plane平面的互动测试
 */
const props = defineProps({
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  controls: Object
});
const { scene, renderer, camera, controls } = props;
camera?.position.set(-7.515256887313716, 7.747599644741814, 12.88287079215545)
controls?.update()

const normal = new THREE.Vector3(1, 0, 0)

let constant = 1;
const p = new THREE.Plane(normal, constant);

const h = new THREE.PlaneHelper(p, 10, 0xff0000)
const h1 = new THREE.ArrowHelper(normal, new THREE.Vector3(), 10, 0x0000ff);

scene?.add(h1).add(h)

/**
 * 小结论：平面的constant的符号只和方向有关
 */

const gui = new GUI()
const obj = {
  constant
}
gui.add(obj, 'constant', -10, 10).onChange((v: number) => {
  p.constant = v;
})

</script>
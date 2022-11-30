<template>

</template>

<script setup lang="ts">
import * as THREE from "three";
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
/**
 * 缩放物体控件
 */
const props = defineProps({
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  controls: Object
});
const { scene, renderer, camera, controls } = props;
if (camera && renderer && controls) {
  controls.enabled = false;
  let control = new TransformControls(camera, renderer.domElement);
  control.setMode('scale')
  const mesh = createGeometry()
  control.attach(mesh);
  scene?.add(control)
}

/**
 * 创建一个可以看见的物体
 */
function createGeometry() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene?.add(cube);
  return cube;
}
</script>
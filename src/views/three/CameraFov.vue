<template></template>

<script setup lang="ts">
import * as THREE from "three";
/**
 * 探索搞懂相机Fov及其计算
 */
const props = defineProps({
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  controls: Object,
});
const { scene, renderer, camera, controls } = props;
if (camera) {
  console.log(camera.fov);
}
</script>

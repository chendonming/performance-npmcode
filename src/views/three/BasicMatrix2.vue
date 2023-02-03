<template></template>

<script setup lang="ts">
import * as THREE from "three";

const props = defineProps({
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  controls: Object,
});
const { scene, renderer, camera, controls } = props;
if (scene) {
  const h = new THREE.GridHelper(100, 100);
  scene.add(h);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
}
</script>

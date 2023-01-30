<template></template>

<script setup lang="ts">
import * as THREE from "three";

/**
 * 探索欧拉角
 */

const props = defineProps({
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  controls: Object,
});
const { scene, renderer, camera, controls } = props;
</script>

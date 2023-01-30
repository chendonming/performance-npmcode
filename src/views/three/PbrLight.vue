<template></template>

<script setup lang="ts">
import * as THREE from "three";
//@ts-ignore
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
/**
 * pbr光照模型
 */
const props = defineProps({
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  controls: Object,
});
const { scene, renderer, camera, controls } = props;

const material = new THREE.ShaderMaterial({
  vertexShader: `
      void main () {
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 )
      }
  `,
  fragmentShader: `
  
  `,
});
</script>

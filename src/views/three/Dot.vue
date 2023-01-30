<template>

</template>

<script setup lang="ts">
import * as THREE from "three";
/**
 * 探索dot点积和与点积相关的three计算
 * 点积和叉乘
 */
const props = defineProps({
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  controls: Object
});
const { scene, renderer, camera, controls } = props;

basic()

/**
 * 基础实验，两个点dot，绿色和蓝色代表两个点，红色代表结果
 */
function basic() {

}

</script>
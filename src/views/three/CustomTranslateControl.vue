<template>
</template>

<script setup lang="ts">
import * as THREE from "three";
import { TransformControl } from "../../base/TransformControl";
/**
 * 自定义控制器
 */
const props = defineProps({
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  controls: Object
});
const { scene, renderer, camera, controls } = props;
if (scene && renderer && camera && controls) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  console.log(cube)

  const t = new TransformControl(camera, renderer.domElement)
  t.onDragChange = (a) => {
    controls.enabled = !a;
  }
  scene.add(t)

  t.attach(cube)
}
</script>
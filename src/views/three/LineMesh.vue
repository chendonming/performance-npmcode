<template></template>

<script setup lang="ts">
import * as THREE from "three";
//@ts-ignore
import { LineSegmentsGeometry } from "./LineMesh/LineSegmentsGeometry.js";
//@ts-ignore
import { LineMaterial } from "./LineMesh/LineMaterial.js";
//@ts-ignore
import { LineSegments2 } from "./LineMesh/LineSegments2.js";

/**
 * 如何通过Mesh实现Line
 */
const props = defineProps({
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  controls: Object,
});
const { scene, renderer, camera, controls } = props;
if (scene && renderer && camera && controls) {
  camera.position.set(2, 2, 2);
  camera.lookAt(0, 0, 0);
  controls.update();
  const positions = [
    0, 0, 0, 1, 1, 1,

    3, 3, 3, 6, 6, 6,
  ];
  const geometry = new LineSegmentsGeometry();
  geometry.setPositions(positions);

  const lineMat = new LineMaterial({
    linewidth: 1,
    color: 0x000000,
    resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
  });

  lineMat.worldUnits = true;
  lineMat.needsUpdate = true;

  const mesh = new LineSegments2(geometry, lineMat);
  scene.add(mesh);
}
</script>

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

    7, 7, 7, 8, 8, 8,
  ];

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(positions), 3)
  );

  const material = new THREE.ShaderMaterial({
    vertexShader: `
      void main() {
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.);
      }
    `,
    fragmentShader: `
      void main () {
        gl_FragColor = vec4(1., 0., 0., 1.);
      }
    `,
  });
  const t = new THREE.LineSegments(geometry, material);

  scene.add(t);
}
</script>

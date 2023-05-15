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
if (scene && renderer && camera && controls) {
  //8
  const vertices = [
    1, 1, 1, 1, 1, -1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, 1, -1,
    -1, -1,
  ];

  // 24 --> 分裂后  36
  const polygonVertexIndex = [
    0, 4, 6, -3, 3, 2, 6, -8, 7, 6, 4, -6, 5, 1, 3, -8, 1, 0, 2, -4, 5, 4, 0,
    -2,
  ];

  //72/3 = 24
  const normals = [
    0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
    -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
    -1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
  ];

  const finalNormal: number[] = [];

  const positionArray = new Float32Array(vertices);

  const quadToTriangle = function (quadArray: number[]) {
    let triangleArray = [];
    for (let i = 0; i < quadArray.length; i += 4) {
      triangleArray.push(quadArray[i]);
      triangleArray.push(quadArray[i + 1]);
      triangleArray.push(quadArray[i + 2]);

      triangleArray.push(quadArray[i]);
      triangleArray.push(quadArray[i + 2]);
      triangleArray.push(quadArray[i + 3]);
    }
    return triangleArray;
  };

  let indexs = quadToTriangle(polygonVertexIndex);

  indexs = indexs.map((v) => {
    if (v >= 0) {
      return v;
    }

    return Math.abs(v) - 1;
  });

  console.log(indexs);

  console.log(finalNormal);

  const indexArray = new Uint16Array(indexs);

  const bufferGeometry = new THREE.BufferGeometry();
  bufferGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positionArray, 3)
  );

  bufferGeometry.setAttribute(
    "normal",
    new THREE.BufferAttribute(new Float32Array(normals), 3)
  );

  bufferGeometry.setIndex(new THREE.BufferAttribute(indexArray, 1));

  const mesh = new THREE.Mesh(
    bufferGeometry,
    new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      side: THREE.DoubleSide
    })
  );

  console.log(mesh);

  scene.add(mesh);
}
</script>

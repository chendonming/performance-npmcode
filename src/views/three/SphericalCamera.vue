<template>

</template>

<script setup lang="ts">
import * as THREE from "three";
//@ts-ignore
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
/**
 * 使用球坐标系来旋转相机
 */
const props = defineProps({
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  controls: Object
});
const { scene, renderer, camera, controls } = props;
console.log(camera)
if (controls && renderer && camera) {
  controls.enabled = false;
  const dom = renderer.domElement;
  const cameraPosition = new THREE.Vector3()
  const cameraRotation = new THREE.Euler()
  let mouseDownX: number, mouseDownY: number, enable = false

  const json = {
    offsetX: 0,
    offsetY: 0,
  }

  dom.addEventListener('mousedown', (e) => {
    mouseDownX = e.offsetX;
    mouseDownY = e.offsetY;
    cameraPosition.copy(camera.position)
    cameraRotation.copy(camera.rotation)
    enable = true
  })

  dom.addEventListener('mouseup', e => {
    enable = false
  })

  dom.addEventListener('mousemove', e => {
    if (!enable) return
    const offsetX = (e.offsetX - mouseDownX) / dom.clientWidth * 2;
    const offsetY = (e.offsetY - mouseDownY) / dom.clientHeight * 2;
    const matrix3 = new THREE.Matrix3()
    mouseDownX = e.offsetX;
    mouseDownY = e.offsetY;

    cameraPosition.copy(camera.position);

    let rotation = new THREE.Vector3(0, 0, -1);
    rotation.applyNormalMatrix(matrix3.setFromMatrix4(camera.matrixWorld));
    let spherical = new THREE.Spherical();
    spherical.setFromVector3(rotation);
    spherical.theta -= offsetX
    spherical.phi += offsetY

    spherical.makeSafe();
    rotation.setFromSpherical(spherical);

    camera.position.set(0, 0, 0);
    camera.lookAt(rotation.x, rotation.y, rotation.z);
    console.log(camera.position)
    camera.position.copy(cameraPosition);
    camera.updateMatrixWorld();
  })
}
</script>
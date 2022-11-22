<template></template>

<script setup lang="ts">
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";

const props = defineProps({
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
});

const { scene, renderer, camera } = props;
console.log("camera: ", camera);
const mesh = createGeometry();

/**
 * 物体移动、镜头移动也许应该用补间动画，自带的animationMixer似乎最好用于自身的动画
 */

// geoAnimation()

camearAnimation();

renderer?.setAnimationLoop(() => {
  TWEEN.update();
});

/**
 * 相机的补间动画
 */
function camearAnimation() {
  if (!camera) return;
  new TWEEN.Tween(camera.position)
    .to({
      x: 3,
      y: 4,
      z: 2.99999999999,
    })
    .easing(TWEEN.Easing.Cubic.Out)
    .start();

  new TWEEN.Tween(camera.quaternion)
    .to(
      {
        x: -0.47465674831720593,
        y: 0.15385645171776974,
        z: 0.044570654466371644,
      },
      1000
    )
    .easing(TWEEN.Easing.Cubic.Out)
    .start();
}

/**
 * 物体的移动动画
 */
function geoAnimation() {
  new TWEEN.Tween(mesh.position)
    .to(
      {
        x: 1,
        y: 1,
        z: 1,
      },
      1000
    )
    .easing(TWEEN.Easing.Cubic.Out)
    .start();
}

/**
 * 创建一个可以看见的物体
 */
function createGeometry() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene?.add(cube);
  return cube;
}
</script>

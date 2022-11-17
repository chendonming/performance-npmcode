<template>
  <!-- THREEJS模板 -->
  <div class="WebGl" ref="webgl" id="webgl"></div>
  <RouterView :scene="scene" v-if="camera" :renderer="renderer" :camera="camera" />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import { onMounted, Ref, ref } from "vue";

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
let camera: Ref<THREE.PerspectiveCamera | undefined> = ref();

onMounted(() => {
  scene.background = new THREE.Color("#fff");
  const dom = document.getElementById("webgl")!;
  const width = dom.clientWidth;
  const height = dom.clientHeight;
  camera.value = new THREE.PerspectiveCamera(75, width / height, 0.01, 1000);

  renderer.localClippingEnabled = true;
  renderer.setSize(width, height);
  dom.appendChild(renderer.domElement);

  // 添加光源
  const point = new THREE.PointLight(0xffffff, 1.5);
  point.position.set(0, 0, 100);
  scene.add(point);

  // 添加相机控制
  const controls = new OrbitControls(camera.value, renderer.domElement);
  camera.value.position.set(1, 2, 3);
  controls.update();

  const size = 20;
  const divisions = 20;

  // const gridHelper = new THREE.GridHelper(size, divisions);
  // scene.add(gridHelper);

  // 添加辅助线测试
  const axesHelper = new THREE.AxesHelper(250);
  scene.add(axesHelper);

  // group.rotateX(Math.PI / 2);
  // group.rotateZ(Math.PI / 2);

  // 添加FPS监控
  const stats = Stats();
  stats.domElement.style.position = "absolute";
  stats.domElement.style.left = "0px";
  stats.domElement.style.top = "0px";
  stats.showPanel(0);
  dom.appendChild(stats.dom);

  function animate() {
    requestAnimationFrame(animate);
    if (camera.value) {
      stats.begin();
      const vector = camera.value.position.clone();
      point.position.set(vector.x, vector.y, vector.z);
      renderer.render(scene, camera.value);
    }
    stats.end();
  }

  animate();
});
</script>

<style scoped>
.WebGl {
  border-top: 1px solid #eee;
  position: relative;
  height: 100%;
}
</style>

<template>
  <div id="container" style="width: 100%; height: 100%"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { onMounted } from "vue";
// @ts-ignore
import deferredShading_g_buffer_vert from "./glsl/deferredShading_g_buffer.vert";
// @ts-ignore
import deferredShading_g_buffer_frag from "./glsl/deferredShading_g_buffer.frag";
// @ts-ignore
import deferredShading_render_vert from "./glsl/deferredShading_render.vert";
// @ts-ignore
import deferredShading_render_frag from "./glsl/deferredShading_render.frag";

onMounted(() => {
  let renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    controls: OrbitControls,
    light: THREE.DirectionalLight;

  initWebGl();

  animate();

  createScene();

  function initWebGl() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    scene = new THREE.Scene();
    // @ts-ignore
    window.scene = scene;

    camera = new THREE.PerspectiveCamera();
    camera.position.set(10, 10, 10);
    camera.lookAt(scene.position);

    controls = new OrbitControls(camera, renderer.domElement);
    renderer.setSize(window.innerWidth, window.innerHeight);

    light = new THREE.DirectionalLight(0xffffff, 1.0);
    light.position.set(0, 1, 5);
    scene.add(light);

    const container = document.getElementById("container");
    if (container) {
      container.append(renderer.domElement);
    }
  }

  function createScene() {
    const mesh: THREE.Mesh<THREE.BufferGeometry, THREE.RawShaderMaterial>[] =
      [];

    const gBufferMaterial = new THREE.RawShaderMaterial({
      vertexShader: deferredShading_g_buffer_vert,
      fragmentShader: deferredShading_g_buffer_frag,
      glslVersion: THREE.GLSL3,
    });

    const renderTarget = new THREE.WebGLMultipleRenderTargets(
      window.innerWidth * window.devicePixelRatio,
      window.innerHeight * window.devicePixelRatio,
      4
    );

    for (let i = 0, il = renderTarget.texture.length; i < il; i++) {
      renderTarget.texture[i].minFilter = THREE.LinearFilter;
      renderTarget.texture[i].magFilter = THREE.LinearFilter;
    }

    const createMesh = () => {
      const g1 = new THREE.BoxGeometry(1, 1, 1);
      const g2 = new THREE.ConeGeometry(1, 2);

      const m1 = new THREE.Mesh(g1, gBufferMaterial);
      const m2 = new THREE.Mesh(g2, gBufferMaterial);

      scene.add(m1);
      scene.add(m2);

      mesh.push(m1, m2);
    };

    createMesh();

    renderer.setRenderTarget(renderTarget);
    renderer.render(scene, camera);

    const material = new THREE.RawShaderMaterial({
      vertexShader: deferredShading_g_buffer_vert,
      fragmentShader: deferredShading_render_frag,
      glslVersion: THREE.GLSL3,
    });

    mesh.forEach((m) => {
      m.material = material;
    });

    renderer.setRenderTarget(null);
  }

  function animate() {
    requestAnimationFrame(animate);

    renderer.setRenderTarget(null);
    renderer.render(scene, camera);

    controls.update();
  }
});
</script>

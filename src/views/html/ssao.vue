<template>
  <div id="container" style="width: 100%; height: 100%; overflow: hidden"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { onMounted } from "vue";
//@ts-ignore
import g_vertex from "./glsl/g_vertex.glsl";
//@ts-ignore
import g_frag from "./glsl/g_frag.glsl";
//@ts-ignore
import ssao_vertex from "./glsl/ssao_vertex.glsl";
//@ts-ignore
import ssao_frag from "./glsl/ssao_frag.glsl";
import { OrthographicCamera } from "three";

onMounted(() => {
  let render: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    controls: OrbitControls,
    geometricTarget: THREE.WebGLMultipleRenderTargets,
    width: number,
    height: number,
    meshes: THREE.Mesh[] = [],
    postScene: THREE.Scene = new THREE.Scene(),
    postCamera: THREE.OrthographicCamera = new OrthographicCamera(
      -1,
      1,
      -1,
      1,
      0.1,
      2000
    );

  const geometricMaterial = new THREE.RawShaderMaterial({
    glslVersion: THREE.GLSL3,
    vertexShader: g_vertex,
    fragmentShader: g_frag,
    uniforms: {
      uColor: {
        value: new THREE.Color(0xffffff),
      },
      cameraNear: { value: null },
      cameraFar: { value: null },
    },
  });

  const ssaoMaterial = new THREE.RawShaderMaterial({
    glslVersion: THREE.GLSL3,
    vertexShader: ssao_vertex,
    fragmentShader: ssao_frag,
    uniforms: {
      gPosition: {
        value: null,
      },
    },
  });

  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), ssaoMaterial);
  postScene.add(quad);

  init();
  animate();
  main();

  function main() {
    const field = new THREE.BoxGeometry(100, 10, 100);
    const ball = new THREE.SphereGeometry(10);

    geometricMaterial.uniforms["cameraNear"].value = camera.near;
    geometricMaterial.uniforms["cameraFar"].value = camera.far;

    meshes = [];

    const bottom = new THREE.Mesh(field, geometricMaterial);
    const left = new THREE.Mesh(field, geometricMaterial);
    left.rotateZ(-Math.PI / 2);
    left.position.set(-50, 50, 0);

    const right = new THREE.Mesh(field, geometricMaterial);
    right.rotateZ(-Math.PI / 2);
    right.position.set(50, 50, 0);

    const back = new THREE.Mesh(field, geometricMaterial);
    back.rotateX(-Math.PI / 2);
    back.position.set(0, 50, -50);

    const m1 = new THREE.Mesh(ball, geometricMaterial);
    m1.position.set(0, 12, 0);
    scene.add(back, left, right, bottom, m1);

    meshes.push(back, left, right, bottom, m1);

    if (geometricTarget) geometricTarget.dispose();

    geometricTarget = new THREE.WebGLMultipleRenderTargets(width, height, 3);
    geometricTarget.texture.forEach((t) => {
      t.minFilter = THREE.NearestFilter;
      t.magFilter = THREE.NearestFilter;
    });

    render.setRenderTarget(geometricTarget);
    render.render(scene, camera);

    quad.material.uniforms["gPosition"].value = geometricTarget.texture[1];

    render.setRenderTarget(null)
  }

  function animate() {
    requestAnimationFrame(animate);
    render.render(postScene, postCamera);
    controls.update();
  }

  function init() {
    width = window.innerWidth;
    height = window.innerHeight;

    render = new THREE.WebGLRenderer({ antialias: true });
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera();
    controls = new OrbitControls(camera, render.domElement);
    //@ts-ignore
    window.camera = camera;
    //@ts-ignore
    window.scene = scene;

    render.setSize(width, height);

    const axes = new THREE.AxesHelper(100);
    scene.add(axes);

    camera.position.set(
      139.991734011778,
      147.12602135938667,
      154.26030870699554
    );
    controls.update();

    document.getElementById("container")?.appendChild(render.domElement);
  }
});
</script>

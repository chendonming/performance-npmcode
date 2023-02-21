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
import { MathUtils } from "three";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise";
//@ts-ignore
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

onMounted(() => {
  let render: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    controls: OrbitControls,
    geometricTarget: THREE.WebGLMultipleRenderTargets,
    width: number,
    height: number,
    postScene = new THREE.Scene(),
    postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 2000),
    activeScene: THREE.Scene | THREE.Object3D<THREE.Event>,
    activeCamera: THREE.PerspectiveCamera | THREE.Camera,
    noiseTexture: THREE.DataTexture,
    kernelSize = 64,
    kernel: THREE.Vector3[] = [],
    kernelRadius = 0.1;

  postCamera.position.set(0, 0, 1);
  postCamera.lookAt(postScene.position);

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
    side: THREE.DoubleSide,
  });

  const ssaoMaterial = new THREE.RawShaderMaterial({
    glslVersion: THREE.GLSL3,
    vertexShader: ssao_vertex,
    fragmentShader: ssao_frag,
    side: THREE.DoubleSide,
    uniforms: {
      gPosition: {
        value: null,
      },
      gDepth: {
        value: null,
      },
      gNormal: { value: null },
      gColor: { value: null },
      uTexNoise: { value: null },
      uSamples: { value: null },
      uProjection: { value: null },
      uResolution: { value: null },
      uKernelSizeRadius: { value: null },
    },
  });

  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), ssaoMaterial);
  postScene.add(quad);

  generateKernel();
  generateRandomRotateKernel();

  init();
  animate();
  createObject();
  createControls();

  function createControls() {
    const gui = new GUI();
    const params = {
      kernelRadius: kernelRadius,
    };

    gui.add(params, "kernelRadius", 0.001, 8).onChange((t: number) => {
      kernelRadius = t;
    });
  }

  /**
   * 生成随机旋转核心
   * 创建一个4x4朝向切线空间平面法线的随机旋转向量数组
   */
  function generateRandomRotateKernel() {
    const width = 4,
      height = 4;

    const size = width * height;
    const data = new Float32Array(size);

    // 使用Simplex噪声
    const simplex = new SimplexNoise();

    for (let i = 0; i < size; i++) {
      const x = Math.random() * 2 - 1;
      const y = Math.random() * 2 - 1;
      const z = 0;

      data[i] = simplex.noise3d(x, y, z);
    }

    if (noiseTexture) {
      noiseTexture.dispose();
    }

    noiseTexture = new THREE.DataTexture(
      data,
      width,
      height,
      THREE.RedFormat,
      THREE.FloatType
    );
    noiseTexture.wrapS = THREE.RepeatWrapping;
    noiseTexture.wrapT = THREE.RepeatWrapping;
    noiseTexture.needsUpdate = true;
  }

  /**
   * 生成半球采样核心
   */
  function generateKernel() {
    for (let i = 0; i < kernelSize; i++) {
      const sample = new THREE.Vector3();

      sample.x = Math.random() * 2 - 1;
      sample.y = Math.random() * 2 - 1;
      sample.z = Math.random();

      sample.normalize();

      let scale = i / kernelSize;
      // 线性插值 结合循环之后的函数图 见: https://www.desmos.com/calculator/2182delnw9?lang=zh-CN
      scale = MathUtils.lerp(0.1, 1, scale * scale);
      sample.multiplyScalar(scale);

      kernel.push(sample);
    }
  }

  function createObject() {
    const field = new THREE.BoxGeometry(100, 10, 100);
    const ball = new THREE.SphereGeometry(10);

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
  }

  function main() {
    if (geometricTarget) geometricTarget.dispose();

    camera.updateMatrix();
    camera.updateMatrixWorld();

    geometricMaterial.uniforms["cameraNear"].value = camera.near;
    geometricMaterial.uniforms["cameraFar"].value = camera.far;

    geometricTarget = new THREE.WebGLMultipleRenderTargets(
      width * window.devicePixelRatio,
      height * window.devicePixelRatio,
      4
    );
    geometricTarget.texture.forEach((t, index) => {
      t.minFilter = THREE.NearestFilter;
      t.magFilter = THREE.NearestFilter;

      if (index === 3) {
        t.type = THREE.FloatType;
      }
    });

    render.setRenderTarget(geometricTarget);
    render.render(scene, camera);

    quad.material.uniforms["gPosition"].value = geometricTarget.texture[1];
    quad.material.uniforms["gDepth"].value = geometricTarget.texture[3];
    quad.material.uniforms["gColor"].value = geometricTarget.texture[0];
    quad.material.uniforms["gNormal"].value = geometricTarget.texture[2];
    quad.material.uniforms["uTexNoise"].value = noiseTexture;
    quad.material.uniforms["uSamples"].value = kernel;
    quad.material.uniforms["uProjection"].value = camera.projectionMatrix;
    quad.material.uniforms["uResolution"].value = new THREE.Vector2(
      render.domElement.width,
      render.domElement.height
    );
    quad.material.uniforms["uKernelSizeRadius"].value = kernelRadius;
    quad.material.defines["KERNELSIZE"] = kernelSize;

    render.setRenderTarget(null);
    activeScene = postScene;
    activeCamera = postCamera;
  }

  function animate() {
    main();
    requestAnimationFrame(animate);
    render.render(activeScene, activeCamera);
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

    activeScene = scene;
    activeCamera = camera;
  }
});
</script>

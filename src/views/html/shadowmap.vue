<template>
  <div id="container" style="width: 100%; height: 100%"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { onMounted } from "vue";
import { ShaderMaterial } from "three";
//@ts-ignore
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

onMounted(() => {
  let renderer: THREE.WebGLRenderer,
      scene: THREE.Scene,
      camera: THREE.PerspectiveCamera,
      controls: OrbitControls,
      light: THREE.DirectionalLight,
      frustumSize: number = 10,
      shadowMapSize,
      material: THREE.ShaderMaterial,
      shadowMaterial: THREE.ShaderMaterial,
      /*language=glsl*/
      vertexShader = `
        varying vec3 vNormal;

        uniform mat4 uProjectionMatrix;
        uniform mat4 uViewMatrix;

        varying vec4 vShadowCoord;

        void main(){
          vNormal = normal;
          vec3 pos = position;
          gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
          vShadowCoord = uProjectionMatrix * uViewMatrix * modelMatrix * vec4(pos, 1.0);
        }
      `,
      /*language=glsl*/
      fragmentShader = `
        #include <packing>
        uniform sampler2D uDepthMap;
        varying vec4 vShadowCoord;
        varying vec3 vNormal;
        uniform vec3 uLightDir;
        uniform vec3 uColor;

        uniform bool uUsePCF;
        uniform int uPCFRegion;
        uniform float uPCFRadius;

        float frustumTest(vec3 shadowCoord, float shadowFactor) {
          bvec4 inFrustumVec = bvec4(shadowCoord.x >= 0., shadowCoord.x <= 1., shadowCoord.y >= 0., shadowCoord.y <= 1.);
          bool inFrustum = all(inFrustumVec);

          bvec2 frustumTestVec = bvec2(inFrustum, shadowCoord.z <= 1.);
          bool frustumTest = all(frustumTestVec);

          if (frustumTest == false) {
            shadowFactor = 1.;
          }

          return shadowFactor;
        }

        float calcPCF(vec3 projCoords, float bias) {
          float shadowFactor = 0.;
          float currentDepth = projCoords.z;

          vec2 texelSize = 1. / vec2(textureSize(uDepthMap, 0));

          for (int x = -uPCFRegion; x <= uPCFRegion; x++) {
            for (int y = -uPCFRegion; y <= uPCFRegion; y++) {
              float shadowMapDepth = unpackRGBAToDepth(texture(uDepthMap, projCoords.xy + uPCFRadius * vec2(x, y) * texelSize));
              shadowFactor += step(currentDepth - bias, shadowMapDepth);
            }
          }

          int total = 2*uPCFRegion+1;
          return shadowFactor/float(total*total);
        }

        void main() {
          vec3 projCoords = vShadowCoord.xyz / vShadowCoord.w;
          projCoords = projCoords * 0.5 + 0.5;

          float shadow = 0.0;

          float cosTheta = dot(normalize(-uLightDir), vNormal);

          float difLight = max(0.0, cosTheta);

          float bias = 0.005 * tan(acos(cosTheta));
          bias = clamp(bias, 0.0, 0.0001);

          float shadowFactor = 0.;

          if (uUsePCF == true) {
            shadowFactor = calcPCF(projCoords, bias);
          } else {
            float depth = unpackRGBAToDepth(texture(uDepthMap, projCoords.xy));
            float currentDepth = projCoords.z;
            shadowFactor = step(currentDepth - bias, depth);
            shadowFactor = frustumTest(projCoords, shadowFactor);
          }

          float shading = shadowFactor * difLight;

          vec3 color = vec3(0.);

          color = mix(uColor - .1, uColor + .1, shading);
          // color = uColor * shading;

          gl_FragColor = vec4(color, 1.);
        }
      `,
      /*language=glsl*/
      shadowShader = `
        #include <packing>

        void main(){
          gl_FragColor = packDepthToRGBA(gl_FragCoord.z);
        }
      `,
      meshes: THREE.Mesh<THREE.BufferGeometry, any>[] = [],
      postCamera: THREE.OrthographicCamera,
      helpers: THREE.Object3D[] = [];

  initWebGl();

  createMaterial();
  createScene();
  getDepthTexture();
  createControls();
  animate();

  function initWebGl() {
    renderer = new THREE.WebGLRenderer({antialias: true});
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

    shadowMapSize = 512;

    // 使用RGBA通道
    light.shadow.map = new THREE.WebGLRenderTarget(
        shadowMapSize,
        shadowMapSize,
        {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          format: THREE.RGBAFormat,
        }
    );

    light.shadow.mapSize.x = shadowMapSize;
    light.shadow.mapSize.y = shadowMapSize;

    postCamera = light.shadow.camera = new THREE.OrthographicCamera(
        -frustumSize / 2,
        frustumSize / 2,
        -frustumSize / 2,
        frustumSize / 2,
        0.1,
        20
    );

    postCamera.position.copy(light.position.clone());
    postCamera.lookAt(scene.position.clone());

    const cameraHelper = new THREE.CameraHelper(postCamera);
    scene.add(postCamera);
    scene.add(cameraHelper);
    helpers.push(cameraHelper);

    const axesHelper = new THREE.AxesHelper(20);
    scene.add(axesHelper);
    helpers.push(axesHelper);

    const container = document.getElementById("container");
    if (container) {
      container.append(renderer.domElement);
    }
  }

  /**
   * 创建场景物体
   */
  function createScene() {
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const m1 = new THREE.Mesh(planeGeometry, material);
    m1.rotateX(-Math.PI / 2);
    m1.position.y = -1;
    scene.add(m1);

    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const m2 = new THREE.Mesh(cubeGeometry, material);
    m2.position.set(0, 0, 1);
    scene.add(m2);

    const coneGeometry = new THREE.ConeGeometry(0.5, 3, 32);
    const m3 = new THREE.Mesh(coneGeometry, material);
    m3.position.set(0, 0, 2);
    scene.add(m3);

    const torusKnotGeometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const m4 = new THREE.Mesh(torusKnotGeometry, material);
    m4.position.set(5, 0, 3);
    m4.scale.set(0.05, 0.05, 0.05);
    scene.add(m4);

    const box = new THREE.BoxGeometry(0.25, 10, 0.25);
    const b1 = new THREE.Mesh(box, material);
    b1.position.set(-1, 0, 1);
    scene.add(b1);

    const b2 = new THREE.Mesh(box, material);
    b2.position.set(-1.5, 0, 1);
    scene.add(b2);

    const b3 = new THREE.Mesh(box, material);
    b3.position.set(-2, 0, 1);
    scene.add(b3);

    meshes.push(m1, m2, m3, m4, b1, b2, b3);
  }

  function createMaterial() {
    const uniforms = {
      uLightDir: {
        value: postCamera.getWorldDirection(new THREE.Vector3()),
      },
      uDepthMap: {
        value: light.shadow.map.texture,
      },
      uProjectionMatrix: {
        value: postCamera.projectionMatrix,
      },
      uViewMatrix: {
        value: postCamera.matrixWorldInverse,
      },
      uColor: {
        value: new THREE.Color(0xfaf3f3),
      },
      uUsePCF: {
        value: false,
      },
      uPCFRegion: {
        value: 1
      },
      uPCFRadius: {
        value: 1.0
      }
    };

    material = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });

    shadowMaterial = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader: shadowShader,
    });
  }

  function getDepthTexture() {
    meshes.forEach((mesh) => {
      mesh.material = shadowMaterial;
    });

    helpers.forEach((v) => {
      v.visible = false;
    });

    renderer.setRenderTarget(light.shadow.map);
    renderer.render(scene, postCamera);

    meshes.forEach((mesh) => {
      mesh.material = material;
    });

    helpers.forEach((v) => {
      v.visible = true;
    });
  }

  function animate() {
    requestAnimationFrame(animate);

    renderer.setRenderTarget(null);
    renderer.render(scene, camera);

    controls.update();
  }

  function createControls() {
    const gui = new GUI();
    const obj = {
      cameraPosX: light.position.x,
      cameraPosY: light.position.y,
      cameraPosZ: light.position.z,
      cameraHelper: true,
      userPCF: false,
      pcfRegion: 1,
      pcfRadius: 1
    };

    function changeCameraPos(s: "x" | "y" | "z", v: number) {
      light.position[s] = v;
      light.updateMatrixWorld();
      postCamera.position.copy(light.position);
      postCamera.lookAt(scene.position);
      getDepthTexture();
    }

    gui.add(obj, "cameraPosX", -10, 10).onChange((v: number) => {
      changeCameraPos("x", v);
    });
    gui.add(obj, "cameraPosY", -10, 10).onChange((v: number) => {
      changeCameraPos("y", v);
    });
    gui.add(obj, "cameraPosZ", -10, 10).onChange((v: number) => {
      changeCameraPos("z", v);
    });
    gui.add(obj, "cameraHelper").onChange((v: boolean) => {
      helpers.forEach((m) => {
        m.visible = v;
      });
    });
    gui.add(obj, "userPCF").onChange((v: boolean) => {
      material.uniforms.uUsePCF.value = v;
    });
    gui.add(obj, "pcfRegion", 1, 10, 1).onChange((v: number) => {
      material.uniforms.uPCFRegion.value = v;
    });
    gui.add(obj, "pcfRadius", 1, 3).onChange((v: number) => {
      material.uniforms.uPCFRadius.value = v;
    });
  }
});
</script>

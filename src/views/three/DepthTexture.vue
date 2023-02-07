<template></template>
<script setup lang="ts">
import * as THREE from "three";
//@ts-ignore
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import DebugUI from "../../util/DebugUI";
import { createADepthMap } from "../../util";

const props = defineProps({
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  controls: Object,
});
const { scene, renderer, camera, controls } = props;
let materialSelf: THREE.ShaderMaterial;

if (scene && renderer && camera && controls) {
  const target = new THREE.WebGLRenderTarget(
    window.innerWidth,
    window.innerHeight
  );
  target.depthTexture = new THREE.DepthTexture(
    window.innerWidth,
    window.innerHeight
  );

  /*language=glsl*/
  const vertexShader = `
    varying vec2 aUv;
    varying vec4 aFragPosLightSpace;
    uniform mat4 lightPro;
    uniform mat4 lightView;

    varying vec3 aNormal;
    void main () {
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
      aUv = uv;
      vec3 aFragPos = vec3(modelMatrix * vec4(position, 1.0));
      aFragPosLightSpace = lightPro * lightView * vec4(aFragPos, 1.);
      aNormal = mat3(transpose(inverse(modelMatrix))) * normal;
    }
  `;
  /*language=glsl*/
  const fragmentShader = `
    #include <packing>
    uniform sampler2D aDepthMap;
    varying vec2 aUv;
    varying vec4 aFragPosLightSpace;
    varying vec3 aNormal;
    //    uniform float bias;
    uniform vec3 lightDir;
    uniform float frustumSize;
    uniform float shadowMapSize;

    void main() {
      vec3 projCoords = aFragPosLightSpace.xyz / aFragPosLightSpace.w;
      projCoords = projCoords * 0.5 + 0.5;

      float depth = texture(aDepthMap, projCoords.xy).r;
      float currentDepth = projCoords.z;

      // 测试 光照向量为(0,0,1)
      float d = dot(-lightDir, aNormal);
      float bias = 0.;

      float theta = d;
      bias = (frustumSize *  tan(acos(theta)))/(shadowMapSize * 2.);
      bias = clamp(bias, 0.0, 0.00001);

      //      float bias = 0.005 * tan(acos(dot(-lightDir, aNormal)));// cosTheta is dot( n,l ), clamped between 0 and 1
      //      bias = clamp(bias, 0.0, 0.01);

      if (currentDepth - bias < depth) {
        gl_FragColor = vec4(1., 1., 0., 1.);
      } else {
        gl_FragColor = vec4(0., 0., 0., 1.);
      }
    }
  `;
  const frustumSize = 4;
  const shadowMapSize = 512;
  const postCamera = new THREE.OrthographicCamera(
    -frustumSize / 2,
    frustumSize / 2,
    frustumSize / 2,
    -frustumSize / 2,
    0.5,
    2000
  );
  const pointer = new THREE.Vector3(0, 0, 1);
  postCamera.position.set(0, 0, 3);
  postCamera.lookAt(pointer);

  materialSelf = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      aDepthMap: {
        value: null,
      },
      lightPro: {
        value: postCamera.projectionMatrix,
      },
      lightView: {
        value: postCamera.matrixWorldInverse,
      },
      bias: {
        value: 0.006,
      },
      lightDir: {
        value: postCamera.getWorldDirection(new THREE.Vector3()),
      },
      frustumSize: {
        value: frustumSize,
      },
      shadowMapSize: {
        value: shadowMapSize,
      },
    },
  });
  const b = new THREE.BoxGeometry(1, 0.5, 0.5);

  const geometry = new THREE.ConeGeometry(0.5, 2, 32);
  const p = new THREE.PlaneGeometry(2, 2);
  // const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
  const m1 = new THREE.Mesh(p, materialSelf);
  // m1.rotateX(-Math.PI / 2)

  const m3 = new THREE.Mesh(geometry, materialSelf);
  m3.position.set(0, 0, 2);

  const m2 = new THREE.Mesh(b, materialSelf);
  m2.position.set(0, 0, 1);

  scene!.add(m1);
  scene!.add(m2);
  scene!.add(m3);

  materialSelf.uniforms.aDepthMap.value = createADepthMap(
    renderer,
    scene,
    postCamera,
    shadowMapSize,
    shadowMapSize
  );

  DebugUI.viewTheCurrentDepthMap(
    scene,
    camera,
    200,
    (window.innerHeight / window.innerWidth) * 200
  );

  const obj = {
    cameraPosX: 0,
    cameraPosY: 0,
    cameraPosZ: 3,
    cameraTargetX: 0,
    cameraTargetY: 0,
    cameraTargetZ: 0,
  };
  const gui = new GUI();
  gui.add(obj, "cameraPosX", 0, 4).onChange((v: number) => {
    postCamera.position.x = v;
    postCamera.lookAt(pointer);
    materialSelf.uniforms.lightPro.value = postCamera.projectionMatrix;
    materialSelf.uniforms.lightView.value = postCamera.matrixWorldInverse;
    materialSelf.uniforms.lightDir.value = postCamera.getWorldDirection(
      new THREE.Vector3()
    );
  });
  gui.add(obj, "cameraPosY", 0, 4).onChange((v: number) => {
    postCamera.position.y = v;
    postCamera.lookAt(pointer);
    materialSelf.uniforms.lightPro.value = postCamera.projectionMatrix;
    materialSelf.uniforms.lightView.value = postCamera.matrixWorldInverse;
    materialSelf.uniforms.lightDir.value = postCamera.getWorldDirection(
      new THREE.Vector3()
    );
  });
  gui.add(obj, "cameraPosZ", 0, 4).onChange((v: number) => {
    postCamera.position.z = v;
    postCamera.lookAt(pointer);
    materialSelf.uniforms.lightPro.value = postCamera.projectionMatrix;
    materialSelf.uniforms.lightView.value = postCamera.matrixWorldInverse;
    materialSelf.uniforms.lightDir.value = postCamera.getWorldDirection(
      new THREE.Vector3()
    );
  });

  const p1 = new THREE.CameraHelper(postCamera);
  scene.add(p1);
}
</script>

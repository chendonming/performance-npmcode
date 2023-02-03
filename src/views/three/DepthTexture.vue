<template></template>
<script setup lang="ts">
import * as THREE from "three";
//@ts-ignore
import {GUI} from "three/examples/jsm/libs/lil-gui.module.min.js";
import DebugUI from "../../util/DebugUI";
import {createADepthMap} from "../../util";

const props = defineProps({
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  controls: Object,
});
const {scene, renderer, camera, controls} = props;
let materialSelf: THREE.ShaderMaterial;

if (scene && renderer && camera && controls) {
  const target = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
  target.depthTexture = new THREE.DepthTexture(window.innerWidth, window.innerHeight);

  const p = new THREE.PlaneGeometry(2, 2)
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
      aNormal = normal;
    }
  `
  /*language=glsl*/
  const fragmentShader = `
    #include <packing>
    uniform sampler2D aDepthMap;
    varying vec2 aUv;
    varying vec4 aFragPosLightSpace;
    varying vec3 aNormal;

    void main() {
      vec3 projCoords = aFragPosLightSpace.xyz / aFragPosLightSpace.w;
      projCoords = projCoords * 0.5 + 0.5;

      float depth = texture(aDepthMap, projCoords.xy).r;
      float currentDepth = projCoords.z;

      //      float cosTheta = dot(vec3(0., 0., 1.), aNormal);
      //      float bias = 0.005 * tan(acos(cosTheta));
      //      bias = clamp(bias, 0.0, 0.01);

      if (currentDepth - 0.0006 < depth) {
        gl_FragColor = vec4(1., 1., 0., 1.);
      } else {
        gl_FragColor = vec4(0., 0., 0., 1.);
      }
    }
  `
  const postCamera = new THREE.OrthographicCamera(-2, 2, 2, -2, .5, 2000);
  postCamera.position.set(0, 0, 10)
  postCamera.lookAt(new THREE.Vector3(0, 0, 0))
  materialSelf = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      aDepthMap: {
        value: null
      },
      lightPro: {
        value: postCamera.projectionMatrix
      },
      lightView: {
        value: postCamera.matrixWorldInverse
      },
    }
  })
  const b = new THREE.BoxGeometry(1, 0.5, 0.5)

  const geometry = new THREE.ConeGeometry(0.5, 2, 32);
  // const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
  const m1 = new THREE.Mesh(p, materialSelf)
  // m1.rotateX(-Math.PI / 2)

  const m3 = new THREE.Mesh(geometry, materialSelf)
  m3.position.set(0, 0, 2)

  const m2 = new THREE.Mesh(b, materialSelf)
  m2.position.set(0, 0, 1)

  scene!.add(m1)
  scene!.add(m2)
  scene!.add(m3)

  const depthTexture = createADepthMap(renderer, scene, postCamera, window.innerWidth, window.innerHeight)

  materialSelf.uniforms.aDepthMap.value = depthTexture

  DebugUI.viewTheCurrentDepthMap(scene, camera, 200, window.innerHeight / window.innerWidth * 200)

  const obj = {
    x: 0
  }

  const gui = new GUI()
  gui.add(obj, 'x', -1, 1)?.onChange((t: number) => {
    postCamera.position.set(t, 0, 2);

    const depthTexture = createADepthMap(renderer, scene, postCamera, window.innerWidth, window.innerHeight)
    materialSelf.uniforms.aDepthMap.value = depthTexture
  })
}
</script>
<template></template>
<script setup lang="ts">
import * as THREE from "three";
//@ts-ignore
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

const props = defineProps({
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  controls: Object,
});
const {scene, renderer, camera, controls} = props;
if (scene && renderer && camera && controls) {
  const material = new THREE.ShaderMaterial({
    /*language=glsl*/
    vertexShader: `
      varying vec2 vUv;
      void main() {
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        vUv = uv;
      }
    `,
    /*language=glsl*/
    fragmentShader: `
      varying vec2 vUv;
      uniform sampler2D uTexture;

      void main() {
        //        gl_FragColor = vec4(vec3(0.), 1.);

        vec2 m = 2. / vec2(textureSize(uTexture, 0));

        gl_FragColor = vec4(float(m.x), float(m.y), 0., 1.);
      }
    `,
    uniforms: {
      uTexture: {
        value: null
      }
    }
  })

  const geo = new THREE.PlaneGeometry(2, 2)
  const m = new THREE.Mesh(geo, material)

  material.uniforms.uTexture.value = new THREE.TextureLoader().load('shadow4.png')

  scene.add(m)
}
</script>
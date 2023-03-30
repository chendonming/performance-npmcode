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
const { scene, renderer, camera, controls } = props;
if (scene && renderer && camera && controls) {
  camera.position.set(2, 2, 2);
  camera.lookAt(0, 0, 0);
  controls.update();

  const material = new THREE.ShaderMaterial({
    vertexShader: `
      void main() {
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.);
      }
    `,
    fragmentShader: `
        uniform float scale;
        uniform float intensity;

        float rand(vec2 co)
        {
            return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
        }

        void main() {
          vec2 st = gl_FragCoord.xy / scale;
          float noise = 0.0;
          float zoom = 1.0;
          
          for(int i = 0; i < 5; i++)
          {
              noise += rand(st * zoom) * intensity;
              zoom *= 2.0;
          }
          
          gl_FragColor = vec4(vec3(noise), 1.0);
        }
    `,
    uniforms: {
      scale: { value: 1.0 },
      intensity: { value: 0.4 },
    },
  });

  const gui = new GUI();
  const params = {
    scale: 1.0,
    intensity: 0.4,
  };

  gui.add(params, "scale", 0, 10).onChange((t: number) => {
    material.uniforms["scale"].value = t;
  });

  gui.add(params, "intensity", 0, 1).onChange((t: number) => {
    material.uniforms["intensity"].value = t;
  });

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
}
</script>

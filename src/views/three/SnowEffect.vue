<template>

</template>

<script setup lang="ts">
import * as THREE from "three";

const props = defineProps({
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  controls: Object
});
const { scene, renderer, camera, controls } = props;
if (scene) {
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.FogExp2(0x000000, 0.0008);

  const geometry = new THREE.BufferGeometry();
  const vertices = [];

  const textureLoader = new THREE.TextureLoader();

  const sprite1 = textureLoader.load(new URL('../../static/texture/snowflake1.png', import.meta.url).href);
  const sprite2 = textureLoader.load(new URL('../../static/texture/snowflake2.png', import.meta.url).href);
  const sprite3 = textureLoader.load(new URL('../../static/texture/snowflake3.png', import.meta.url).href);
  const sprite4 = textureLoader.load(new URL('../../static/texture/snowflake4.png', import.meta.url).href);
  const sprite5 = textureLoader.load(new URL('../../static/texture/snowflake5.png', import.meta.url).href);

  for (let i = 0; i < 10000; i++) {

    const x = Math.random() * 2000 - 1000;
    const y = Math.random() * 2000 - 1000;
    const z = Math.random() * 2000 - 1000;
    vertices.push(x, y, z);

  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

  const parameters = [
    [[1.0, 0.2, 0.5], sprite2, 20],
    [[0.95, 0.1, 0.5], sprite3, 15],
    [[0.90, 0.05, 0.5], sprite1, 10],
    [[0.85, 0, 0.5], sprite5, 8],
    [[0.80, 0, 0.5], sprite4, 5]
  ];

  const materials: string | any[] = []

  for (let i = 0; i < parameters.length; i++) {
    const color = parameters[i][0] as number[];
    const sprite = parameters[i][1] as THREE.Texture;
    const size = parameters[i][2] as number;

    materials[i] = new THREE.PointsMaterial({ size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent: true });
    materials[i].color.setHSL(color[0], color[1], color[2]);

    const particles = new THREE.Points(geometry, materials[i]);

    particles.rotation.x = Math.random() * 6;
    particles.rotation.y = Math.random() * 6;
    particles.rotation.z = Math.random() * 6;

    scene.add(particles);

  }

  const update = () => {
    requestAnimationFrame(update)
    const time = Date.now() * 0.00005;

    for (let i = 0; i < scene.children.length; i++) {
      const object = scene.children[i];
      if (object instanceof THREE.Points) {
        object.rotation.y = time * (i < 4 ? i + 1 : - (i + 1));
      }
    }
    for (let i = 0; i < materials.length; i++) {
      const color = parameters[i][0] as number[];
      const h = (360 * (color[0] + time) % 360) / 360;
      materials[i].color.setHSL(h, color[1], color[2]);
    }
  }

  update()
}
</script>
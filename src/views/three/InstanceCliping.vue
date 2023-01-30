<template>

</template>

<script setup lang="ts">
import * as THREE from "three";
/**
 * 探索InstancedMesh如何进行剖切
 */
const props = defineProps({
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  controls: Object
});
const { scene, renderer, camera, controls } = props;
camera?.position.set(7.781365022019561, 15.562730044039121, 23.34409506605867)
controls?.update()

run()

/**
 * 通过instancedMesh创建Mesh
 * 由此可见剖切只和材质有关 和是否是实例化mesh无关
 */
function run() {
  const loader = new THREE.BufferGeometryLoader();
  let mesh, count = 1000
  loader.load('model/suzanne_buffergeometry.json', geometry => {
    geometry.computeVertexNormals();
    geometry.scale(0.5, 0.5, 0.5);
    const material = new THREE.MeshNormalMaterial();
    material.clippingPlanes = [
      new THREE.Plane(new THREE.Vector3(1, 0, 0).normalize(), 1)
    ]
    material.clipShadows = true;
    mesh = new THREE.InstancedMesh(geometry, material, count);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
    scene?.add(mesh);



    let i = 0, amount = 10, dummy = new THREE.Object3D();
    const offset = (amount - 1) / 2;
    for (let x = 0; x < amount; x++) {
      for (let y = 0; y < amount; y++) {
        for (let z = 0; z < amount; z++) {
          dummy.position.set(offset - x, offset - y, offset - z);
          dummy.updateMatrix();
          mesh.setMatrixAt(i++, dummy.matrix);
        }
      }
    }
  })
}
</script>
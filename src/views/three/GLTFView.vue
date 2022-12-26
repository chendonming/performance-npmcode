<template>

</template>

<script setup lang="ts">
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
/**
 * GLTF模型查看
 */
const props = defineProps({
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  controls: Object
});
const { scene, renderer, camera, controls } = props;

const loader = new GLTFLoader()
loader.load('人物.glb', (m) => {
  console.log(m)
  const model = m.scene
  scene?.add(model)

  const mixer = new THREE.AnimationMixer(model)
  const actions: any = {}
  const createActions = (animations: any[]) => {
    for (let i = 0; i < animations.length; i++) {
      const clip = animations[i];
      const action = mixer.clipAction(clip);
      actions[clip.name] = action

      action.clampWhenFinished = true;
      action.loop = THREE.LoopPingPong;
    }
  }
  createActions(m.animations)

  console.log(actions['Bip001|Take 001|BaseLayer'])

  //@ts-ignore
  const a = actions['Bip001|Take 001|BaseLayer']
  if (a.isRunning()) {
    a.stop()
  } else {
    a.play()
  }

  const clock = new THREE.Clock()
  renderer?.setAnimationLoop(() => {
    mixer.update(clock.getDelta())
  })

})
</script>
<template>

</template>

<script setup lang="ts">
import * as THREE from "three";
//@ts-ignore
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { vector3Helper } from '../../util/index'

/**
 * 关于Plane平面的互动测试
 */
const props = defineProps({
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  controls: Object
});
const { scene, renderer, camera, controls } = props;
camera?.position.set(6.276599944444732, 9.99093887682438, 15.293090013790483)
controls?.update()

const grid = new THREE.AxesHelper(40)
scene?.add(grid)

basic2()

/**
 * 基础1：感受查看平面位置和constant的关系
 */
function basic() {
  const normal = new THREE.Vector3(1, 0, 0)

  let constant = -1;
  const p = new THREE.Plane(normal, constant);

  const h = new THREE.PlaneHelper(p, 10, 0xff0000)
  const h1 = new THREE.ArrowHelper(normal, new THREE.Vector3(), 10, 0x0000ff);

  const h2 = new THREE.GridHelper(40, 40)
  scene?.add(h1).add(h).add(h2)

  const gui = new GUI()
  const obj = {
    constant
  }
  gui.add(obj, 'constant', -10, 10).onChange((v: number) => {
    p.constant = v;
  })
}

/**
 * 基础2：如何计算垂直距离
 */
function basic2() {
  run1()

  /**
   * 查看distanceToPoint方法距离是否准确
   */
  function run1() {
    const gui = new GUI()
    const normal = new THREE.Vector3(1, 0, 0)
    const obj = {
      normalx: normal.x,
      normaly: normal.y,
      normalz: normal.z
    }
    let constant = 10;
    const p = new THREE.Plane(normal.normalize(), constant);
    const h = new THREE.PlaneHelper(p, 10, 0xff0000)
    scene?.add(h)

    const v3 = new THREE.Vector3(-3, 0, 1)
    const h1 = vector3Helper(v3)
    scene?.add(h1)

    gui.add(obj, 'normalx', -10, 10).onChange((v: number) => {
      p.normal.x = v;
      p.normal = p.normal.normalize()
      h.plane = p;
      h.updateMatrixWorld()
      const dic = p.distanceToPoint(v3)
      console.log('distanceToPoint: ', dic)
    })
    gui.add(obj, 'normaly', -10, 10).onChange((v: number) => {
      p.normal.y = v;
      p.normal = p.normal.normalize()
      h.plane = p;
      h.updateMatrixWorld()
      const dic = p.distanceToPoint(v3)
      console.log('distanceToPoint: ', dic)
    })
    gui.add(obj, 'normalz', -10, 10).onChange((v: number) => {
      p.normal.z = v;
      p.normal = p.normal.normalize()
      h.plane = p;
      h.updateMatrixWorld()
      const dic = p.distanceToPoint(v3)
      console.log('distanceToPoint: ', dic)
    })
  }


  /**
   * 选取一组点 分析distanceToPoint不准确的原因
   */
  function run2() {
    // 通过run1函数得知 当normal为0,0,10, constant为1时 距离为11， 通过GridHelper得知distanceToPoint结果一定为错，以下为分析过程
    const normal = new THREE.Vector3(0, 0, 10)
    const constant = 1;
    const plane = new THREE.Plane(normal.normalize(), constant)

    const h = new THREE.PlaneHelper(plane, 10, 0xff0000)
    scene?.add(h)

    const v3 = new THREE.Vector3(0, 0, 1)
    const h2 = vector3Helper(v3)
    scene?.add(h2)

    console.log('distanceToPoint结果: ', plane.distanceToPoint(v3))
    /* 
      查看源码得知distanceToPoint计算过程如下: this.normal.dot( point ) + this.constant

      shit！ normal需要归一化， run1函数中normal没有归一化（ 现已修改 ）

      tip: 且distanceToPoint的结果为正时代表点在平面正方向一侧，为负代表在平面反方向一侧
    */
  }
}

</script>
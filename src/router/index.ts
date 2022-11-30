import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    component: () => import("../template/html.vue"),
    path: "/",
    children: [
      // 普通HTML模板
      {
        component: () => import('../views/WorkerPool.vue'),
        path: 'workpool'
      }
    ]
  },
  {
    component: () => import('../template/three.vue'),
    path: '/three',
    children: [
      // THREEJS模板
      {
        component: () => import('../views/three/CameraAnimation.vue'),
        path: 'CameraAnimation'
      },
      {
        component: () => import('../views/three/BasicMatrix.vue'),
        path: 'BasicMatrix'
      },
      {
        component: () => import('../views/three/DrillMatrix.vue'),
        path: 'DrillMatrix'
      },
      {
        component: () => import('../views/three/PositionMatrix.vue'),
        path: 'PositionMatrix'
      },
      {
        component: () => import('../views/three/SnowEffect.vue'),
        path: 'SnowEffect'
      },
      {
        component: () => import('../views/three/ZoomObject.vue'),
        path: 'ZoomObject'
      },
      {
        component: () => import('../views/three/Plane.vue'),
        path: 'Plane'
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export { router }
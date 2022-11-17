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
        component: () => import('../views/CameraAnimation.vue'),
        path: 'CameraAnimation'
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export { router }
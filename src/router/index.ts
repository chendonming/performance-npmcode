import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    component: () => import("../template/html.vue"),
    path: "/",
    children: [
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
      {
        component: () => import('../views/test.vue'),
        path: 'test'
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export { router }
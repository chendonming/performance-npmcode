import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    component: () => import('../views/WorkerPool.vue'),
    name: 'workpool',
    path: '/workpool'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export { router }
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
            },
            {
                component: () => import('../views/html/shadowmap.vue'),
                path: 'shadowmap'
            },
            {
                component: () => import('../views/html/deferredShading.vue'),
                path: 'deferredShading'
            },
            {
                component: () => import('../views/html/ssao.vue'),
                path: 'ssao'
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
                component: () => import('../views/three/BasicMatrix2.vue'),
                path: 'BasicMatrix2'
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
            },
            {
                component: () => import('../views/three/CustomTranslateControl.vue'),
                path: 'CustomTranslateControl'
            },
            {
                component: () => import('../views/three/GLTFView.vue'),
                path: 'GLTFView'
            },
            {
                component: () => import('../views/three/SphericalCamera.vue'),
                path: 'SphericalCamera'
            },
            {
                component: () => import('../views/three/InstanceCliping.vue'),
                path: 'InstanceCliping'
            },
            {
                component: () => import('../views/three/CameraFov.vue'),
                path: 'CameraFov'
            },
            {
                component: () => import('../views/three/Euler.vue'),
                path: 'Euler'
            },
            {
                component: () => import('../views/three/PbrLight.vue'),
                path: 'PbrLight'
            },
            {
                component: () => import('../views/three/DepthTexture.vue'),
                path: 'DepthTexture'
            },
            {
                component: () => import('../views/three/Texture2.vue'),
                path: 'Texture2'
            },
            {
                component: () => import('../views/three/LineMesh.vue'),
                path: 'LineMesh'
            },
            {
                component: () => import('../views/three/GPUNormal.vue'),
                path: 'GPUNormal'
            },
            {
                component: () => import('../views/three/Noise.vue'),
                path: 'Noise'
            }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export { router }
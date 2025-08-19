import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'OrderList',
        component: () => import('./assets/components/OrderList.vue'),  // 路径修正
        meta: {
            title: '运输订单',
            requiresAuth: true,
            icon: 'mdi-clipboard-list'
        }
    },
    {
        path: '/orders/create',
        name: 'CreateOrder',
        component: () => import('./assets/components/CreateOrder.vue'),  // 路径修正
        meta: {
            title: '创建订单',
            requiresAuth: true,
            icon: 'mdi-plus-box'
        }
    },
    {
        path: '/vehicles',
        name: 'VehicleList',
        component: () => import('./assets/components/VehicleList.vue'),  // 路径修正
        meta: {
            title: '车辆管理',
            requiresAuth: true,
            icon: 'mdi-truck'
        }
    },
    {
        path: '/vehicles/add',
        name: 'AddVehicle',
        component: () => import('./assets/components/AddVehicle.vue'),  // 路径修正
        meta: {
            title: '添加车辆',
            requiresAuth: true,
            icon: 'mdi-car-plus'
        }
    },
    // 404 页面处理
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('./assets/components/NotFound.vue'),  // 创建一个专门的 404 页面
        meta: {
            title: '页面未找到'
        }
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL || '/'),  // 环境变量修正
    routes,
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { top: 0 }
    }
})

// router.beforeEach((to, from, next) => {
//     document.title = to.meta.title ? `${to.meta.title} | TMS系统` : 'TMS运输管理系统'
//     const isAuthenticated = localStorage.getItem('token')
//     if (to.meta.requiresAuth && !isAuthenticated) {
//         next({ name: 'Login' })  // 重定向到登录页面
//     } else {
//         next()
//     }
// })

export default router

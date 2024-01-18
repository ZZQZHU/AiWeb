// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useDataStore } from '../store/index.ts';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('../views/home.vue'),
    },
    {
        path: '/login',
        component: () => import('../views/Login.vue'),
    },
    {
        path: '/blog',
        component: () => import('../views/blog.vue'),
    },
    {
        path: '/home',
        component: () => import('../views/home.vue'),
    },
    {
        path: '/ai',
        component: () => import('../views/AI.vue'),
    },
    {
        path: '/finance',
        component: () => import('../views/finance.vue'),
    },
    {
        path: '/developer',
        component: () => import('../views/developer.vue'),
    },
    {
        path: '/publish',
        component: () => import('../views/publish.vue'),
    },
    {
        path: '/notification',
        component: () => import('../views/notification.vue'),
    },
    {
        path: '/vip',
        component: () => import('../views/vip.vue'),
    },

    {
        path: '/test',
        component: () => import('../components/mainheader.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, _, next) => {
    const dataStore = useDataStore()
    const token = dataStore.getCookie("Token")
    if (token) {
        next()
    } else {
        if (to.path === "/login") {
            next()
        } else {
            next()
            // next('/login')
        }
    }
})

export default router;

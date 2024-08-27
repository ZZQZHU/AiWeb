// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useDataStore } from '../store/index.ts';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('../views/home.vue'),
        meta: { keepAlive: true }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login.vue'),
    },
    {
        path: '/blog/:id',
        name: 'blog',
        component: () => import('../views/blog.vue'),
    },
    {
        path: '/blog2/:id',
        name: 'blog2',
        component: () => import('../views/blogold.vue'),
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('../views/home.vue'),
        meta: { keepAlive: true }
    },
    {
        path: '/ai',
        name: 'ai',
        component: () => import('../views/AI.vue'),
        meta: { keepAlive: true }
    },
    {
        path: '/aibot',
        name: 'aibot',
        component: () => import('../views/Aibot.vue'),
        meta: { keepAlive: true }
    },
    {
        path: '/finance',
        name: 'finance',
        component: () => import('../views/finance.vue'),
        meta: { keepAlive: true }
    },
    {
        path: '/developer',
        name: 'developer',
        component: () => import('../views/developer.vue'),
        meta: { keepAlive: true }
    },
    {
        path: '/publish/:id',
        name: 'publish',
        component: () => import('../views/publish.vue'),
    },
    {
        path: '/notification',
        name: 'notification',
        component: () => import('../views/notification.vue'),
    },
    {
        path: '/vip',
        name: 'vip',
        component: () => import('../views/vip.vue'),
    },
    {
        path: '/chat',
        name: 'chat',
        component: () => import('../views/chatstreammdKIMI.vue'),
        meta: { keepAlive: true }
    },
    // 带参数的路由
    {
        path: '/dify/:id',
        name: 'dify',
        component: () => import('../views/dify.vue'),
        meta: { keepAlive: true }
    },
    {
        path: '/tem',
        name: 'tem',
        component: () => import('../views/tem.vue'),
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

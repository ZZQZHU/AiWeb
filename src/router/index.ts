// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useDataStore } from '../store/index.ts';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('../views/index.vue'),
    },
    {
        path: '/login',
        component: () => import('../views/Login.vue'),
    },
    {
        path: '/blog',
        component: () => import('../views/blog.vue'),
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
            // next()
            next('/login')
        }
    }
})

export default router;

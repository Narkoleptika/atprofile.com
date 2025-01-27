import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { isLoggedIn } from '@/stores/auth'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/edit',
            name: 'edit',
            component: () => import('@/views/EditView.vue'),
            beforeEnter() {
                if (!isLoggedIn.value) {
                    return { name: 'login' }
                }
            },
        },
        {
            path: '/:handle',
            name: 'profile',
            component: () => import('@/views/ProfileView.vue'),
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/LoginView.vue'),
            beforeEnter() {
                if (isLoggedIn.value) {
                    return '/'
                }
            },
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('@/views/NotFoundView.vue'),
        },
    ],
})

export default router

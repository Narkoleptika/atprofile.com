import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { isLoggedIn } from '@/stores/auth'
import { isValidHandle } from '@atproto/syntax'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
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
            path: '/lexicon',
            name: 'lexicon',
            component: () => import('@/views/LexiconView.vue'),
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

router.beforeEach((to) => {
    // Redirect old hash history profile links
    // eg atprofile.com/#/atprofile.com -> atprofile.com/atprofile.com
    const hash = to.hash.replace(/^#\/?(.*)/, '$1')

    if (isValidHandle(hash)) {
        return `/${hash}`
    }
})

export default router

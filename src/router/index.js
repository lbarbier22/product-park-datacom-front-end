import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import HomeView from '../views/HomeView.vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('../views/ProductListView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/products/new',
    name: 'product-new',
    component: () => import('../views/ProductFormView.vue'),
    meta: { requiresAuth: true, role: 'ADMIN' },
  },
  {
    path: '/products/:id/edit',
    name: 'product-edit',
    component: () => import('../views/ProductFormView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/products/:id/review',
    name: 'product-review',
    component: () => import('../views/ProductReviewView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
]

export function createAppRouter() {
  const router = createRouter({
    history: createWebHistory(),
    routes,
  })

  router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !token) {
      return next({ path: '/login' })
    }

    if (to.meta.role && authStore.role !== to.meta.role) {
      return next({ path: '/products' })
    }

    next()
  })

  return router
}

const router = createAppRouter()

export default router
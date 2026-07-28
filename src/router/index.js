import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
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
  },
  {
    path: '/products/new',
    name: 'product-new',
    component: () => import('../views/ProductFormView.vue'),
  },
  {
    path: '/products/:id/edit',
    name: 'product-edit',
    component: () => import('../views/ProductFormView.vue'),
  },
  {
    path: '/products/:id/review',
    name: 'product-review',
    component: () => import('../views/ProductReviewView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

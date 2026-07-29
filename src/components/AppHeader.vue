<template>
  <header class="app-header">
    <div class="brand">
      <h1>DATACOM Frontend</h1>
    </div>

    <nav class="main-nav">
      <RouterLink to="/">Accueil</RouterLink>
      <RouterLink to="/products">Produits</RouterLink>
      <RouterLink v-if="isAdmin" to="/products/new">Nouveau produit</RouterLink>
    </nav>

    <div class="user-panel" v-if="isAuthenticated">
      <span>{{ userFullname }} ({{ authStore.role }})</span>
      <button type="button" @click="logout">Déconnexion</button>
    </div>

    <div class="auth-link" v-else>
      <RouterLink to="/login">Connexion</RouterLink>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'

const authStore = useAuthStore()
const router = useRouter()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.role === 'ADMIN')
const userFullname = computed(() => `${authStore.firstname || ''} ${authStore.lastname || ''}`.trim())

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #f5f7fb;
  border-bottom: 1px solid #dfe3ea;
}
.brand h1 {
  margin: 0;
  font-size: 1.2rem;
}
.main-nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.user-panel,
.auth-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
button {
  padding: 0.4rem 0.8rem;
  border: 1px solid #6578a0;
  background: white;
  cursor: pointer;
}
</style>

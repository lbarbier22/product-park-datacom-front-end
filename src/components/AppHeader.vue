<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'

const auth = useAuthStore()
const router = useRouter()

const isAuthenticated = computed(() => auth.isAuthenticated)
const userName = computed(() => [auth.firstname, auth.lastname].filter(Boolean).join(' ') || auth.login)

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <header class="app-header">
    <div class="brand-block">
      <h1>DATACOM Frontend</h1>
      <p v-if="isAuthenticated">Bonjour {{ userName }}</p>
    </div>

    <nav class="nav-links">
      <RouterLink to="/">Accueil</RouterLink>
      <RouterLink v-if="!isAuthenticated" to="/login">Connexion</RouterLink>
      <RouterLink to="/products">Produits</RouterLink>
      <RouterLink v-if="isAuthenticated" to="/products/new">Nouveau produit</RouterLink>
      <button v-if="isAuthenticated" type="button" class="logout-btn" @click="logout">Déconnexion</button>
    </nav>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #0f172a;
  color: #fff;
}
.brand-block h1 {
  margin: 0;
  font-size: 1.2rem;
}
.brand-block p {
  margin: 0.2rem 0 0;
  font-size: 0.9rem;
  color: #cbd5e1;
}
.nav-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.nav-links a,
.logout-btn {
  color: #fff;
  text-decoration: none;
  background: transparent;
  border: none;
  cursor: pointer;
  font: inherit;
}
.nav-links a.router-link-active {
  font-weight: 700;
}
.logout-btn {
  padding: 0;
}
</style>

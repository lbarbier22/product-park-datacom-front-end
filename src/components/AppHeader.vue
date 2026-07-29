<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import { createProduct } from '../services/api'

const auth = useAuthStore()
const router = useRouter()

const isAuthenticated = computed(() => auth.isAuthenticated)
const userName = computed(() => [auth.firstname, auth.lastname].filter(Boolean).join(' ') || auth.login)

async function createNewProduct() {
  try {
    const response = await createProduct()
    const productId = response?.data?.id || response?.data?.productId || response?.data?.product?.id

    if (productId) {
      router.push({ name: 'product-edit', params: { id: productId } })
      return
    }

    window.alert('Impossible de créer le produit : identifiant manquant.')
  } catch (error) {
    window.alert('Erreur lors de la création du produit. Veuillez réessayer.')
  }
}

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
      <button v-if="auth.role === 'ADMIN'" type="button" class="new-product-btn" @click="createNewProduct">Nouveau produit</button>
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
.new-product-btn,
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
.new-product-btn,
.logout-btn {
  padding: 0;
}
</style>
<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import { createProduct } from '../services/api'

const auth = useAuthStore()
const router = useRouter()

const isAuthenticated = computed(() => auth.isAuthenticated)

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

<style scoped src="../styles/AppHeader.css"></style>
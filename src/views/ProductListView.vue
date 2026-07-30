<template>
  <section class="product-list-view">
    <div class="header-row">
      <h1>Liste des produits</h1>

      <label class="filter-wrap">
        <span>Statut</span>
        <select v-model="selectedStatus" @change="refreshProducts">
          <option value="">Tous</option>
          <option value="DRAFT">DRAFT</option>
          <option value="PENDING">PENDING</option>
          <option value="VALIDATED">VALIDATED</option>
          <option value="REJECTED">REJECTED</option>
        </select>
      </label>
    </div>

    <div v-if="loading" class="state">Chargement…</div>
    <div v-else-if="products.length === 0" class="state">Aucun produit trouvé.</div>

    <table v-else class="product-table">
      <thead>
        <tr>
          <th>Id</th>
          <th>Nom</th>
          <th>Statut</th>
          <th>Step courant</th>
          <th>Créé par</th>
          <th>Date de création</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="product in products"
          :key="product.id"
          class="product-row"
          @click="goToProduct(product)"
        >
          <td>{{ product.id }}</td>
          <td>{{ product.name }}</td>
          <td>
            <span class="status-badge" :class="statusClass(product.status)">{{ product.status }}</span>
          </td>
          <td>{{ product.currentStep || '-' }}</td>
          <td>{{ product.createdBy || '-' }}</td>
          <td>{{ formatDate(product.createdAt) }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '../stores/product.store'
import { useAuthStore } from '../stores/auth.store'

const router = useRouter()
const productStore = useProductStore()
const authStore = useAuthStore()
const loading = ref(true)
const selectedStatus = ref('')
const products = computed(() => productStore.products)

onMounted(async () => {
  await refreshProducts()
})

async function refreshProducts() {
  loading.value = true
  try {
    await productStore.fetchList(selectedStatus.value)
  } finally {
    loading.value = false
  }
}

// US-07.1 : un ADMIN ne doit jamais atterrir sur le formulaire d'édition
// pour un produit que le backend refuserait de modifier (409 sur PENDING/VALIDATED).
// Seuls DRAFT et REJECTED sont éditables par l'ADMIN ; tout le reste part en consultation.
function goToProduct(product) {
  const editableStatuses = ['DRAFT', 'REJECTED']

  if (authStore.role === 'ADMIN' && editableStatuses.includes(product.status)) {
    router.push(`/products/${product.id}/edit`)
    return
  }

  router.push(`/products/${product.id}/review`)
}

function formatDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('fr-FR')
}

function statusClass(status) {
  switch (status) {
    case 'VALIDATED':
      return 'success'
    case 'PENDING':
      return 'warning'
    case 'REJECTED':
      return 'danger'
    default:
      return 'neutral'
  }
}
</script>

<style scoped src="../styles/ProductListView.css"></style>
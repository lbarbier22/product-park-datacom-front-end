<template>
  <section class="product-list-view">
    <div class="header-row">
      <h1>Liste des produits</h1>
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
import { useAuthStore } from '../stores/auth.store'
import { useProductStore } from '../stores/product.store'

const router = useRouter()
const productStore = useProductStore()
const authStore = useAuthStore()

const loading = ref(true)
const products = computed(() => productStore.products)

onMounted(async () => {
  loading.value = true
  try {
    await productStore.fetchList('')
  } finally {
    loading.value = false
  }
})

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

function goToProduct(product) {
  const role = authStore.role
  const editableByAdmin = product.status === 'DRAFT' || product.status === 'REJECTED'

  if (role === 'ADMIN' && editableByAdmin) {
    router.push(`/products/${product.id}/edit`)
    return
  }

  router.push(`/products/${product.id}/review`)
}
</script>

<style scoped>
.product-list-view {
  padding: 1.5rem;
}
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.product-table {
  width: 100%;
  border-collapse: collapse;
}
.product-table th,
.product-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}
.product-row {
  cursor: pointer;
}
.product-row:hover {
  background: #f8fafc;
}
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
}
.status-badge.neutral {
  background: #e2e8f0;
  color: #334155;
}
.status-badge.warning {
  background: #fef3c7;
  color: #92400e;
}
.status-badge.success {
  background: #dcfce7;
  color: #166534;
}
.status-badge.danger {
  background: #fee2e2;
  color: #991b1b;
}
.state {
  padding: 1rem 0;
  color: #64748b;
}
</style>

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
        <tr v-for="product in products" :key="product.id" class="product-row">
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
import { useProductStore } from '../stores/product.store'

const productStore = useProductStore()
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

<style scoped>
.product-list-view {
  padding: 1.5rem;
}
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
.filter-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.filter-wrap select {
  padding: 0.4rem 0.6rem;
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

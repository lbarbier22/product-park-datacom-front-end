<template>
  <section class="product-review-view">
    <h1>Revue du produit</h1>

    <div v-if="loading" class="state">Chargement…</div>
    <div v-else-if="loadError" class="state error">{{ loadError }}</div>

    <template v-else>
      <!-- US-06.1: statut avec le même badge coloré que la liste -->
      <div class="status-row">
        <span class="status-badge" :class="statusClass(product.status)">{{ product.status }}</span>
      </div>

      <RejectionBanner v-if="product.rejectionReason" :reason="product.rejectionReason" />

      <!-- US-06.1: récap en lecture seule, aucun champ éditable -->
      <div class="step-card">
        <div class="summary-list">
          <div class="summary-item"><strong>Nom :</strong> {{ product.name }}</div>
          <div class="summary-item"><strong>Référence :</strong> {{ product.reference }}</div>
          <div class="summary-item"><strong>Description :</strong> {{ product.description || '-' }}</div>
          <div class="summary-item"><strong>Catégorie :</strong> {{ product.category }}</div>
          <div class="summary-item"><strong>Sous-catégorie :</strong> {{ product.subCategory || '-' }}</div>
          <div class="summary-item"><strong>Fabricant :</strong> {{ product.manufacturer }}</div>
          <div class="summary-item"><strong>Pays :</strong> {{ product.country }}</div>
          <div class="summary-item"><strong>Numéro de lot :</strong> {{ product.lotNumber }}</div>
          <div class="summary-item"><strong>Certification :</strong> {{ product.certification || '-' }}</div>
          <div class="summary-item"><strong>Commentaire :</strong> {{ product.comment || '-' }}</div>
          <div class="summary-item"><strong>Créé par :</strong> {{ product.createdBy || '-' }}</div>
          <div class="summary-item"><strong>Date de création :</strong> {{ formatDate(product.createdAt) }}</div>
        </div>
      </div>

      <!-- US-06.2: actions de décision, uniquement pour un VALIDATOR sur un produit PENDING -->
      <div v-if="canDecide" class="decision-block">
        <div class="decision-actions">
          <button class="btn-validate" :disabled="isSubmitting" @click="handleValidate">Valider</button>
          <button class="btn-reject" :disabled="isSubmitting" @click="openRejectForm">Refuser</button>
        </div>

        <div v-if="showRejectForm" class="reject-form">
          <label for="rejectReason">Motif du refus</label>
          <textarea
            id="rejectReason"
            v-model="rejectReason"
            rows="4"
            maxlength="1000"
            placeholder="Expliquez pourquoi ce produit est refusé (10 caractères minimum)"
          />
          <small v-if="rejectReason.length > 0 && !isReasonValid" class="hint">
            {{ 10 - rejectReason.trim().length }} caractère(s) restant(s) minimum.
          </small>

          <div class="reject-form-actions">
            <!-- US-06.3: confirmation explicite avant l'action destructive -->
            <button
              class="btn-reject"
              :disabled="!isReasonValid || isSubmitting"
              @click="confirmAndReject"
            >
              Confirmer le refus
            </button>
            <button class="btn-cancel" :disabled="isSubmitting" @click="cancelReject">Annuler</button>
          </div>
        </div>
      </div>

      <div v-if="actionError" class="server-error">{{ actionError }}</div>
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProduct, validateProduct, rejectProduct } from '../services/api'
import { useAuthStore } from '../stores/auth.store'
import { useUiStore } from '../stores/ui.store'
import RejectionBanner from '../components/RejectionBanner.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()

const productId = computed(() => route.params.id)

const loading = ref(true)
const loadError = ref('')
const product = ref({})

const isSubmitting = ref(false)
const actionError = ref('')

const showRejectForm = ref(false)
const rejectReason = ref('')

// US-06.2: boutons visibles uniquement pour un VALIDATOR sur un produit PENDING
const canDecide = computed(
  () => product.value.status === 'PENDING' && authStore.role === 'VALIDATOR'
)

// Contrainte serveur : motif de refus d'au moins 10 caractères
const isReasonValid = computed(() => rejectReason.value.trim().length >= 10)

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

function formatDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('fr-FR')
}

async function fetchProduct() {
  loading.value = true
  loadError.value = ''
  try {
    const response = await getProduct(productId.value)
    product.value = response?.data || {}
  } catch (error) {
    loadError.value =
      error?.response?.data?.message || 'Impossible de récupérer ce produit.'
  } finally {
    loading.value = false
  }
}

async function handleValidate() {
  if (isSubmitting.value) return
  isSubmitting.value = true
  actionError.value = ''
  try {
    await validateProduct(productId.value)
    uiStore.setSuccess('Produit validé.')
    router.push('/products')
  } catch (error) {
    actionError.value =
      error?.response?.data?.message || 'Une erreur est survenue lors de la validation.'
  } finally {
    isSubmitting.value = false
  }
}

function openRejectForm() {
  showRejectForm.value = true
  actionError.value = ''
}

function cancelReject() {
  showRejectForm.value = false
  rejectReason.value = ''
}

// US-06.3: confirmation explicite avant d'envoyer le refus
function confirmAndReject() {
  if (!isReasonValid.value || isSubmitting.value) return

  const confirmed = window.confirm('Confirmez-vous le refus de ce produit ?')
  if (!confirmed) return

  handleReject()
}

async function handleReject() {
  isSubmitting.value = true
  actionError.value = ''
  try {
    await rejectProduct(productId.value, rejectReason.value.trim())
    uiStore.setSuccess('Produit refusé.')
    router.push('/products')
  } catch (error) {
    actionError.value =
      error?.response?.data?.message || 'Une erreur est survenue lors du refus.'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(fetchProduct)
</script>

<style scoped>
.product-review-view {
  padding: 1.5rem;
}
.status-row {
  margin-bottom: 1rem;
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
.step-card {
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  margin-bottom: 1rem;
}
.summary-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.summary-item {
  padding: 0.45rem 0;
  border-bottom: 1px solid #f1f5f9;
}
.decision-block {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}
.decision-actions {
  display: flex;
  gap: 0.75rem;
}
.btn-validate {
  padding: 0.55rem 0.9rem;
  border: none;
  border-radius: 6px;
  background: #16a34a;
  color: #fff;
  cursor: pointer;
}
.btn-reject {
  padding: 0.55rem 0.9rem;
  border: none;
  border-radius: 6px;
  background: #dc2626;
  color: #fff;
  cursor: pointer;
}
.btn-cancel {
  padding: 0.55rem 0.9rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #fff;
  color: #334155;
  cursor: pointer;
}
button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
.reject-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
}
.reject-form textarea {
  padding: 0.6rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-family: inherit;
}
.reject-form-actions {
  display: flex;
  gap: 0.75rem;
}
.hint {
  color: #64748b;
  font-size: 0.85rem;
}
.server-error,
.state.error {
  color: #b91c1c;
  font-size: 0.9rem;
}
.state {
  padding: 1rem 0;
  color: #64748b;
}
</style>
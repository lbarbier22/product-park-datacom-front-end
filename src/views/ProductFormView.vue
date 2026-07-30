<template>
  <section class="product-form-view">
    <h1>Formulaire produit</h1>

    <NotFoundMessage
      v-if="notFound"
      title="Produit introuvable"
      message="Ce produit n'existe pas ou a été supprimé."
      to="/products"
      link-label="Retour à la liste des produits"
    />

    <template v-else>
      <RejectionBanner v-if="rejectionReason" :rejectionReason="rejectionReason" />
      <StepIndicator :current-step="currentStep" />

      <component
        :is="currentStepComponent"
        :form-data="formData"
        :errors="errors"
        :is-submitting="isSubmitting"
        @update="updateForm"
        @next="goNext"
        @submit="submitProduct"
      />
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StepIndicator from '../components/StepIndicator.vue'
import RejectionBanner from '../components/RejectionBanner.vue'
import NotFoundMessage from '../components/NotFoundMessage.vue'
import ProductStep1 from '../components/ProductStep1.vue'
import ProductStep2 from '../components/ProductStep2.vue'
import ProductStep3 from '../components/ProductStep3.vue'
import ProductStep4 from '../components/ProductStep4.vue'
import api from '../services/api'
import {
  validateProductStep1,
  validateProductStep2,
  validateProductStep3,
} from '../utils/productFormValidation'

const route = useRoute()
const router = useRouter()
const productId = computed(() => route.params.id)
const currentStep = ref(1)
const formData = ref({
  name: '',
  reference: '',
  description: '',
  category: '',
  subcategory: '',
  manufacturer: '',
  country: '',
  lot: '',
  certification: '',
})
const errors = ref({})
const isSubmitting = ref(false)
// Motif de refus renvoyé par l'API tant que le produit n'a pas été re-soumis
// (le backend ne le vide qu'après la re-soumission du step 4)
const rejectionReason = ref('')
const notFound = ref(false)

const currentStepComponent = computed(() => {
  switch (currentStep.value) {
    case 2:
      return ProductStep2
    case 3:
      return ProductStep3
    case 4:
      return ProductStep4
    default:
      return ProductStep1
  }
})

function updateForm(payload) {
  formData.value = { ...formData.value, ...payload }
  errors.value = {}
}

function validateStep1() {
  const nextErrors = validateProductStep1(formData.value)
  errors.value = nextErrors
  return Object.keys(nextErrors).length === 0
}

function validateStep2() {
  const nextErrors = validateProductStep2(formData.value)
  errors.value = nextErrors
  return Object.keys(nextErrors).length === 0
}

function validateStep3() {
  const nextErrors = validateProductStep3(formData.value)
  errors.value = nextErrors
  return Object.keys(nextErrors).length === 0
}

async function goNext() {
  if (isSubmitting.value) return

  let valid = false
  if (currentStep.value === 1) valid = validateStep1()
  if (currentStep.value === 2) valid = validateStep2()
  if (currentStep.value === 3) valid = validateStep3()

  if (!valid) return

  isSubmitting.value = true
  try {
    await api.put(`/products/${productId.value}/step/${currentStep.value}?next=true`, formData.value)
    currentStep.value += 1
  } catch (error) {
    errors.value = {
      server: error?.response?.data?.message || 'Une erreur est survenue lors de la sauvegarde.',
    }
  } finally {
    isSubmitting.value = false
  }
}

async function submitProduct() {
  if (isSubmitting.value) return
  isSubmitting.value = true
  try {
    await api.put(`/products/${productId.value}/step/4?next=true`, formData.value)
    router.push({ path: '/products', query: { message: 'Produit soumis pour validation' } })
  } catch (error) {
    errors.value = {
      server: error?.response?.data?.message || 'Une erreur est survenue lors de la soumission.',
    }
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  try {
    const response = await api.get(`/products/${productId.value}`)
    const data = response?.data || {}
    formData.value = {
      ...formData.value,
      ...data,
    }
    rejectionReason.value = data.rejectionReason || ''

    // Le backend ne remet le statut/step à zéro qu'au premier PUT.
    // Si on arrive ici avec un produit encore REJECTED, on force
    // l'affichage au step 1 dès le chargement initial (US-05.2).
    if (data.status === 'REJECTED') {
      currentStep.value = 1
    } else {
      currentStep.value = Number(data.currentStep || 1)
    }
  } catch (error) {
    if (error?.response?.status === 404) {
      notFound.value = true
    } else {
      currentStep.value = 1
    }
  }
})
</script>

<style scoped src="../styles/ProductFormView.css"></style>
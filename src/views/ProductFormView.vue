<template>
  <section class="product-form-view">
    <h1>Formulaire produit</h1>
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
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StepIndicator from '../components/StepIndicator.vue'
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
  subCategory: '',
  manufacturer: '',
  country: '',
  lotNumber: '',
  certification: '',
  comment: '',
})
const errors = ref({})
const isSubmitting = ref(false)

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
  let valid = false
  if (currentStep.value === 1) valid = validateStep1()
  if (currentStep.value === 2) valid = validateStep2()
  if (currentStep.value === 3) valid = validateStep3()

  if (!valid) return

  try {
    await api.put(`/products/${productId.value}/step/${currentStep.value}?next=true`, formData.value)
    currentStep.value += 1
  } catch (error) {
    errors.value = {
      server: error?.response?.data?.message || 'Une erreur est survenue lors de la sauvegarde.',
    }
  }
}

async function submitProduct() {
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
    currentStep.value = Number(data.currentStep || 1)
  } catch (error) {
    currentStep.value = 1
  }
})
</script>

<style scoped>
.product-form-view {
  padding: 1.5rem;
}
</style>

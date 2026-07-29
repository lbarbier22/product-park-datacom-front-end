<template>
  <section class="product-form-view">
    <h1>Formulaire produit</h1>
    <StepIndicator :current-step="currentStep" />

    <component :is="currentStepComponent" />
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import StepIndicator from '../components/StepIndicator.vue'
import ProductStep1 from '../components/ProductStep1.vue'
import ProductStep2 from '../components/ProductStep2.vue'
import ProductStep3 from '../components/ProductStep3.vue'
import ProductStep4 from '../components/ProductStep4.vue'
import api from '../services/api'

const route = useRoute()
const productId = computed(() => route.params.id)
const product = ref(null)
const currentStep = ref(1)

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

onMounted(async () => {
  try {
    const response = await api.get(`/products/${productId.value}`)
    product.value = response?.data || null
    currentStep.value = Number(response?.data?.currentStep || 1)
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

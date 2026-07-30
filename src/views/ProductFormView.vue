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

/**
 * Copie des données reçues depuis l'API.
 * Permet de savoir si l'utilisateur a réellement modifié quelque chose.
 */
const initialFormData = ref(null)

const errors = ref({})
const isSubmitting = ref(false)

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

/**
 * Vérifie si le formulaire a changé depuis le chargement.
 */
function hasFormChanged() {
  return (
    JSON.stringify(formData.value) !==
    JSON.stringify(initialFormData.value)
  )
}

async function goNext() {
  if (isSubmitting.value) return

  let valid = false

  if (currentStep.value === 1) valid = validateStep1()
  if (currentStep.value === 2) valid = validateStep2()
  if (currentStep.value === 3) valid = validateStep3()

  if (!valid) return

  /**
   * Pas de modification :
   * on passe directement à l'étape suivante sans PUT.
   */
  if (!hasFormChanged()) {
    currentStep.value += 1
    return
  }

  isSubmitting.value = true

  try {
    await api.put(
      `/products/${productId.value}/step/${currentStep.value}?next=true`,
      formData.value
    )

    // On mémorise la nouvelle version après sauvegarde
    initialFormData.value = structuredClone(formData.value)

    currentStep.value += 1
  } catch (error) {
    errors.value = {
      server:
        error?.response?.data?.message ||
        'Une erreur est survenue lors de la sauvegarde.',
    }
  } finally {
    isSubmitting.value = false
  }
}

async function submitProduct() {
  if (isSubmitting.value) return

  isSubmitting.value = true

  try {
    await api.put(
      `/products/${productId.value}/step/4?next=true`,
      formData.value
    )

    router.push({
      path: '/products',
      query: {
        message: 'Produit soumis pour validation',
      },
    })
  } catch (error) {
    errors.value = {
      server:
        error?.response?.data?.message ||
        'Une erreur est survenue lors de la soumission.',
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

    // Sauvegarde de l'état initial
    initialFormData.value = structuredClone(formData.value)

    rejectionReason.value = data.rejectionReason || ''

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
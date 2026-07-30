<template>
  <div class="step-card">
    <h2>Étape 2 - Classification</h2>

    <form class="step-form" @submit.prevent="emitNext">
      <FormField id="category" :modelValue="formData.category" label="Catégorie" :required="true" :error="errors.category" @update:modelValue="value => updateField('category', value)" />
      <FormField id="subcategory" :modelValue="formData.subcategory" label="Sous-catégorie" @update:modelValue="value => updateField('subcategory', value)" />
      <FormField id="manufacturer" :modelValue="formData.manufacturer" label="Fabricant" :required="true" :maxlength="150" :error="errors.manufacturer" @update:modelValue="value => updateField('manufacturer', value)" />
      <FormField id="country" :modelValue="formData.country" label="Pays" type="select" :required="true" :options="countryOptions" :error="errors.country" @update:modelValue="value => updateField('country', value)" />

      <div v-if="errors.server" class="server-error">{{ errors.server }}</div>
      <button type="submit" :disabled="isSubmitting">Suivant</button>
    </form>
  </div>
</template>

<script setup>
import FormField from './FormField.vue'

const props = defineProps({
  formData: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) },
  isSubmitting: { type: Boolean, default: false },
})

const emit = defineEmits(['update', 'next'])

const countryOptions = [
  { value: 'France', label: 'France' },
  { value: 'Germany', label: 'Germany' },
  { value: 'Spain', label: 'Spain' },
  { value: 'Italy', label: 'Italy' },
  { value: 'China', label: 'China' },
  { value: 'USA', label: 'USA' },
]

function updateField(field, value) {
  emit('update', { [field]: value })
}

function emitNext() {
  emit('next')
}
</script>

<style scoped src="../styles/ProductStep.css"></style>

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

<style scoped>
.step-card { padding: 1rem; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; }
.step-form { display: flex; flex-direction: column; gap: 0.9rem; }
button { align-self: flex-start; padding: 0.55rem 0.9rem; border: none; border-radius: 6px; background: #2563eb; color: #fff; cursor: pointer; }
button[disabled] { opacity: 0.6; cursor: not-allowed; }
.server-error { color: #b91c1c; font-size: 0.9rem; }
</style>
